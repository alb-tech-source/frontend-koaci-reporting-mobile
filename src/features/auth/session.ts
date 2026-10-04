import { clearRoleCookie, setRoleCookie } from "@/shared/lib/role-cookie";
import { normalizeUser, useAuthStore, type RawUser } from "@/shared/store/authStore";
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

  return applySession(rawUser);
}

function applySession(rawUser: RawUser): AppRole {
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

/**
 * Cookie sesi backend dipakai bersama semua tab dan aplikasi Koaci (termasuk admin)
 * di browser yang sama, jadi login di tempat lain mengganti sesi di sini tanpa
 * diketahui store. Jika pemilik cookie bukan lagi akun yang tersimpan, tampilan
 * mengikuti pemilik cookie supaya nama dan data yang tampil milik akun yang sama.
 */
export async function syncSession(): Promise<void> {
  const previous = useAuthStore.getState().user;
  if (!previous) return;

  let rawUser: RawUser | undefined;
  try {
    rawUser = (await fetchCurrentUser())?.data?.user;
  } catch {
    // 401 sudah ditangani interceptor axios; gangguan jaringan tidak mengubah sesi
    return;
  }
  if (!rawUser?.user_id || rawUser.user_id === previous.user_id) return;

  try {
    const role = applySession(rawUser);
    if (role !== previous.role) window.location.href = homePathForRole(role);
  } catch (error) {
    if (!(error instanceof UnsupportedRoleError)) throw error;
    window.location.href = "/";
  }
}

/** Mencocokkan sesi saat aplikasi dibuka dan setiap kali tab kembali aktif. */
export function watchSession(): () => void {
  const check = () => {
    if (document.visibilityState === "visible") void syncSession();
  };

  check();
  document.addEventListener("visibilitychange", check);
  return () => document.removeEventListener("visibilitychange", check);
}
