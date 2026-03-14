import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../lib/jwt';

async function getEmailFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  return payload?.sub ?? null;
}

// GET /api/projects — load all projects for the authenticated user
export async function GET(request: Request) {
  try {
    const email = await getEmailFromRequest(request);
    if (!email) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const result = await sql`
      SELECT id, title, status, plan_data, created_at
      FROM projects
      WHERE user_email = ${email}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const projects = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      date: new Date(row.created_at).toLocaleDateString(),
      planData: row.plan_data,
    }));

    return NextResponse.json({ projects }, { status: 200 });

  } catch (error: any) {
    console.error("GET /projects error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}

// POST /api/projects — save a new project
export async function POST(request: Request) {
  try {
    const email = await getEmailFromRequest(request);
    if (!email) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, status, planData } = body;

    if (!title || !planData) {
      return NextResponse.json({ detail: "title and planData are required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO projects (user_email, title, status, plan_data)
      VALUES (${email}, ${title}, ${status || 'Completed'}, ${JSON.stringify(planData)})
      RETURNING id, created_at
    `;

    return NextResponse.json({
      id: result.rows[0].id,
      date: new Date(result.rows[0].created_at).toLocaleDateString(),
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST /projects error:", error);
    return NextResponse.json({ detail: "Server Error" }, { status: 500 });
  }
}
