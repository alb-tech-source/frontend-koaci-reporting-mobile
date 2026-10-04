import { ChevronRight } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { formatDateID, formatIDR } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import type { MySettlement } from "./types";

interface SettlementCardProps {
  settlement: MySettlement;
  onClick?: () => void;
}

export function SettlementCard({
  settlement,
  onClick,
}: Readonly<SettlementCardProps>) {
  const isLoss = settlement.totalProfit < 0;

  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={onClick}
      className="flex flex-col gap-3 p-4 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">
            {settlement.projectKey}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {settlement.companyName}
          </p>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isLoss ? "cancelled" : "active"}>
          {isLoss ? "Rugi" : "Selesai"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Disetujui {formatDateID(settlement.settledAt)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Modal Disetor</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {formatIDR(settlement.principalAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Bagi Hasil</p>
          <p
            className={cn(
              "mt-0.5 text-sm font-bold",
              isLoss ? "text-danger" : "text-success",
            )}
          >
            {formatIDR(settlement.totalProfit)}
          </p>
        </div>
      </div>
    </Card>
  );
}
