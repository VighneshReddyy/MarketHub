const mysql = require('mysql2/promise');

async function test() {
  try {
    const db = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "root123",
      database: "marketplace",
    });
    
    const [rows] = await db.query(
      "SELECT user_id, name, email, is_admin FROM Users WHERE email = ? AND password = ? LIMIT 1",
      ["aayush@gmail.com", "pass123"]
    );

    console.log("TEST RESULT:", rows);
    process.exit(0);
  } catch (err) {
    console.error("TEST ERROR:", err);
    process.exit(1);
  }
}
test();
