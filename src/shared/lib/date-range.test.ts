import { describe, expect, it } from "vitest";

import { isWithinDateRange, toDateKey } from "./date-range";
import { emptyListFilter, matchesListFilter } from "./list-filter";

// Dibuat dari komponen waktu lokal supaya hasilnya sama di zona waktu mana pun
const localIso = (y: number, m: number, d: number, h = 12) =>
  new Date(y, m - 1, d, h).toISOString();

describe("toDateKey", () => {
  it("memakai tanggal lokal secara default", () => {
    expect(toDateKey(localIso(2026, 9, 5, 23))).toBe("2026-09-05");
  });

  it("memakai tanggal UTC untuk mode utc", () => {
    expect(toDateKey("2026-09-05T00:00:00.000Z", "utc")).toBe("2026-09-05");
    expect(toDateKey("2026-09-05T23:59:59.000Z", "utc")).toBe("2026-09-05");
  });

  it("mengembalikan string kosong untuk tanggal tidak valid", () => {
    expect(toDateKey("bukan-tanggal")).toBe("");
  });
});

describe("isWithinDateRange", () => {
  it("menyertakan hari pada batas akhir", () => {
    expect(isWithinDateRange(localIso(2026, 9, 5, 23), "", "2026-09-05")).toBe(true);
    expect(isWithinDateRange(localIso(2026, 9, 6, 0), "", "2026-09-05")).toBe(false);
  });

  it("menyertakan hari pada batas awal", () => {
    expect(isWithinDateRange(localIso(2026, 9, 5, 0), "2026-09-05", "")).toBe(true);
    expect(isWithinDateRange(localIso(2026, 9, 4, 23), "2026-09-05", "")).toBe(false);
  });

  it("meloloskan semua data jika tidak ada batas", () => {
    expect(isWithinDateRange("", "", "")).toBe(true);
  });

  it("menolak tanggal tidak valid jika ada batas", () => {
    expect(isWithinDateRange("", "2026-09-01", "")).toBe(false);
  });
});

describe("matchesListFilter", () => {
  const item = {
    projectKey: "KOACI-001",
    companyName: "PT Maju Bersama",
    date: "2026-09-05T00:00:00.000Z",
  };

  it("meloloskan semua item untuk filter kosong", () => {
    expect(matchesListFilter(item, emptyListFilter)).toBe(true);
  });

  it("mencari di kode proyek dan nama perusahaan tanpa membedakan huruf besar", () => {
    expect(matchesListFilter(item, { ...emptyListFilter, search: "koaci" })).toBe(true);
    expect(matchesListFilter(item, { ...emptyListFilter, search: " maju " })).toBe(true);
    expect(matchesListFilter(item, { ...emptyListFilter, search: "lain" })).toBe(false);
  });

  it("memfilter berdasarkan proyek yang dipilih", () => {
    expect(matchesListFilter(item, { ...emptyListFilter, project: "KOACI-001" })).toBe(true);
    expect(matchesListFilter(item, { ...emptyListFilter, project: "KOACI-002" })).toBe(false);
  });

  it("menggabungkan filter tanggal dengan mode yang diminta", () => {
    const filter = { ...emptyListFilter, dateStart: "2026-09-05", dateEnd: "2026-09-05" };
    expect(matchesListFilter(item, filter, "utc")).toBe(true);
    expect(
      matchesListFilter({ ...item, date: "2026-09-06T00:00:00.000Z" }, filter, "utc"),
    ).toBe(false);
  });
});
