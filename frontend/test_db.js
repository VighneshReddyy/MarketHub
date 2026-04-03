const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'marketplace'
});

connection.query(
  'SELECT email, password FROM Users LIMIT 1;',
  function(err, results, fields) {
    if (err) {
      console.log("DB_ERROR:", err.message);
    } else {
      console.log("DB_SUCCESS:", JSON.stringify(results, null, 2));
    }
    connection.end();
  }
);
