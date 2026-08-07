import api from "@/shared/lib/axios";

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

export async function loginWithGoogle(idToken: string) {
  const { data } = await api.post("/auth/google", { idToken });
  return data; 
}