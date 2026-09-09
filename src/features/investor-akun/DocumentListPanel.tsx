import { useState } from "react";
import { FileText, Download, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getDocumentDownloadUrl, type InvestorDocument } from "./documents";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { toast } from "sonner";

interface Props {
  documents: InvestorDocument[];
  onDelete?: (doc: InvestorDocument) => void;
  onUpload?: (file: File) => Promise<void>;
}

export function DocumentListPanel({
  documents,
  onDelete,
  onUpload,
}: Readonly<Props>) {
  const [addOpen, setAddOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!onUpload) {
      toast.info("Fungsi upload belum disambungkan dari halaman utama.");
      setAddOpen(false);
      return;
    }
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

  const handleDownload = async (doc: InvestorDocument) => {
    setDownloadingId(doc.id);
    try {
      const url = await getDocumentDownloadUrl(doc.id);
      if (!url) throw new Error("URL unduhan tidak valid");

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("CORS terblokir");

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = doc.name || "dokumen";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast.error("Gagal mengunduh dokumen.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-foreground">
          Daftar Dokumen
        </h3>
        <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Tambah
        </Button>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4 border rounded-xl border-dashed">
          Belum ada dokumen.
        </p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-xl bg-card"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-8 w-8 text-brand shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(doc.sizeBytes / 1024).toFixed(1)} KB •{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingId === doc.id}
                >
                  {downloadingId === doc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-danger"
                    onClick={() => onDelete(doc)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {addOpen && (
        <AddDocumentDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onUpload={handleUpload}
          isSubmitting={isUploading}
        />
      )}
    </div>
  );
}
