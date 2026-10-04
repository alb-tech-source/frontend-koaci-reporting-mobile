import axios from "axios";
import api from "@/shared/lib/axios";
import type { MySettlement, MySettlementSummary } from "./types";

// Backend mengirim angka desimal sebagai string (mis. "23520000", "-60000000")
type DecimalString = string | number;

export interface ApiInvestorSettlement {
  investor_settlement_id?: string;
  principal_amount?: DecimalString;
  modal_portion_pct?: DecimalString;
  profit_share_amount?: DecimalString;
  compensation_pct?: DecimalString;
  compensation_amount?: DecimalString;
  total_profit?: DecimalString;
  created_at?: string;
  updated_at?: string;
  projectSettlement?: {
    profit_model?: string;
    total_capital?: DecimalString;
    sales_amount?: DecimalString;
    net_profit_margin?: DecimalString;
    investor_portion_pct?: DecimalString;
    investor_portion_amount?: DecimalString;
    project?: {
      project_id?: string;
      project_key?: string;
      company?: { company_name?: string } | null;
    };
  };
}

// Hanya untuk tampilan; semua perhitungan settlement dilakukan backend
function toNumber(value?: DecimalString | null): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mapSettlement(raw: ApiInvestorSettlement): MySettlement {
  const projectSettlement = raw.projectSettlement ?? {};
  const project = projectSettlement.project ?? {};

  return {
    settlementId: raw.investor_settlement_id ?? "",
    projectId: project.project_id ?? "",
    projectKey: project.project_key ?? "",
    companyName: project.company?.company_name ?? "-",
    profitModel: projectSettlement.profit_model ?? "",
    // Settlement terkunci setelah disetujui, jadi updated_at adalah waktu persetujuan
    settledAt: raw.updated_at || raw.created_at || "",
    principalAmount: toNumber(raw.principal_amount),
    modalPortionPct: toNumber(raw.modal_portion_pct),
    profitShareAmount: toNumber(raw.profit_share_amount),
    compensationPct: toNumber(raw.compensation_pct),
    compensationAmount: toNumber(raw.compensation_amount),
    totalProfit: toNumber(raw.total_profit),
    totalCapital: toNumber(projectSettlement.total_capital),
    salesAmount: toNumber(projectSettlement.sales_amount),
    netProfitMargin: toNumber(projectSettlement.net_profit_margin),
    investorPortionPct: toNumber(projectSettlement.investor_portion_pct),
    investorPortionAmount: toNumber(projectSettlement.investor_portion_amount),
  };
}

/** Backend membalas 404 jika investor belum melengkapi profilnya. */
export class ProfileRequiredError extends Error {
  constructor() {
    super("Lengkapi profil investor untuk melihat hasil settlement.");
    this.name = "ProfileRequiredError";
  }
}

const PAGE_SIZE = 100; // batas maksimal backend

/**
 * Untuk role investor, backend hanya mengembalikan settlement miliknya
 * yang sudah disetujui — tidak perlu mengirim investor_id.
 */
export async function fetchMySettlements(): Promise<MySettlement[]> {
  const items: ApiInvestorSettlement[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const { data } = await api.get("/investor-settlements", {
        params: { page, limit: PAGE_SIZE },
      });
      items.push(...(data?.data ?? []));
      totalPages = data?.meta?.totalPages ?? 1;
      page += 1;
    } while (page <= totalPages);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new ProfileRequiredError();
    }
    throw error;
  }

  return items.map(mapSettlement);
}

export function computeSettlementSummary(
  settlements: MySettlement[],
): MySettlementSummary {
  return {
    totalPrincipal: settlements.reduce((sum, s) => sum + s.principalAmount, 0),
    totalProfit: settlements.reduce((sum, s) => sum + s.totalProfit, 0),
    settledProjects: settlements.length,
  };
}
