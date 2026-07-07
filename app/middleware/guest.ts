import { defineNuxtRouteMiddleware, useOidcAuth } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
  const isErrorPage = !(to.matched.length > 0);
  if (isErrorPage) return;

  const { loggedIn } = useOidcAuth();
  if (!loggedIn.value) return;

  return navigateTo({ path: "/", query: { redirect: to.fullPath } });
});
