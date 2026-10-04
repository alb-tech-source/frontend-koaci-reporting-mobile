import api from "./axios";
import { clearRoleCookie } from "./role-cookie";
import { useAuthStore } from "../store/authStore";

export async function logout(redirectTo: string = "/") {
  if (typeof window === "undefined") return;

  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error(
      "Gagal memanggil API logout di server, memaksa logout lokal...",
      error,
    );
  } finally {
    useAuthStore.getState().clearAuth();
    clearRoleCookie();

    window.location.href = redirectTo;
  }
}
