// server/lib/auth.ts
import type { Auth } from 'better-auth'
import { betterAuth } from 'better-auth'
import { genericOAuth } from 'better-auth/plugins'
import Database from 'better-sqlite3'

// We export a factory function or a singleton.
// For Nuxt, a singleton initialized once is usually best.
let authInstance: Auth<any> | undefined // eslint-disable-line @typescript-eslint/no-explicit-any

export function getAuth() {
  if (authInstance) return authInstance

  authInstance = betterAuth(getAuthConfig())

  return authInstance
}

const createSecret = (bytes: number): string => {
  const data = new Uint8Array(bytes)
  crypto.getRandomValues(data)
  return Array.from(data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function getRuntimeConfig() {
  return (typeof useRuntimeConfig === 'function')
    ? useRuntimeConfig()
    : {
      authBase: 'http://localhost:3000',
      authSecret: createSecret(32),
      authCache: {
        version: '1',
        maxAge: 300,
      },
      pocketId: {
        clientId: 'string',
        clientSecret: 'string',
        issuer: 'https://example.com',
        scopes: ['openid', 'groups', 'profile'],
      },
    }
}

function buildBaseUrl(baseUrl: string) {
  const baseUrls = process.env.BETTER_AUTH_ORIGINS ?? ''
  if (!baseUrls)
    return process.env.BETTER_AUTH_URL || baseUrl

  const origins = baseUrls.split(',').map(origin => new URL(origin.trim()))

  return {
    allowedHosts: origins.map(origin => origin.port ? `${origin.hostname}:${origin.port}` : origin.hostname),
    protocol: origins[0]!.protocol.replace(/:$/, ''),
    fallback: baseUrl ?? origins[0]!.origin,
  }
}

export function getAuthConfig() {
  const config = getRuntimeConfig()
  const baseUrlConfig = buildBaseUrl(config.authBase)

  return {
    appName: 'Penis Logistiekapp',

    baseUrl: baseUrlConfig,
    secret: process.env.BETTER_AUTH_SECRET || config.authSecret,

    // Use SQLite for storage
    database: new Database('data/database.sqlite'),

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 18, // 18 hours
      updateAge: 60 * 60, // Update session every hour

      cookieCache: {
        enabled: true,
        version: config.authCache.version ?? '1',
        maxAge: 30, // 30 seconds
      },
    },

    // Error page formatting
    onAPIError: {
      throw: true,
      errorURL: '/auth/login',
    },

    // OpenID plugin
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: 'pocket',
            clientId: config.pocketId.clientId,
            clientSecret: config.pocketId.clientSecret,
            discoveryUrl: new URL('/.well-known/openid-configuration', config.pocketId.issuer).toString(),
            scopes: config.pocketId.scopes,
            pkce: true,
          },
        ],
      }),
    ],
  }
}
