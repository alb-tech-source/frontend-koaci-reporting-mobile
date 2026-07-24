"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useMemo, useState, Suspense } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

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
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const strength = useMemo(() => evaluateStrength(pw), [pw]);
  const mismatch = confirm.length > 0 && confirm !== pw;

  // Skenario: Token tidak ditemukan di URL
  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 text-center">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Link Tidak Valid
        </h2>
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pw || pw !== confirm || !token) return;

    setIsLoading(true);

    // TODO: [BACKEND INTEGRATION]
    // Ganti blok setTimeout ini dengan pemanggilan API sungguhan
    // try {
    //   await api.post("/auth/reset-password", { token, new_password: pw });
    //   setDone(true);
    // } catch (err) {
    //   console.error(err);
    // }
    
    // Placeholder (Simulasi loading 1 detik)
    setTimeout(() => {
      console.log("Token yang dikirim:", token);
      console.log("Password baru:", pw);
      setIsLoading(false);
      setDone(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Link
            href="/login/investor"
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">
            Buat Password Baru
          </h1>
        </header>

        <div className="flex-1 px-5 py-6">
          {!done ? (
            <>
              <p className="text-sm text-muted-foreground">
                Masukkan password baru untuk akun Anda.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rp-new">Password Baru</Label>
                  <div className="relative">
                    <Input
                      id="rp-new"
                      type={showPw ? "text" : "password"}
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Sembunyikan" : "Tampilkan"}
                      className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {pw.length > 0 && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            strength.className
                          )}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Kekuatan:{" "}
                        <span className="font-medium text-foreground">
                          {strength.label}
                        </span>
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
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
                      className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {mismatch && (
                    <p className="text-xs text-danger">
                      Password tidak cocok.
                    </p>
                  )}
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
          ) : (
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
              <Link href="/login/investor" className="w-full">
                <Button variant="primary" size="touch" className="w-full">
                  Masuk Sekarang
                </Button>
              </Link>
            </div>
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