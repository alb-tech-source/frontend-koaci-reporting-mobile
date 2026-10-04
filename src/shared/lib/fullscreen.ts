// iPhone Safari tidak punya Fullscreen API untuk elemen; <video> memakai API webkit ini
type FullscreenCapableVideo = {
  requestFullscreen?: () => Promise<void>;
  webkitEnterFullscreen?: () => void;
};

/** Mengembalikan false jika browser tidak bisa menampilkan video dalam layar penuh. */
export async function enterVideoFullscreen(
  video: FullscreenCapableVideo,
): Promise<boolean> {
  if (typeof video.requestFullscreen === "function") {
    try {
      await video.requestFullscreen();
      return true;
    } catch {
      // lanjut ke fallback webkit
    }
  }

  if (typeof video.webkitEnterFullscreen === "function") {
    try {
      video.webkitEnterFullscreen();
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
