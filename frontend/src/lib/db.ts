import mysql from "mysql2/promise";

const globalForDb = global as unknown as {
  conn: mysql.Pool | undefined;
};

export const getDbConnection = () => {
  if (!globalForDb.conn) {
    globalForDb.conn = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
      ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: true }
        : undefined,
    });
  }
  return globalForDb.conn;
};
