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
    const newItemId = 150005;
    const title = "String Price Test";
    
    // Simulating exactly what Next.js FormData does: form values are Strings
    const category_id = "1";
    const price = "89000"; 
    
    // Testing the SELECT directly with string params to see if TiDB returns 0 rows
    const [rows] = await pool.query(`
         SELECT user_id, ?, CONCAT('An item matching your request "', ?, '" has just been listed!'), 0, NOW()
         FROM Alerts
         WHERE category_id = ? AND min_price <= ? AND max_price >= ?
    `, [newItemId, title, category_id, price, price]);
    
    console.log("Returned rows with String params:", rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
