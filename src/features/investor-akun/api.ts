import api from "@/shared/lib/axios";
import { useAuthStore } from "@/shared/store/authStore";
import { InvestorProfile } from "./types";

export async function fetchInvestorProfile(): Promise<InvestorProfile> {
  const rawState = useAuthStore.getState().user;
  // ✅ Tangani masalah nested object (user.user)
  const userObj = rawState?.user || rawState;
  const userId = userObj?.user_id || userObj?.id;

  if (!userId) {
    throw new Error("User ID tidak ditemukan");
  }

  try {
    const { data } = await api.get(`/investors/user/${userId}`);
    const raw = data.data || data;

    return {
      investorId: raw.investor_id || raw.investorId,
      userId: raw.user_id || raw.userId,
      firstName: raw.first_name || raw.firstName || "",
      lastName: raw.last_name || raw.lastName || "",
      email: raw.email || userObj?.email || "",
      phone: raw.phone || "",
      investorType: raw.investor_type || raw.investorType || "individual",
      gender: raw.gender || "men",
      nik: raw.nik || "",
      address: raw.address || "",
      accountNumber: raw.account_number || raw.accountNumber || "",
      bankName: raw.bank_name || raw.bankName || "",
      status: raw.status || "pending",
      privy: raw.privy,
      heir: raw.heir,
    } as InvestorProfile;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        investorId: "", // Kosong, penanda bahwa ini harus di-POST nanti
        userId: userId,
        firstName: userObj?.firstname || "",
        lastName: userObj?.lastname || "",
        email: userObj?.email || "",
        phone: "",
        investorType: "individual",
        gender: "men",
        nik: "",
        address: "",
        accountNumber: "",
        bankName: "",
        status: "pending" as unknown as InvestorProfile["status"],
      } as InvestorProfile;
    }
    throw error;
  }
}

// ✅ FUNGSI BARU UNTUK SAVE/UPDATE PROFIL
export async function saveInvestorProfile(payload: InvestorProfile) {
  const rawState = useAuthStore.getState().user;
  const userObj = rawState?.user || rawState;
  const userId = userObj?.user_id || userObj?.id;

  const apiPayload = {
    user_id: userId,
    first_name: payload.firstName,
    last_name: payload.lastName,
    phone: payload.phone,
    investor_type: payload.investorType,
    gender: payload.gender,
    nik: payload.nik,
    address: payload.address,
    account_number: payload.accountNumber,
    bank_name: payload.bankName,
  };

  // Jika sudah punya ID, berarti Update (PUT). Jika kosong, Create (POST)
  if (payload.investorId) {
    const { data } = await api.put(`/investors/${payload.investorId}`, apiPayload);
    return data;
  } else {
    const { data } = await api.post(`/investors`, apiPayload);
    return data;
  }
}

// GET /api/users/{id}
export async function fetchUserDetails() {
  const rawState = useAuthStore.getState().user;
  const userObj = rawState?.user || rawState;
  const userId = userObj?.user_id || userObj?.id;

  if (!userId) throw new Error("User ID tidak ditemukan");

  const { data } = await api.get(`/users/${userId}`);
  return data.data;
}

// PUT /api/users/{id}
export async function updateUserDetails(payload: { firstname?: string; lastname?: string }) {
  const rawState = useAuthStore.getState().user;
  const userObj = rawState?.user || rawState;
  const userId = userObj?.user_id || userObj?.id;

  if (!userId) throw new Error("User ID tidak ditemukan");

  const { data } = await api.put(`/users/${userId}`, payload);
  return data.data;
}