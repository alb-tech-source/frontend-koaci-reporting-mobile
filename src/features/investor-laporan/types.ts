export interface MyReporting {
  reportingId: string;
  projectId: string;
  projectKey: string;
  companyName: string;
  reportDate: string;
  estimateProgress: number; // 0-100
  narrativeSummary: string;
  issuesBlockers: string;
  nextWeekPlan: string;
  fundDisbursed: number;
  createdAt: string;
  mediaCount: number;
}

export interface MyReportingMedia {
  mediaId: string;
  reportingId: string;
  mediaType: "photo" | "video" | "document";
  mediaName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}
