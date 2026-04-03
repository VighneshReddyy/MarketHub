const mysql = require('mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'marketplace'
  });
  
  try {
    const [reviews] = await db.query(`
      SELECT r.review_id, r.rating, r.comment, u1.name as reviewer_name, u2.name as reviewed_name
      FROM Reviews r
      LEFT JOIN Users u1 ON r.reviewer_id = u1.user_id
      LEFT JOIN Users u2 ON r.reviewed_user_id = u2.user_id
    `);
    console.log("Joined Reviews count:", reviews.length);
  } catch(e) {
    console.error("Error on reviews:", e.message);
  }

  await db.end();
}
main().catch(console.error);
