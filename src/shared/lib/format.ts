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

export function formatIDR(value?: number | null, options?: { compact?: boolean }): string {
  if (value == null) return "—";

  const { compact = false } = options ?? {};

  if (compact && Math.abs(value) >= 1_000_000_000) {
    return `Rp ${groupID(value / 1_000_000_000, 1)} M`;
  }

  if (compact && Math.abs(value) >= 1_000_000) {
    return `Rp ${groupID(value / 1_000_000, 1)} Jt`;
  }

  return `Rp ${groupID(value)}`;
}

/** Persen 0–100 dengan maksimal 4 desimal, mis. 33.333333 → "33,3333%". */
export function formatPercent(value: number): string {
  return `${String(Number(value.toFixed(4))).replace(".", ",")}%`;
}

/** Untuk timestamp (createdAt, uploaded_at): tanggal menurut zona waktu perangkat. */
export function formatDateID(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Untuk tanggal tanpa jam (report_date) yang disimpan sebagai tengah malam UTC:
 * dibaca dalam UTC agar tidak bergeser sehari di zona waktu lain.
 */
export function formatCalendarDateID(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${MONTHS_ID[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatRelativeTime(iso?: string | null): string {
  if (!iso) return "Belum pernah";
  const diff = Date.now() - new Date(iso).getTime();
  const abs = Math.abs(diff);
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;

  if (abs < min) return "Baru saja";
  if (abs < hour) return `${Math.floor(abs / min)} menit lalu`;
  if (abs < day) return `${Math.floor(abs / hour)} jam lalu`;
  if (abs < 7 * day) return `${Math.floor(abs / day)} hari lalu`;
  return formatDateID(iso);
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
