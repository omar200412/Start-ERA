import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        verification_code VARCHAR(10),
        reset_code VARCHAR(10),
        is_verified BOOLEAN DEFAULT FALSE
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        title TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Completed',
        plan_data JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_projects_user_email ON projects(user_email);
    `;

    // Add reset_code column if it doesn't exist yet
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code VARCHAR(10);
    `;

    return NextResponse.json({ message: "Database initialized successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("DB init error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}