// server/middleware/proxy-useAuth.ts
import { createError, defineEventHandler } from "h3";
import { getAuth } from "#server/lib/auth";
import { jwtDecode } from "jwt-decode";

const skippedRequestHeaders = [
  "connection",
  "transfer-encoding",
  "host",
  "cookie",
];
const skippedResponseHeaders = [
  "connection",
  "transfer-encoding",
  "set-cookie",
];
const acceptedRequestTypes = ["GET", "HEAD", "PATCH", "POST", "PUT", "DELETE"];
type HttpMethod = "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE";

export default defineEventHandler(async (event) => {
  // Only intercept expected methods
  const checkMethod = event.method.toUpperCase();
  if (!acceptedRequestTypes.includes(checkMethod)) return;
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
  const auth = getAuth();
  try {
    const session = await auth.api.getSession({ headers: event.headers });

    event.context.sessionToken = session?.session.token ?? null;
    event.context.userId = session?.user.id ?? null;
  } catch {
    // noop
  }

  if (!event.context.sessionToken || !event.context.userId) {
    throw createError({
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }

  try {
    const token = await auth.api.getAccessToken({
      headers: event.headers,
      body: { providerId: "pocket" },
    });

    if (
      !token ||
      (token.accessTokenExpiresAt && token.accessTokenExpiresAt < new Date())
    )
      throw new Error("Token missing or expired");

    // Attach access token
    event.context.userToken = token.accessToken;

    // Attach ID token if present
    if (token.idToken) event.context.idToken = token.idToken;
  } catch {
    // Access Token has expired, kill the whole session
    await auth.api.revokeSession({
      headers: event.headers,
      body: { token: event.context.sessionToken as string },
    });

    throw createError({
      statusCode: 401,
      message: "Authentication failed",
    });
  }

  // 4. Construct Target URL
  const targetUrl = new URL(event.path, upstreamUrl);

  // 5. Prepare headers
  const authToken =
    event.context.idToken &&
    (jwtDecode(event.context.idToken)?.exp ?? 0) > Date.now() / 1000
      ? event.context.idToken
      : event.context.useToken;

  console.log(
    "Authenticating using %s",
    authToken == event.context.useToken ? "access token" : "id-token",
  );

  const upstreamHeaders = new Headers();

  Array.from(event.headers.entries())
    .filter(([key]) => !skippedRequestHeaders.includes(key.toLowerCase()))
    .map(([key, value]) => upstreamHeaders.append(key, value));

  upstreamHeaders.set("Accept", "application/json, text/plain, */*");
  upstreamHeaders.set("Authorization", `Bearer ${authToken}`);
  upstreamHeaders.set("X-User-Id", event.context.userId);

  // 5. Proxy the Request
  try {
    const response = await fetch(targetUrl.toString(), {
      mode: "cors",
      credentials: "include",
      headers: upstreamHeaders,
      method: method,
      body: ["GET", "HEAD"].includes(method)
        ? undefined
        : await readRawBody(event),
    });

    const filteredHeaders = new Headers(
      Array.from(response.headers.entries()).filter(
        ([key]) => !skippedResponseHeaders.includes(key.toLowerCase()),
      ),
    );

    await event.respondWith(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: filteredHeaders,
      }),
    );
  } catch (error) {
    console.error("Error = %o", error);

    throw createError({
      statusCode: 502,
      message: "Failed to proxy request",
    });
  }
});
