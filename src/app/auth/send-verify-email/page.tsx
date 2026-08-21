"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmailToken } from "@/features/auth/api";

type State = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      setMessage("Token verifikasi tidak ditemukan.");
      return;
    }

    verifyEmailToken(token)
      .then(() => {
        setState("success");
        setMessage(
          "Email berhasil diverifikasi! Perubahan data Anda telah diterapkan.",
        );
        // Redirect ke akun setelah 3 detik
        setTimeout(() => router.push("/investor/akun"), 3000);
      })
      .catch((err) => {
        setState("error");
        setMessage(
          err?.response?.data?.message ||
            "Token tidak valid atau sudah kadaluarsa. Silakan minta verifikasi ulang.",
        );
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 text-center shadow-elevated">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand" />
            <h2 className="mt-4 text-lg font-semibold">Memverifikasi...</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mohon tunggu sebentar.
            </p>
          </>
        )}
        {state === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Berhasil!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Mengalihkan ke halaman akun...
            </p>
          </>
        )}
        {state === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-danger" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Verifikasi Gagal
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
            <button
              type="button"
              onClick={() => router.push("/investor/akun")}
              className="mt-4 text-sm text-brand hover:underline"
            >
              Kembali ke halaman akun
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
