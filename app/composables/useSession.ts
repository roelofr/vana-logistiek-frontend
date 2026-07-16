export function useSession() {
  const { user, loggedIn, logout, login, refresh } = useOidcAuth();

  const name = computed(
    () => (user.value?.userInfo?.["display_name"] as string) ?? null,
  );
  const email = computed(
    () => (user.value?.userInfo?.["email"] as string) ?? null,
  );
  const avatar = computed(
    () => (user.value?.userInfo?.["picture"] as string) ?? null,
  );

  // Vana extensions
  // @ts-expect-error Vana extensions are present!
  const roles = computed(() => user.value?.vana?.roles ?? []);

  const { groups } = useGroups();

  const group = computed(() => {
    // @ts-expect-error Vana extensions are present!
    const vanaGroup = user.value?.vana?.group;

    return vanaGroup ? groups.value?.find((g) => g.id == vanaGroup) : null;
  });

  type ValidPermission = "admin" | "centrale-post" | "wijkhouder" | "gebruiker";
  const hasPermissionTo = (
    permission: ValidPermission | ValidPermission[],
  ): boolean => {
    if (Array.isArray(permission))
      return permission.some((p) => roles.value?.includes(p));
    return roles.value?.includes(permission);
  };

  return {
    user,
    loggedIn,
    login,
    refresh,
    logout,
    name,
    roles,
    group,
    email,
    avatar,
    hasPermissionTo,
  };
}
