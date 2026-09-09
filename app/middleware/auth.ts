import { defineNuxtRouteMiddleware } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
  const isErrorPage = !(to.matched.length > 0);
  if (isErrorPage) return;

  const { loggedIn, login } = useSession();
  if (loggedIn.value) return;

  await login(void 0, { callbackRedirectUrl: to.fullPath });
});
