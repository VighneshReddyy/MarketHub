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
    const [categories] = await pool.query("SELECT * FROM Categories");
    fs.writeFileSync("categories-latest.json", JSON.stringify(categories, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
