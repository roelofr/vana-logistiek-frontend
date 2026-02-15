const validationRoute = `https://api.example.com/not-an-api/`
const validationOrigin = new URL(validationRoute).origin

const apiAuthErrorToast = 'vana-api-auth-error'

export default defineNuxtPlugin((_) => {
  const config = useRuntimeConfig()
  const accessToken = useAccessToken()
  const toast = useToast()
  const toastRef = ref<string | number | null>(null)

  const baseUrl = computed(() => config.apiUrl as string ?? config.public?.apiUrl as string ?? 'https://logistiek.myvana.dev')

  const isValidApiUrl = (request: string | Request): boolean => {
    const requestUri = typeof request == 'string' ? request : request.url

    const route = new URL(requestUri, validationRoute)
    if (route.origin !== validationOrigin)
      return false

    return route.pathname.startsWith('/api/')
  }

  const $api = $fetch.create({
    redirect: 'error',
    baseURL: baseUrl.value,
    onRequest({ request, options }) {
      if (!isValidApiUrl(request))
        return

      options.headers.set('Accept', 'application/json, image/*, text/*;q=0.9, */*;q=0.8')

      if (accessToken.value)
        options.headers.set('Authorization', `Bearer ${accessToken.value}`)
    },
    onResponse(res) {
      if (res.response.status < 300 && toastRef.value)
        toast.remove(toastRef.value)
    },
    onResponseError(response) {
      if (toastRef.value == null && response.response.status === 401) {
        toastRef.value = toast.add({
          id: apiAuthErrorToast,
          type: 'foreground',
          color: 'error',
          icon: 'i-lucide-user-x',
          title: 'Sessie verlopen',
          description: 'Je sessie is verlopen, herlaad de pagina om opnieuw in te loggen.',
          duration: -1,
          actions: [
            {
              label: 'Pagina herladen',
              href: document.location.href,
            },
          ],
        }).id
      }
    },
  })

  const resolve = (path: string): string => {
    if (baseUrl.value[0] == '/')
      return baseUrl.value + '/' + path.replace(/^\//, '')

    return new URL(path, baseUrl.value).toString()
  }

  const $apiUrl = {
    baseUrl,
    resolve,
  }

  return {
    provide: {
      api: $api,
      apiUrl: $apiUrl,
    },
  }
})
