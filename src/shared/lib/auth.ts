import api from "./axios";
import { useAuthStore } from "../store/authStore";

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().user;
}

export function getCurrentRole(): string | null {
  const user = getCurrentUser();
  if (!user) return null;

  if (typeof user.role === "string") return user.role;
  return user.role?.role_name ?? null;
}

export function isInvestor(): boolean {
  return getCurrentRole() === "investor";
}

export function isUser(): boolean {
  return getCurrentRole() === "user";
}

export function hasPermission(permissionKey: string): boolean {
  const user = getCurrentUser();
  const roleName =
    typeof user?.role === "string" ? user.role : user?.role?.role_name;

  if (roleName === "superadmin") return true;

  let permissions: string[] = [];

  if (Array.isArray(user?.permissions)) {
    permissions = user.permissions;
  } else if (Array.isArray(user?.role?.permissions)) {
    permissions = user.role.permissions;
  }

  return permissions.includes(permissionKey);
}

export async function logout(redirectTo: string = "/") {
  if (typeof window === "undefined") return;

  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error(
      "Gagal memanggil API logout di server (Error 500), memaksa logout lokal...",
      error,
    );
  } finally {
    useAuthStore.getState().clearAuth();

    const pastDate = "Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie = `user_role=; path=/; expires=${pastDate}; SameSite=Lax`;

    document.cookie = `access_token=; path=/; expires=${pastDate}; SameSite=Lax`;
    document.cookie = `refresh_token=; path=/; expires=${pastDate}; SameSite=Lax`;

    window.location.href = redirectTo;
  }
}
