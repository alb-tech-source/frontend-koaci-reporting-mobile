function groupID(value: number, fractionDigits = 0): string {
  const fixed = Math.abs(value).toFixed(fractionDigits);
  const [intPart, fracPart] = fixed.split(".");

  let grouped = intPart;
  if (intPart.length > 3) {
    const chunks: string[] = [];
    for (let i = intPart.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      chunks.push(intPart.slice(start, i));
    }
    grouped = chunks.toReversed().join(".");
  }

  const sign = value < 0 ? "-" : "";
  return sign + (fracPart ? `${grouped},${fracPart}` : grouped);
}

export function formatIDR(value: number, options?: { compact?: boolean }): string {
  const { compact = false } = options ?? {};

  if (compact && Math.abs(value) >= 1_000_000_000) {
    return `Rp ${groupID(value / 1_000_000_000, 1)} M`;
  }

  if (compact && Math.abs(value) >= 1_000_000) {
    return `Rp ${groupID(value / 1_000_000, 1)} Jt`;
  }

  return `Rp ${groupID(value)}`;
}

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

const MONTHS_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function formatDateID(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${MONTHS_ID[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
