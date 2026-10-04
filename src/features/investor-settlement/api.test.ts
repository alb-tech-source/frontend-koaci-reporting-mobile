import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it } from "vitest";

import api from "@/shared/lib/axios";
import {
  computeSettlementSummary,
  fetchMySettlements,
  mapSettlement,
  ProfileRequiredError,
  type ApiInvestorSettlement,
} from "./api";

// Bentuk respons GET /investor-settlements untuk role investor
const apiSettlement: ApiInvestorSettlement = {
  investor_settlement_id: "is-1",
  principal_amount: "300000000",
  modal_portion_pct: "60",
  profit_share_amount: "23520000",
  compensation_pct: "2",
  compensation_amount: "6000000",
  total_profit: "29520000",
  created_at: "2026-09-01T02:00:00.000Z",
  updated_at: "2026-09-10T02:00:00.000Z",
  projectSettlement: {
    profit_model: "jual beli",
    total_capital: "500000000",
    sales_amount: "650000000",
    net_profit_margin: "140000000",
    investor_portion_pct: "70",
    investor_portion_amount: "39200000",
    project: {
      project_id: "p-1",
      project_key: "KOACI-001",
      company: { company_name: "PT Maju Bersama" },
    },
  },
};

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe("mapSettlement", () => {
  it("mengubah angka string backend menjadi angka untuk tampilan", () => {
    expect(mapSettlement(apiSettlement)).toEqual({
      settlementId: "is-1",
      projectId: "p-1",
      projectKey: "KOACI-001",
      companyName: "PT Maju Bersama",
      profitModel: "jual beli",
      settledAt: "2026-09-10T02:00:00.000Z",
      principalAmount: 300_000_000,
      modalPortionPct: 60,
      profitShareAmount: 23_520_000,
      compensationPct: 2,
      compensationAmount: 6_000_000,
      totalProfit: 29_520_000,
      totalCapital: 500_000_000,
      salesAmount: 650_000_000,
      netProfitMargin: 140_000_000,
      investorPortionPct: 70,
      investorPortionAmount: 39_200_000,
    });
  });

  it("mempertahankan nilai negatif dan desimal saat proyek rugi", () => {
    const settlement = mapSettlement({
      ...apiSettlement,
      modal_portion_pct: "33.333333",
      profit_share_amount: "-60000000",
      total_profit: "-59999999.5",
    });

    expect(settlement.modalPortionPct).toBe(33.333333);
    expect(settlement.profitShareAmount).toBe(-60_000_000);
    expect(settlement.totalProfit).toBe(-59_999_999.5);
  });

  it("mengisi nilai default untuk respons kosong", () => {
    expect(mapSettlement({})).toMatchObject({
      settlementId: "",
      projectKey: "",
      companyName: "-",
      principalAmount: 0,
      totalProfit: 0,
    });
  });
});

describe("computeSettlementSummary", () => {
  it("menjumlahkan modal dan bagi hasil, termasuk yang rugi", () => {
    const summary = computeSettlementSummary([
      mapSettlement(apiSettlement),
      mapSettlement({ principal_amount: "100000000", total_profit: "-9520000" }),
    ]);

    expect(summary).toEqual({
      totalPrincipal: 400_000_000,
      totalProfit: 20_000_000,
      settledProjects: 2,
    });
  });

  it("mengembalikan nol jika belum ada settlement", () => {
    expect(computeSettlementSummary([])).toEqual({
      totalPrincipal: 0,
      totalProfit: 0,
      settledProjects: 0,
    });
  });
});

describe("fetchMySettlements", () => {
  it("mengambil semua halaman", async () => {
    const pages: number[] = [];
    api.defaults.adapter = async (config) => {
      pages.push(config.params.page);
      return {
        data: {
          success: true,
          data: [{ ...apiSettlement, investor_settlement_id: `is-${config.params.page}` }],
          meta: { total: 2, page: config.params.page, limit: 100, totalPages: 2 },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    const settlements = await fetchMySettlements();

    expect(pages).toEqual([1, 2]);
    expect(settlements.map((s) => s.settlementId)).toEqual(["is-1", "is-2"]);
  });

  it("mengubah 404 menjadi ProfileRequiredError", async () => {
    api.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const response = {
        data: { success: false, message: "Profil investor tidak ditemukan" },
        status: 404,
        statusText: "Not Found",
        headers: {},
        config,
      };
      throw new AxiosError("HTTP 404", undefined, config, null, response);
    };

    await expect(fetchMySettlements()).rejects.toBeInstanceOf(ProfileRequiredError);
  });
});
