import api from "@/shared/lib/axios";
import { useAuthStore } from "@/shared/store/authStore";
import { InvestorProfile } from "./types";

export async function fetchInvestorProfile(): Promise<InvestorProfile> {
  const user = useAuthStore.getState().user;

  const userId = user?.user_id;

  if (!userId) {
    throw new Error("User ID tidak ditemukan");
  }

  try {
    const { data } = await api.get(`/investors/user/${userId}`);
    const raw = data.data || data;

    return {
      investorId: raw.investor_id || raw.investorId,
      userId: raw.user_id || raw.userId,
      // Nama ada di tabel user; fallback ke data sesi jika endpoint investor
      // tidak mengembalikannya
      firstName: raw.first_name || raw.firstName || user?.firstname || "",
      lastName: raw.last_name || raw.lastName || user?.lastname || "",
      email: raw.email || user.email || "",
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
        firstName: user?.firstname || "",
        lastName: user?.lastname || "",
        email: user?.email || "",
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
  const user = useAuthStore.getState().user;
  const userId = user?.user_id;

  if (!userId) throw new Error("User ID tidak ditemukan");

  // first_name & last_name ada di tabel user, update via PUT /users/{user_id}
  const userPayload = {
    firstname: payload.firstName,
    lastname: payload.lastName,
  };

  // Field lain milik tabel investor
  const investorPayload = {
    user_id: userId,
    phone: payload.phone,
    investor_type: payload.investorType,
    gender: payload.gender,
    nik: payload.nik,
    address: payload.address,
    account_number: payload.accountNumber,
    bank_name: payload.bankName,
  };

  const [, investorResponse] = await Promise.all([
    updateUserDetails(userPayload),
    // Jika sudah punya ID, berarti Update (PUT). Jika kosong, Create (POST)
    payload.investorId
      ? api.put(`/investors/${payload.investorId}`, investorPayload)
      : api.post(`/investors`, investorPayload),
  ]);

  return investorResponse.data;
}

// GET /api/users/{id}
export async function fetchUserDetails() {
  const user = useAuthStore.getState().user;
  const userId = user?.user_id;

  if (!userId) throw new Error("User ID tidak ditemukan");

  const { data } = await api.get(`/users/${userId}`);
  return data.data;
}

// PUT /api/users/{id}
export async function updateUserDetails(payload: {
  firstname?: string;
  lastname?: string;
}) {
  const user = useAuthStore.getState().user;
  const userId = user?.user_id;

  if (!userId) throw new Error("User ID tidak ditemukan");

  const { data } = await api.put(`/users/${userId}`, payload);
  return data.data;
}
