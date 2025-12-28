const validationRoute = `https://${crypto.randomUUID()}.example.com/not-an-api/`
const validationOrigin = new URL(validationRoute).origin

export default defineNuxtPlugin((_) => {
  const config = useRuntimeConfig()
  const accessToken = useAccessToken()

  const isValidApiUrl = (request: string | Request): boolean => {
    const requestUri = typeof request == 'string' ? request : request.url

    const route = new URL(requestUri, validationRoute)
    if (route.origin !== validationOrigin)
      return false

    return route.pathname.startsWith('/api/')
  }

  const $api = $fetch.create({
    baseURL: config.apiUrl as string ?? config.public?.apiUrl as string ?? 'https://logistiek.myvana.dev',
    onRequest({ request, options }) {
      if (!isValidApiUrl(request))
        return

      options.headers.set('Accept', 'application/json, image/*, text/*;q=0.9, */*;q=0.8')

      if (accessToken.value)
        options.headers.set('Authorization', `Bearer ${accessToken.value}`)
    },
  })

  return {
    provide: {
      api: $api,
    },
  }
})
