"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { forgotPassword } from "@/features/auth/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSubmitted(true); // tampilkan state "Cek Email Anda" (UI sudah ada dari Lovable)
    } catch {
      setError("Gagal mengirim link reset. Periksa email Anda dan coba lagi.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-base font-semibold text-foreground">
            Lupa Password
          </h1>
        </header>

        <div className="flex-1 px-5 py-6">
          {!submitted ? (
            <>
              <p className="text-sm text-muted-foreground">
                Masukkan email yang terdaftar, kami akan mengirimkan link untuk
                membuat password baru.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fp-email">Email</Label>
                  <Input
                    id="fp-email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="touch"
                  className="w-full"
                >
                  Kirim Link Reset
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-8 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-brand/10 text-brand">
                <Mail className="h-9 w-9" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  Cek Email Anda
                </h2>
                <p className="text-sm text-muted-foreground">
                  Link reset password telah dikirim ke{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Silakan cek inbox atau folder spam. Link berlaku selama 1 jam.
                </p>
              </div>
              <Link href="/" className="w-full">
                <Button variant="outline" size="touch" className="w-full">
                  Kembali ke Halaman Masuk
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Tidak menerima email?{" "}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-brand hover:underline"
                >
                  Kirim ulang
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
