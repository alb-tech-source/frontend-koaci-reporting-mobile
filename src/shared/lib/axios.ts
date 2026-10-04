import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";
import { clearRoleCookie, setRoleCookie } from "./role-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// 401 dari endpoint ini berarti kredensial/token-nya sendiri yang salah,
// bukan access token kedaluwarsa — jadi tidak perlu dicoba refresh.
const NO_REFRESH_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
]);

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Satu refresh dipakai bersama oleh semua request yang gagal 401 bersamaan
let refreshPromise: Promise<void> | null = null;

function refreshSession(): Promise<void> {
  refreshPromise ??= api
    .post("/auth/refresh")
    .then(() => {
      // Refresh token dirotasi (7 hari lagi), jadi cookie role ikut diperpanjang;
      // kalau tidak, proxy.ts melempar user ke halaman login saat sesinya masih hidup
      const role = useAuthStore.getState().user?.role;
      if (role) setRoleCookie(role);
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

/** Refresh ditolak server (token kedaluwarsa/tidak valid, user nonaktif). */
function isSessionRejected(error: unknown): boolean {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  return status === 401 || status === 403;
}

function endSession() {
  if (typeof window === "undefined") return;
  useAuthStore.getState().clearAuth();
  // Tanpa ini proxy.ts akan terus mengarahkan "/" kembali ke area investor
  clearRoleCookie();
  window.location.href = "/";
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      NO_REFRESH_PATHS.has(originalRequest.url ?? "")
    ) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
    } catch (refreshError) {
      // Gangguan jaringan, timeout atau 5xx saat refresh bukan berarti sesi habis —
      // biarkan request ini gagal tanpa me-logout user.
      if (isSessionRejected(refreshError)) endSession();
      throw refreshError;
    }

    return api(originalRequest);
  },
);

export function getErrorMessage(err: unknown, fallback = "Terjadi kesalahan."): string {
  if (axios.isAxiosError(err)) return err.response?.data?.message ?? fallback;
  return fallback;
}

export default api;
