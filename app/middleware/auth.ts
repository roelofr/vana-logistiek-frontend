export default defineNuxtRouteMiddleware(async (to) => {
  const { useSession } = useAuth();
  const { data: session } = await useSession();

  if (!session.value?.user)
    return navigateTo({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
});
