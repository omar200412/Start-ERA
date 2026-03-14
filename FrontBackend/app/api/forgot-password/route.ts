import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ detail: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check user exists — but always return success to prevent email enumeration
    const userResult = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
    if (userResult.rowCount === 0) {
      // Return success anyway so attackers can't enumerate emails
      return NextResponse.json({ message: "If this email exists, a code was sent." }, { status: 200 });
    }

    // Generate 6-digit code, expires in 15 minutes
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await sql`
      UPDATE users 
      SET reset_code = ${code}, reset_code_expires = ${expires}
      WHERE email = ${cleanEmail}
    `;

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER || "mail.plan-iq.net",
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Start ERA" <${process.env.MAIL_USERNAME}>`,
      to: cleanEmail,
      subject: "Start ERA — Password Reset Code",
      text: `Your password reset code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, #2563eb, #4f46e5); border-radius: 16px; line-height: 56px; color: white; font-size: 24px; font-weight: 900;">S</div>
            <h1 style="color: #1e293b; margin-top: 16px; font-size: 24px;">Password Reset</h1>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Use the code below to reset your Start ERA password. This code expires in <strong>15 minutes</strong>.</p>
          <div style="background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #2563eb;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "If this email exists, a code was sent." }, { status: 200 });

  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}