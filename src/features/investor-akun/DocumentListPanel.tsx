import { FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { InvestorDocument } from "./documents";

interface Props {
  documents: InvestorDocument[];
  onDownload: (doc: InvestorDocument) => void;
  onDelete?: (doc: InvestorDocument) => void;
}

export function DocumentListPanel({ documents, onDownload, onDelete }: Readonly<Props>) {
  if (documents.length === 0) return <p className="text-sm text-muted-foreground text-center py-4">Belum ada dokumen.</p>;

  return (
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
  );
}