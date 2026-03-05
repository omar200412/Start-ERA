import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ detail: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return NextResponse.json({ detail: "Email already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert into Vercel Postgres
    await sql`
      INSERT INTO users (email, password, verification_code, is_verified) 
      VALUES (${cleanEmail}, ${hashedPassword}, ${code}, FALSE)
    `;

    // Send the Verification Email
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
      subject: "Start ERA Verification Code",
      text: `Your verification code is: ${code}`,
    });

    return NextResponse.json({ message: "success", email: cleanEmail }, { status: 200 });

  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}