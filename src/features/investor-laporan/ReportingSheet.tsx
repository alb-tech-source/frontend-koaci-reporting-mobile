import { useQuery } from "@tanstack/react-query";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Video,
} from "lucide-react";
import { useState } from "react";
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
import { downloadFromUrl } from "@/shared/lib/download";
import {
  formatCalendarDateID,
  formatFileSize,
  formatIDR,
} from "@/shared/lib/format";
import { fetchMyReportingMedia, getReportingMediaDownloadUrl } from "./api";
import { MediaPreviewDialog } from "./MediaPreviewDialog";
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
  const [previewMedia, setPreviewMedia] = useState<MyReportingMedia | null>(null);

  const mediaQuery = useQuery({
    queryKey: ["investor", "reporting-media", reporting?.reportingId],
    queryFn: () => fetchMyReportingMedia(reporting!.reportingId),
    enabled: Boolean(reporting?.reportingId) && isOpen,
  });

  const handleDownloadMedia = async (mediaId: string, mediaName: string) => {
    setDownloadingId(mediaId);
    try {
      const url = await getReportingMediaDownloadUrl(mediaId);
      if (!url) throw new Error("URL unduhan tidak valid");

      await downloadFromUrl(url, mediaName || "media");
    } catch {
      toast.error("Gagal mengunduh media.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Foto dan video dibuka di pratinjau; dokumen (pdf/doc) langsung diunduh
  const handlePreviewMedia = (media: MyReportingMedia) => {
    if (media.mediaType === "document") {
      void handleDownloadMedia(media.mediaId, media.mediaName);
      return;
    }
    setPreviewMedia(media);
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
                    value={formatCalendarDateID(reporting.reportDate)}
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
                    handlePreviewMedia={handlePreviewMedia}
                  />
                )}
              </div>
            </>
          ) : null}
        </DrawerContent>
      </Drawer>

      <MediaPreviewDialog
        media={previewMedia}
        isDownloading={previewMedia !== null && downloadingId === previewMedia.mediaId}
        onDownload={(media) => void handleDownloadMedia(media.mediaId, media.mediaName)}
        onClose={() => setPreviewMedia(null)}
      />
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