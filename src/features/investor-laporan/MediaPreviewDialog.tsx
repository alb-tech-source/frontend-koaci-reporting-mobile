import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Maximize, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { enterVideoFullscreen } from "@/shared/lib/fullscreen";
import { fetchReportingMediaStream } from "./api";
import type { MyReportingMedia } from "./types";

interface MediaPreviewDialogProps {
  media: MyReportingMedia | null;
  isDownloading: boolean;
  onDownload: (media: MyReportingMedia) => void;
  onClose: () => void;
}

// URL stream berlaku 4 jam; dipakai ulang selama 1 jam sebelum diminta lagi
const STREAM_URL_FRESH_MS = 60 * 60 * 1000;

const iconButtonClass =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25 disabled:opacity-50";

// Tidak semua browser memutar semua format (mis. MKV di Safari/iOS)
function canPlayMimeType(mimeType: string): boolean {
  if (!mimeType) return true;
  return document.createElement("video").canPlayType(mimeType) !== "";
}

/**
 * Pratinjau foto/video layar penuh. Dibuat sebagai dialog modal tersendiri agar
 * tetap interaktif di atas drawer laporan: elemen biasa di luar drawer modal
 * tidak menerima klik selama drawer terbuka.
 */
export function MediaPreviewDialog({
  media,
  isDownloading,
  onDownload,
  onClose,
}: Readonly<MediaPreviewDialogProps>) {
  return (
    <DialogPrimitive.Root
      open={media !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[100] flex flex-col bg-black text-white outline-none"
        >
          {media ? (
            <PreviewBody
              key={media.mediaId}
              media={media}
              isDownloading={isDownloading}
              onDownload={() => onDownload(media)}
            />
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function PreviewBody({
  media,
  isDownloading,
  onDownload,
}: Readonly<{
  media: MyReportingMedia;
  isDownloading: boolean;
  onDownload: () => void;
}>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resumeAt = useRef(0);
  const isRecovering = useRef(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);

  const streamQuery = useQuery({
    queryKey: ["investor", "reporting-media-stream", media.mediaId],
    queryFn: () => fetchReportingMediaStream(media.mediaId),
    staleTime: STREAM_URL_FRESH_MS,
  });
  const stream = streamQuery.data;

  const isVideo = media.mediaType === "video";
  const isPlayableVideo =
    isVideo && Boolean(stream) && !playbackFailed && canPlayMimeType(stream?.mimeType ?? "");

  // Kemungkinan URL kedaluwarsa (403 dari storage) saat video lama dijeda:
  // minta URL baru satu kali, lalu lanjutkan dari posisi terakhir.
  const handleVideoError = () => {
    if (isRecovering.current) {
      setPlaybackFailed(true);
      return;
    }
    isRecovering.current = true;
    resumeAt.current = videoRef.current?.currentTime ?? 0;
    void streamQuery.refetch().then((result) => {
      if (result.isError) setPlaybackFailed(true);
    });
  };

  const handleLoadedMetadata = () => {
    if (resumeAt.current > 0 && videoRef.current) {
      videoRef.current.currentTime = resumeAt.current;
    }
    resumeAt.current = 0;
  };

  const handleFullscreen = async () => {
    if (!videoRef.current) return;
    const entered = await enterVideoFullscreen(videoRef.current);
    if (!entered) toast.error("Layar penuh tidak didukung di browser ini.");
  };

  let content: ReactNode;
  if (streamQuery.isLoading) {
    content = <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />;
  } else if (!stream) {
    content = (
      <Notice message="Gagal memuat pratinjau media.">
        <NoticeButton onClick={() => void streamQuery.refetch()}>Coba Lagi</NoticeButton>
      </Notice>
    );
  } else if (isVideo && !isPlayableVideo) {
    content = (
      <Notice message="Video ini tidak bisa diputar di browser Anda. Unduh untuk menontonnya.">
        <NoticeButton onClick={onDownload} disabled={isDownloading}>
          Unduh Video
        </NoticeButton>
      </Notice>
    );
  } else if (isVideo) {
    content = (
      <video
        key={stream.url}
        ref={videoRef}
        src={stream.url}
        controls
        autoPlay
        playsInline
        preload="metadata"
        onError={handleVideoError}
        onLoadedMetadata={handleLoadedMetadata}
        onPlaying={() => {
          isRecovering.current = false;
        }}
        className="h-full w-full object-contain"
      />
    );
  } else {
    content = (
      // URL presigned dari storage; tidak bisa lewat optimizer next/image
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={stream.url}
        alt={media.mediaName || "Pratinjau"}
        className="max-h-full max-w-full object-contain"
      />
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 p-3">
        <DialogPrimitive.Title className="min-w-0 flex-1 truncate text-sm font-medium">
          {media.mediaName}
        </DialogPrimitive.Title>
        {isPlayableVideo ? (
          <button
            type="button"
            onClick={() => void handleFullscreen()}
            className={iconButtonClass}
            aria-label="Layar penuh"
          >
            <Maximize className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className={iconButtonClass}
          aria-label={`Unduh ${media.mediaName}`}
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <DialogPrimitive.Close className={iconButtonClass} aria-label="Tutup pratinjau">
          <X className="h-5 w-5" aria-hidden="true" />
        </DialogPrimitive.Close>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center pb-[env(safe-area-inset-bottom)]">
        {content}
      </div>
    </>
  );
}

function Notice({
  message,
  children,
}: Readonly<{ message: string; children: ReactNode }>) {
  return (
    <div className="flex max-w-xs flex-col items-center gap-4 px-6 text-center">
      <p className="text-sm text-white/80">{message}</p>
      {children}
    </div>
  );
}

function NoticeButton({
  children,
  ...props
}: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      type="button"
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
