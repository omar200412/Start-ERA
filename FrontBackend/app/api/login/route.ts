import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ detail: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Master user bypass — REMOVE THIS IN PRODUCTION
    if (cleanEmail === "dev@plan-iq.net" && password === "Omar12omar12") {
      const token = await signToken(cleanEmail);
      const response = NextResponse.json({ token, email: cleanEmail }, { status: 200 });
      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return response;
    }

    const userResult = await sql`SELECT * FROM users WHERE email = ${cleanEmail}`;
    if (userResult.rowCount === 0) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }
    if (!user.is_verified) {
      return NextResponse.json({ detail: "Not verified" }, { status: 403 });
    }

    const token = await signToken(cleanEmail);
    const response = NextResponse.json({ token, email: cleanEmail }, { status: 200 });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}