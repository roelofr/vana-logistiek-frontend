// https://nuxt.com/docs/api/configuration/nuxt-config
function env<T>(
  key: string,
  defaultValue: T,
  formatter: (value: string) => T = (value) => value as T,
): T {
  if (Object.hasOwn(process.env, key)) return formatter(process.env[key]!);
  return defaultValue;
}

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/better-auth",
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
          driver: "fs",
          base: ".data/nitro/oidc",
        },
      },
    },
  },

  css: ["~/assets/css/main.css"],

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

  auth: {
    redirects: {
      login: "/login",
      guest: "/",
      authenticated: "/app",
      logout: "/logged-out",
    },
    preserveRedirect: true,
    redirectQueryKey: "redirect",
  },

  routeRules: {
    "/app/**": { auth: { only: "user" } },
    "/login": { auth: { only: "guest" } },
  },

  compatibilityDate: "2025-12-20",

  nitro: {
    // Use local file system storage for dev quick setup
    storage: {
      oidc: {
        driver: "fs",
        base: "/app/data/oidc",
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
      noDiscovery: true,
      include: [
        "@tanstack/table-core",
        "date-fns",
        "js-confetti",
        "maplibre-gl",
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
