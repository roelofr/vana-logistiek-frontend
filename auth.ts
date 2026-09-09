import { betterAuth } from "better-auth";
import { options } from "./server/auth.config";

export const auth = betterAuth(options);
