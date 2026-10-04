"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmailToken } from "@/features/auth/api";
import { accountPathForRole, establishSession } from "@/features/auth/session";
import { getErrorMessage } from "@/shared/lib/axios";
import { useAuthStore } from "@/shared/store/authStore";

type Result = { state: "success" | "error"; message: string };

const REDIRECT_DELAY_MS = 3000;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    verifyEmailToken(token)
      .then(async () => {
        // Link bisa dibuka di browser tanpa sesi; sinkronkan hanya jika sedang login
        let nextPath = "/";
        if (useAuthStore.getState().isAuthenticated) {
          try {
            nextPath = accountPathForRole(await establishSession());
          } catch (syncError) {
            console.error("Gagal sinkronisasi profil terbaru", syncError);
          }
        }
        if (cancelled) return;

        setResult({ state: "success", message: "Email berhasil diverifikasi!" });
        redirectTimer = setTimeout(() => router.push(nextPath), REDIRECT_DELAY_MS);
      })
      .catch((err) => {
        if (cancelled) return;
        setResult({
          state: "error",
          message: getErrorMessage(
            err,
            "Token tidak valid atau sudah kadaluarsa. Silakan minta verifikasi ulang.",
          ),
        });
      });

    return () => {
      cancelled = true;
      clearTimeout(redirectTimer);
    };
  }, [token, router]);

  let view: Result | { state: "loading"; message: "" };
  if (!token) {
    view = { state: "error", message: "Token verifikasi tidak ditemukan." };
  } else {
    view = result ?? { state: "loading", message: "" };
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 text-center shadow-elevated">
        {view.state === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand" />
            <h2 className="mt-4 text-lg font-semibold">Memverifikasi...</h2>
            <p className="mt-1 text-sm text-muted-foreground">Mohon tunggu sebentar.</p>
          </>
        )}
        {view.state === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">Berhasil!</h2>
            <p className="mt-1 text-sm text-muted-foreground">{view.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">Mengalihkan ke aplikasi...</p>
          </>
        )}
        {view.state === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-danger" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">Verifikasi Gagal</h2>
            <p className="mt-1 text-sm text-muted-foreground">{view.message}</p>
            <button
              type="button"
              onClick={() =>
                router.push(accountPathForRole(useAuthStore.getState().user?.role))
              }
              className="mt-4 text-sm text-brand hover:underline"
            >
              Kembali ke aplikasi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/40" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
