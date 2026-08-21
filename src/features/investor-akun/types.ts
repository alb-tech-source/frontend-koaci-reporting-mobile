export type InvestorAccountStatus = "active" | "inactive" | "blacklist";
export type InvestorAccountType = "individual" | "corporation";
export type InvestorGender = "men" | "women";
export type HeirRelationValue = "spouse" | "child" | "parent" | "sibling" | "other";

export interface InvestorHeir {
  name: string;
  relation: HeirRelationValue | "";
  nik: string;
  address: string;
  accountNumber: string;
  bankName: string;
  phone: string;
}

export interface InvestorProfile {
  investorId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investorType: InvestorAccountType;
  gender: InvestorGender;
  nik: string;
  address: string;
  privy?: string;
  accountNumber: string;
  bankName: string;
  status: InvestorAccountStatus;
  heir?: InvestorHeir;
}

export const emptyHeir: InvestorHeir = {
  name: "",
  relation: "",
  nik: "",
  address: "",
  accountNumber: "",
  bankName: "",
  phone: "",
};

export const investorTypeLabel: Record<InvestorAccountType, string> = {
  individual: "Individu",
  corporation: "Korporasi",
};

export const genderLabel: Record<InvestorGender, string> = {
  men: "Laki-laki",
  women: "Perempuan",
};

export const heirRelationLabel: Record<HeirRelationValue, string> = {
  spouse: "Pasangan",
  child: "Anak",
  parent: "Orang Tua",
  sibling: "Saudara",
  other: "Lainnya",
};

export const accountStatusLabel: Record<InvestorAccountStatus, string> = {
  active: "Aktif",
  inactive: "Non-aktif",
  blacklist: "Blacklist",
};

export const accountStatusVariant: Record<
  InvestorAccountStatus,
  "active" | "cancelled" | "secondary"
> = {
  active: "active",
  inactive: "secondary",
  blacklist: "cancelled",
};
