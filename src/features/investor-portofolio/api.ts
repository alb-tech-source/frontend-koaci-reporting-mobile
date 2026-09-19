import api from "@/shared/lib/axios";
import type { MyInvestment, MyPortfolioSummary } from "./types";

interface ApiInvestment {
  project_investment_id?: string;
  projectInvestmentId?: string;
  project_id?: string;
  projectId?: string;
  amount?: string | number;
  total_package?: number;
  totalPackage?: number;
  payment_method?: string;
  paymentMethod?: string;
  receipt_number?: string;
  receiptNumber?: string;
  createdAt?: string;
  latest_progress?: number;
  has_receipt?: boolean;
  project?: {
    project_id?: string;
    project_key?: string;
    projectKey?: string;
    funding_required?: string | number;
    fundingRequired?: string | number;
    status?: string;
    company?: {
      company_name?: string;
      companyName?: string;
    };
  };
}

export function mapInvestment(raw: ApiInvestment): MyInvestment {
  const proj = raw.project ?? {};
  const comp = proj.company ?? {};

  return {
    investmentId: raw.project_investment_id || raw.projectInvestmentId || "",
    projectId: proj.project_id || raw.project_id || raw.projectId || "",
    projectKey: proj.project_key || proj.projectKey || "",
    companyName: comp.company_name || comp.companyName || "",
    fundingRequired: Number.parseFloat(
      String(proj.funding_required || proj.fundingRequired || 0),
    ),
    projectStatus: (proj.status as MyInvestment["projectStatus"]) || "open",
    amount: Number.parseFloat(String(raw.amount ?? 0)),
    totalPackage: raw.total_package || raw.totalPackage || 0,
    paymentMethod: (raw.payment_method ||
      raw.paymentMethod ||
      "transfer") as MyInvestment["paymentMethod"],
    receiptNumber: raw.receipt_number || raw.receiptNumber || "",
    createdAt: raw.createdAt || "",
    latestProgress: raw.latest_progress,
    hasReceipt: Boolean(raw.has_receipt),
  };
}

export async function fetchMyInvestments(): Promise<MyInvestment[]> {
  const { data } = await api.get("/project-investments/own/investments");
  const items = data?.data?.items ?? data?.data ?? data ?? [];
  return items.map(mapInvestment);
}

export function computePortfolioSummary(
  investments: MyInvestment[],
  investorName: string,
): MyPortfolioSummary {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeProjects = investments.filter(
    (inv) =>
      inv.projectStatus === "open" || inv.projectStatus === "target_achieved",
  ).length;

  return { totalInvested, activeProjects, investorName };
}

