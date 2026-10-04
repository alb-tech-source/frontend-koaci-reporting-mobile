import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { normalizeUser, useAuthStore } from "@/shared/store/authStore";
import { fetchCurrentUser } from "./api";
import {
  accountPathForRole,
  establishSession,
  homePathForRole,
  syncSession,
  UnsupportedRoleError,
} from "./session";

vi.mock("./api", () => ({ fetchCurrentUser: vi.fn() }));

const mockedFetchCurrentUser = vi.mocked(fetchCurrentUser);
const fakeDocument = { cookie: "" };
const fakeWindow = { location: { href: "/investor/portofolio" } };

// Bentuk respons GET /auth/me di backend
const meResponse = (roleName: string, userId = "u-1") => ({
  success: true,
  data: {
    user: {
      user_id: userId,
      email: "orang@koaci.id",
      firstname: "Ahmad",
      lastname: "Fauzi",
      role: { role_name: roleName, permissions: ["investors:read:own"] },
    },
  },
});

beforeEach(() => {
  fakeDocument.cookie = "";
  fakeWindow.location.href = "/investor/portofolio";
  vi.stubGlobal("document", fakeDocument);
  vi.stubGlobal("window", fakeWindow);
  useAuthStore.getState().clearAuth();
  mockedFetchCurrentUser.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("establishSession", () => {
  it("mengisi store dan cookie role untuk investor", async () => {
    mockedFetchCurrentUser.mockResolvedValue(meResponse("investor"));

    await expect(establishSession()).resolves.toBe("investor");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toMatchObject({
      user_id: "u-1",
      role: "investor",
      permissions: ["investors:read:own"],
      firstname: "Ahmad",
    });
    expect(fakeDocument.cookie).toContain("user_role=investor;");
  });

  it("mengisi store dan cookie role untuk user biasa", async () => {
    mockedFetchCurrentUser.mockResolvedValue(meResponse("user"));

    await expect(establishSession()).resolves.toBe("user");
    expect(fakeDocument.cookie).toContain("user_role=user;");
  });

  it("menolak role yang tidak punya halaman di aplikasi ini", async () => {
    mockedFetchCurrentUser.mockResolvedValue(meResponse("admin"));

    await expect(establishSession()).rejects.toBeInstanceOf(UnsupportedRoleError);

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(fakeDocument.cookie).toContain("user_role=;");
  });

  it("gagal jika respons profil tidak berisi user", async () => {
    mockedFetchCurrentUser.mockResolvedValue({ success: true, data: {} });

    await expect(establishSession()).rejects.toThrow("Gagal membaca profil pengguna.");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

describe("syncSession", () => {
  const loginAs = (userId: string, role: string) =>
    useAuthStore.getState().setAuth(normalizeUser({ user_id: userId, role, firstname: "Baru" }));

  it("tidak memanggil backend jika belum login", async () => {
    await syncSession();

    expect(mockedFetchCurrentUser).not.toHaveBeenCalled();
  });

  it("tidak mengubah apa pun jika cookie masih milik akun yang sama", async () => {
    loginAs("u-1", "investor");
    const before = useAuthStore.getState().user;
    mockedFetchCurrentUser.mockResolvedValue(meResponse("investor"));

    await syncSession();

    expect(useAuthStore.getState().user).toBe(before);
    expect(fakeWindow.location.href).toBe("/investor/portofolio");
  });

  it("mengikuti pemilik cookie jika akun lain login di tab atau aplikasi lain", async () => {
    loginAs("u-baru", "investor");
    mockedFetchCurrentUser.mockResolvedValue(meResponse("investor", "u-lama"));

    await syncSession();

    expect(useAuthStore.getState().user).toMatchObject({ user_id: "u-lama", firstname: "Ahmad" });
    expect(fakeWindow.location.href).toBe("/investor/portofolio");
  });

  it("pindah ke beranda role baru jika pemilik cookie berbeda role", async () => {
    loginAs("u-baru", "investor");
    mockedFetchCurrentUser.mockResolvedValue(meResponse("user", "u-lain"));

    await syncSession();

    expect(fakeDocument.cookie).toContain("user_role=user;");
    expect(fakeWindow.location.href).toBe("/user/beranda");
  });

  it("mengakhiri sesi jika cookie sekarang milik akun admin", async () => {
    loginAs("u-baru", "investor");
    mockedFetchCurrentUser.mockResolvedValue(meResponse("admin", "u-admin"));

    await syncSession();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(fakeDocument.cookie).toContain("user_role=;");
    expect(fakeWindow.location.href).toBe("/");
  });

  it("membiarkan sesi apa adanya jika backend tidak bisa dihubungi", async () => {
    loginAs("u-baru", "investor");
    mockedFetchCurrentUser.mockRejectedValue(new Error("Network Error"));

    await syncSession();

    expect(useAuthStore.getState().user).toMatchObject({ user_id: "u-baru" });
    expect(fakeWindow.location.href).toBe("/investor/portofolio");
  });
});

describe("path per role", () => {
  it("homePathForRole", () => {
    expect(homePathForRole("investor")).toBe("/investor/beranda");
    expect(homePathForRole("user")).toBe("/user/beranda");
  });

  it("accountPathForRole kembali ke halaman login jika role tidak dikenal", () => {
    expect(accountPathForRole("investor")).toBe("/investor/akun");
    expect(accountPathForRole("user")).toBe("/user/akun");
    expect(accountPathForRole(undefined)).toBe("/");
    expect(accountPathForRole("admin")).toBe("/");
  });
});
