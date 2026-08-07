import { jwtDecode } from "jwt-decode";
import api from "./axios";

interface JwtPayload {
  role: string;
  permissions: string[];
  userId?: string;
  [key: string]: unknown;
}

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = new RegExp(/(^|;\s*)access_token=([^;]+)/).exec(document.cookie);
  return match ? decodeURIComponent(match[2]) : null;
}

export function getCurrentUser(): JwtPayload | null {
  if (typeof window === "undefined") return null;
  const token = getTokenFromCookie() || localStorage.getItem("access_token");
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function getCurrentRole(): string | null {
  return getCurrentUser()?.role ?? null;
}

export function isInvestor(): boolean {
  return getCurrentRole() === "investor";
}

export function isUser(): boolean {
  return getCurrentRole() === "user";
}

export function logout(redirectTo: string = "/") {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
  window.location.href = redirectTo;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token: string, newPassword: string) {
  const { data } = await api.post("/auth/reset-password", { token, newPassword });
  return data;
}