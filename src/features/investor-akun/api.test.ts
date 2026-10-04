import { describe, expect, it } from "vitest";

import { mapInvestorProfile, toHeirPayload } from "./api";
import { emptyHeir } from "./types";

const sessionUser = {
  user_id: "u-1",
  email: "sesi@koaci.id",
  firstname: "Sesi",
  lastname: "User",
};

describe("mapInvestorProfile", () => {
  it("memetakan investor beserta ahli waris dari kolom heir_*", () => {
    const profile = mapInvestorProfile(
      {
        investor_id: "inv-1",
        user_id: "u-1",
        investor_type: "corporation",
        status: "active",
        gender: "women",
        nik: "3201010101010001",
        address: "Jl. Merdeka 1",
        privy: null,
        phone: "081234567890",
        account_number: "1234567890",
        bank_name: "BSI",
        heir_name: "Budi",
        heir_relationship: "child",
        heir_nik: "3201010101010002",
        heir_address: null,
        heir_account_number: "987654321",
        heir_bank_name: "BCA",
        heir_phone: "0811111111",
        user: { firstname: "Siti", lastname: "Aminah", email: "siti@koaci.id" },
      },
      sessionUser,
    );

    expect(profile).toEqual({
      investorId: "inv-1",
      userId: "u-1",
      firstName: "Siti",
      lastName: "Aminah",
      email: "siti@koaci.id",
      phone: "081234567890",
      investorType: "corporation",
      gender: "women",
      nik: "3201010101010001",
      address: "Jl. Merdeka 1",
      accountNumber: "1234567890",
      bankName: "BSI",
      status: "active",
      privy: undefined,
      heir: {
        name: "Budi",
        relation: "child",
        nik: "3201010101010002",
        address: "",
        accountNumber: "987654321",
        bankName: "BCA",
        phone: "0811111111",
      },
    });
  });

  it("tidak membuat ahli waris jika heir_name kosong", () => {
    const profile = mapInvestorProfile({ investor_id: "inv-1", heir_name: null }, sessionUser);

    expect(profile.heir).toBeUndefined();
  });

  it("memakai data sesi dan status inactive untuk investor yang belum punya profil", () => {
    expect(mapInvestorProfile({}, sessionUser)).toMatchObject({
      investorId: "",
      userId: "u-1",
      firstName: "Sesi",
      lastName: "User",
      email: "sesi@koaci.id",
      investorType: "individual",
      status: "inactive",
    });
  });
});

describe("toHeirPayload", () => {
  it("memakai nama kolom backend", () => {
    expect(
      toHeirPayload({
        name: " Budi ",
        relation: "child",
        nik: "3201010101010002",
        address: "Jl. Merdeka 1",
        accountNumber: "987654321",
        bankName: "BCA",
        phone: "+62811111111",
      }),
    ).toEqual({
      heir_name: "Budi",
      heir_relationship: "child",
      heir_nik: "3201010101010002",
      heir_address: "Jl. Merdeka 1",
      heir_account_number: "987654321",
      heir_bank_name: "BCA",
      heir_phone: "+62811111111",
    });
  });

  it("tidak mengirim field berpola angka yang kosong", () => {
    const payload = toHeirPayload({ ...emptyHeir, name: "Budi" });

    expect(payload.heir_nik).toBeUndefined();
    expect(payload.heir_account_number).toBeUndefined();
    expect(payload.heir_phone).toBeUndefined();
  });
});
