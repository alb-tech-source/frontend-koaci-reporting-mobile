export interface InvestmentSummary {
  totalActiveInvestment: number;
  activeProjects: number; // jumlah proyek unik, bukan jumlah transaksi
}

export type ActivityType = "profit" | "progress" | "document";

export interface BerandaActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO
}