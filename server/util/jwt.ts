import { jwtDecode } from "jwt-decode";

export function getUpstreamUrl(path: string): string {
  const config = useRuntimeConfig();
  const upstreamUrl = config.upstreamUrl || "https://api.logistiek.myvana.dev";

  if (!upstreamUrl) throw new Error("No upstream URL configured");

  return new URL(path, upstreamUrl).toString();
}

export function tokenValid(token: string) {
  try {
    const parsed = jwtDecode(token);

    return Boolean(parsed?.exp && parsed!.exp > Date.now() / 1000);
  } catch {
    return false;
  }
}

export function firstValidToken(...tokens: string[]) {
  return tokens.find(tokenValid) ?? null;
}
