import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Separator } from "@/shared/components/ui/separator";
import { formatDateID, formatIDR, formatPercent } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import type { MySettlement } from "./types";

interface SettlementSheetProps {
  settlement: MySettlement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SettlementSheet({
  settlement,
  isOpen,
  onClose,
}: Readonly<SettlementSheetProps>) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[88vh] pb-safe">
        {settlement ? (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle>{settlement.projectKey}</DrawerTitle>
              <p className="text-sm text-muted-foreground">
                {settlement.companyName}
              </p>
            </DrawerHeader>

            <div className="space-y-5 overflow-y-auto px-4 pb-8">
              <div className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">Total Bagi Hasil</p>
                <p
                  className={cn(
                    "mt-0.5 text-2xl font-bold",
                    settlement.totalProfit < 0 ? "text-danger" : "text-success",
                  )}
                >
                  {formatIDR(settlement.totalProfit)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Disetujui {formatDateID(settlement.settledAt)}
                </p>
              </div>

              <section className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Bagian Anda</p>
                <Row
                  label="Modal yang disetor"
                  value={formatIDR(settlement.principalAmount)}
                />
                <Row
                  label="Porsi modal"
                  value={formatPercent(settlement.modalPortionPct)}
                />
                <Row
                  label="Bagi hasil"
                  value={formatIDR(settlement.profitShareAmount)}
                  negative={settlement.profitShareAmount < 0}
                />
                <Row
                  label={`Kompensasi (${formatPercent(settlement.compensationPct)})`}
                  value={formatIDR(settlement.compensationAmount)}
                />
                <Separator />
                <Row
                  label="Total bagi hasil"
                  value={formatIDR(settlement.totalProfit)}
                  negative={settlement.totalProfit < 0}
                  strong
                />
              </section>

              <Separator />

              <section className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Ringkasan Proyek
                </p>
                <Row label="Model keuntungan" value={settlement.profitModel || "—"} />
                <Row
                  label="Total modal proyek"
                  value={formatIDR(settlement.totalCapital)}
                />
                <Row label="Penjualan" value={formatIDR(settlement.salesAmount)} />
                <Row
                  label="Laba bersih"
                  value={formatIDR(settlement.netProfitMargin)}
                  negative={settlement.netProfitMargin < 0}
                />
                <Row
                  label={`Porsi seluruh investor (${formatPercent(settlement.investorPortionPct)})`}
                  value={formatIDR(settlement.investorPortionAmount)}
                  negative={settlement.investorPortionAmount < 0}
                />
              </section>
            </div>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

function Row({
  label,
  value,
  negative = false,
  strong = false,
}: Readonly<{
  label: string;
  value: string;
  negative?: boolean;
  strong?: boolean;
}>) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right capitalize",
          strong ? "font-bold" : "font-medium",
          negative ? "text-danger" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
