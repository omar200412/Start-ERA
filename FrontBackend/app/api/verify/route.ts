import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, type } = body;

    if (!email || !code) {
      return NextResponse.json({ detail: "Email and code are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // type = "reset" for password reset, anything else = registration verify
    const isReset = type === "reset";

    const userResult = await sql`SELECT verification_code, reset_code FROM users WHERE email = ${cleanEmail}`;

    if (userResult.rowCount === 0) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];
    const storedCode = isReset ? user.reset_code : user.verification_code;

    if (!storedCode) {
      return NextResponse.json({ detail: "No code found. Please request a new one." }, { status: 400 });
    }

    if (storedCode.toString().trim() !== code.toString().trim()) {
      return NextResponse.json({ detail: "Invalid code" }, { status: 400 });
    }

    if (isReset) {
      // Clear reset code after use
      await sql`UPDATE users SET reset_code = NULL WHERE email = ${cleanEmail}`;
      return NextResponse.json({ message: "success", email: cleanEmail }, { status: 200 });
    } else {
      // Mark as verified and clear verification code
      await sql`UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE email = ${cleanEmail}`;
      return NextResponse.json({ message: "success", token: `user-${cleanEmail}`, email: cleanEmail }, { status: 200 });
    }

  } catch (error: any) {
    console.error("Verify Error:", error.message);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}