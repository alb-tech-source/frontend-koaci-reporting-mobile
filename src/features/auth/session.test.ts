import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/shared/store/authStore";
import { fetchCurrentUser } from "./api";
import {
  accountPathForRole,
  establishSession,
  homePathForRole,
  UnsupportedRoleError,
} from "./session";

vi.mock("./api", () => ({ fetchCurrentUser: vi.fn() }));

const mockedFetchCurrentUser = vi.mocked(fetchCurrentUser);
const fakeDocument = { cookie: "" };

// Bentuk respons GET /auth/me di backend
const meResponse = (roleName: string) => ({
  success: true,
  data: {
    user: {
      user_id: "u-1",
      email: "orang@koaci.id",
      firstname: "Ahmad",
      lastname: "Fauzi",
      role: { role_name: roleName, permissions: ["investors:read:own"] },
    },
  },
});

beforeEach(() => {
  fakeDocument.cookie = "";
  vi.stubGlobal("document", fakeDocument);
  useAuthStore.getState().clearAuth();
  mockedFetchCurrentUser.mockReset();
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
