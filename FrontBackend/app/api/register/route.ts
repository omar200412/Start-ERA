import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ detail: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ detail: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return NextResponse.json({ detail: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await sql`
      INSERT INTO users (email, password, verification_code, is_verified)
      VALUES (${cleanEmail}, ${hashedPassword}, ${code}, FALSE)
    `;

    await sendVerificationEmail(cleanEmail, code);

    return NextResponse.json({ message: "success", email: cleanEmail }, { status: 200 });

  } catch (error: any) {
    console.error("Register Error:", error.message);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}

async function sendVerificationEmail(toEmail: string, code: string) {
  try {
    await resend.emails.send({
      from: 'Start ERA <noreply@startera.io>',
      to: toEmail,
      subject: 'Start ERA — Doğrulama Kodunuz / Verification Code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 32px;background:#0f172a;border-radius:20px;">

          <div style="text-align:center;margin-bottom:36px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#2563eb,#4f46e5);color:white;font-size:26px;font-weight:900;padding:14px 28px;border-radius:14px;letter-spacing:-0.5px;">
              Start ERA
            </div>
          </div>

          <h2 style="color:#f1f5f9;font-size:22px;text-align:center;margin-bottom:10px;font-weight:800;">
            Hesabını Doğrula
          </h2>

          <p style="color:#94a3b8;font-size:15px;text-align:center;margin-bottom:36px;line-height:1.6;">
            Aşağıdaki kodu girerek hesabını aktive et.<br/>
            <span style="font-size:13px;">Enter the code below to activate your account.</span>
          </p>

          <div style="background:#1e293b;border:2px solid #2563eb;border-radius:16px;padding:32px;text-align:center;margin-bottom:36px;">
            <div style="font-size:56px;font-weight:900;letter-spacing:16px;color:#3b82f6;font-variant-numeric:tabular-nums;">
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
            Eğer bu hesabı sen oluşturmadıysan, bu emaili görmezden gelebilirsin.<br/>
            If you did not create this account, you can safely ignore this email.
          </p>

          <hr style="border:none;border-top:1px solid #1e293b;margin:28px 0;" />

          <p style="color:#334155;font-size:11px;text-align:center;margin:0;">
            © 2026 Start ERA · plan-iq.net
          </p>

        </div>
      `,
    });
    console.log(`Verification email sent to ${toEmail}`);
  } catch (error: any) {
    console.error("Resend error:", error.message);
  }
}