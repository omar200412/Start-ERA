import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ detail: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Master User Bypass
    if (cleanEmail === "dev@plan-iq.net" && password === "Omar12omar12") {
      return NextResponse.json({ token: "master", email: cleanEmail }, { status: 200 });
    }

    // Fetch user from Vercel Postgres
    const userResult = await sql`SELECT * FROM users WHERE email = ${cleanEmail}`;
    
    if (userResult.rowCount === 0) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    const user = userResult.rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    // Check if verified
    if (!user.is_verified) {
      return NextResponse.json({ detail: "Not verified" }, { status: 403 });
    }

    return NextResponse.json({ token: `user-${cleanEmail}`, email: cleanEmail }, { status: 200 });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}