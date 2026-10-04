import { describe, expect, it } from "vitest";

import { mapMedia, mapMediaStream, mapReporting } from "./api";

describe("mapReporting", () => {
  it("memetakan laporan beserta proyek dan jumlah media", () => {
    const reporting = mapReporting({
      project_reporting_id: "rep-1",
      report_date: "2026-09-05T00:00:00.000Z",
      estimate_progress_percentage: 60,
      narative_summary: "Pondasi selesai.",
      issues_blockers: "Hujan",
      next_week_plan: "Pasang rangka",
      fund_disbursed: "12500000.50",
      created_at: "2026-09-06T01:00:00.000Z",
      project: {
        project_id: "p-1",
        project_key: "KOACI-001",
        company: { company_name: "PT Maju Bersama" },
      },
      projectReportingMedia: [{}, {}],
    });

    expect(reporting).toEqual({
      reportingId: "rep-1",
      projectId: "p-1",
      projectKey: "KOACI-001",
      companyName: "PT Maju Bersama",
      reportDate: "2026-09-05T00:00:00.000Z",
      estimateProgress: 60,
      narrativeSummary: "Pondasi selesai.",
      issuesBlockers: "Hujan",
      nextWeekPlan: "Pasang rangka",
      fundDisbursed: 12_500_000.5,
      createdAt: "2026-09-06T01:00:00.000Z",
      mediaCount: 2,
    });
  });

  it("mengisi nilai default untuk respons kosong", () => {
    expect(mapReporting({})).toMatchObject({
      reportingId: "",
      projectKey: "",
      estimateProgress: 0,
      fundDisbursed: 0,
      mediaCount: 0,
    });
  });
});

describe("mapMedia", () => {
  it("memetakan media laporan", () => {
    expect(
      mapMedia({
        project_reporting_media_id: "m-1",
        project_reporting_id: "rep-1",
        media_type: "video",
        media_name: "progres.mp4",
        mime_type: "video/mp4",
        file_size_bytes: "1048576",
        uploaded_at: "2026-09-05T03:00:00.000Z",
      }),
    ).toEqual({
      mediaId: "m-1",
      reportingId: "rep-1",
      mediaType: "video",
      mediaName: "progres.mp4",
      mimeType: "video/mp4",
      fileSizeBytes: 1_048_576,
      uploadedAt: "2026-09-05T03:00:00.000Z",
    });
  });

  it("menganggap media tanpa tipe sebagai dokumen", () => {
    expect(mapMedia({}).mediaType).toBe("document");
  });
});

describe("mapMediaStream", () => {
  it("memetakan URL streaming dan tipe MIME", () => {
    expect(
      mapMediaStream({ streamUrl: "https://storage.example/video.mp4?sig=1", mimeType: "video/mp4" }),
    ).toEqual({ url: "https://storage.example/video.mp4?sig=1", mimeType: "video/mp4" });
  });

  it("menerima tipe MIME kosong", () => {
    expect(mapMediaStream({ streamUrl: "https://storage.example/x", mimeType: null }).mimeType).toBe("");
  });

  it("menolak respons tanpa URL", () => {
    expect(() => mapMediaStream({})).toThrow("URL streaming tidak valid.");
  });
});
