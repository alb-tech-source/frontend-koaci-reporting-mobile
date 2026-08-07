"use client";

import { BookOpen, Globe, MessageCircle, ShieldCheck } from "lucide-react";
import { InvestorAuthCard } from "@/features/auth/InvestorAuthCard"; 

const quickLinks = [
  { icon: MessageCircle, label: "Bantuan", hint: "WhatsApp CS" },
  { icon: BookOpen, label: "Panduan", hint: "Cara mulai" },
  { icon: Globe, label: "koaci.id", hint: "Website resmi" },
];

export default function MobileLoginPage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-brand pb-24 pt-12 text-brand-foreground">
          {/* Decorative blobs */}
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-accent-teal/30 blur-2xl" />
          
          <div className="relative px-6">
            {/* Logo "K" */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-elevated backdrop-blur">
              <span className="text-3xl font-bold tracking-tight text-brand-foreground">K</span>
            </div>
            
            <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight">Koaci Investor</h1>
            <p className="mt-1 text-center text-sm text-brand-foreground/80">
              Pantau investasi syariah Anda dengan tenang
            </p>
            
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-brand-foreground/85">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Aman &amp; sesuai prinsip syariah</span>
            </div>
          </div>

          {/* Curved bottom */}
          <svg aria-hidden="true" viewBox="0 0 500 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full text-background">
            <path d="M0,60 C150,0 350,0 500,60 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Card & Content Section */}
        <div className="relative -mt-14 flex-1 px-5 pb-8">
          
          {/* 2. PANGGIL KOMPONEN KARTU DI SINI (Menggantikan form lama) */}
          <InvestorAuthCard />

          {/* Quick links */}
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

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Versi 1.0 · © {new Date().getFullYear()} Koaci
          </p>
          
        </div>
      </div>
    </div>
  );
}