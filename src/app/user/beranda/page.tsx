"use client"; 

import {
  CheckCircle2,
  Clock,
  Lock,
  Shield,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  getCurrentUser,
  getInitials,
  SUPPORT_EMAIL,
  WHATSAPP_CS_URL,
} from "@/features/user-area/auth";
import { userNav } from "@/features/user-area/nav";

const highlights: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Shield,
    title: "Investasi Syariah",
    desc: "Sesuai prinsip syariah, bebas riba",
  },
  {
    icon: TrendingUp,
    title: "Imbal Hasil Kompetitif",
    desc: "Return optimal dengan risiko terukur",
  },
  {
    icon: Users,
    title: "Dipercaya Investor",
    desc: "Bergabung bersama komunitas investor",
  },
];

export default function UserBerandaPage() {
  const user = getCurrentUser() || { name: "Pengguna", verified: false };

  return (
    <InvestorShell navItems={userNav}>
      <div className="space-y-6">
        {/* Header card */}
        <Card className="relative overflow-hidden bg-gradient-brand p-5 text-brand-foreground">
          <div className="relative z-10 flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-lg font-bold backdrop-blur">
              {getInitials(user.name)}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">
                Halo, {user.name}!
              </h1>
              <div className="mt-1.5">
                <Badge variant={user.verified ? "active" : "pending"}>
                  {user.verified ? "Terverifikasi" : "Menunggu Verifikasi"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
        </Card>

        {/* Info banner */}
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4">
          <div className="flex gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-foreground">
              Akun Anda sedang dalam proses verifikasi oleh admin. Setelah diverifikasi, Anda
              dapat mengakses seluruh fitur investasi.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-3 w-full">
            <a href={WHATSAPP_CS_URL} target="_blank" rel="noreferrer">
              Hubungi CS
            </a>
          </Button>
        </div>

        {/* Kenali Koaci */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Kenali Koaci</h2>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="w-[13.5rem] shrink-0 snap-start p-4 shadow-card"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Langkah Selanjutnya */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Langkah Selanjutnya</h2>
          <Card className="divide-y divide-border p-0 shadow-card">
            <StepRow
              icon={CheckCircle2}
              tone="success"
              title="Daftar Akun"
              hint="Selesai"
            />
            <StepRow
              icon={Clock}
              tone="warning"
              title="Verifikasi Admin"
              hint="Sedang diproses"
            />
            <StepRow icon={Lock} tone="muted" title="Akses Investor" hint="Terkunci" />
          </Card>
        </section>

        <p className="pt-1 text-center text-xs text-muted-foreground">
          Butuh bantuan? hubungi kami di{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-brand hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </InvestorShell>
  );
}

function StepRow({
  icon: Icon,
  tone,
  title,
  hint,
}: Readonly<{
  icon: LucideIcon;
  tone: "success" | "warning" | "muted";
  title: string;
  hint: string;
}>) {
  const toneClass =
    tone === "success"
      ? "bg-success/10 text-success"
      : tone === "warning"
        ? "bg-warning/10 text-warning"
        : "bg-muted text-muted-foreground";

  return (
    <div className="flex items-center gap-3 p-4">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClass}`}>
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p
          className={`text-sm font-medium ${
            tone === "muted" ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}