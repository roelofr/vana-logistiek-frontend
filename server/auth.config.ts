import { defineServerAuth } from "@nuxtjs/better-auth/config";
import { getAuthDatabase } from "#server/util/database.ts";
import { jwt } from "better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";

export const options: BetterAuthOptions = {
  database: getAuthDatabase(),
  session: {
    cookieCache: {
      strategy: "jwt",
    },
  },
  emailAndPassword: { enabled: true },
  plugins: [
    jwt({
      sessionCookieCache: true,
    }),
  ],
};

export default defineServerAuth(options);
