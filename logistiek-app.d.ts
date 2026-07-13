// Extend OIDC session with Vana props.
import "nuxt-oidc-auth/runtime/types";

declare module "nuxt-oidc-auth/runtime/types" {
  interface UserSession {
    vana: {
      roles: string[];
      group: number | null;
      groups: number[];
    };
  }
}
