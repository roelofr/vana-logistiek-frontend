import { createError, defineEventHandler, proxyRequest } from "h3";
import { jwtDecode } from "jwt-decode";
import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

const acceptedRequestTypes = ["GET", "HEAD", "PATCH", "POST", "PUT", "DELETE"];
type HttpMethod = "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE";

function maybeUseIdToken(idToken: string | null, accessToken: string): string {
  if (!idToken) return accessToken;

  try {
    const parsed = jwtDecode(idToken);

    if (!parsed!.exp || parsed!.exp < Date.now() / 1000) return accessToken;

    return idToken;
  } catch {
    return accessToken;
  }
}

export default defineEventHandler(async (event) => {
  // Only intercept expected methods
  const checkMethod = event.method.toUpperCase();
  if (!acceptedRequestTypes.includes(checkMethod))
    throw createError({
      statusCode: 405,
      message: "API does not support this method type",
    });

  const method = checkMethod as HttpMethod;

  // 1. Get Configuration
  const config = useRuntimeConfig();
  const upstreamUrl = config.upstreamUrl || "https://api.logistiek.myvana.dev";

  if (!upstreamUrl) {
    console.warn("No upstream URL configured");
    throw createError({
      statusCode: 500,
      message: "Upstream URL not configured",
    });
  }

  // 3. Local Validation
  try {
    const session = await getUserSession(event);

    event.context.sessionAccessToken = session.accessToken ?? null;
    event.context.sessionIdToken = session.idToken ?? null;
    event.context.userId = session.userInfo?.sub ?? null;
  } catch (e) {
    console.error("Failed to fetch session %o", e);
    // noop
  }

  if (!event.context.sessionAccessToken || !event.context.userId) {
    throw createError({
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  // 4. Construct Target URL
  const targetUrl = new URL(event.path, upstreamUrl);

  // 5. Prepare headers
  const proxyHeaders = new Headers();
  proxyHeaders.set(
    "Authorization",
    `Bearer ${maybeUseIdToken(event.context.sessionIdToken, event.context.sessionAccessToken)}`,
  );
  proxyHeaders.set("X-User-Id", event.context.userId);

  // 6. Proxy the Request
  try {
    return proxyRequest(event, targetUrl.toString(), { headers: proxyHeaders });
  } catch (error) {
    console.log(`Proxy %s %s: ERROR %s`, method, targetUrl, error);

    console.error("Error = %o", error);

    throw createError({
      statusCode: 502,
      message: "Failed to proxy request",
    });
  }
});
