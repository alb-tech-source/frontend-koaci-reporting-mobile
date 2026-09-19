import api from "@/shared/lib/axios";
import type { MyReporting, MyReportingMedia } from "./types";

interface ApiReporting {
  project_reporting_id?: string;
  projectReportingId?: string;
  project_id?: string;
  report_date?: string;
  estimate_progress_percentage?: number;
  narative_summary?: string;
  issues_blockers?: string;
  next_week_plan?: string;
  fund_disbursed?: string | number;
  createdAt?: string;
  created_at?: string;
  project?: {
    project_key?: string;
    projectKey?: string;
    project_id?: string;
    company?: { company_name?: string; companyName?: string };
  };
  projectReportingMedia?: unknown[];
}

export function mapReporting(raw: ApiReporting): MyReporting {
  const proj = raw.project ?? {};
  const comp = proj.company ?? {};

  return {
    reportingId: raw.project_reporting_id || raw.projectReportingId || "",
    projectId: proj.project_id || raw.project_id || "",
    projectKey: proj.project_key || proj.projectKey || "",
    companyName: comp.company_name || comp.companyName || "",
    reportDate: raw.report_date || "",
    estimateProgress: raw.estimate_progress_percentage ?? 0,
    narrativeSummary: raw.narative_summary || "",
    issuesBlockers: raw.issues_blockers || "",
    nextWeekPlan: raw.next_week_plan || "",
    fundDisbursed: Number.parseFloat(String(raw.fund_disbursed ?? 0)),
    createdAt: raw.createdAt || raw.created_at || "",
    mediaCount: Array.isArray(raw.projectReportingMedia)
      ? raw.projectReportingMedia.length
      : 0,
  };
}

interface ApiMedia {
  project_reporting_media_id?: string;
  projectReportingMediaId?: string;
  project_reporting_id?: string;
  media_type?: string;
  mediaType?: string;
  media_name?: string;
  mediaName?: string;
  mime_type?: string;
  mimeType?: string;
  file_size_bytes?: string | number;
  uploaded_at?: string;
  uploadedAt?: string;
}

export function mapMedia(raw: ApiMedia): MyReportingMedia {
  return {
    mediaId:
      raw.project_reporting_media_id || raw.projectReportingMediaId || "",
    reportingId: raw.project_reporting_id || "",
    mediaType: (raw.media_type ||
      raw.mediaType ||
      "document") as MyReportingMedia["mediaType"],
    mediaName: raw.media_name || raw.mediaName || "",
    mimeType: raw.mime_type || raw.mimeType || "",
    fileSizeBytes: Number(raw.file_size_bytes || 0),
    uploadedAt: raw.uploaded_at || raw.uploadedAt || "",
  };
}

export async function fetchMyReportings(): Promise<MyReporting[]> {
  const { data } = await api.get("/project-reportings/own");
  const items = data?.data?.items ?? data?.data ?? data ?? [];
  return items.map(mapReporting);
}

export async function fetchMyReportingMedia(reportingId: string): Promise<MyReportingMedia[]> {
  const { data } = await api.get("/project-reporting-media/own", { 
    params: { reporting_id: reportingId } 
  });
  const items = data?.data?.items ?? data?.data ?? data ?? [];
  return items.map(mapMedia);
}

export async function getReportingMediaDownloadUrl(mediaId: string): Promise<string> {
  const { data } = await api.get(`/project-reporting-media/own/${mediaId}/download`);
  return data?.data?.downloadUrl ?? data?.downloadUrl ?? "";
}