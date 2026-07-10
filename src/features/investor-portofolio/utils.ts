import type { ProjectStatus } from "./types";

export function formatIDR(value: number, options?: { compact?: boolean }): string {
  const { compact = false } = options ?? {};

  if (compact && value >= 1_000_000_000) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 1,
    })
      .format(value / 1_000_000_000)
      .replace("IDR", "Rp")
      .trim() + " M";
  }

  if (compact && value >= 1_000_000) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 1,
    })
      .format(value / 1_000_000)
      .replace("IDR", "Rp")
      .trim() + " Jt";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp")
    .trim();
}

export function statusLabel(status: ProjectStatus): string {
  switch (status) {
    case "active":
      return "Aktif";
    case "pending":
      return "Menunggu";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
}

export function statusBadgeVariant(status: ProjectStatus): "active" | "pending" | "cancelled" | "info" {
  switch (status) {
    case "active":
      return "active";
    case "pending":
      return "pending";
    case "completed":
      return "info";
    case "cancelled":
      return "cancelled";
    default:
      return "info";
  }
}
