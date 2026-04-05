"use server";

import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function purchaseItem(itemId: number, price: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const buyerId = user.user_id;

    const db = getDbConnection();
    
    // Check item validity
    const [rows] = await db.query(
      "SELECT seller_id, status FROM Items WHERE item_id = ?",
      [itemId]
    ) as any[];
    
    if (rows.length === 0 || rows[0].status !== 'available') {
      return { error: "Item no longer available" };
    }
    if (rows[0].seller_id === buyerId) {
      return { error: "You cannot buy your own item!" };
    }

    const sellerId = rows[0].seller_id;

    // Insert the order — the after_order_insert_notify trigger
    // automatically sends a notification to the seller.
    await db.query(
      "INSERT INTO Orders (buyer_id, seller_id, item_id, price, status) VALUES (?, ?, ?, ?, 'pending')",
      [buyerId, sellerId, itemId, price]
    );

    return { success: true };
  } catch (error: any) {
    console.error("Purchase error:", error);
    return { error: "Failed to process purchase" };
  }
}

export async function createListing(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    
    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const category_id = formData.get("category_id");
    const condition = formData.get("condition");
    const image_url = formData.get("image_url") || null;
    const usage_months = formData.get("usage_months") || null;
    
    if (!title || !price || !category_id || !condition) {
       return { error: "Missing required fields" };
    }

    const db = getDbConnection();
    const [insertResult] = await db.query(
      "INSERT INTO Items (seller_id, category_id, title, description, price, condition_type, status, image_url, usage_months) VALUES (?, ?, ?, ?, ?, ?, 'available', ?, ?)",
      [user.user_id, category_id, title, description, price, condition, image_url, usage_months]
    ) as any[];

    // The after_item_insert trigger fires automatically to notify Alert subscribers.
    // Also call the procedure to notify BuyerRequests matches.
    const newItemId = insertResult.insertId;
    await db.query(
      "CALL MatchItemWithRequests(?, ?, ?, ?)",
      [newItemId, category_id, price, title]
    );

    revalidatePath("/dashboard/buy");
    revalidatePath("/dashboard/manage");

    return { success: true };
  } catch (error: any) {
    console.error("Listing error:", error);
    return { error: "Failed to create listing" };
  }
}

export async function deleteListing(itemId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const db = getDbConnection();
    
    await db.query("UPDATE Items SET status = 'removed' WHERE item_id = ? AND seller_id = ?", [itemId, user.user_id]);

    revalidatePath("/dashboard/buy");
    revalidatePath("/dashboard/manage");
    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { error: "Failed to delete listing" };
  }
}

export async function createAlert(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    
    const category_id = formData.get("category_id");
    const min_price = formData.get("min_price") || 0;
    const max_price = formData.get("max_price") || 9999999;
    const condition = formData.get("condition");
    
    if (!category_id || !condition) {
       return { error: "Missing required fields" };
    }

    const db = getDbConnection();
    await db.query(
      "INSERT INTO Alerts (user_id, category_id, min_price, max_price, condition_type) VALUES (?, ?, ?, ?, ?)",
      [user.user_id, category_id, min_price, max_price, condition]
    );

    return { success: true };
  } catch (error: any) {
    console.error("Alert error:", error);
    return { error: "Failed to create alert" };
  }
}

export async function reportItem(itemId: number, reason: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const db = getDbConnection();
    await db.query(
      "INSERT INTO Reports (item_id, reason, status) VALUES (?, ?, 'pending')",
      [itemId, reason]
    );

    return { success: true };
  } catch (error: any) {
    console.error("Report error:", error);
    return { error: "Failed to submit report" };
  }
}

export async function updateListing(itemId: number, data: { price?: string; description?: string; image_url?: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const db = getDbConnection();

    const fields: string[] = [];
    const values: any[] = [];

    if (data.price) { fields.push("price = ?"); values.push(data.price); }
    if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
    if (data.image_url !== undefined) { fields.push("image_url = ?"); values.push(data.image_url || null); }

    if (fields.length === 0) return { error: "Nothing to update" };

    values.push(itemId, user.user_id);
    await db.query(
      `UPDATE Items SET ${fields.join(", ")} WHERE item_id = ? AND seller_id = ?`,
      values
    );

    revalidatePath("/dashboard/manage");
    revalidatePath("/dashboard/buy");
    return { success: true };
  } catch (error: any) {
    console.error("Update error:", error);
    return { error: "Failed to update listing" };
  }
}

// ─── Accept an order — calls AcceptOrder stored procedure ────────────────────
export async function acceptOrder(orderId: number, itemId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const db = getDbConnection();
    // AcceptOrder: marks order 'completed' + item 'sold' atomically
    await db.query("CALL AcceptOrder(?, ?)", [orderId, itemId]);

    revalidatePath("/dashboard/manage");
    return { success: true };
  } catch (error: any) {
    console.error("AcceptOrder error:", error);
    return { error: "Failed to accept order" };
  }
}

// ─── Get seller stats using DB functions ─────────────────────────────────────
export async function getSellerStats(sellerId: number) {
  try {
    const db = getDbConnection();
    const [rows] = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM Orders WHERE seller_id = ? AND status = 'completed') AS total_sales,
        (SELECT COALESCE(AVG(rating), 0) FROM Reviews WHERE reviewed_user_id = ?) AS avg_rating`,
      [sellerId, sellerId]
    ) as any[];
    const totalSales = rows[0]?.total_sales ?? 0;
    const avgRating = rows[0]?.avg_rating ?? 0;
    return { total_sales: totalSales, is_trusted: avgRating >= 4 && totalSales >= 5 };
  } catch (error: any) {
    console.error("getSellerStats error:", error);
    return { total_sales: 0, is_trusted: false };
  }
}
