export type DateMode = "local" | "utc";

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" — sama dengan format value `<input type="date">`. */
export function toDateKey(iso: string, mode: DateMode = "local"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  return mode === "utc"
    ? `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
    : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Batas awal dan akhir sama-sama inklusif; batas kosong berarti tanpa batas. */
export function isWithinDateRange(
  iso: string,
  start: string,
  end: string,
  mode: DateMode = "local",
): boolean {
  if (!start && !end) return true;

  const key = toDateKey(iso, mode);
  if (!key) return false;

  return (!start || key >= start) && (!end || key <= end);
}
