export type ProjectStatus = "open" | "closed" | "target_achieved" | "cancelled";

export interface MyInvestment {
  investmentId: string;
  projectId: string;
  projectKey: string;
  companyName: string;
  fundingRequired: number;
  fundingCollected: number | null; // total setoran semua investor di proyek
  fundingProgress: number | null; // persen dana terkumpul, 0-100
  projectProgress: number | null; // estimasi progres dari laporan terakhir
  projectStatus: ProjectStatus;
  amount: number;
  totalPackage: number;
  paymentMethod: "cash" | "transfer";
  receiptNumber: string;
  createdAt: string;
  hasReceipt: boolean;
}

export interface MyReceipt {
  receiptId: string;
  investmentId: string;
  receiptName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}