import api from "@/shared/lib/axios";
import type { InvestmentSummary } from "./types";

// Bentuk respons GET /project-investments/own/summary.
// Nominal dikirim sebagai string desimal (mis. "150000000").
export interface ApiInvestmentSummary {
  total_active_investment?: string | number;
  active_projects?: number;
}

/**
 * Hanya mengubah bentuk untuk tampilan; perhitungannya dilakukan backend.
 * Respons yang tidak lengkap ditolak agar beranda tidak menampilkan "Rp 0" palsu.
 */
export function mapInvestmentSummary(raw: ApiInvestmentSummary): InvestmentSummary {
  const totalActiveInvestment = Number(raw.total_active_investment);
  const activeProjects = Number(raw.active_projects);

  if (
    raw.total_active_investment == null ||
    raw.active_projects == null ||
    !Number.isFinite(totalActiveInvestment) ||
    !Number.isFinite(activeProjects)
  ) {
    throw new Error("Respons ringkasan investasi tidak valid.");
  }

  return { totalActiveInvestment, activeProjects };
}

export async function fetchInvestmentSummary(): Promise<InvestmentSummary> {
  const { data } = await api.get("/project-investments/own/summary");
  return mapInvestmentSummary(data?.data ?? {});
}
