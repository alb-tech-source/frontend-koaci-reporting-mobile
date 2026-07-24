import type { InvestmentProject, InvestorPortfolioSummary } from "./types";

export async function fetchPortfolioSummary(): Promise<InvestorPortfolioSummary> {
  // Simulate network latency for realistic preview.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    investorName: "Ahmad Fauzi",
    totalActiveInvestment: 245_000_000,
    activeProjects: 3,
  };
}

export async function fetchInvestmentProjects(): Promise<InvestmentProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    {
      id: "proj-001",
      name: "Pembiayaan Rumah Syariah Cluster Al-Falah",
      investmentAmount: 120_000_000,
      status: "active",
      progress: 72,
      returnRate: 8.5,
      tenorMonths: 24,
    },
    {
      id: "proj-002",
      name: "Sukuk Ritel SR-018 Seri Oranye",
      investmentAmount: 75_000_000,
      status: "active",
      progress: 45,
      returnRate: 6.75,
      tenorMonths: 36,
    },
    {
      id: "proj-003",
      name: "Pembiayaan UMKM Kedai Kopi Halal",
      investmentAmount: 50_000_000,
      status: "pending",
      progress: 12,
      returnRate: 10.0,
      tenorMonths: 18,
    },
  ];
}
