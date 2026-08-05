import Link from "next/link"; 
import {
  FileText,
  Headphones,
  History,
  Wallet,
  type LucideIcon,
} from "lucide-react"; 

interface Shortcut {
  to: string;
  label: string;
  icon: LucideIcon;
  tone: "brand" | "teal" | "success" | "warning";
}

const shortcuts: Shortcut[] = [
  { to: "/portofolio", label: "Lihat Portofolio", icon: Wallet, tone: "brand" },
  { to: "/laporan", label: "Laporan Terbaru", icon: FileText, tone: "teal" },
  { to: "/riwayat", label: "Riwayat Investasi", icon: History, tone: "success" },
  { to: "/bantuan", label: "Hubungi CS", icon: Headphones, tone: "warning" },
];

const toneClass: Record<Shortcut["tone"], string> = {
  brand: "bg-brand/10 text-brand",
  teal: "bg-accent-teal/15 text-accent-teal",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export function ShortcutGrid() {
  return (
    <section aria-label="Menu cepat">
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map(({ to, label, icon: Icon, tone }) => (
          <Link 
            key={to}
            href={to} 
            className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card transition-colors hover:border-brand/40 hover:bg-accent"
          >
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass[tone]}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}