import { describe, expect, it } from "vitest";

import { normalizeUser } from "./authStore";

describe("normalizeUser", () => {
  it("meratakan role objek dari GET /auth/me", () => {
    const user = normalizeUser({
      user_id: "u-1",
      email: "investor@koaci.id",
      firstname: "Ahmad",
      lastname: "Fauzi",
      is_active: true,
      role: { role_name: "investor", permissions: ["investors:read:own"] },
    });

    expect(user).toMatchObject({
      user_id: "u-1",
      email: "investor@koaci.id",
      role: "investor",
      permissions: ["investors:read:own"],
      firstname: "Ahmad",
      lastname: "Fauzi",
      is_active: true,
    });
  });

  it("menerima role yang sudah berbentuk string", () => {
    expect(normalizeUser({ role: "user" }).role).toBe("user");
  });

  it("memakai role 'user' jika role tidak ada", () => {
    expect(normalizeUser({}).role).toBe("user");
    expect(normalizeUser({ role: null }).role).toBe("user");
    expect(normalizeUser({ role: {} }).role).toBe("user");
  });

  it("menormalkan sesi lama yang memakai firstName/lastName", () => {
    const user = normalizeUser({ firstName: "Siti", lastName: "Aminah" });

    expect(user.firstname).toBe("Siti");
    expect(user.lastname).toBe("Aminah");
  });

  it("mengisi nilai kosong yang aman untuk field yang hilang", () => {
    expect(normalizeUser({ firstname: null, lastname: null })).toMatchObject({
      user_id: "",
      email: "",
      firstname: "",
      lastname: "",
      permissions: [],
    });
  });
});
