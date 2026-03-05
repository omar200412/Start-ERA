import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan_data } = body; 

    if (!plan_data) {
      return NextResponse.json({ detail: "No plan data provided" }, { status: 400 });
    }

    // PDF'i bir Buffer (hafıza) olarak oluşturuyoruz
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // PDF İçeriğini Yazdırma
      doc.fontSize(22).text('Start ERA - Is Plani', { align: 'center' });
      doc.moveDown(2);

      // JSON formatındaki planı döngüye alıp PDF'e ekliyoruz
      if (Array.isArray(plan_data)) {
        plan_data.forEach((section: any) => {
          doc.fontSize(16).text(section.title, { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12).text(section.content);
          doc.moveDown();
        });
      } else {
        // Eğer düz metin gelirse
        doc.fontSize(12).text(typeof plan_data === 'string' ? plan_data : JSON.stringify(plan_data));
      }

      doc.end();
    });

    // Hazırlanan PDF'i direkt olarak indirilebilir formatta gönderiyoruz
    return new NextResponse(pdfBuffer, {
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