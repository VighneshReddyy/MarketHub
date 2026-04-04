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

    // Send Notification to Seller
    await db.query(
      "INSERT INTO Notifications (user_id, item_id, message, is_read) VALUES (?, ?, ?, 0)",
      [sellerId, itemId, `Someone is interested in purchasing your item #${itemId}!`]
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
    
    if (!title || !price || !category_id || !condition) {
       return { error: "Missing required fields" };
    }

    const db = getDbConnection();
    await db.query(
      "INSERT INTO Items (seller_id, category_id, title, description, price, condition_type, status, image_url) VALUES (?, ?, ?, ?, ?, ?, 'available', ?)",
      [user.user_id, category_id, title, description, price, condition, image_url]
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
