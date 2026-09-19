import type { MyInvestment } from "@/features/investor-portofolio/types";
import type { BerandaActivity } from "./types";


export async function fetchLatestProjects(): Promise<MyInvestment[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [];
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
