import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET() {
  const db = getDbConnection();
  try {
    // 1. Ensure "Home & Furniture" category exists or insert it
    await db.query(`INSERT IGNORE INTO Categories (name) VALUES ('Home & Furniture')`);
    
    // Get its ID
    const [rows] = await db.query(`SELECT category_id FROM Categories WHERE name = 'Home & Furniture' OR name = 'Furniture' LIMIT 1`) as any[];
    const furnitureId = rows[0]?.category_id;

    if (furnitureId) {
      // 2. Check for existing "Chair" categories
      const [chairRows] = await db.query(`SELECT category_id FROM Categories WHERE name LIKE '%Chair%'`) as any[];
      for (const row of chairRows) {
        const chairId = row.category_id;
        // map items to furniture
        await db.query(`UPDATE Items SET category_id = ? WHERE category_id = ?`, [furnitureId, chairId]);
        // delete chair category
        await db.query(`DELETE FROM Categories WHERE category_id = ?`, [chairId]);
      }
    }

    // 3. Add the rest of the new categories
    const categories = [
      'Fashion & Clothing',
      'Books & Stationery',
      'Sports & Fitness',
      'Vehicles',
      'Gaming',
      'Music Instruments',
      'Movies & Collectibles',
      'Toys & Hobbies'
    ];
    for (const cat of categories) {
      // check if exists (since we don't have UNIQUE on name unfortunately)
      const [existing] = await db.query(`SELECT category_id FROM Categories WHERE name = ?`, [cat]) as any[];
      if (existing.length === 0) {
        await db.query(`INSERT INTO Categories (name) VALUES (?)`, [cat]);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
