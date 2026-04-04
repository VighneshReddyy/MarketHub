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

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { review_id } = await req.json();
  if (!review_id) return NextResponse.json({ error: "Missing review_id" }, { status: 400 });

  const db = getDbConnection();
  try {
    await db.query(`DELETE FROM Reviews WHERE review_id = ?`, [review_id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
