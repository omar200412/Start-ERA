import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ detail: "Email and code are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Master code bypass for testing
    if (code === "123456") {
      return NextResponse.json({ message: "success", token: "demo", email: cleanEmail }, { status: 200 });
    }

    // Fetch the user's verification code
    const userResult = await sql`SELECT verification_code FROM users WHERE email = ${cleanEmail}`;
    
    if (userResult.rowCount === 0) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
    }

    const storedCode = userResult.rows[0].verification_code;

    if (storedCode.toString() === code.toString().trim()) {
      // Mark as verified
      await sql`UPDATE users SET is_verified = TRUE WHERE email = ${cleanEmail}`;
      return NextResponse.json({ message: "success", token: `user-${cleanEmail}`, email: cleanEmail }, { status: 200 });
    } else {
      return NextResponse.json({ detail: "Invalid code" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Verify Error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}