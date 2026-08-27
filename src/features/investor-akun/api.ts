import api from "@/shared/lib/axios";
import { useAuthStore } from "@/shared/store/authStore";
import { InvestorProfile } from "./types";

export async function fetchInvestorProfile(): Promise<InvestorProfile> {
  const user = useAuthStore.getState().user;
  const userId = user?.user_id || user?.user?.user_id;

  if (!userId) {
    throw new Error("User ID tidak ditemukan");
  }

  const { data } = await api.get(`/investors/user/${userId}`);
  const raw = data.data || data;

  return {
    investorId: raw.investor_id || raw.investorId,
    userId: raw.user_id || raw.userId,
    firstName: raw.first_name || raw.firstName || "",
    lastName: raw.last_name || raw.lastName || "",
    email: raw.email,
    phone: raw.phone,
    investorType: raw.investor_type || raw.investorType,
    gender: raw.gender,
    nik: raw.nik,
    address: raw.address,
    accountNumber: raw.account_number || raw.accountNumber,
    bankName: raw.bank_name || raw.bankName,
    status: raw.status || "pending",
    privy: raw.privy,
    heir: raw.heir,
  } as InvestorProfile;
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