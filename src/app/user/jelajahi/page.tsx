"use client"; 

import { Clock3, TrendingUp } from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { publicProducts } from "@/features/user-area/api";
import { userNav } from "@/features/user-area/nav";

export default function UserJelajahiPage() {
  return (
    <InvestorShell navItems={userNav}>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Jelajahi Produk
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Produk investasi yang tersedia di Koaci
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {publicProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden p-0 shadow-card">
              <div className="h-1.5 w-full bg-accent-teal" />
              <div className="space-y-2 p-3.5">
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {product.name}
                </p>
                <Badge variant="info">{product.scheme}</Badge>
                <div className="space-y-1 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {product.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {product.returnRange}
                  </span>
                </div>
                <span className="group relative inline-block pt-1">
                  <button
                    type="button"
                    disabled
                    title="Tersedia setelah verifikasi"
                    className="cursor-not-allowed text-xs font-medium text-muted-foreground"
                  >
                    Pelajari lebih lanjut
                  </button>
                  <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background group-hover:block">
                    Tersedia setelah verifikasi
                  </span>
                </span>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Data bersifat ilustratif. Detail lengkap tersedia setelah akun Anda diverifikasi.
        </p>
      </div>
    </InvestorShell>
  );
}