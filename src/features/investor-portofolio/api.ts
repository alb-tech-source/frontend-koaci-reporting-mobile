import api from "@/shared/lib/axios";
import type { MyInvestment } from "./types";

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
  has_receipt?: boolean;
  receiptDocument?: {
    receipt_document_id?: string;
    receipt_name?: string;
  } | null;
  project?: {
    project_id?: string;
    project_key?: string;
    projectKey?: string;
    funding_required?: string | number;
    fundingRequired?: string | number;
    // Dihitung backend: total setoran semua investor, persentasenya terhadap
    // funding_required, dan estimasi progres dari laporan terakhir
    funding_collected?: string | number;
    funding_progress_pct?: number;
    latest_progress_pct?: number | null;
    status?: string;
    company?: {
      company_name?: string;
      companyName?: string;
    };
  };
}

function toNumberOrNull(value?: string | number | null): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function mapInvestment(raw: ApiInvestment): MyInvestment {
  const proj = raw.project ?? {};
  const comp = proj.company ?? {};

  const fundingRequired = Number.parseFloat(
    String(proj.funding_required || proj.fundingRequired || 0),
  );

  // Evaluasi resi dari JSON object receiptDocument atau boolean has_receipt
  const hasReceipt = Boolean(raw.receiptDocument) || Boolean(raw.has_receipt);

  return {
    investmentId: raw.project_investment_id || raw.projectInvestmentId || "",
    projectId: proj.project_id || raw.project_id || raw.projectId || "",
    projectKey: proj.project_key || proj.projectKey || "",
    companyName: comp.company_name || comp.companyName || "-",
    fundingRequired,
    // null = backend tidak mengirim nilainya; ditampilkan "—", bukan 0 palsu
    fundingCollected: toNumberOrNull(proj.funding_collected),
    fundingProgress: toNumberOrNull(proj.funding_progress_pct),
    projectProgress: toNumberOrNull(proj.latest_progress_pct),
    projectStatus: (proj.status as MyInvestment["projectStatus"]) || "open",
    amount: Number.parseFloat(String(raw.amount ?? 0)),
    totalPackage: raw.total_package || raw.totalPackage || 0,
    paymentMethod: (raw.payment_method ||
      raw.paymentMethod ||
      "transfer") as MyInvestment["paymentMethod"],
    receiptNumber: raw.receipt_number || raw.receiptNumber || "",
    createdAt: raw.createdAt || "",
    hasReceipt,
  };
}

export async function fetchMyInvestments(): Promise<MyInvestment[]> {
  const { data } = await api.get("/project-investments/own/investments");
  const items = data?.data?.items ?? data?.data ?? data ?? [];
  return items.map(mapInvestment);
}
