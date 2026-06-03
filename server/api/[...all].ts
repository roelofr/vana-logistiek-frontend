// server/middleware/proxy-useAuth.ts
import {createError, defineEventHandler} from 'h3'
import {getAuth} from '#server/lib/auth'

const skippedRequestHeaders = [
  'connection',
  'transfer-encoding',
  'host',
  'cookie',
]
const skippedResponseHeaders = ['connection', 'transfer-encoding']
const acceptedRequestTypes = ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE']
type AcceptedRequestType = 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE'

export default defineEventHandler(async (event) => {
  // Only intercept expected methods
  const method = event.method.toUpperCase()
  if (!acceptedRequestTypes.includes(method)) return

  // 1. Get Configuration
  const config = useRuntimeConfig()
  const upstreamUrl = config.upstreamUrl
    ? config.upstreamUrl
    : 'https://api.logistiek.myvana.dev'

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
    const session = await auth.api.getSession({headers: event.headers})

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
      body: {providerId: 'pocket'},
    })

    if (
      !token
      || (token.accessTokenExpiresAt && token.accessTokenExpiresAt < new Date())
    )
      throw new Error('Token missing or expired')

    // Optionally attach user info to context if needed downstream
    event.context.userToken = token.accessToken
  } catch {
    // Access Token has expired, kill the whole session
    await auth.api.revokeSession({
      headers: event.headers,
      body: {token: event.context.sessionToken as string},
    })

    throw createError({
      statusCode: 401,
      message: 'Authentication failed',
    })
  }

  // 4. Construct Target URL
  const targetUrl = new URL(event.path, upstreamUrl)

  // 5. Prepare Headers
  const upstreamHeaders = new Headers({
    'Accept': 'application/json, text/plain, */*',
    'Authorization': `Bearer ${event.context.userToken}`,
    'X-User-Id': event.context.userId,
  })

  if (event.headers.has('Content-Type'))
    upstreamHeaders.set('Content-Type', event.headers.get('Content-Type') as string)

  // 5. Proxy the Request
  try {
    const response = await fetch(targetUrl.toString(), {
      mode: 'cors',
      credentials: 'include',
      headers: upstreamHeaders,
      method: method,
      body: ['GET', 'HEAD'].includes(method) ? undefined : await readBody(event),
    })



    await event.respondWith(response)
  } catch (error) {
    console.error('Error = %o', error)

    throw createError({
      statusCode: 502,
      message: 'Failed to proxy request',
    })
  }
})
