import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json({ detail: "Email, code and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ detail: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userResult = await sql`
      SELECT reset_code, reset_code_expires
      FROM users
      WHERE email = ${cleanEmail}
    `;

    if (userResult.rowCount === 0) {
      return NextResponse.json({ detail: "Invalid request" }, { status: 400 });
    }

    const user = userResult.rows[0];

    if (!user.reset_code || user.reset_code !== code.trim()) {
      return NextResponse.json({ detail: "Invalid code" }, { status: 400 });
    }

    if (!user.reset_code_expires || new Date() > new Date(user.reset_code_expires)) {
      return NextResponse.json({ detail: "Code expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Also set is_verified = TRUE — they proved email ownership by receiving the reset code
    await sql`
      UPDATE users
      SET
        password = ${hashedPassword},
        reset_code = NULL,
        reset_code_expires = NULL,
        is_verified = TRUE
      WHERE email = ${cleanEmail}
    `;

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}