const ROLE_COOKIE = "user_role";
const ONE_DAY_SECONDS = 60 * 60 * 24;

// Cookie ini hanya dibaca proxy.ts untuk mengarahkan route.
// Otorisasi data tetap ditentukan backend lewat cookie httpOnly.
export function setRoleCookie(role: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${ONE_DAY_SECONDS}; SameSite=Lax`;
}

export function clearRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
