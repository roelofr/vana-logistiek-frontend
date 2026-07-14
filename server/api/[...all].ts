import {
  createError,
  defineEventHandler,
  type H3Event,
  proxyRequest,
} from "h3";
import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";
import { firstValidToken } from "#server/util/jwt";

const acceptedRequestTypes = ["GET", "HEAD", "PATCH", "POST", "PUT", "DELETE"];
type HttpMethod = "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE";

const streamPaths = [new RegExp("^/api/chats/stream/\\d+$")];
function isStreaming(event: H3Event<EventHandlerRequest>): boolean {
  if (!event.headers.get("accept")?.includes("text/event-stream")) return false;
  if (!streamPaths.some((path) => path.test(event.path))) return false;

  console.log("Streaming %s", event.path);

  return true;
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
    throw e;
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
    `Bearer ${firstValidToken(event.context.sessionIdToken, event.context.sessionAccessToken)}`,
  );
  proxyHeaders.set("X-User-Id", event.context.userId);

  const shouldStream = isStreaming(event);

  // 6. Proxy the Request
  try {
    return proxyRequest(event, targetUrl.toString(), {
      headers: proxyHeaders,
      streamRequest: shouldStream || undefined,
      sendStream: shouldStream || undefined,
    });
  } catch (error) {
    console.log(`Proxy %s %s: ERROR %s`, method, targetUrl, error);

    console.error("Error = %o", error);

    throw createError({
      statusCode: 502,
      message: "Failed to proxy request",
    });
  }
});
