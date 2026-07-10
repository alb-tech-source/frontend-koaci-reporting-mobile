export type ProjectStatus = "active" | "pending" | "completed" | "cancelled";

export interface InvestorPortfolioSummary {
  investorName: string;
  totalActiveInvestment: number;
  activeProjects: number;
}

export interface InvestmentProject {
  id: string;
  name: string;
  investmentAmount: number;
  status: ProjectStatus;
  progress: number; // 0 - 100
  returnRate?: number; // optional, percentage
  tenorMonths?: number;
  imageUrl?: string;
}
