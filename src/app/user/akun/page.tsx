"use client";

import { useState } from "react";
import {
  ChevronRight,
  FileText,
  Info,
  LogOut,
  MessageCircle,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { getCurrentUser, getInitials } from "@/features/user-area/auth";
import { userNav } from "@/features/user-area/nav";
import { logout } from "@/shared/lib/auth";

const menuItems: { icon: LucideIcon; label: string }[] = [
  { icon: MessageCircle, label: "Bantuan & CS" },
  { icon: FileText, label: "Kebijakan Privasi" },
  { icon: Info, label: "Tentang Koaci" },
];

export default function UserAkunPage() {
  const user = getCurrentUser() || { name: "Pengguna", email: "Memuat..." };
  
  // State untuk mengontrol visibilitas modal logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <InvestorShell navItems={userNav}>
      <div className="relative space-y-6">
        <div className="flex flex-col items-center pt-2 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-brand text-2xl font-bold text-brand-foreground shadow-elevated">
            {getInitials(user.name)}
          </span>
          <h1 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
            {user.name}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-2">
            <Badge variant="pending">User (Belum Terverifikasi)</Badge>
          </div>
        </div>

        <Card className="p-4 shadow-card">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Status Verifikasi</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Akun Anda menunggu verifikasi admin. Akses fitur investasi akan terbuka
                otomatis setelah verifikasi selesai.
              </p>
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

        <Button
          variant="outline"
          size="touch"
          onClick={() => setShowLogoutModal(true)} 
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Keluar
        </Button>
      </div>

      {/* MODAL KONFIRMASI KELUAR */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLogoutModal(false)}
            aria-hidden="true"
          />
          
          {/* Kartu Modal */}
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