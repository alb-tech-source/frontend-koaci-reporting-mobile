import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface AddDocumentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpload: (file: File) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function AddDocumentDialog({ 
  onOpenChange, 
  onUpload, 
  isSubmitting = false 
}: Readonly<AddDocumentDialogProps>) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="p-4 border border-border rounded-xl mt-4 space-y-3 bg-muted/20">
      <p className="text-sm font-semibold text-foreground">Unggah Dokumen Baru</p>
      
      <Input 
        type="file" 
        disabled={isSubmitting}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)} 
      />
      
      <div className="flex items-center gap-2 pt-2">
        {onOpenChange && (
          <Button 
            variant="outline" 
            className="w-full" 
            disabled={isSubmitting} 
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
        )}
        
        <Button 
          variant="primary" 
          className="w-full" 
          disabled={!file || isSubmitting} 
          onClick={() => { if (file) onUpload(file); }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Mengunggah...
            </>
          ) : (
            "Unggah"
          )}
        </Button>
      </div>
    </div>
  );
}