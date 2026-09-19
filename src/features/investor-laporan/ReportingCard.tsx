import { ChevronRight, Image as ImageIcon } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { formatDateID } from "@/features/investor-portofolio/utils";
import type { MyReporting } from "./types";

interface ReportingCardProps {
  reporting: MyReporting;
  onClick?: () => void;
}

export function ReportingCard({ reporting, onClick }: Readonly<ReportingCardProps>) {
  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={onClick}
      className="flex flex-col gap-3 p-4 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {reporting.projectKey}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Laporan {formatDateID(reporting.reportDate)}
          </p>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      {reporting.mediaCount > 0 ? (
        <div className="flex items-center">
          <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full bg-brand/10 text-brand hover:bg-brand/20">
            {reporting.mediaCount} media
          </Badge>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress Tersalurkan</span>
          <span className="font-semibold text-foreground">
            {reporting.estimateProgress}%
          </span>
        </div>
        <Progress
          value={reporting.estimateProgress}
          className="h-2"
          aria-label={`Progress ${reporting.projectKey}: ${reporting.estimateProgress}%`}
        />
      </div>
    </Card>
  );
}