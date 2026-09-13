import { defineClientAuth } from "@nuxtjs/better-auth/config";
import { adminClient, jwtClient } from "better-auth/client/plugins";
import { ac, acRoles } from "~/auth.permissions.ts";

export default defineClientAuth({
  plugins: [adminClient({ ac, roles: acRoles }), jwtClient()],
});
