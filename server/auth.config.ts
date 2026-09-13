import { defineServerAuth } from "@nuxtjs/better-auth/config";
import { getAuthDatabase } from "#server/util/database.ts";
import { admin, emailOTP, jwt, phoneNumber } from "better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";

import { ac, acRoles } from "~/auth.permissions.ts";
import { useBrevo } from "#server/composables/useBrevo.ts";

export const options: BetterAuthOptions = {
  database: getAuthDatabase(),
  session: {
    cookieCache: {
      strategy: "jwt",
    },
  },
  emailAndPassword: { enabled: true },
  plugins: [
    admin({ ac, roles: acRoles }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          const { sendMessage } = useBrevo();
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    phoneNumber({
      sendOTP(data) {
        // TODO
      },
    }),
    jwt({
      sessionCookieCache: true,
    }),
  ],
};

export default defineServerAuth(options);
