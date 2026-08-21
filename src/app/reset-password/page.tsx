"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useMemo, useState, Suspense } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { resetPassword } from "@/features/auth/api";

type Strength = { score: 0 | 1 | 2 | 3; label: string; className: string };

function evaluateStrength(pw: string): Strength {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length === 0) return { score: 0, label: "", className: "" };
  if (score <= 1)
    return { score: 1, label: "Lemah", className: "bg-danger w-1/3" };
  if (score === 2)
    return { score: 2, label: "Sedang", className: "bg-warning w-2/3" };
  return { score: 3, label: "Kuat", className: "bg-success w-full" };
}

// Komponen Logika Utama
async function handleResetPasswordSubmit(
  e: React.FormEvent<HTMLFormElement>,
  token: string,
  pw: string,
  confirm: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setDone: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.preventDefault();
  if (!pw || pw !== confirm || !token) return;

  setIsLoading(true);
  setError("");

  try {
    await resetPassword(token, pw);
    setDone(true);
  } catch (err: any) {
    if (err?.response?.status === 400) {
      setError("Link sudah kedaluwarsa atau tidak valid. Minta link baru.");
    } else {
      setError("Gagal mengubah password. Silakan coba lagi.");
    }
  } finally {
    setIsLoading(false);
  }
}

function InvalidTokenNotice() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-danger/10 text-danger">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Link Tidak Valid</h2>
      <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
        Link reset password tidak valid atau sudah kedaluwarsa. Silakan minta
        ulang link reset password Anda.
      </p>
      <Link href="/login/lupa-password">
        <Button variant="outline" size="touch">
          Kembali ke Lupa Password
        </Button>
      </Link>
    </div>
  );
}

function ResetPasswordSuccess() {
  return (
    <div className="flex flex-col items-center gap-4 pt-8 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
        <Check className="h-10 w-10" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        Password berhasil diperbarui
      </h2>
      <p className="text-sm text-muted-foreground">
        Silakan masuk kembali dengan password baru Anda.
      </p>
      <Link href="/" className="w-full">
        <Button variant="primary" size="touch" className="w-full">
          Masuk Sekarang
        </Button>
      </Link>
    </div>
  );
}

type ResetPasswordFormProps = {
  pw: string;
  confirm: string;
  showPw: boolean;
  showConfirm: boolean;
  strength: Strength;
  mismatch: boolean;
  isLoading: boolean;
  error: string;
  onPwChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onToggleShowPw: () => void;
  onToggleShowConfirm: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
};

function ResetPasswordForm({
  pw,
  confirm,
  showPw,
  showConfirm,
  strength,
  mismatch,
  isLoading,
  error,
  onPwChange,
  onConfirmChange,
  onToggleShowPw,
  onToggleShowConfirm,
  onSubmit,
}: Readonly<ResetPasswordFormProps>) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Masukkan password baru untuk akun Anda.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-danger bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rp-new">Password Baru</Label>
          <div className="relative">
            <Input
              id="rp-new"
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => onPwChange(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={onToggleShowPw}
              aria-label={showPw ? "Sembunyikan" : "Tampilkan"}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {pw.length > 0 && (
            <div className="space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full transition-all", strength.className)} />
              </div>
              <p className="text-xs text-muted-foreground">
                Kekuatan:{" "}
                <span className="font-medium text-foreground">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rp-confirm">Konfirmasi Password Baru</Label>
          <div className="relative">
            <Input
              id="rp-confirm"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => onConfirmChange(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={onToggleShowConfirm}
              aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {mismatch && <p className="text-xs text-danger">Password tidak cocok.</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="touch"
          className="w-full"
          disabled={!pw || pw !== confirm || isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
        </Button>
      </form>
    </>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => evaluateStrength(pw), [pw]);
  const mismatch = confirm.length > 0 && confirm !== pw;

  if (!token) {
    return <InvalidTokenNotice />;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Link
            href="/"
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">Buat Password Baru</h1>
        </header>

        <div className="flex-1 px-5 py-6">
          {!done ? (
            <ResetPasswordForm
              pw={pw}
              confirm={confirm}
              showPw={showPw}
              showConfirm={showConfirm}
              strength={strength}
              mismatch={mismatch}
              isLoading={isLoading}
              error={error}
              onPwChange={setPw}
              onConfirmChange={setConfirm}
              onToggleShowPw={() => setShowPw((s) => !s)}
              onToggleShowConfirm={() => setShowConfirm((s) => !s)}
              onSubmit={(e) =>
                handleResetPasswordSubmit(
                  e,
                  token,
                  pw,
                  confirm,
                  setError,
                  setDone,
                  setIsLoading
                )
              }
            />
          ) : (
            <ResetPasswordSuccess />
          )}
        </div>
      </div>
    </div>
  );
}

// Komponen Utama (Wrapper Suspense)
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/40 text-sm text-muted-foreground">
          Memuat halaman...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}