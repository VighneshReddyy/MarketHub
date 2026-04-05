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

  const { item_id } = await req.json();
  if (!item_id) return NextResponse.json({ error: "Missing item_id" }, { status: 400 });

  const db = getDbConnection();
  try {
    // Hard delete: Clean up child records completely to avoid foreign key errors
    await db.query(`DELETE FROM Payments WHERE order_id IN (SELECT order_id FROM Orders WHERE item_id = ?)`, [item_id]);
    await db.query(`DELETE FROM Reviews WHERE order_id IN (SELECT order_id FROM Orders WHERE item_id = ?)`, [item_id]);
    await db.query(`DELETE FROM Orders WHERE item_id = ?`, [item_id]);
    await db.query(`DELETE FROM Notifications WHERE item_id = ?`, [item_id]);
    await db.query(`DELETE FROM ItemMedia WHERE item_id = ?`, [item_id]);
    await db.query(`DELETE FROM Reports WHERE item_id = ?`, [item_id]);
    
    // Finally delete the item itself
    await db.query(`DELETE FROM Items WHERE item_id = ?`, [item_id]);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
