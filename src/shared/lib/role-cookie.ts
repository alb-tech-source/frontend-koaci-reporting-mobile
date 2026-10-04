const ROLE_COOKIE = "user_role";
// Sama dengan umur refresh token backend; diperpanjang setiap refresh berhasil
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Cookie ini hanya dibaca proxy.ts untuk mengarahkan route.
// Otorisasi data tetap ditentukan backend lewat cookie httpOnly.
export function setRoleCookie(role: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
