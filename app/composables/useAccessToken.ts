import { createSharedComposable } from '@vueuse/core'

const _useAccessToken = () => {
  const authHeader = useRequestHeader('Authorization')
  const authCookie = useCookie('token')

  return computed({
    get: () => {
      if (authHeader && authHeader.toLowerCase().startsWith('Bearer ')) {
        console.log('Using Authorization header for API authentication')
        return authHeader.substring('Bearer'.length).trimStart()
      }

      if (authCookie.value) {
        console.log('Using token cookie for API authentication')
        return authCookie.value
      }

      console.log('Not using any authentication')
      return null
    },
    set: (newValue) => {
      if (authHeader) {
        console.error('Cannot set authCookie when an Authorization header is set!')
        throw new Error('Cannot set authCookie when an Authorization header is set!')
      }

      console.log('Updating cookie to new value %o', newValue)

      authCookie.value = newValue
    },
  })
}

export const useAccessToken = createSharedComposable(_useAccessToken)
