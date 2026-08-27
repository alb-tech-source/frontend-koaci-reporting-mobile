import { useState } from "react";
import { FileText, Download, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { InvestorDocument } from "./documents";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { toast } from "sonner";

interface Props {
  documents: InvestorDocument[];
  onDownload: (doc: InvestorDocument) => void;
  onDelete?: (doc: InvestorDocument) => void;
  // ✅ Tambahkan prop onUpload jika API upload mobile sudah ada (opsional)
  onUpload?: (file: File) => Promise<void>; 
}

export function DocumentListPanel({ documents, onDownload, onDelete, onUpload }: Readonly<Props>) {
  const [addOpen, setAddOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!onUpload) return;
    setIsUploading(true);
    try {
      await onUpload(file);
      setAddOpen(false);
      toast.success("Dokumen berhasil diunggah.");
    } catch {
      toast.error("Gagal mengunggah dokumen.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ Tombol Tambah Dokumen */}
      {onUpload && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-foreground">Daftar Dokumen</h3>
          <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Tambah
          </Button>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4 border rounded-xl border-dashed">
          Belum ada dokumen.
        </p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-xl bg-card">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-8 w-8 text-brand shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(doc.sizeBytes / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => onDownload(doc)}>
                  <Download className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button variant="ghost" size="icon" className="text-danger" onClick={() => onDelete(doc)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal Dialog (Jika diklik Tambah) */}
      {addOpen && (
        <AddDocumentDialog 
          onUpload={handleUpload} 
          // (Anda mungkin perlu menyesuaikan state modal di komponen Dialog Anda)
        />
      )}
    </div>
  );
}