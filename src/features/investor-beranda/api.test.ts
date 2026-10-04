import { afterEach, describe, expect, it } from "vitest";

import api from "@/shared/lib/axios";
import { fetchInvestmentSummary, mapInvestmentSummary } from "./api";

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe("mapInvestmentSummary", () => {
  it("mengubah nominal string dari backend menjadi angka untuk tampilan", () => {
    expect(
      mapInvestmentSummary({ total_active_investment: "150000000.5", active_projects: 2 }),
    ).toEqual({ totalActiveInvestment: 150_000_000.5, activeProjects: 2 });
  });

  it("menerima nilai nol", () => {
    expect(
      mapInvestmentSummary({ total_active_investment: "0", active_projects: 0 }),
    ).toEqual({ totalActiveInvestment: 0, activeProjects: 0 });
  });

  it("menolak respons yang tidak lengkap atau bukan angka", () => {
    expect(() => mapInvestmentSummary({})).toThrow("tidak valid");
    expect(() => mapInvestmentSummary({ total_active_investment: "100" })).toThrow();
    expect(() =>
      mapInvestmentSummary({ total_active_investment: "abc", active_projects: 1 }),
    ).toThrow();
  });
});

describe("fetchInvestmentSummary", () => {
  it("membaca ringkasan dari GET /project-investments/own/summary", async () => {
    let requestedUrl = "";
    api.defaults.adapter = async (config) => {
      requestedUrl = config.url ?? "";
      return {
        data: {
          success: true,
          data: { total_active_investment: "150000000", active_projects: 2 },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    await expect(fetchInvestmentSummary()).resolves.toEqual({
      totalActiveInvestment: 150_000_000,
      activeProjects: 2,
    });
    expect(requestedUrl).toBe("/project-investments/own/summary");
  });
});
