// server/middleware/proxy-useAuth.ts
import { createError, defineEventHandler } from 'h3'
import { getAuth } from '#server/lib/auth'
import type { Session } from 'better-auth'

const skippedRequestHeaders = ['connection', 'transfer-encoding', 'host', 'cookie']
const skippedResponseHeaders = ['connection', 'transfer-encoding']
const acceptedRequestTypes = ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE']
type AcceptedRequestType = 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE'

export default defineEventHandler(async (event) => {
  // Only intercept expected methods
  const method = event.method.toUpperCase()
  if (!acceptedRequestTypes.includes(method)) return

  // 1. Get Configuration
  const config = useRuntimeConfig()
  const upstreamUrl = config.upstreamUrl ? config.upstreamUrl : 'https://api.logistiek.myvana.dev'

  if (!upstreamUrl) {
    console.warn('No upstream URL configured')
    throw createError({
      statusCode: 500,
      message: 'Upstream URL not configured',
    })
  }

  // 3. Local Validation
  const auth = getAuth()
  try {
    const session = await auth.api.getSession({ headers: event.headers })

    event.context.sessionToken = session?.session.token ?? null
    event.context.userId = session?.user.id ?? null
  } catch {
    // noop
  }

  if (!event.context.sessionToken || !event.context.userId) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    })
  }

  try {
    const token = await auth.api.getAccessToken({
      headers: event.headers,
      body: { providerId: 'pocket' },
    })

    if (!token || (token.accessTokenExpiresAt && token.accessTokenExpiresAt < new Date()))
      throw new Error('Token missing or expired')

    // Optionally attach user info to context if needed downstream
    event.context.userToken = token.accessToken
  } catch {
    // Access Token has expired, kill the whole session
    await auth.api.revokeSession({ headers: event.headers, body: { token: event.context.sessionToken as string } })

    throw createError({
      statusCode: 401,
      message: 'Authentication failed',
    })
  }

  // 4. Construct Target URL
  const targetUrl = new URL(event.path, upstreamUrl)

  // 5. Prepare Headers
  const headers: Record<string, string> = {}
  Object.entries(event.headers)
    .filter(([key, _value]) => !skippedRequestHeaders.includes(key.toLowerCase()))
    .forEach(([key, value]) => (headers[key] = value))

  // Ensure Authorization is forwarded (it was already extracted, but we ensure it's in the map)
  headers['authorization'] = `Bearer ${event.context.userToken}`
  headers['X-User-Id'] = event.context.userId

  // 5. Proxy the Request
  // We use h3's sendProxy or manual fetch.
  // Note: sendProxy is convenient but requires careful header handling.
  // Here we use a manual fetch to ensure full control over the request body and headers.
  try {
    const response = await $fetch.raw(targetUrl.toString(), {
      method: method as AcceptedRequestType,
      headers,
      body: method === 'POST' ? await readBody(event) : undefined,
    })

    // Forward the response status and headers back to the client
    event.node.res.statusCode = response.status
    event.node.res.statusMessage = response.statusText

    // Forward response headers (excluding hop-by-hop)
    Object.entries(response.headers)
      .filter(([key, _value]) => !skippedResponseHeaders.includes(key.toLowerCase()))
      .forEach(([key, value]) => event.node.res.setHeader(key, value))

    // Stream the body
    const body = await response._data // In $fetch.raw, _data holds the raw buffer/string
    if (body) event.node.res.end(body)
    else event.node.res.end()
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    // Handle upstream errors (e.g., 401 from upstream, network failure)
    console.error('Proxy error:', error.message)
    throw createError({
      statusCode: error.response?.status || 502,
      message: error.response?.statusText || 'Upstream service unavailable',
    })
  }
})
