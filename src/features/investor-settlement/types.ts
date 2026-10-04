export interface MySettlement {
  settlementId: string;
  projectId: string;
  projectKey: string;
  companyName: string;
  profitModel: string;
  settledAt: string;

  // Bagian investor
  principalAmount: number;
  modalPortionPct: number;
  profitShareAmount: number;
  compensationPct: number;
  compensationAmount: number;
  totalProfit: number; // bisa negatif jika proyek rugi

  // Ringkasan proyek
  totalCapital: number;
  salesAmount: number;
  netProfitMargin: number;
  investorPortionPct: number;
  investorPortionAmount: number;
}

export interface MySettlementSummary {
  totalPrincipal: number;
  totalProfit: number;
  settledProjects: number;
}
