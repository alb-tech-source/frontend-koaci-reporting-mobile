import { ChevronRight } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import type { MyInvestment } from "./types";
import { formatIDR, statusBadgeVariant, statusLabel } from "./utils";

interface ProjectCardProps {
  investment: MyInvestment;
  onClick?: () => void;
}

export function ProjectCard({
  investment,
  onClick,
}: Readonly<ProjectCardProps>) {
  const progress = investment.latestProgress ?? 0;

  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={onClick}
      className="flex flex-col gap-3 p-4 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">
            {investment.projectKey}
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatIDR(investment.amount)}
          </p>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={statusBadgeVariant(investment.projectStatus)}>
          {statusLabel(investment.projectStatus)}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Persentase Dana Terkumpul</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <Progress
          value={progress}
          className={cn(
            "h-2",
            String(investment.projectStatus).toLowerCase() === "pending" &&
              "bg-warning/20",
            String(investment.projectStatus).toLowerCase() === "cancelled" &&
              "bg-danger/20",
          )}
          aria-label={`Persentase Dana Terkumpul ${investment.projectKey}: ${progress}%`}
        />
      </div>
    </Card>
  );
}