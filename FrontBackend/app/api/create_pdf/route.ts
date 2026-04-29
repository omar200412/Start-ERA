import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

interface PlanSection {
  title: string;
  content: string;
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

    const doc = new PDFDocument({ margin: 50 });
    
    // Use an array to collect buffers
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    const endPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });

    // Register fonts (We downloaded Roboto which supports Turkish characters)
    const fontRegularPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');
    const fontBoldPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf');
    
    const hasFonts = fs.existsSync(fontRegularPath) && fs.existsSync(fontBoldPath);
    
    if (hasFonts) {
        doc.registerFont('Roboto', fontRegularPath);
        doc.registerFont('Roboto-Bold', fontBoldPath);
    } else {
        console.warn("Fonts not found at " + fontRegularPath + ", falling back to default Helvetica. Turkish characters may break.");
    }

    const defaultFont = hasFonts ? 'Roboto' : 'Helvetica';
    const boldFont = hasFonts ? 'Roboto-Bold' : 'Helvetica-Bold';

    // Cover header
    doc.font(boldFont)
       .fontSize(20)
       .fillColor('#179923')
       .text('Start ERA', { align: 'center' });
       
    doc.font(defaultFont)
       .fontSize(11)
       .fillColor('black')
       .text('AI-Powered Business Plan', { align: 'center' });
       
    doc.moveDown(1);
    
    // Divider line
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(2);

    for (const section of sections) {
      doc.font(boldFont)
         .fontSize(14)
         .fillColor('#176935')
         .text(section.title);
         
      doc.moveDown(0.5);
      
      doc.font(defaultFont)
         .fontSize(10)
         .fillColor('black')
         .text(section.content || '');
         
      doc.moveDown(1);
    }

    doc.end();
    
    const pdfBytes = await endPromise;

    return new NextResponse(pdfBytes, {
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