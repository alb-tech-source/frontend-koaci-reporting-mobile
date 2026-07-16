"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, FileText, User, type LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export interface BottomNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const defaultInvestorNav: BottomNavItem[] = [
  { to: "/", label: "Login", icon: Home },
  { to: "/investor/portofolio", label: "Portofolio", icon: Wallet },
  { to: "/investor/laporan", label: "Laporan", icon: FileText },
  { to: "/investor/akun", label: "Akun", icon: User },
];

interface BottomNavProps {
  items?: BottomNavItem[];
}

export function BottomNav({ items = defaultInvestorNav }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active
                  ? "text-brand"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn("h-5 w-5", active && "stroke-[2.4]")}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
