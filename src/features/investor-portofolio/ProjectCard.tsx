import { ChevronRight, TrendingUp } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import type { InvestmentProject } from "./types";
import { formatIDR, statusBadgeVariant, statusLabel } from "./utils";

interface ProjectCardProps {
  project: InvestmentProject;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: Readonly<ProjectCardProps>) {
  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={onClick}
      className="flex flex-col gap-3 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">
            {project.name}
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {formatIDR(project.investmentAmount)}
          </p>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={statusBadgeVariant(project.status)}>
          {statusLabel(project.status)}
        </Badge>
        {project.returnRate ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {project.returnRate}% / thn
          </span>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress Proyek</span>
          <span className="font-semibold text-foreground">
            {project.progress}%
          </span>
        </div>
        <Progress
          value={project.progress}
          className={cn(
            "h-2",
            project.status === "pending" && "bg-warning/20",
            project.status === "cancelled" && "bg-danger/20",
          )}
          aria-label={`Progress ${project.name}: ${project.progress}%`}
        />
      </div>
    </Card>
  );
}
