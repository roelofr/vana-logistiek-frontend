const validationRoute = `https://api.example.com/not-an-api/`
const validationOrigin = new URL(validationRoute).origin

const apiAuthErrorToast = 'vana-api-auth-error'

export default defineNuxtPlugin(() => {
  const toast = useToast()
  const toastRef = ref<string | number | null>(null)
  const baseUrl = computed<string>(() => {
    if (document?.location?.origin)
      new URL('/api/', document.location.origin).toString()
    return '/api/'
  })
  const baseOrigin = computed(() => new URL(baseUrl.value, 'https://example.com').origin)

  const isValidApiUrl = (request: string | Request): boolean => {
    const requestUri = typeof request == 'string' ? request : request.url

    const route = new URL(requestUri, validationRoute)
    if (route.origin !== validationOrigin) return false

    return route.pathname.startsWith('/api/')
  }

  const $api = $fetch.create({
    redirect: 'error',
    baseURL: baseUrl.value,
    onRequest({ request, options }) {
      if (!isValidApiUrl(request)) return

      options.headers.set('Accept', 'application/json, image/*, text/*;q=0.9, */*;q=0.8')
    },
    onResponse(res) {
      if (res.response.status < 300 && toastRef.value) {
        toast.remove(toastRef.value)
        toastRef.value = null
      }
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
    if (path.startsWith('/api/'))
      return new URL(path, baseUrl.value).toString()

    // Parse as a path, but don't allow any origin change.
    const pathAsUrl = new URL(path, baseOrigin.value)
    if (pathAsUrl.origin !== baseOrigin.value) throw new Error('Path must not specify an origin.')

    // Trim the origin and the first slash and join it together with the base path
    const pathOnly = pathAsUrl.toString().substring(pathAsUrl.origin.length + 1)
    return new URL(pathOnly, baseUrl.value).toString()
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
