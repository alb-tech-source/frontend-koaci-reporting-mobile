import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function AddDocumentDialog({ onUpload }: Readonly<{ onUpload: (file: File) => void }>) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="p-4 border rounded-xl mt-4 space-y-3 bg-muted/20">
      <p className="text-sm font-medium">Unggah Dokumen Baru</p>
      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button 
        variant="primary" 
        className="w-full" 
        disabled={!file} 
        onClick={() => { if (file) onUpload(file); }}
      >
        Unggah
      </Button>
    </div>
  );
}