// https://nuxt.com/docs/api/configuration/nuxt-config
function env<T>(
  key: string,
  defaultValue: T,
  formatter: (value: string) => T = (value) => value as T,
): T {
  if (Object.hasOwn(process.env, key)) return formatter(process.env[key]!);
  return defaultValue;
}

const authUrl = (path: string): string => new URL(path, 'https://login.troela.fun').toString();

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "nuxt-oidc-auth"
  ],

  $development: {
    runtimeConfig: {
      upstreamUrl: "http://localhost:8080",
    },
    devtools: {
      enabled: true,
    },
    nitro: {
      storage: {
        oidc: {
          driver: 'fs',
          base: '.data/nitro/oidc',
        },
      },
    },
    vite: {
      optimizeDeps: {
        include: [
          "@tanstack/table-core",
          "@vue/devtools-core",
          "@vue/devtools-kit",
          "better-auth/client/plugins",
          "better-auth/vue",
          "date-fns",
          "js-confetti",
          "yup",
          "zod",
        ],
      },
    },
  },

  css: ["~/assets/css/main.css"],

  // OpenID
  oidc: {
    enabled: true,
    defaultProvider: 'oidc',
    providers: {
      oidc: {
        clientId: 'logistiek-nuxt-dev',
        clientSecret: '',
        redirectUri: 'http://localhost:3000/auth/oidc/callback',
        authorizationUrl: authUrl('/authorize'),
        logoutUrl: authUrl('/api/oidc/end-session'),
        tokenUrl: authUrl('/api/oidc/token'),
        userInfoUrl: authUrl('/api/oidc/userinfo'),
        openIdConfiguration: authUrl('/.well-known/openid-configuration'),
        scope: ['openid', 'email', 'profile', 'groups'],
        pkce: true,
        state: true,
        exposeAccessToken: true,
        exposeIdToken: true,
      }
    },
    session: {
      expirationCheck: true,
      automaticRefresh: true,
      expirationThreshold: 3600,
    },
    middleware: {
      globalMiddlewareEnabled: false,
    }
  },

  runtimeConfig: {
    upstreamUrl: env("UPSTREAM_URL", "https://api.logistiek.myvana.dev"),
    authBase: env("BETTER_AUTH_URL", "http://localhost:3000"),
    authSecret: env("BETTER_AUTH_SECRET", "secret"),
    authCache: {
      version: "1",
      maxAge: 300, // Seconds
    },
    public: {
      // noop
    },
  },

  compatibilityDate: "2025-12-20",

  nitro: {
    // Use local file system storage for dev quick setup
    storage: {
      oidc: {
        driver: 'fs',
        base: '/app/data/oidc',
      },
    },
    hooks: {
      "prerender:generate"(route) {
        const routesToSkip = ["/200.html"];
        if (routesToSkip.includes(route.route)) {
          route.skip = true;
        }
      },
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        "@tanstack/table-core",
        "better-auth/client/plugins",
        "better-auth/vue",
        "date-fns",
        "js-confetti",
        "yup",
        "zod",
      ],
    },
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  icon: {
    serverBundle: {
      collections: ["lucide"],
    },

    clientBundle: {
      icons: [
        // Team icons
        "lucide:radio-tower",
        "lucide:tower-control",
        "lucide:truck",
        "lucide:van",
        "lucide:shield-half",
        "lucide:binoculars",

        // Type of actions
        "lucide:inbox",
        "lucide:forward",
        "lucide:archive-x",
        "lucide:shredder",
        "lucide:check",
        "lucide:mail-check",

        // Type of vendors
        "lucide:store",
        "lucide:ferris-wheel",
        "lucide:barrel",
        "lucide:castle",
        "lucide:library-big",
        "lucide:theater",
        "lucide:lectern",
      ],

      // scan all components in the project and include icons
      scan: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },

  image: {
    provider: "none",
  },
});
