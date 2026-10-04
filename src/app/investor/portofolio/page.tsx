"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, UserRound } from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { ClientOnly } from "@/shared/components/ClientOnly";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { emptyListFilter, matchesListFilter } from "@/shared/lib/list-filter";

import { PortfolioSummaryCard } from "@/features/investor-portofolio/PortfolioSummaryCard";
import {
  computeSettlementSummary,
  fetchMySettlements,
  ProfileRequiredError,
} from "@/features/investor-settlement/api";
import { SettlementCard } from "@/features/investor-settlement/SettlementCard";
import { SettlementSheet } from "@/features/investor-settlement/SettlementSheet";
import type { MySettlement } from "@/features/investor-settlement/types";
import { useAuthStore } from "@/shared/store/authStore";

function PortofolioContent() {
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState(emptyListFilter);
  const [selected, setSelected] = useState<MySettlement | null>(null);

  const { data: settlements, isLoading, error, refetch } = useQuery({
    queryKey: ["investor", "my-settlements"],
    queryFn: fetchMySettlements,
    // Profil yang belum lengkap tidak akan berubah dengan mencoba ulang
    retry: (failureCount, err) =>
      !(err instanceof ProfileRequiredError) && failureCount < 1,
  });

  const summary = useMemo(
    () => (settlements ? computeSettlementSummary(settlements) : undefined),
    [settlements],
  );
  const investorName =
    `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Investor";

  const uniqueProjects = useMemo(() => {
    if (!settlements) return [];
    return [...new Set(settlements.map((s) => s.projectKey))];
  }, [settlements]);

  const filteredSettlements = useMemo(() => {
    if (!settlements) return [];
    return settlements.filter((s) =>
      matchesListFilter(
        { projectKey: s.projectKey, companyName: s.companyName, date: s.settledAt },
        filter,
      ),
    );
  }, [settlements, filter]);

  const header = (
    <div className="px-4 py-3">
      <h1 className="text-lg font-semibold">Portofolio Saya</h1>
    </div>
  );

  if (isLoading) {
    return (
      <InvestorShell header={header}>
        <div className="space-y-4 px-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </InvestorShell>
    );
  }

  if (error instanceof ProfileRequiredError) {
    return (
      <InvestorShell header={header}>
        <Card className="flex flex-col items-center gap-3 p-8 text-center m-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button asChild variant="primary" size="touch">
            <Link href="/investor/akun">Lengkapi Profil</Link>
          </Button>
        </Card>
      </InvestorShell>
    );
  }

  if (error || !settlements || !summary) {
    return (
      <InvestorShell header={header}>
        <Card className="flex flex-col items-center gap-3 p-8 text-center m-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">Gagal memuat portofolio.</p>
          <Button variant="outline" size="touch" onClick={() => void refetch()}>Coba Lagi</Button>
        </Card>
      </InvestorShell>
    );
  }

  let list;
  if (settlements.length === 0) {
    list = (
      <Card className="space-y-1 p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Belum ada settlement yang disetujui
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Hasil bagi hasil muncul di sini setelah proyek selesai dan
          settlement-nya disetujui.
        </p>
      </Card>
    );
  } else if (filteredSettlements.length === 0) {
    list = (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">Settlement tidak ditemukan.</p>
      </Card>
    );
  } else {
    list = (
      <div className="space-y-3">
        {filteredSettlements.map((settlement) => (
          <SettlementCard
            key={settlement.settlementId}
            settlement={settlement}
            onClick={() => setSelected(settlement)}
          />
        ))}
      </div>
    );
  }

  return (
    <InvestorShell header={header}>
      <div className="space-y-6 px-4 pb-4">
        <PortfolioSummaryCard
          investorName={investorName}
          totalPrincipal={summary.totalPrincipal}
          totalProfit={summary.totalProfit}
          settledProjects={summary.settledProjects}
        />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Hasil Settlement
            </h2>
            <Link
              href="/investor/riwayat"
              className="inline-flex items-center gap-0.5 text-xs font-medium text-brand hover:underline"
            >
              Riwayat Investasi <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {settlements.length > 0 && (
            <SearchFilterBar
              value={filter}
              onChange={setFilter}
              projects={uniqueProjects}
              title="Filter Settlement"
            />
          )}

          {list}
        </section>
      </div>

      <SettlementSheet
        settlement={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </InvestorShell>
  );
}

export default function PortofolioPage() {
  return (
    <ClientOnly fallback={<p className="p-4 text-muted-foreground">Memuat...</p>}>
      <PortofolioContent />
    </ClientOnly>
  );
}
