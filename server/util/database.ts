import { Pool } from "pg";
import { DatabaseSync } from "node:sqlite";

export function getAuthDatabase() {
  const dbUrl = process.env.BETTER_AUTH_DB_URL ?? "sqlite://db.sqlite";

  const isSqlite = dbUrl.startsWith("sqlite://");
  const isPostgres = dbUrl.startsWith("postgres://");

  if (isSqlite) {
    const dbPath = dbUrl.replace(/^sqlite:\/\//, "./");
    return new DatabaseSync(dbPath);
  }

  if (isPostgres)
    return new Pool({
      // Pool settings
      max: 2,

      // Client settings
      connectionString: process.env.BETTER_AUTH_DB_URL,
      user: process.env.BETTER_AUTH_DB_USERNAME,
      password: process.env.BETTER_AUTH_DB_PASSWORD,
      fallback_application_name: "Penis LogistiekApp",
    });

  throw new Error(`Failed to parse DB connection URL: ${dbUrl}`);
}
