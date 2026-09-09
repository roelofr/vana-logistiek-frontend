import Database from "better-sqlite3";
import { Pool } from "pg";

export function getAuthDatabase() {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) return new Database("./sqlite.db");

  return new Pool({
    // Pool settings
    max: 2,

    // Client settings
    connectionString: process.env.BETTER_AUTH_DB_URL,
    user: process.env.BETTER_AUTH_DB_USERNAME,
    password: process.env.BETTER_AUTH_DB_PASSWORD,
    fallback_application_name: "Penis LogistiekApp",
  });
}
