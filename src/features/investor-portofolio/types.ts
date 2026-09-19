export type ProjectStatus = "open" | "closed" | "target_achieved" | "cancelled";

export interface MyInvestment {
  investmentId: string;
  projectId: string;
  projectKey: string;
  companyName: string;
  fundingRequired: number;
  projectStatus: ProjectStatus;
  amount: number;
  totalPackage: number;
  paymentMethod: "cash" | "transfer";
  receiptNumber: string;
  createdAt: string;
  latestProgress?: number;
  hasReceipt: boolean;
}

export interface MyPortfolioSummary {
  totalInvested: number;
  activeProjects: number;
  investorName: string;
}

export interface MyReceipt {
  receiptId: string;
  investmentId: string;
  receiptName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}