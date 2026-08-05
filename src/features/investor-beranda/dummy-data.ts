import type { InvestmentProject } from "@/features/investor-portofolio/types";

import type { BerandaActivity, BerandaSummary } from "./types";

export async function fetchBerandaSummary(): Promise<BerandaSummary> {
  await new Promise((r) => setTimeout(r, 250));
  return {
    investorName: "Ahmad Fauzi",
    totalActiveInvestment: 245_000_000,
    activeProjects: 3,
    unreadNotifications: 2,
  };
}

export async function fetchLatestProjects(): Promise<InvestmentProject[]> {
  await new Promise((r) => setTimeout(r, 300));
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
  ];
}

export async function fetchLatestActivities(): Promise<BerandaActivity[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = Date.now();
  return [
    {
      id: "act-001",
      type: "profit",
      title: "Bagi Hasil Diterima",
      description: "Rp 2.400.000 dari Cluster Al-Falah masuk ke saldo Anda.",
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "act-002",
      type: "progress",
      title: "Update Progress Proyek",
      description: "Sukuk Ritel SR-018 mencapai 45% dari target pendanaan.",
      timestamp: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "act-003",
      type: "document",
      title: "Dokumen Baru Tersedia",
      description: "Laporan kinerja Q2 untuk Kedai Kopi Halal siap diunduh.",
      timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}