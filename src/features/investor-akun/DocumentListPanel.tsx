import { useState } from "react";
import { FileText, Download, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { getDocumentDownloadUrl, type InvestorDocument } from "./documents";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/axios";

// Prioritaskan pesan dari Error aplikasi (mis. helper upload), lalu pesan backend
function errMsg(err: unknown, fallback: string): string {
  return getErrorMessage(err, err instanceof Error && err.message ? err.message : fallback);
}

interface Props {
  documents: InvestorDocument[];
  onDelete?: (doc: InvestorDocument) => Promise<void>;
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
  const [pendingDelete, setPendingDelete] = useState<InvestorDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpload = async (file: File) => {
    if (!onUpload) {
      toast.info("Fungsi upload belum disambungkan dari halaman utama.");
      setAddOpen(false);
      return;
    }
    // Batas maksimal backend: 100MB
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Ukuran file melebihi batas maksimal 100MB.");
      return;
    }
    setIsUploading(true);
    try {
      await onUpload(file);
      setAddOpen(false);
      toast.success("Dokumen berhasil diunggah.");
    } catch (err) {
      toast.error(errMsg(err, "Gagal mengunggah dokumen."));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !pendingDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
      toast.success("Dokumen berhasil dihapus.");
    } catch (err) {
      toast.error(errMsg(err, "Gagal menghapus dokumen."));
    } finally {
      setIsDeleting(false);
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
                    aria-label={`Hapus ${doc.name}`}
                    className="text-danger"
                    disabled={isDeleting}
                    onClick={() => setPendingDelete(doc)}
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

      {/* KONFIRMASI HAPUS DOKUMEN */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus dokumen ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Dokumen “{pendingDelete?.name}” akan dihapus permanen dan tidak
              dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
