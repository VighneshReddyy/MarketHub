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
    const [alerts] = await pool.query("SELECT * FROM Alerts");
    console.log("Alerts:", alerts);
    
    const [items] = await pool.query("SELECT * FROM Items ORDER BY item_id DESC LIMIT 3");
    console.log("Latest Items:", items);

    const [notifications] = await pool.query("SELECT * FROM Notifications ORDER BY notification_id DESC LIMIT 5");
    console.log("Latest Notifications:", notifications);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
