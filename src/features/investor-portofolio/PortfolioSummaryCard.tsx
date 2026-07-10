import { Briefcase, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatIDR } from "./utils";

interface PortfolioSummaryCardProps {
  investorName: string;
  totalActiveInvestment: number;
  activeProjects: number;
}

export function PortfolioSummaryCard({
  investorName,
  totalActiveInvestment,
  activeProjects,
}: PortfolioSummaryCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-brand p-5 text-brand-foreground">
      <div className="relative z-10">
        <p className="text-sm font-medium text-brand-foreground/90">
          Halo, {investorName}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          Portofolio Saya
        </h1>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-brand-foreground/90">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Total Investasi Aktif
            </div>
            <p className="mt-1 text-lg font-bold tracking-tight">
              {formatIDR(totalActiveInvestment, { compact: true })}
            </p>
          </div>

          <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-brand-foreground/90">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              Jumlah Proyek
            </div>
            <p className="mt-1 text-lg font-bold tracking-tight">
              {activeProjects} Proyek
            </p>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
    </Card>
  );
}
