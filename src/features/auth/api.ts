import api from "@/shared/lib/axios";
import type { RawUser } from "@/shared/store/authStore";

interface CurrentUserResponse {
  success?: boolean;
  data?: { user?: RawUser };
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token: string, newPassword: string) {
  const { data } = await api.post("/auth/reset-password", { token, newPassword });
  return data;
}

export async function registerWithEmail(payload: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

// Backend selalu mengirim ke email user yang sedang login (tanpa body)
export async function sendVerifyEmail() {
  const { data } = await api.post("/auth/send-verify-email");
  return data;
}

export async function verifyEmailToken(token: string) {
  const { data } = await api.get("/auth/verify-email", { params: { token } });
  return data;
}
