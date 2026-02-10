const inputUi = {
  slots: {
    root: ['w-full', 'max-w-lg'],
  },
}

export default defineAppConfig({
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
  vendor: {
    types: {
      shop: 'Verkoper',
      publisher: 'Uitgever',
      food: 'Cateraar',
      entertainment: 'Entertainment',
    },
  },
  ui: {
    input: inputUi,
    inputMenu: inputUi,
    inputTags: inputUi,
    textarea: inputUi,
    colors: {
      primary: 'pink',
      neutral: 'zinc',
    },
  },
})
