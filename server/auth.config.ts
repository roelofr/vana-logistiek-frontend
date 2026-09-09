import { defineServerAuth } from "@nuxtjs/better-auth/config";
import { getAuthDatabase } from "#server/util/database.ts";
import type { BetterAuthOptions } from "better-auth";

export const options: BetterAuthOptions = {
  database: getAuthDatabase(),
  emailAndPassword: { enabled: true },
};

export default defineServerAuth(options);
