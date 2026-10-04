"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useState, useMemo } from "react";

import { InvestorShell } from "@/components/layout/InvestorShell";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ClientOnly } from "@/shared/components/ClientOnly";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";
import { emptyListFilter, matchesListFilter } from "@/shared/lib/list-filter";

import { fetchMyReportings } from "@/features/investor-laporan/api";
import { ReportingCard } from "@/features/investor-laporan/ReportingCard";
import { ReportingSheet } from "@/features/investor-laporan/ReportingSheet";
import type { MyReporting } from "@/features/investor-laporan/types";

function LaporanContent() {
  const [selectedReporting, setSelectedReporting] =
    useState<MyReporting | null>(null);
  const [filter, setFilter] = useState(emptyListFilter);

  const {
    data: reportings,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["investor", "my-reportings"],
    queryFn: fetchMyReportings,
  });

  const uniqueProjects = useMemo(() => {
    if (!reportings) return [];
    return Array.from(new Set(reportings.map((r) => r.projectKey)));
  }, [reportings]);

  const filteredReportings = useMemo(() => {
    if (!reportings) return [];
    // report_date adalah tanggal tanpa jam (tengah malam UTC), jadi dibandingkan dalam UTC
    return reportings.filter((r) =>
      matchesListFilter(
        { projectKey: r.projectKey, companyName: r.companyName, date: r.reportDate },
        filter,
        "utc",
      ),
    );
  }, [reportings, filter]);

  const header = (
    <div className="flex flex-col gap-3 px-4 py-3">
      <h1 className="text-base font-semibold text-foreground">
        Laporan Proyek
      </h1>
    </div>
  );

  let content;

  if (isLoading) {
    content = (
      <div className="space-y-3 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  } else if (isError || !reportings) {
    content = (
      <Card className="flex flex-col items-center gap-3 p-8 text-center mx-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          Gagal memuat laporan. Coba lagi.
        </p>
        <Button variant="outline" size="touch" onClick={() => void refetch()}>
          Coba Lagi
        </Button>
      </Card>
    );
  } else if (filteredReportings.length === 0) {
    content = (
      <Card className="p-8 text-center mx-4">
        <p className="text-sm text-muted-foreground">Data tidak ditemukan.</p>
      </Card>
    );
  } else {
    content = (
      <div className="space-y-3 px-4">
        {filteredReportings.map((r) => (
          <ReportingCard
            key={r.reportingId}
            reporting={r}
            onClick={() => setSelectedReporting(r)}
          />
        ))}
      </div>
    );
  }

  return (
    <InvestorShell header={header}>
      <SearchFilterBar
        value={filter}
        onChange={setFilter}
        projects={uniqueProjects}
        title="Filter Laporan"
        className="px-4 pt-2 mb-4"
      />

      {/* Bagian List Kartu Laporan */}
      {content}

      <ReportingSheet
        reporting={selectedReporting}
        isOpen={selectedReporting !== null}
        onClose={() => setSelectedReporting(null)}
      />
    </InvestorShell>
  );
}

export default function LaporanPage() {
  return (
    <ClientOnly
      fallback={<p className="p-4 text-muted-foreground">Memuat laporan...</p>}
    >
      <LaporanContent />
    </ClientOnly>
  );
}
