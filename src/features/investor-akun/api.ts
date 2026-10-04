import axios from "axios";
import api from "@/shared/lib/axios";
import { useAuthStore, type UserProfile } from "@/shared/store/authStore";
import type { InvestorHeir, InvestorProfile } from "./types";

// Bentuk respons GET /investors/user/{userId} (SafeInvestor di backend)
export interface ApiInvestor {
  investor_id?: string;
  user_id?: string;
  investor_type?: InvestorProfile["investorType"];
  status?: InvestorProfile["status"];
  gender?: InvestorProfile["gender"];
  nik?: string;
  address?: string;
  privy?: string | null;
  phone?: string;
  account_number?: string;
  bank_name?: string;
  heir_name?: string | null;
  heir_relationship?: string | null;
  heir_nik?: string | null;
  heir_address?: string | null;
  heir_account_number?: string | null;
  heir_bank_name?: string | null;
  heir_phone?: string | null;
  user?: {
    firstname?: string | null;
    lastname?: string | null;
    email?: string;
  };
}

type SessionUser = Pick<UserProfile, "user_id" | "email" | "firstname" | "lastname">;

function mapHeir(raw: ApiInvestor): InvestorHeir | undefined {
  if (!raw.heir_name) return undefined;

  return {
    name: raw.heir_name,
    relation: (raw.heir_relationship ?? "") as InvestorHeir["relation"],
    nik: raw.heir_nik ?? "",
    address: raw.heir_address ?? "",
    accountNumber: raw.heir_account_number ?? "",
    bankName: raw.heir_bank_name ?? "",
    phone: raw.heir_phone ?? "",
  };
}

export function mapInvestorProfile(
  raw: ApiInvestor,
  sessionUser: SessionUser,
): InvestorProfile {
  return {
    investorId: raw.investor_id ?? "",
    userId: raw.user_id ?? sessionUser.user_id,
    // Nama ada di tabel user; fallback ke data sesi jika endpoint investor
    // tidak mengembalikannya
    firstName: raw.user?.firstname || sessionUser.firstname || "",
    lastName: raw.user?.lastname || sessionUser.lastname || "",
    email: raw.user?.email || sessionUser.email || "",
    phone: raw.phone ?? "",
    investorType: raw.investor_type ?? "individual",
    gender: raw.gender ?? "men",
    nik: raw.nik ?? "",
    address: raw.address ?? "",
    accountNumber: raw.account_number ?? "",
    bankName: raw.bank_name ?? "",
    // Backend membuat investor baru dengan status "inactive" sampai diaktifkan admin
    status: raw.status ?? "inactive",
    privy: raw.privy ?? undefined,
    heir: mapHeir(raw),
  };
}

function requireSessionUser(): UserProfile {
  const user = useAuthStore.getState().user;
  if (!user?.user_id) throw new Error("User ID tidak ditemukan");
  return user;
}

export async function fetchInvestorProfile(): Promise<InvestorProfile> {
  const user = requireSessionUser();

  try {
    const { data } = await api.get(`/investors/user/${user.user_id}`);
    return mapInvestorProfile(data.data || data, user);
  } catch (error) {
    // 404 = belum punya profil investor; investorId kosong menandai harus di-POST nanti
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return mapInvestorProfile({}, user);
    }
    throw error;
  }
}

export async function saveInvestorProfile(payload: InvestorProfile) {
  const user = requireSessionUser();

  // first_name & last_name ada di tabel user, update via PUT /users/{user_id}
  const userPayload = {
    firstname: payload.firstName,
    lastname: payload.lastName,
  };

  // Field lain milik tabel investor
  const investorPayload = {
    user_id: user.user_id,
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

export function toHeirPayload(heir: InvestorHeir) {
  return {
    heir_name: heir.name.trim(),
    heir_relationship: heir.relation,
    heir_address: heir.address.trim(),
    heir_bank_name: heir.bankName,
    // Backend menolak string kosong untuk field berpola angka, jadi yang kosong tidak dikirim
    heir_nik: heir.nik || undefined,
    heir_account_number: heir.accountNumber || undefined,
    heir_phone: heir.phone || undefined,
  };
}

// Ahli waris disimpan sebagai kolom heir_* pada data investor
export async function saveInvestorHeir(investorId: string, heir: InvestorHeir) {
  const { data } = await api.put(`/investors/${investorId}`, toHeirPayload(heir));
  return data;
}

// GET /api/users/{id}
export async function fetchUserDetails() {
  const user = requireSessionUser();

  const { data } = await api.get(`/users/${user.user_id}`);
  return data.data;
}

// PUT /api/users/{id}
export async function updateUserDetails(payload: {
  firstname?: string;
  lastname?: string;
}) {
  const user = requireSessionUser();

  const { data } = await api.put(`/users/${user.user_id}`, payload);
  return data.data;
}
