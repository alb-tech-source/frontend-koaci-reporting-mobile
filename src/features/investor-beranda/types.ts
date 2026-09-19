export type ActivityType = "profit" | "progress" | "document";

export interface BerandaActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO
}