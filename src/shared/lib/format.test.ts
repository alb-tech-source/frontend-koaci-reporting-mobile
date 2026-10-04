import { describe, expect, it } from "vitest";

import {
  formatCalendarDateID,
  formatDateID,
  formatFileSize,
  formatIDR,
} from "./format";

describe("formatIDR", () => {
  it("mengelompokkan ribuan dengan titik", () => {
    expect(formatIDR(0)).toBe("Rp 0");
    expect(formatIDR(1_500_000)).toBe("Rp 1.500.000");
    expect(formatIDR(-25_000)).toBe("Rp -25.000");
  });

  it("menyingkat juta dan miliar pada mode compact", () => {
    expect(formatIDR(1_500_000, { compact: true })).toBe("Rp 1,5 Jt");
    expect(formatIDR(2_250_000_000, { compact: true })).toBe("Rp 2,3 M");
    expect(formatIDR(999_999, { compact: true })).toBe("Rp 999.999");
  });

  it("menampilkan strip untuk nilai kosong", () => {
    expect(formatIDR(null)).toBe("—");
    expect(formatIDR(undefined)).toBe("—");
  });
});

describe("format tanggal", () => {
  it("formatCalendarDateID membaca tanggal dalam UTC", () => {
    expect(formatCalendarDateID("2026-08-17T00:00:00.000Z")).toBe("17 Agu 2026");
    expect(formatCalendarDateID("2026-08-17T23:30:00.000Z")).toBe("17 Agu 2026");
  });

  it("formatDateID membaca tanggal dalam zona waktu perangkat", () => {
    const iso = new Date(2026, 4, 1, 23, 30).toISOString();
    expect(formatDateID(iso)).toBe("1 Mei 2026");
  });

  it("menangani nilai kosong dan tidak valid", () => {
    expect(formatDateID(null)).toBe("—");
    expect(formatCalendarDateID("")).toBe("—");
    expect(formatDateID("bukan-tanggal")).toBe("bukan-tanggal");
  });
});

describe("formatFileSize", () => {
  it("memilih satuan yang sesuai", () => {
    expect(formatFileSize(0)).toBe("—");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});
