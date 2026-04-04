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

export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { report_id, status } = await req.json();
  if (!report_id) return NextResponse.json({ error: "Missing report_id" }, { status: 400 });

  const db = getDbConnection();
  try {
    await db.query(`UPDATE Reports SET status = ? WHERE report_id = ?`, [status, report_id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { report_id } = await req.json();
  if (!report_id) return NextResponse.json({ error: "Missing report_id" }, { status: 400 });

  const db = getDbConnection();
  try {
    await db.query(`DELETE FROM Reports WHERE report_id = ?`, [report_id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
