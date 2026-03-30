import { NextResponse } from 'next/server';

// Pure-JS PDF generation — no native binaries, works on Vercel Edge/Node runtimes.
// We build a minimal but well-structured PDF manually using the PDF 1.4 spec.

interface PlanSection {
  title: string;
  content: string;
}

function buildPdf(sections: PlanSection[]): Uint8Array {
  const objects: string[] = [];
  const offsets: number[] = [];

  function addObj(content: string): number {
    const id = objects.length + 1;
    objects.push(content);
    return id;
  }

  // -- helpers --
  const pdfStr = (s: string) =>
    '(' + s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\r/g, '').replace(/\n/g, '\\n') + ')';

  // Wrap text to max charsPerLine
  function wrapText(text: string, maxChars: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    for (const para of paragraphs) {
      if (para.trim() === '') { lines.push(''); continue; }
      const words = para.split(' ');
      let line = '';
      for (const word of words) {
        if ((line + (line ? ' ' : '') + word).length <= maxChars) {
          line += (line ? ' ' : '') + word;
        } else {
          if (line) lines.push(line);
          // if word itself is longer than maxChars, break it
          let w = word;
          while (w.length > maxChars) {
            lines.push(w.slice(0, maxChars));
            w = w.slice(maxChars);
          }
          line = w;
        }
      }
      if (line) lines.push(line);
    }
    return lines;
  }

  // Page dimensions (A4 in points: 595 x 842)
  const PAGE_W = 595;
  const PAGE_H = 842;
  const MARGIN = 50;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const LINE_H_BODY = 16;
  const LINE_H_TITLE = 22;
  const FONT_TITLE = 14;
  const FONT_SECTION = 11;
  const FONT_BODY = 10;
  const CHARS_PER_LINE = 80; // approximate at 10pt Helvetica

  // Split content into pages
  interface PageLine {
    text: string;
    x: number;
    y: number;
    size: number;
    bold: boolean;
    color?: string; // hex like "0.09 0.60 0.14" (green)
  }

  const pages: PageLine[][] = [];
  let curPage: PageLine[] = [];
  let curY = PAGE_H - MARGIN;

  function newPage() {
    pages.push(curPage);
    curPage = [];
    curY = PAGE_H - MARGIN;
  }

  function ensureSpace(needed: number) {
    if (curY - needed < MARGIN + 40) newPage();
  }

  function addLine(text: string, size: number, bold: boolean, x: number, color?: string) {
    curY -= size + 4;
    curPage.push({ text, x, y: curY, size, bold, color });
  }

  // Cover header
  ensureSpace(60);
  curY -= 10;
  addLine('Start ERA', 20, true, MARGIN + (CONTENT_W / 2) - 60, '0.09 0.60 0.14');
  addLine('AI-Powered Business Plan', 11, false, MARGIN + (CONTENT_W / 2) - 80);
  curY -= 12;

  // Divider line (we add as a special marker)
  curPage.push({ text: '__DIVIDER__', x: MARGIN, y: curY, size: 1, bold: false });
  curY -= 10;

  for (const section of sections) {
    ensureSpace(LINE_H_TITLE + 10);
    curY -= 6;
    addLine(section.title, FONT_TITLE, true, MARGIN, '0.09 0.41 0.21');
    curY -= 2;

    const bodyLines = wrapText(section.content || '', CHARS_PER_LINE);
    for (const line of bodyLines) {
      ensureSpace(LINE_H_BODY);
      addLine(line === '' ? ' ' : line, FONT_BODY, false, MARGIN);
    }
    curY -= 10;
  }

  if (curPage.length > 0) pages.push(curPage);

  // Now build PDF binary
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  let byteOffset = 0;

  function emit(s: string): void {
    const bytes = enc.encode(s);
    parts.push(bytes);
    byteOffset += bytes.length;
  }

  // PDF header
  emit('%PDF-1.4\n');

  // Catalog object (id=1)
  const catalogId = 1;
  // Pages object (id=2)
  const pagesId = 2;
  // Font Helvetica (id=3)
  const fontId = 3;
  // Font Helvetica-Bold (id=4)
  const fontBoldId = 4;

  // Page content stream objects start at 5
  const pageContentStartId = 5;
  // Page objects start after all content
  const pageObjStartId = pageContentStartId + pages.length;

  const xrefOffsets: number[] = new Array(pageObjStartId + pages.length).fill(0);

  // 1 — Catalog
  xrefOffsets[catalogId - 1] = byteOffset;
  emit(`${catalogId} 0 obj\n<< /Type /Catalog /Pages ${pagesId} 0 R >>\nendobj\n`);

  // 2 — Pages (placeholder, we'll fill kids later)
  const pageIds = pages.map((_, i) => pageObjStartId + i);

  xrefOffsets[pagesId - 1] = byteOffset;
  const kidsRef = pageIds.map(id => `${id} 0 R`).join(' ');
  emit(`${pagesId} 0 obj\n<< /Type /Pages /Kids [${kidsRef}] /Count ${pages.length} >>\nendobj\n`);

  // 3 — Font Helvetica
  xrefOffsets[fontId - 1] = byteOffset;
  emit(`${fontId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n`);

  // 4 — Font Helvetica-Bold
  xrefOffsets[fontBoldId - 1] = byteOffset;
  emit(`${fontBoldId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n`);

  // 5..5+N-1 — Content streams
  for (let pi = 0; pi < pages.length; pi++) {
    const pageLines = pages[pi];
    const contentId = pageContentStartId + pi;
    xrefOffsets[contentId - 1] = byteOffset;

    let stream = '';
    for (const line of pageLines) {
      if (line.text === '__DIVIDER__') {
        // Draw a horizontal rule
        stream += `q\n${MARGIN} ${line.y} m\n${PAGE_W - MARGIN} ${line.y} l\nS\nQ\n`;
        continue;
      }
      const font = line.bold ? `/F2` : `/F1`;
      stream += `BT\n${font} ${line.size} Tf\n`;
      if (line.color) {
        const [r, g, b] = line.color.split(' ');
        stream += `${r} ${g} ${b} rg\n`;
      } else {
        stream += `0 0 0 rg\n`;
      }
      // PDF y is bottom-up; our y is already in PDF coords (we started from PAGE_H)
      stream += `${line.x} ${line.y} Td\n${pdfStr(line.text)} Tj\nET\n`;
    }

    const streamBytes = enc.encode(stream);
    emit(`${contentId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`);
    parts.push(streamBytes);
    byteOffset += streamBytes.length;
    emit(`\nendstream\nendobj\n`);
  }

  // Page objects
  for (let pi = 0; pi < pages.length; pi++) {
    const pageId = pageObjStartId + pi;
    const contentId = pageContentStartId + pi;
    xrefOffsets[pageId - 1] = byteOffset;
    emit(`${pageId} 0 obj\n<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R /F2 ${fontBoldId} 0 R >> >> >>\nendobj\n`);
  }

  // xref table
  const xrefOffset = byteOffset;
  const totalObjs = pageObjStartId + pages.length; // total pdf objects
  emit(`xref\n0 ${totalObjs + 1}\n`);
  emit(`0000000000 65535 f \n`);
  for (const off of xrefOffsets) {
    emit(String(off).padStart(10, '0') + ' 00000 n \n');
  }

  emit(`trailer\n<< /Size ${totalObjs + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  // Concatenate all parts
  const totalLen = parts.reduce((s, p) => s + p.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const p of parts) {
    result.set(p, pos);
    pos += p.length;
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const planData: PlanSection[] = body.plan_data || body.plan || [];

    if (!planData || !Array.isArray(planData) || planData.length === 0) {
      return NextResponse.json({ detail: 'No plan data provided' }, { status: 400 });
    }

    // Parse plan_data if it's a JSON string (legacy format from backend)
    let sections: PlanSection[] = planData;
    if (planData.length === 1 && typeof (planData[0] as any) === 'string') {
      try { sections = JSON.parse(planData[0] as any); } catch {}
    }

    const pdfBytes = buildPdf(sections);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="StartERA_Plan.pdf"',
        'Content-Length': String(pdfBytes.length),
      },
    });
  } catch (error: any) {
    console.error('PDF Error:', error);
    return NextResponse.json({ detail: 'PDF generation failed: ' + String(error?.message || error) }, { status: 500 });
  }
}