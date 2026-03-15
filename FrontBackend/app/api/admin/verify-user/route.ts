import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const key = searchParams.get('key');

  if (key !== 'startera-admin-2026') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: "Provide ?email=..." }, { status: 400 });
  }

  try {
    await sql`
      UPDATE users 
      SET is_verified = TRUE 
      WHERE email = ${email.trim().toLowerCase()}
    `;

    const result = await sql`
      SELECT email, is_verified 
      FROM users 
      WHERE email = ${email.trim().toLowerCase()}
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}