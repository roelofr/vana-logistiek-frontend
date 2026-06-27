export function useSession() {
  const {user, loggedIn, logout, login} = useOidcAuth()

  const name = computed(() => user.value?.userInfo?.['display_name'] as string ?? null)
  const roles = computed(() => user.value?.userInfo?.['groups'] as string[] ?? null)
  const email = computed(() => user.value?.userInfo?.['email'] as string ?? null)
  const avatar = computed(() => user.value?.userInfo?.['picture'] as string ?? null)

  const hasPermissionTo = (permission: string): boolean => roles.value?.includes(permission) ?? false;

  return {
    user,
    loggedIn,
    login,
    logout,
    name,
    roles,
    email,
    avatar,
    hasPermissionTo,
  }
}
