// modules/better-auth-migrate.ts
import { defineNuxtModule, logger } from "@nuxt/kit";
import { getMigrations } from "better-auth/db/migration";
import { options as betterAuthOptions } from "#server/auth.config";

export default defineNuxtModule({
  meta: {
    name: "better-auth-migrate",
  },
  setup(options, nuxt) {
    // Hook into nitro:prepare to run migration BEFORE the server builds
    nuxt.hook("modules:done", async () => {
      logger.start("Checking for better-auth migrations...");

      // Get migrations
      const { toBeAdded, toBeCreated, runMigrations } =
        await getMigrations(betterAuthOptions);

      // Run, if any
      if (toBeAdded.length > 0 || toBeCreated.length > 0) {
        logger.start("Running database migrations...");

        await runMigrations();

        logger.success("Database migrations completed successfully.");
      } else {
        logger.success("Database migrations are up-to-date.");
      }
    });
  },
});
