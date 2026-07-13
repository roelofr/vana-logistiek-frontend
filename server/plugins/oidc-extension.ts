import { createError } from "h3";
// @ts-expect-error Runtimes seem to not register nicely, but they are there!
import type { UserSession } from "nuxt-oidc-auth/runtime/types";
import { firstValidToken, getUpstreamUrl } from "#server/util/jwt";
import type { Group, User } from "~/types";

type MeGroup = Pick<Group, "id" | "name" | "colour" | "icon">;
interface MeUser extends Pick<User, "id" | "name" | "email" | "avatar"> {
  roles: string[];
  groups: MeGroup[];
}

async function downloadSessionInformation(session: UserSession): Promise<void> {
  const token = firstValidToken(session.idToken, session.accessToken);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [activeUser, roles] = await Promise.all([
    $fetch<MeUser>(getUpstreamUrl("/api/users/me"), { headers }),
    $fetch<string[]>(getUpstreamUrl("/api/roles/me"), { headers }),
  ]);

  session.vana = {
    roles: roles ?? [],
    group: activeUser.groups?.[0]?.id ?? null,
    groups: activeUser.groups?.map(({ id }) => id) ?? [],
  };
}

export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session) => {
    try {
      await downloadSessionInformation(session);
    } catch {
      throw createError({
        statusCode: 500,
        message: "Failed to download session information",
      });
    }
  });

  sessionHooks.hook("refresh", async (session) => {
    try {
      await downloadSessionInformation(session);
    } catch {
      throw createError({
        statusCode: 500,
        message: "Failed to download session information",
      });
    }
  });
});
