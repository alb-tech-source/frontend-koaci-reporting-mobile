import api from "@/shared/lib/axios";
import { useAuthStore } from "@/shared/store/authStore";
import { InvestorProfile } from "./types";

export async function fetchInvestorProfile(): Promise<InvestorProfile> {
  const user = useAuthStore.getState().user;
  // Menangani struktur nested 'user' atau root 'user'
  const userId = user?.user_id || user?.user?.user_id;

  if (!userId) {
    throw new Error("User ID tidak ditemukan");
  }

  const { data } = await api.get(`/investors/user/${userId}`);
  
  // Asumsi API mengembalikan { data: { ...profil... } }
  return data.data;
}

// GET /api/users/{id}
export async function fetchUserDetails() {
  const user = useAuthStore.getState().user;
  const userId = user?.user_id || user?.user?.user_id;

  if (!userId) throw new Error("User ID tidak ditemukan");

  const { data } = await api.get(`/users/${userId}`);
  return data.data;
}

// PUT /api/users/{id}
export async function updateUserDetails(payload: { firstname?: string; lastname?: string }) {
  const user = useAuthStore.getState().user;
  const userId = user?.user_id || user?.user?.user_id;

  if (!userId) throw new Error("User ID tidak ditemukan");

  const { data } = await api.put(`/users/${userId}`, payload);
  return data.data;
}