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
    const [categories] = await pool.query("SELECT * FROM Categories");
    console.log("Categories:", JSON.stringify(categories, null, 2));

    const [items] = await pool.query("DESCRIBE Items");
    console.log("Items table:", items);

    const [orders] = await pool.query("DESCRIBE Orders");
    console.log("Orders table:", orders);

    const [notifications] = await pool.query("DESCRIBE Notifications");
    console.log("Notifications table:", notifications);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
