export default defineAppConfig({
  runtimeConfig: {
    apiUrl: 'https://logistiek.myvana.dev',
    public: {
      apiUrl: 'https://logistiek.myvana.dev',
    },
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', href: '/logo.svg', type: 'image/svg' },
    ],
    htmlAttrs: { lang: 'nl' },
  },
  ui: {
    colors: {
      primary: 'pink',
      neutral: 'zinc',
    },
  },
})
