import mysql from "mysql2/promise";

const globalForDb = global as unknown as {
  conn: mysql.Pool | undefined;
};

export const dbParams = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "marketplace",
  port: parseInt(process.env.DB_PORT || "3306"),
  ssl: process.env.DB_SSL === "true"
    ? { minVersion: "TLSv1.2", rejectUnauthorized: true }
    : undefined,
};

export const getDbConnection = () => {
  if (!globalForDb.conn) {
    globalForDb.conn = mysql.createPool(dbParams);
  }
  return globalForDb.conn;
};
