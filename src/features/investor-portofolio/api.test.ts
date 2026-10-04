import { describe, expect, it } from "vitest";

import { mapInvestment } from "./api";
import { mapReceipt } from "./receiptApi";

describe("mapInvestment", () => {
  it("memetakan respons snake_case backend", () => {
    const investment = mapInvestment({
      project_investment_id: "inv-1",
      amount: "25000000",
      total_package: 5,
      payment_method: "cash",
      receipt_number: "KW-001",
      createdAt: "2026-09-05T03:00:00.000Z",
      receiptDocument: { receipt_document_id: "r-1" },
      project: {
        project_id: "p-1",
        project_key: "KOACI-001",
        funding_required: "100000000",
        funding_collected: "45500000",
        funding_progress_pct: 45,
        latest_progress_pct: 62.5,
        status: "open",
        company: { company_name: "PT Maju Bersama" },
      },
    });

    expect(investment).toEqual({
      investmentId: "inv-1",
      projectId: "p-1",
      projectKey: "KOACI-001",
      companyName: "PT Maju Bersama",
      fundingRequired: 100_000_000,
      fundingCollected: 45_500_000,
      fundingProgress: 45,
      projectProgress: 62.5,
      projectStatus: "open",
      amount: 25_000_000,
      totalPackage: 5,
      paymentMethod: "cash",
      receiptNumber: "KW-001",
      createdAt: "2026-09-05T03:00:00.000Z",
      hasReceipt: true,
    });
  });

  it("meneruskan nilai nol dari backend apa adanya", () => {
    const investment = mapInvestment({
      project: { funding_collected: "0", funding_progress_pct: 0, latest_progress_pct: 0 },
    });

    expect(investment.fundingCollected).toBe(0);
    expect(investment.fundingProgress).toBe(0);
    expect(investment.projectProgress).toBe(0);
  });

  it("memakai null, bukan 0, jika backend tidak mengirim nilai progres", () => {
    const investment = mapInvestment({
      project: { funding_required: "100000000", latest_progress_pct: null },
    });

    expect(investment.fundingCollected).toBeNull();
    expect(investment.fundingProgress).toBeNull();
    expect(investment.projectProgress).toBeNull();
  });

  it("mengisi nilai default untuk respons kosong", () => {
    expect(mapInvestment({})).toMatchObject({
      investmentId: "",
      companyName: "-",
      projectStatus: "open",
      amount: 0,
      paymentMethod: "transfer",
      fundingProgress: null,
      hasReceipt: false,
    });
  });
});

describe("mapReceipt", () => {
  it("memetakan kwitansi dan mengubah ukuran file menjadi angka", () => {
    expect(
      mapReceipt({
        receipt_document_id: "r-1",
        project_investment_id: "inv-1",
        receipt_name: "kwitansi.pdf",
        mime_type: "application/pdf",
        file_size_bytes: "20480",
        uploaded_at: "2026-09-05T03:00:00.000Z",
      }),
    ).toEqual({
      receiptId: "r-1",
      investmentId: "inv-1",
      receiptName: "kwitansi.pdf",
      mimeType: "application/pdf",
      fileSizeBytes: 20480,
      uploadedAt: "2026-09-05T03:00:00.000Z",
    });
  });
});
