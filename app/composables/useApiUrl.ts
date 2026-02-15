declare interface apiUrlType {
  resolve(path: string): string

  apiUrl: ComputedRef<string>
}

declare type useApiUrlResponse = string | Ref<string> | apiUrlType

export function useApiUrl(value: string | Ref<string> | undefined = undefined): useApiUrlResponse {
  const $apiUrl = useNuxtApp().$apiUrl

  if (value === undefined)
    return $apiUrl as unknown as apiUrlType

  if (isRef(value))
    return computed(() => $apiUrl.resolve(value.value))

  return $apiUrl.resolve(value)
}
