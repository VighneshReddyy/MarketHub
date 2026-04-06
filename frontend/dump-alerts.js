const fs = require("fs");
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
    const [alerts] = await pool.query("SELECT * FROM Alerts ORDER BY alert_id DESC LIMIT 5");
    fs.writeFileSync("alerts-dump.json", JSON.stringify(alerts, null, 2));
    
    const [items] = await pool.query("SELECT item_id, title, category_id, price FROM Items ORDER BY item_id DESC LIMIT 3");
    fs.writeFileSync("items-dump.json", JSON.stringify(items, null, 2));

    const [notifications] = await pool.query("SELECT * FROM Notifications ORDER BY notification_id DESC LIMIT 10");
    fs.writeFileSync("notifications-dump.json", JSON.stringify(notifications, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
