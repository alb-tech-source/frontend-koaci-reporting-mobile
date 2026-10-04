import { describe, expect, it, vi } from "vitest";

import { enterVideoFullscreen } from "./fullscreen";

describe("enterVideoFullscreen", () => {
  it("memakai Fullscreen API standar jika tersedia", async () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    const webkitEnterFullscreen = vi.fn();

    await expect(
      enterVideoFullscreen({ requestFullscreen, webkitEnterFullscreen }),
    ).resolves.toBe(true);

    expect(requestFullscreen).toHaveBeenCalledOnce();
    expect(webkitEnterFullscreen).not.toHaveBeenCalled();
  });

  it("memakai API webkit di iPhone yang tidak punya requestFullscreen", async () => {
    const webkitEnterFullscreen = vi.fn();

    await expect(enterVideoFullscreen({ webkitEnterFullscreen })).resolves.toBe(true);
    expect(webkitEnterFullscreen).toHaveBeenCalledOnce();
  });

  it("jatuh ke API webkit jika Fullscreen API standar ditolak", async () => {
    const requestFullscreen = vi.fn().mockRejectedValue(new Error("denied"));
    const webkitEnterFullscreen = vi.fn();

    await expect(
      enterVideoFullscreen({ requestFullscreen, webkitEnterFullscreen }),
    ).resolves.toBe(true);
    expect(webkitEnterFullscreen).toHaveBeenCalledOnce();
  });

  it("mengembalikan false jika browser tidak mendukung layar penuh", async () => {
    await expect(enterVideoFullscreen({})).resolves.toBe(false);
    await expect(
      enterVideoFullscreen({
        webkitEnterFullscreen: () => {
          throw new Error("InvalidStateError");
        },
      }),
    ).resolves.toBe(false);
  });
});
