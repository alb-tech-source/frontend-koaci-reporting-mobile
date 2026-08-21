"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  FileText,
  Info,
  LogOut,
  MessageCircle,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useAuthStore } from "@/shared/store/authStore";
import { userNav } from "@/features/user-area/nav";
import { logout } from "@/shared/lib/auth";

import { sendVerifyEmail } from "@/features/auth/api"; 

const menuItems: { icon: LucideIcon; label: string }[] = [
  { icon: MessageCircle, label: "Bantuan & CS" },
  { icon: FileText, label: "Kebijakan Privasi" },
  { icon: Info, label: "Tentang Koaci" },
];

function getInitials(first: string, last: string) {
  const f = first ? first.charAt(0) : "U";
  const l = last ? last.charAt(0) : "";
  return `${f}${l}`.toUpperCase();
}

export default function UserAkunPage() {
  const userState = useAuthStore((state) => state.user);
  
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // State untuk mengontrol tombol verifikasi
  const [isSending, setIsSending] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  useEffect(() => setMounted(true), []);

  const actualUser = userState?.user || userState;
  const firstName = actualUser?.firstname ?? "Pengguna";
  const lastName = actualUser?.lastname ?? "";
  const displayEmail = actualUser?.email ?? "Memuat...";

  const handleSendVerify = async () => {
    if (!displayEmail || displayEmail === "Memuat...") return;
    setIsSending(true);
    try {
      await sendVerifyEmail(displayEmail);
      setVerifySent(true);
    } catch (error) {
      console.error("Gagal mengirim email verifikasi", error);
    } finally {
      setIsSending(false);
    }
  };

  const header = (
    <div className="px-4 py-3">
      <h1 className="text-base font-semibold tracking-tight text-foreground">Akun Saya</h1>
    </div>
  );

  if (!mounted) {
    return <InvestorShell header={header} navItems={userNav}><div /></InvestorShell>;
  }

  return (
    <InvestorShell header={header} navItems={userNav}>
      <div className="space-y-5">
        <section className="flex flex-col items-center pt-1 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-brand/10 text-2xl font-bold text-brand">
            {getInitials(firstName, lastName)}
          </span>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
            {firstName} {lastName}
          </h2>
          <p className="text-sm text-muted-foreground">{displayEmail}</p>
          <Badge variant="pending" className="mt-2">
            User (Belum Terverifikasi)
          </Badge>
        </section>

        <Card className="p-4 shadow-card border border-warning/30 bg-warning/5">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Status Verifikasi</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Akun Anda perlu diverifikasi. Silakan kirim tautan verifikasi ke email Anda untuk membuka akses fitur investasi.
              </p>
              
              {verifySent ? (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-xs font-medium text-success">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p>Tautan verifikasi telah dikirim ke email Anda!</p>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3 w-full border-warning/50 text-warning-foreground hover:bg-warning/10"
                  onClick={handleSendVerify}
                  disabled={isSending || displayEmail === "Memuat..."}
                >
                  {isSending ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Mengirim...</>
                  ) : (
                    "Kirim Email Verifikasi"
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card className="divide-y divide-border p-0 shadow-card">
          {menuItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </button>
          ))}
        </Card>

        <Button variant="destructive" className="w-full" onClick={() => setShowLogoutModal(true)}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Keluar dari Akun
        </Button>
      </div>

      {/* MODAL KONFIRMASI KELUAR */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutModal(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm rounded-3xl border border-border bg-background p-6 shadow-elevated animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-destructive/10">
              <LogOut className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="text-center text-lg font-bold text-foreground">
              Keluar Akun?
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Apakah Anda yakin ingin keluar dari akun? Anda perlu masuk kembali untuk mengakses informasi investasi.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="primary"
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => logout("/")} 
              >
                Ya, Keluar
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </InvestorShell>
  );
}