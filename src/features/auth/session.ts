import { clearRoleCookie, setRoleCookie } from "@/shared/lib/role-cookie";
import { normalizeUser, useAuthStore } from "@/shared/store/authStore";
import { fetchCurrentUser } from "./api";

const APP_ROLES = ["investor", "user"] as const;
export type AppRole = (typeof APP_ROLES)[number];

function isAppRole(role: string): role is AppRole {
  return (APP_ROLES as readonly string[]).includes(role);
}

export class UnsupportedRoleError extends Error {
  constructor() {
    super("Akun ini tidak memiliki akses ke aplikasi investor.");
    this.name = "UnsupportedRoleError";
  }
}

export function homePathForRole(role: AppRole): string {
  return role === "investor" ? "/investor/beranda" : "/user/beranda";
}

export function accountPathForRole(role?: string | null): string {
  if (role === "investor") return "/investor/akun";
  if (role === "user") return "/user/akun";
  return "/";
}

/**
 * Satu-satunya tempat sesi client dibentuk dari GET /auth/me.
 * Dipakai login email, callback Google, dan verifikasi email supaya
 * store dan cookie role selalu terisi dengan cara yang sama.
 */
export async function establishSession(): Promise<AppRole> {
  const response = await fetchCurrentUser();
  const rawUser = response?.data?.user;

  if (!response?.success || !rawUser) {
    throw new Error("Gagal membaca profil pengguna.");
  }

  const user = normalizeUser(rawUser);

  // Role admin/bod/superadmin tidak punya halaman di aplikasi ini
  if (!isAppRole(user.role)) {
    useAuthStore.getState().clearAuth();
    clearRoleCookie();
    throw new UnsupportedRoleError();
  }

  useAuthStore.getState().setAuth(user);
  setRoleCookie(user.role);

  return user.role;
}
