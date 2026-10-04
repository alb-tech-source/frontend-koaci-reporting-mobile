import Link from "next/link";
import {
  FileText,
  Headphones,
  History,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { WHATSAPP_CS_URL } from "@/shared/lib/support";

interface Shortcut {
  to: string;
  label: string;
  icon: LucideIcon;
  tone: "brand" | "teal" | "success" | "warning";
  external?: boolean;
}

const shortcuts: Shortcut[] = [
  { to: "/investor/portofolio", label: "Lihat Portofolio", icon: Wallet, tone: "brand" },
  { to: "/investor/laporan", label: "Laporan Terbaru", icon: FileText, tone: "teal" },
  { to: "/investor/riwayat", label: "Riwayat Investasi", icon: History, tone: "success" },
  { to: WHATSAPP_CS_URL, label: "Hubungi CS", icon: Headphones, tone: "warning", external: true },
];

const toneClass: Record<Shortcut["tone"], string> = {
  brand: "bg-brand/10 text-brand",
  teal: "bg-accent-teal/15 text-accent-teal",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

const cardClass =
  "flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-colors hover:border-brand/40 hover:bg-accent";

export function ShortcutGrid() {
  return (
    <section aria-label="Menu cepat">
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map(({ to, label, icon: Icon, tone, external }) => {
          const content = (
            <>
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass[tone]}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </>
          );

          return external ? (
            <a key={to} href={to} target="_blank" rel="noreferrer" className={cardClass}>
              {content}
            </a>
          ) : (
            <Link key={to} href={to} className={cardClass}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
