// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/ui',
    '@vueuse/nuxt',
  ],

  $development: {
    runtimeConfig: {
      apiUrl: 'http://localhost:8080',
      public: {
        apiUrl: 'http://localhost:8080',
      },
    },
  },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiUrl: 'https://logistiek.myvana.dev',
    public: {
      apiUrl: 'https://logistiek.myvana.dev',
    },
  },

  routeRules: {
    '/api/**': {
      cors: true,
    },
  },

  compatibilityDate: '2025-12-20',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
      },
    },
  },

  icon: {
    // Force use of non-/api-route, as they are rewritten to Quarkus by the load balancer.
    localApiEndpoint: '/resources/dynamic/icons',

    serverBundle: {
      collections: ['lucide'],
    },

    clientBundle: {
      icons: [
        // Team icons
        'lucide:radio-tower',
        'lucide:tower-control',
        'lucide:truck',
        'lucide:van',
        'lucide:shield-half',
        'lucide:binoculars',

        // Type of actions
        'lucide:inbox',
        'lucide:forward',
        'lucide:archive-x',
        'lucide:shredder',
        'lucide:check',
        'lucide:mail-check',

        // Type of vendors
        'lucide:store',
        'lucide:ferris-wheel',
        'lucide:barrel',
        'lucide:castle',
        'lucide:library-big',
        'lucide:theater',
        'lucide:lectern',

      ],

      // scan all components in the project and include icons
      scan: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },
})
