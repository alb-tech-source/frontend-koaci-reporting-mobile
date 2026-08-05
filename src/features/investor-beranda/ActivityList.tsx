import { FileText, TrendingUp, Wallet, type LucideIcon } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { formatRelativeTime } from "@/features/investor-beranda/utils";

import type { ActivityType, BerandaActivity } from "./types";

const iconByType: Record<ActivityType, LucideIcon> = {
  profit: Wallet,
  progress: TrendingUp,
  document: FileText,
};

const toneByType: Record<ActivityType, string> = {
  profit: "bg-success/15 text-success",
  progress: "bg-brand/10 text-brand",
  document: "bg-accent-teal/15 text-accent-teal",
};

interface ActivityListProps {
  activities: BerandaActivity[];
}

export function ActivityList({ activities }: Readonly<ActivityListProps>) {
  return (
    <Card className="divide-y divide-border p-0">
      {activities.map((a) => {
        const Icon = iconByType[a.type];
        return (
          <div key={a.id} className="flex items-start gap-3 p-4">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneByType[a.type]}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {a.title}
                </p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatRelativeTime(a.timestamp)}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {a.description}
              </p>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
