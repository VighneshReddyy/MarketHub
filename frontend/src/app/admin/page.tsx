import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPanelClient from "./AdminPanelClient";

export default async function AdminLogsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  if (token) {
    try {
      user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    } catch {}
  }
  
  if (!user || user.is_admin === 0 || user.is_admin === false) {
    redirect("/");
  }

  const db = await getDbConnection();
  
  const [users] = await db.query(`SELECT user_id, name, email, is_admin, created_at FROM Users ORDER BY created_at DESC`);
  
  const [items] = await db.query(`
    SELECT i.item_id, i.title, i.price, i.condition_type, i.status, u.name as seller_name, c.name as category_name
    FROM Items i
    LEFT JOIN Users u ON i.seller_id = u.user_id
    LEFT JOIN Categories c ON i.category_id = c.category_id
    ORDER BY i.created_at DESC
  `);
  
  const [adminLogs] = await db.query(`SELECT log_id, action, created_at FROM AdminLogs ORDER BY created_at DESC`);
  
  const [ordersData] = await db.query(`SELECT SUM(price) as total_sales, COUNT(order_id) as total_orders FROM Orders WHERE status = 'completed'`);

  const [categories] = await db.query(`SELECT category_id, name, parent_id FROM Categories`);

  const [reports] = await db.query(`
    SELECT r.report_id, r.reason, r.status, r.item_id
    FROM Reports r
  `);

  const [reviews] = await db.query(`
    SELECT r.review_id, r.rating, r.comment, u1.name as reviewer_name, u2.name as reviewed_name
    FROM Reviews r
    LEFT JOIN Users u1 ON r.reviewer_id = u1.user_id
    LEFT JOIN Users u2 ON r.reviewed_user_id = u2.user_id
  `);

  // Aggregate category distributions
  const [categoryDistribution] = await db.query(`
    SELECT c.name, COUNT(i.item_id) as count
    FROM Categories c
    LEFT JOIN Items i ON c.category_id = i.category_id
    GROUP BY c.category_id, c.name
  `);

  const stats = {
    totalUsers: (users as any[]).length,
    totalItems: (items as any[]).length,
    pendingReports: (reports as any[]).filter((r: any) => r.status === 'pending').length,
    totalOrders: (ordersData as any[])[0]?.total_orders || 0,
    totalSales: (ordersData as any[])[0]?.total_sales || 0
  };

  return (
    <AdminPanelClient 
      stats={stats} 
      users={users} 
      items={items} 
      adminLogs={adminLogs} 
      categories={categories}
      reports={reports}
      reviews={reviews}
      categoryDistribution={categoryDistribution}
    />
  );
}
