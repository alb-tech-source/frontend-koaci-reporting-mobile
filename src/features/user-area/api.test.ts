import { describe, expect, it } from "vitest";

import { mapPublicProject } from "./api";

describe("mapPublicProject", () => {
  it("memetakan respons snake_case backend", () => {
    expect(
      mapPublicProject({
        project_id: "p-1",
        project_name: "Pembiayaan Gudang Distribusi",
        funding_required: "500000000",
        status: "target_achieved",
        company: { company_name: "PT Maju Bersama", industry_sector: "Logistik" },
      }),
    ).toEqual({
      id: "p-1",
      name: "Pembiayaan Gudang Distribusi",
      companyName: "PT Maju Bersama",
      industrySector: "Logistik",
      fundingRequired: 500_000_000,
      status: "target_achieved",
    });
  });

  it("memakai nama perusahaan jika project_name kosong", () => {
    const company = { company_name: "PT Maju Bersama", industry_sector: null };

    expect(mapPublicProject({ project_name: null, company }).name).toBe("PT Maju Bersama");
    expect(mapPublicProject({ project_name: "   ", company }).name).toBe("PT Maju Bersama");
  });

  it("mengisi nilai default untuk respons kosong", () => {
    expect(mapPublicProject({})).toEqual({
      id: "",
      name: "-",
      companyName: "-",
      industrySector: null,
      fundingRequired: 0,
      status: "open",
    });
  });
});
