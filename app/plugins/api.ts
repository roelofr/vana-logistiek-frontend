export default defineNuxtPlugin((_nuxtApp) => {
  const apiUrl = useAppConfig().apiUrl ?? 'https://logistiek.myvana.dev'
  const authHeader = useRequestHeader('Authorization')
  const authCookie = useCookie('token')
  const accessToken = authHeader ?? authCookie.value

  const api = $fetch.create({
    baseURL: apiUrl as string,
    onRequest({ request, options }) {
      const requestUri = typeof request == 'string' ? request : request.url
      if (requestUri.startsWith('/api/'))
        throw new Error('Call to $api with non-relative URI or URL that does not start with /api/.')

      console.log('API call to %s', requestUri)

      if (accessToken)
        options.headers.set('Authorization', `Bearer ${accessToken}`)
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  }
})
