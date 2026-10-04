import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { normalizeUser, useAuthStore } from "../store/authStore";
import api from "./axios";

type Handler = (config: InternalAxiosRequestConfig, attempt: number) => number;

const originalAdapter = api.defaults.adapter;
const fakeDocument = { cookie: "" };
const fakeWindow = { location: { href: "/investor/beranda" } };
let calls: string[] = [];

// Adapter palsu: status ditentukan handler, tanpa request jaringan
function useHandler(handler: Handler) {
  api.defaults.adapter = async (config) => {
    const url = config.url ?? "";
    calls.push(url);
    const attempt = calls.filter((u) => u === url).length;
    const status = handler(config, attempt);
    const response = { data: {}, status, statusText: "", headers: {}, config };

    if (status >= 200 && status < 300) return response;
    // Status 0 = jaringan terputus: error tanpa response
    if (status === 0) throw new AxiosError("Network Error", "ERR_NETWORK", config);
    throw new AxiosError(`HTTP ${status}`, undefined, config, null, response);
  };
}

beforeEach(() => {
  calls = [];
  fakeDocument.cookie = "";
  fakeWindow.location.href = "/investor/beranda";
  vi.stubGlobal("document", fakeDocument);
  vi.stubGlobal("window", fakeWindow);
  useAuthStore.getState().setAuth(normalizeUser({ user_id: "u-1", role: "investor" }));
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  vi.unstubAllGlobals();
});

describe("interceptor refresh token", () => {
  it("tidak mencoba refresh saat login ditolak 401", async () => {
    useHandler(() => 401);

    await expect(api.post("/auth/login", {})).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(calls).toEqual(["/auth/login"]);
    expect(fakeWindow.location.href).toBe("/investor/beranda");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("me-refresh lalu mengulang request saat access token kedaluwarsa", async () => {
    useHandler((config, attempt) => {
      if (config.url === "/auth/refresh") return 200;
      return attempt === 1 ? 401 : 200;
    });

    const response = await api.get("/project-investments/own/investments");

    expect(response.status).toBe(200);
    expect(calls).toEqual([
      "/project-investments/own/investments",
      "/auth/refresh",
      "/project-investments/own/investments",
    ]);
  });

  it("memperpanjang cookie role selama umur refresh token setelah refresh berhasil", async () => {
    useHandler((config, attempt) => {
      if (config.url === "/auth/refresh") return 200;
      return attempt === 1 ? 401 : 200;
    });

    await api.get("/project-investments/own/investments");

    expect(fakeDocument.cookie).toContain("user_role=investor;");
    expect(fakeDocument.cookie).toContain(`max-age=${7 * 24 * 60 * 60}`);
  });

  it("me-refresh lalu mengulang logout agar cookie sesi di server ikut terhapus", async () => {
    useHandler((config, attempt) => {
      if (config.url === "/auth/refresh") return 200;
      return attempt === 1 ? 401 : 200;
    });

    await api.post("/auth/logout");

    expect(calls).toEqual(["/auth/logout", "/auth/refresh", "/auth/logout"]);
  });

  it("hanya me-refresh sekali untuk beberapa request yang gagal bersamaan", async () => {
    useHandler((config, attempt) => {
      if (config.url === "/auth/refresh") return 200;
      return attempt === 1 ? 401 : 200;
    });

    await Promise.all([api.get("/a"), api.get("/b")]);

    expect(calls.filter((url) => url === "/auth/refresh")).toHaveLength(1);
  });

  it("tidak mengakhiri sesi jika refresh gagal karena gangguan server", async () => {
    useHandler((config) => (config.url === "/auth/refresh" ? 503 : 401));

    await expect(api.get("/project-reportings/own")).rejects.toMatchObject({
      response: { status: 503 },
    });

    expect(calls).toEqual(["/project-reportings/own", "/auth/refresh"]);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(fakeDocument.cookie).toBe("");
    expect(fakeWindow.location.href).toBe("/investor/beranda");
  });

  it("tidak mengakhiri sesi jika refresh gagal karena jaringan terputus", async () => {
    useHandler((config) => (config.url === "/auth/refresh" ? 0 : 401));

    await expect(api.get("/project-reportings/own")).rejects.toBeInstanceOf(AxiosError);

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(fakeWindow.location.href).toBe("/investor/beranda");
  });

  it("membersihkan sesi dan kembali ke halaman login jika refresh ditolak", async () => {
    useHandler(() => 401);

    await expect(api.get("/project-reportings/own")).rejects.toBeInstanceOf(AxiosError);

    expect(calls).toEqual(["/project-reportings/own", "/auth/refresh"]);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(fakeDocument.cookie).toContain("user_role=;");
    expect(fakeWindow.location.href).toBe("/");
  });
});
