import api from "@/shared/lib/axios";
import type { MyReceipt } from "./types";

interface ApiReceipt {
  receipt_document_id?: string;
  receiptDocumentId?: string;
  project_investment_id?: string;
  projectInvestmentId?: string;
  receipt_name?: string;
  receiptName?: string;
  mime_type?: string;
  mimeType?: string;
  file_size_bytes?: string | number;
  fileSizeBytes?: string | number;
  uploaded_at?: string;
  uploadedAt?: string;
}

export function mapReceipt(raw: ApiReceipt): MyReceipt {
  return {
    receiptId: raw.receipt_document_id || raw.receiptDocumentId || "",
    investmentId: raw.project_investment_id || raw.projectInvestmentId || "",
    receiptName: raw.receipt_name || raw.receiptName || "",
    mimeType: raw.mime_type || raw.mimeType || "",
    fileSizeBytes: Number(raw.file_size_bytes || raw.fileSizeBytes || 0),
    uploadedAt: raw.uploaded_at || raw.uploadedAt || "",
  };
}

export async function fetchMyReceipts(): Promise<MyReceipt[]> {
  const { data } = await api.get("/receipt-documents/own");
  const items = data?.data?.items ?? data?.data ?? data ?? [];
  return items.map(mapReceipt);
}

export async function getReceiptDownloadUrl(receiptId: string): Promise<string> {
  const { data } = await api.get(`/receipt-documents/own/${receiptId}/download`);
  return data?.data?.downloadUrl ?? data?.downloadUrl ?? "";
}