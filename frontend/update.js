const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 4000,
        ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  });
  
  await conn.query(`INSERT IGNORE INTO Categories (name) VALUES ('Home & Furniture')`);
  console.log("Inserted Home & Furniture");
  
  const [catRows] = await conn.query(`SELECT category_id FROM Categories WHERE name = 'Home & Furniture' OR name = 'Furniture' LIMIT 1`);
  const fid = catRows[0].category_id;
  
  const [chairRows] = await conn.query(`SELECT category_id FROM Categories WHERE name LIKE '%Chair%'`);
  for(let row of chairRows) {
     const cid = row.category_id;
     await conn.query(`UPDATE Items SET category_id = ? WHERE category_id = ?`, [fid, cid]);
     await conn.query(`DELETE FROM Categories WHERE category_id = ?`, [cid]);
     console.log("Migrated and deleted chair category", cid);
  }
  
  const others = [
      'Fashion & Clothing',
      'Books & Stationery',
      'Sports & Fitness',
      'Vehicles',
      'Gaming',
      'Music Instruments',
      'Movies & Collectibles',
      'Toys & Hobbies'
  ];
  for(let c of others) {
     const [exists] = await conn.query(`SELECT category_id FROM Categories WHERE name=?`, [c]);
     if (exists.length === 0) {
       await conn.query(`INSERT INTO Categories (name) VALUES (?)`, [c]);
       console.log("Added", c);
     }
  }
  console.log("Done");
  process.exit(0);
}
run();
