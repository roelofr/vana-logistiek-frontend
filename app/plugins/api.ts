const validationRoute = new URL(`https://example.com/not-an-api/`)
const isValidUrl = (url: string) => {
  const route = new URL(url, validationRoute)
  if (route.origin !== validationRoute.origin)
    return false

  return route.pathname.startsWith('/api/')
}

const resolveRequestUri = (request: string | Request) => typeof request == 'string' ? request : request.url

export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = nuxtApp.$config
  const apiUrl = appConfig?.apiUrl ?? appConfig?.public?.apiUrl ?? 'https://logistiek.myvana.dev'
  const authHeader = useAccessToken()

  const api = $fetch.create({
    baseURL: apiUrl,
    onRequest({ request, options }) {
      const requestUri = resolveRequestUri(request)

      if (!isValidUrl(requestUri))
        throw new Error('Call to $api with non-relative URI or URL that does not start with /api/.')

      const token = authHeader.value
      if (token)
        options.headers.set('Authorization', `Bearer ${token}`)

      console.log('Making request to URL %s, using authorization? %o', new URL(requestUri, apiUrl).toString(), options.headers.has('Authorization'))
    },
  })

  return {
    provide: {
      api,
    },
  }
})
