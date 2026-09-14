// mobile/src/features/investor-akun/documents.ts (BARU)
import api from "@/shared/lib/axios";
import { uploadFile } from "@/shared/lib/upload";

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

// Alur direct-to-R2: presign → PUT ke storage → confirm (buat record DB)
export async function uploadInvestorDocument(investorId: string, file: File) {
  return uploadFile(
    "/investor-documents/presign",
    "/investor-documents",
    { investor_id: investorId },
    { investor_id: investorId, document_name: file.name },
    file,
  );
}

export async function getDocumentDownloadUrl(documentId: string): Promise<string> {
  const { data } = await api.get(`/investor-documents/${documentId}/download`);
  return data.data.downloadUrl;
}

export async function deleteInvestorDocumentApi(documentId: string) {
  await api.delete(`/investor-documents/${documentId}`);
}