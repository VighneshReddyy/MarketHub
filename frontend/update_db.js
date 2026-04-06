const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env" });

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });

  try {
    await pool.query("SET FOREIGN_KEY_CHECKS=0");
    // 1. Move Chairs to Furniture
    await pool.query("UPDATE Items SET category_id = 4 WHERE category_id = 5");
    
    // 2. Remove Chair category
    await pool.query("DELETE FROM Categories WHERE category_id = 5");

    // 3. Rename Furniture to Home & Furniture
    await pool.query("UPDATE Categories SET name = 'Home & Furniture' WHERE category_id = 4");

    // 4. Add new categories
    const newCategories = [
      "Fashion & Clothing",
      "Books & Stationery",
      "Sports & Fitness",
      "Vehicles",
      "Gaming",
      "Music Instruments",
      "Movies & Collectibles",
      "Toys & Hobbies"
    ];

    for (const cat of newCategories) {
      // Check if exists
      const [existing] = await pool.query("SELECT * FROM Categories WHERE name = ?", [cat]);
      if (existing.length === 0) {
        await pool.query("INSERT INTO Categories (name) VALUES (?)", [cat]);
      }
    }
    
    console.log("Categories updated successfully!");

    // Check if Alerts table exists. It may exist. Let's make sure it doesn't fail.
    const [tables] = await pool.query("SHOW TABLES LIKE 'Alerts'");
    if (tables.length === 0) {
      console.log("Creating Alerts table...");
      await pool.query(`
        CREATE TABLE Alerts (
          alert_id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          category_id INT NOT NULL,
          min_price DECIMAL(10,2) DEFAULT 0,
          max_price DECIMAL(10,2) DEFAULT 9999999,
          condition_type VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Alerts table created!");
    } else {
        console.log("Alerts table already exists.");
    }
    await pool.query("SET FOREIGN_KEY_CHECKS=1");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
