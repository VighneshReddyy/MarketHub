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

    // Insert the order manually instead of relying on missing DB triggers
    await db.query(
      "INSERT INTO Orders (buyer_id, seller_id, item_id, price, status) VALUES (?, ?, ?, ?, 'pending')",
      [buyerId, sellerId, itemId, price]
    );

    await db.query(
      "INSERT INTO Notifications (user_id, item_id, message, is_read, created_at) VALUES (?, ?, 'You have a new order pending!', 0, NOW())",
      [sellerId, itemId]
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

    // Match alerts and notify users — two-step approach for reliability
    const newItemId = insertResult.insertId;
    const numericCategoryId = Number(category_id);
    const numericPrice = Number(price);
    console.log(`[createListing] New item ${newItemId} | category=${numericCategoryId} | price=${numericPrice} | condition=${condition}`);
    try {
      const [matchingAlerts] = await db.query(
        `SELECT alert_id, user_id, category_id, min_price, max_price, condition_type
         FROM Alerts
         WHERE category_id = ? AND min_price <= ? AND max_price >= ?`,
        [numericCategoryId, numericPrice, numericPrice]
      ) as any[];
      console.log(`[createListing] Found ${matchingAlerts.length} matching alert(s) for item ${newItemId}`);

      for (const alert of matchingAlerts) {
        // Skip notifying the seller about their own listing
        if (alert.user_id === user.user_id) continue;
        const msg = `A new item matching your alert was just listed: "${title}" — ₹${numericPrice}`;
        await db.query(
          `INSERT INTO Notifications (user_id, item_id, message, is_read, created_at) VALUES (?, ?, ?, 0, NOW())`,
          [alert.user_id, newItemId, msg]
        );
        console.log(`[createListing] Notified user ${alert.user_id} for alert ${alert.alert_id}`);
      }
    } catch (e) {
      console.error("[createListing] Failed to notify alert users: ", e);
    }

    revalidatePath("/dashboard/buy");
    revalidatePath("/dashboard/manage");

    return { success: true };
  } catch (error: any) {
    console.error("Listing error:", error);
    return { error: `Failed to create listing: ${error.message}` };
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

// ─── Accept an order — implement it inline to avoid procedure issues ────────────────────
export async function acceptOrder(orderId: number, itemId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { error: "Not authenticated" };

    const db = getDbConnection();
    // Marks order 'completed' + item 'sold' atomically
    await db.query("UPDATE Orders SET status = 'completed' WHERE order_id = ?", [orderId]);
    await db.query("UPDATE Items SET status = 'sold' WHERE item_id = ?", [itemId]);

    const [orders] = await db.query("SELECT buyer_id FROM Orders WHERE order_id = ?", [orderId]) as any[];
    if (orders.length > 0) {
      await db.query(
        "INSERT INTO Notifications (user_id, item_id, message, is_read, created_at) VALUES (?, ?, 'Your order was accepted!', 0, NOW())",
        [orders[0].buyer_id, itemId]
      );
    }

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
