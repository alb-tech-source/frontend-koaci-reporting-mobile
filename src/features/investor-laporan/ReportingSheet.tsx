import { useQuery } from "@tanstack/react-query";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  formatDateID,
  formatFileSize,
  formatIDR,
} from "@/features/investor-portofolio/utils";
import { fetchMyReportingMedia, getReportingMediaDownloadUrl } from "./api";
import type { MyReporting, MyReportingMedia } from "./types";

interface ReportingSheetProps {
  reporting: MyReporting | null;
  isOpen: boolean;
  onClose: () => void;
}

const mediaIcon = {
  photo: ImageIcon,
  video: Video,
  document: FileText,
} as const;

export function ReportingSheet({
  reporting,
  isOpen,
  onClose,
}: Readonly<ReportingSheetProps>) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  // STATE BARU: Menyimpan status dan data untuk Modal Preview Layar Penuh
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    url: string | null;
    type: "photo" | "video" | "document" | null;
    name: string | null;
  }>({
    isOpen: false,
    isLoading: false,
    url: null,
    type: null,
    name: null,
  });

  const mediaQuery = useQuery({
    queryKey: ["investor", "reporting-media", reporting?.reportingId],
    queryFn: () => fetchMyReportingMedia(reporting!.reportingId),
    enabled: Boolean(reporting?.reportingId) && isOpen,
  });

  // Fungsi khusus untuk Unduh (Tetap ada untuk tombol panah bawah)
  const handleDownloadMedia = async (mediaId: string, mediaName: string) => {
    setDownloadingId(mediaId);
    try {
      const url = await getReportingMediaDownloadUrl(mediaId);
      if (!url) throw new Error("URL unduhan tidak valid");

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("CORS terblokir");

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = mediaName || "media";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast.error("Gagal mengunduh media.");
    } finally {
      setDownloadingId(null);
    }
  };

  // FUNGSI BARU: Khusus untuk Streaming / Preview (saat baris diklik)
  const handlePreviewMedia = async (media: MyReportingMedia) => {
    // Jika bentuknya dokumen (pdf/doc), bypass preview dan langsung unduh/buka
    if (media.mediaType === "document") {
      void handleDownloadMedia(media.mediaId, media.mediaName);
      return;
    }

    // Buka UI loading layar penuh
    setPreviewState({
      isOpen: true,
      isLoading: true,
      url: null,
      type: media.mediaType,
      name: media.mediaName,
    });

    try {
      const url = await getReportingMediaDownloadUrl(media.mediaId);
      if (!url) throw new Error("URL tidak valid");
      
      // Setelah URL didapat dari backend, berikan ke tag <video> atau <img>
      setPreviewState((prev) => ({ ...prev, isLoading: false, url }));
    } catch (err) {
      toast.error("Gagal memuat pratinjau media.");
      setPreviewState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  // Komponen Lightbox Modal (Menggunakan Portal agar melayang di atas segalanya)
  const renderPreviewModal = () => {
    if (!previewState.isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[100] mx-auto flex max-w-md flex-col bg-black">
        {/* Header Preview */}
        <div className="flex items-center justify-between p-4 text-white">
          <p className="truncate text-sm font-medium pr-4">{previewState.name}</p>
          <button 
            onClick={() => setPreviewState((prev) => ({ ...prev, isOpen: false }))}
            className="shrink-0 rounded-full bg-white/20 p-2 transition-transform hover:bg-white/30 active:scale-95"
            aria-label="Tutup pratinjau"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
          {previewState.isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" aria-hidden="true" />
          ) : previewState.type === "video" && previewState.url ? (
            <video 
              key={previewState.url}
              src={previewState.url} 
              controls 
              autoPlay 
              playsInline 
              className="max-h-full max-w-full object-contain"
            />
          ) : previewState.type === "photo" && previewState.url ? (
            <img 
              src={previewState.url} 
              alt={previewState.name ?? "Preview"} 
              className="max-h-full max-w-full object-contain"
            />
          ) : null}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[88vh] pb-safe">
          {reporting ? (
            <>
              <DrawerHeader className="text-left">
                <DrawerTitle>{reporting.projectKey}</DrawerTitle>
                <p className="text-sm text-muted-foreground">
                  {reporting.companyName}
                </p>
              </DrawerHeader>

              <div className="space-y-5 overflow-y-auto px-4 pb-8">
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-muted-foreground">
                      Progress Proyek
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      {reporting.estimateProgress}%
                    </span>
                  </div>
                  <Progress value={reporting.estimateProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Tanggal Laporan"
                    value={formatDateID(reporting.reportDate)}
                  />
                  <InfoBox
                    label="Dana Tersalurkan"
                    value={formatIDR(reporting.fundDisbursed, { compact: true })}
                  />
                </div>

                <ReportingTextBlocks reporting={reporting} />

                {reporting.mediaCount > 0 && (
                  <MediaSection 
                    mediaQuery={mediaQuery} 
                    downloadingId={downloadingId} 
                    handleDownloadMedia={handleDownloadMedia}
                    handlePreviewMedia={handlePreviewMedia} // Melempar fungsi baru ke bawah
                  />
                )}
              </div>
            </>
          ) : null}
        </DrawerContent>
      </Drawer>

      {/* Eksekusi Portal di akhir file agar melayang di atas segalanya */}
      {renderPreviewModal()}
    </>
  );
}

function ReportingTextBlocks({ reporting }: Readonly<{ reporting: MyReporting }>) {
  return (
    <>
      <TextBlock title="Narasi Ringkasan" body={reporting.narrativeSummary} />
      {reporting.issuesBlockers && <TextBlock title="Kendala & Hambatan" body={reporting.issuesBlockers} />}
      {reporting.nextWeekPlan && <TextBlock title="Rencana Minggu Depan" body={reporting.nextWeekPlan} />}
    </>
  );
}

function MediaSection({
  mediaQuery,
  downloadingId,
  handleDownloadMedia,
  handlePreviewMedia,
}: Readonly<{
  mediaQuery: { isLoading: boolean; data?: MyReportingMedia[] | null };
  downloadingId: string | null;
  handleDownloadMedia: (mediaId: string, mediaName: string) => Promise<void> | void;
  handlePreviewMedia: (media: MyReportingMedia) => void;
}>) {
  let mediaContent;

  if (mediaQuery.isLoading) {
    mediaContent = (
      <div className="space-y-2">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    );
  } else if (mediaQuery.data && mediaQuery.data.length > 0) {
    mediaContent = (
      <ul className="space-y-2">
        {mediaQuery.data.map((media) => (
          <MediaRow
            key={media.mediaId}
            media={media}
            isDownloading={downloadingId === media.mediaId}
            onPreview={() => handlePreviewMedia(media)} 
            onDownload={() => void handleDownloadMedia(media.mediaId, media.mediaName)}
          />
        ))}
      </ul>
    );
  } else {
    mediaContent = <p className="text-sm text-muted-foreground">Media belum tersedia.</p>;
  }

  return (
    <>
      <Separator />
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Media Pendukung</p>
        {mediaContent}
      </div>
    </>
  );
}

function InfoBox({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function TextBlock({ title, body }: Readonly<{ title: string; body: string }>) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="rounded-xl bg-muted p-3 text-sm leading-relaxed text-muted-foreground">
        {body || "—"}
      </div>
    </div>
  );
}

function MediaRow({
  media,
  isDownloading,
  onPreview,
  onDownload,
}: Readonly<{
  media: MyReportingMedia;
  isDownloading: boolean;
  onPreview: () => void;
  onDownload: () => void;
}>) {
  const Icon = mediaIcon[media.mediaType] ?? FileText;
  return (
    <li 
      onClick={onPreview}
      // UI diubah menjadi interaktif (cursor pointer, hover, active state)
      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50 active:bg-muted"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {media.mediaName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(media.fileSizeBytes)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Unduh ${media.mediaName}`}
        disabled={isDownloading}
        onClick={(e) => {
          // Menghentikan aksi klik menyebar ke <li> agar Modal tidak ikut terbuka saat mengunduh
          e.stopPropagation();
          onDownload();
        }}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </li>
  );
}