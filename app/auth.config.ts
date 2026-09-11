import { defineClientAuth } from "@nuxtjs/better-auth/config";
import { jwtClient } from "better-auth/client/plugins";

export default defineClientAuth({
  plugins: [jwtClient()],
});
