import { Briefcase, TrendingUp } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { formatIDR } from "@/features/investor-portofolio/utils";

interface BerandaSummaryCardProps {
  totalActiveInvestment: number;
  activeProjects: number;
}

export function BerandaSummaryCard({
  totalActiveInvestment,
  activeProjects,
}: Readonly<BerandaSummaryCardProps>) {
  return (
    <Card className="relative overflow-hidden bg-gradient-brand p-5 text-brand-foreground">
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-foreground/80">
          Total Investasi Aktif
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight">
          {formatIDR(totalActiveInvestment, { compact: true })}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-brand-foreground/90">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            {activeProjects} Proyek Aktif
          </span>
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Imbal hasil syariah
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
    </Card>
  );
}
