import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ detail: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const userResult = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
    if (userResult.rowCount === 0) {
      // Don't reveal whether email exists for security
      return NextResponse.json({ message: "If this email exists, a code has been sent." }, { status: 200 });
    }

    // Generate reset code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save code to DB (reuse verification_code column)
    await sql`UPDATE users SET verification_code = ${code} WHERE email = ${cleanEmail}`;

    // Send email
    await resend.emails.send({
      from: 'Start ERA <noreply@startera.io>',
      to: cleanEmail,
      subject: 'Start ERA — Şifre Sıfırlama / Password Reset',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 32px;background:#0f172a;border-radius:20px;">

          <div style="text-align:center;margin-bottom:36px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#2563eb,#4f46e5);color:white;font-size:26px;font-weight:900;padding:14px 28px;border-radius:14px;">
              Start ERA
            </div>
          </div>

          <h2 style="color:#f1f5f9;font-size:22px;text-align:center;margin-bottom:10px;font-weight:800;">
            Şifre Sıfırlama
          </h2>

          <p style="color:#94a3b8;font-size:15px;text-align:center;margin-bottom:36px;line-height:1.6;">
            Şifreni sıfırlamak için aşağıdaki kodu kullan.<br/>
            <span style="font-size:13px;">Use the code below to reset your password.</span>
          </p>

          <div style="background:#1e293b;border:2px solid #7c3aed;border-radius:16px;padding:32px;text-align:center;margin-bottom:36px;">
            <div style="font-size:56px;font-weight:900;letter-spacing:16px;color:#8b5cf6;font-variant-numeric:tabular-nums;">
              ${code}
            </div>
          </div>

          <div style="background:#1e293b;border-radius:12px;padding:16px;margin-bottom:28px;">
            <p style="color:#64748b;font-size:13px;text-align:center;margin:0;line-height:1.6;">
              ⏱ Bu kod <strong style="color:#94a3b8;">15 dakika</strong> içinde geçerlidir.<br/>
              This code is valid for <strong style="color:#94a3b8;">15 minutes</strong>.
            </p>
          </div>

          <p style="color:#475569;font-size:12px;text-align:center;line-height:1.6;">
            Eğer şifre sıfırlama talebinde bulunmadıysan, bu emaili görmezden gelebilirsin.<br/>
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <hr style="border:none;border-top:1px solid #1e293b;margin:28px 0;" />

          <p style="color:#334155;font-size:11px;text-align:center;margin:0;">
            © 2026 Start ERA · plan-iq.net
          </p>

        </div>
      `,
    });

    console.log(`Password reset email sent to ${cleanEmail}`);
    return NextResponse.json({ message: "If this email exists, a code has been sent." }, { status: 200 });

  } catch (error: any) {
    console.error("Forgot password error:", error.message);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}