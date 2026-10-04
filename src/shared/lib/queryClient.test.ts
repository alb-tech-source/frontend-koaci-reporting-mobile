import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { normalizeUser, useAuthStore } from "../store/authStore";
import { bindSessionToQueryCache, createQueryClient } from "./queryClient";

const KEY = ["investor", "my-investments"];
const login = (userId: string) =>
  useAuthStore.getState().setAuth(normalizeUser({ user_id: userId, role: "investor" }));

let queryClient = createQueryClient();
let unbind = () => {};

beforeEach(() => {
  login("u-lama");
  queryClient = createQueryClient();
  queryClient.setQueryData(KEY, [{ investmentId: "inv-lama" }]);
  unbind = bindSessionToQueryCache(queryClient);
});

afterEach(() => {
  unbind();
  queryClient.clear();
});

describe("bindSessionToQueryCache", () => {
  it("membuang data akun sebelumnya saat akun lain login", () => {
    login("u-baru");

    expect(queryClient.getQueryData(KEY)).toBeUndefined();
  });

  it("membuang cache saat logout", () => {
    useAuthStore.getState().clearAuth();

    expect(queryClient.getQueryData(KEY)).toBeUndefined();
  });

  it("mempertahankan cache jika akunnya tetap sama", () => {
    login("u-lama");
    useAuthStore.getState().updateUser({ firstname: "Ahmad" });

    expect(queryClient.getQueryData(KEY)).toEqual([{ investmentId: "inv-lama" }]);
  });
});
