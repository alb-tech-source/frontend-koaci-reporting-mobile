// mobile/src/features/investor-akun/documents.ts (BARU)
import api from "@/shared/lib/axios";

export interface InvestorDocument {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export async function fetchInvestorDocuments(investorId: string): Promise<InvestorDocument[]> {
  const { data } = await api.get(`/investor-documents/investor/${investorId}`);
  return (data?.data ?? []).map((d: any) => ({
    id: d.document_id,
    name: d.document_name,
    mimeType: d.mime_type,
    sizeBytes: Number(d.file_size_bytes),
    uploadedAt: d.uploaded_at,
  }));
}

export async function getDocumentDownloadUrl(documentId: string): Promise<string> {
  const { data } = await api.get(`/investor-documents/${documentId}/download`);
  return data.data.downloadUrl;
}

export async function deleteInvestorDocumentApi(documentId: string) {
  await api.delete(`/investor-documents/${documentId}`);
}