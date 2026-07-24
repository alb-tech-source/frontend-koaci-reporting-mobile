"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Globe, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { KoaciLogo } from "@/shared/components/KoaciLogo";
import { LoginForm, type LoginFormValues } from "@/features/auth/LoginForm";
import { jwtDecode } from "jwt-decode";
import api from "@/shared/lib/axios";

interface JwtPayload {
  role : string;
  [key: string]: unknown;
}

const quickLinks = [
  { icon: MessageCircle, label: "Bantuan", hint: "WhatsApp CS" },
  { icon: BookOpen, label: "Panduan", hint: "Cara mulai" },
  { icon: Globe, label: "koaci.id", hint: "Website resmi" },
];

export default function InvestorLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin({ email, password }: LoginFormValues) {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const { accessToken, refreshToken } = data.data.tokens;

      const decodedToken = jwtDecode<JwtPayload>(accessToken);
      if (decodedToken.role !== "investor") {
        setError("Anda tidak memiliki akses sebagai investor. Silakan gunakan akun yang sesuai.");
        return;
      } 

      document.cookie = `access_token=${accessToken}; path=/; max-age=86400`;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      router.push("/investor/portofolio");

    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 401) {
        setError("Email atau password salah.");
      } else {
        setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-background">
        <div className="relative bg-gradient-brand pb-24 pt-12 text-brand-foreground">
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-accent-teal/30 blur-2xl" />
          <div className="relative flex flex-col items-center px-6">
            <KoaciLogo size="lg" className="flex-col text-brand-foreground" />
            <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight">Koaci Investor</h1>
            <p className="mt-1 text-center text-sm text-brand-foreground/80">
              Pantau investasi syariah Anda dengan tenang
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-brand-foreground/85">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Aman &amp; sesuai prinsip syariah</span>
            </div>
          </div>
          <svg aria-hidden="true" viewBox="0 0 500 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full text-background">
            <path d="M0,60 C150,0 350,0 500,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative -mt-14 flex-1 px-5 pb-8">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground">Selamat datang kembali</p>
            </div>
            <LoginForm variant="investor" loading={loading} errorMessage={error} onSubmit={handleLogin} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {quickLinks.map(({ icon: Icon, label, hint }) => (
              <button key={label} type="button" className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-card transition-colors hover:border-brand/40 hover:bg-accent">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium text-foreground">{label}</span>
                <span className="text-[10px] text-muted-foreground">{hint}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}