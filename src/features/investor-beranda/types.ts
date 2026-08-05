export type ActivityType = "profit" | "progress" | "document";

export interface BerandaSummary {
  investorName: string;
  totalActiveInvestment: number;
  activeProjects: number;
  unreadNotifications: number;
}

export interface BerandaActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO
}