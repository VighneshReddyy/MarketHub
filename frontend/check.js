const mysql = require('mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'marketplace'
  });
  
  const [reviews] = await db.query('SELECT * FROM Reviews');
  console.log("Reviews:", reviews.length);
  
  const [reports] = await db.query('SELECT * FROM Reports');
  console.log("Reports:", reports.length);

  const [notifications] = await db.query('SELECT * FROM Notifications');
  console.log("Notifications:", notifications.length);

  await db.end();
}
main().catch(console.error);
