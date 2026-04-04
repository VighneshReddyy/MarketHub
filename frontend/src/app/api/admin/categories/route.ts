import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  try {
    const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return user?.is_admin ? user : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const db = getDbConnection();
  try {
    const [result] = await db.query(`INSERT INTO Categories (name) VALUES (?)`, [name.trim()]) as any;
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category_id } = await req.json();
  if (!category_id) return NextResponse.json({ error: "Missing category_id" }, { status: 400 });

  const db = getDbConnection();
  try {
    await db.query(`DELETE FROM Categories WHERE category_id = ?`, [category_id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
