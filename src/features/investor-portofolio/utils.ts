export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: "Terbuka",
    target_achieved: "Target Tercapai",
    closed: "Ditutup",
    cancelled: "Dibatalkan",
    // backward compat
    active: "Aktif",
    pending: "Menunggu",
    completed: "Selesai",
  };
  return labels[String(status).toLowerCase()] ?? status;
}

export type StatusBadgeVariant =
  | "active"
  | "pending"
  | "cancelled"
  | "info"
  | "secondary";

export function statusBadgeVariant(status: string): StatusBadgeVariant {
  const variants: Record<string, StatusBadgeVariant> = {
    open: "active",
    target_achieved: "info",
    closed: "secondary",
    cancelled: "cancelled",
    active: "active",
    pending: "pending",
    completed: "secondary",
  };
  return variants[String(status).toLowerCase()] ?? "info";
}
