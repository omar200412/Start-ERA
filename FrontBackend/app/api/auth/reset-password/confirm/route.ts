import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ── POST: Confirm password reset with OTP + new password ───────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    // ── Validate required fields ────────────────────────────────────────────
    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { detail: "Email, code and new password are required" },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { detail: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.toString().trim();

    // ── Look up user and their reset code ───────────────────────────────────
    const userResult = await sql`
      SELECT reset_code, reset_code_expires
      FROM users
      WHERE email = ${cleanEmail}
    `;

    if (userResult.rowCount === 0) {
      return NextResponse.json(
        { detail: "Invalid request" },
        { status: 400 }
      );
    }

    const user = userResult.rows[0];

    // ── Verify the code matches ─────────────────────────────────────────────
    if (!user.reset_code || user.reset_code.trim() !== cleanCode) {
      return NextResponse.json(
        { detail: "Invalid code" },
        { status: 400 }
      );
    }

    // ── Verify the code has not expired ─────────────────────────────────────
    if (
      !user.reset_code_expires ||
      new Date() > new Date(user.reset_code_expires)
    ) {
      // Nullify the expired code so it can't be retried
      await sql`
        UPDATE users
        SET reset_code = NULL, reset_code_expires = NULL
        WHERE email = ${cleanEmail}
      `;

      return NextResponse.json(
        { detail: "Code expired. Please request a new one." },
        { status: 400 }
      );
    }

    // ── Hash the new password ───────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ── Update password, clear reset code, and mark user as verified ────────
    // Setting is_verified = TRUE because receiving the email proves ownership
    await sql`
      UPDATE users
      SET
        password = ${hashedPassword},
        reset_code = NULL,
        reset_code_expires = NULL,
        is_verified = TRUE
      WHERE email = ${cleanEmail}
    `;

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password confirm error:", error.message);
    return NextResponse.json(
      { detail: "Server Error" },
      { status: 500 }
    );
  }
}
