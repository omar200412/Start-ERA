import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Frontend veriyi 'plan_data' veya 'plan' ismiyle gönderiyor olabilir, ikisini de yakalayalım.
    const plan_data = body.plan_data || body.plan; 

    if (!plan_data) {
      console.error("Gelen Body:", body);
      return NextResponse.json({ detail: "No plan data provided" }, { status: 400 });
    }

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // PDF Başlığı
      doc.fontSize(22).text('Start ERA - Is Plani', { align: 'center' });
      doc.moveDown(2);

      // Gelen veri string (metin) ise ve JSON formatındaysa onu Array'e çevirmeyi deneyelim
      let parsedData = plan_data;
      if (typeof plan_data === 'string') {
        try {
          parsedData = JSON.parse(plan_data);
        } catch (e) {
          // JSON değilse düz metin olarak kalır, sorun yok
        }
      }

      // PDF İçeriğini Yazdırma
      if (Array.isArray(parsedData)) {
        parsedData.forEach((section: any) => {
          doc.fontSize(16).text(section.title || "Bolum", { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12).text(section.content || "");
          doc.moveDown();
        });
      } else {
        doc.fontSize(12).text(typeof parsedData === 'string' ? parsedData : JSON.stringify(parsedData));
      }

      doc.end();
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="StartERA_Plan.pdf"',
      },
    });

  } catch (error: any) {
    console.error("PDF Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}