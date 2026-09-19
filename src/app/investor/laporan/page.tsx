"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Filter, Search } from "lucide-react";
import { useState, useMemo } from "react";

import { InvestorShell } from "@/components/layout/InvestorShell";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ClientOnly } from "@/shared/components/ClientOnly";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/shared/components/ui/drawer";

import { fetchMyReportings } from "@/features/investor-laporan/api";
import { ReportingCard } from "@/features/investor-laporan/ReportingCard";
import { ReportingSheet } from "@/features/investor-laporan/ReportingSheet";
import type { MyReporting } from "@/features/investor-laporan/types";

function LaporanContent() {
  const [selectedReporting, setSelectedReporting] =
    useState<MyReporting | null>(null);

  // State Filter
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const {
    data: reportings,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["investor", "my-reportings"],
    queryFn: fetchMyReportings,
  });

  // Filter & Search
  const uniqueProjects = useMemo(() => {
    if (!reportings) return [];
    return Array.from(new Set(reportings.map((r) => r.projectKey)));
  }, [reportings]);

  const filteredReportings = useMemo(() => {
    if (!reportings) return [];
    return reportings.filter((r) => {
      const matchSearch =
        r.projectKey.toLowerCase().includes(search.toLowerCase()) ||
        r.companyName.toLowerCase().includes(search.toLowerCase());
      const matchProject = projectFilter
        ? r.projectKey === projectFilter
        : true;
      const matchStartDate = dateStart
        ? new Date(r.reportDate) >= new Date(dateStart)
        : true;
      const matchEndDate = dateEnd
        ? new Date(r.reportDate) <= new Date(dateEnd)
        : true;

      return matchSearch && matchProject && matchStartDate && matchEndDate;
    });
  }, [reportings, search, projectFilter, dateStart, dateEnd]);

  const clearFilter = () => {
    setDateStart("");
    setDateEnd("");
    setProjectFilter("");
    setIsFilterOpen(false);
  };

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
      {/* WRAPPER SEARCH & FILTER */}
      <div className="flex gap-2 px-4 pt-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari proyek atau PT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <Button
          variant={dateStart || projectFilter ? "primary" : "outline"}
          size="icon"
          onClick={() => setIsFilterOpen(true)}
          className="h-10 w-10 shrink-0 rounded-xl shadow-sm"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Bagian List Kartu Laporan */}
      {content}

      {/* Sheet Modal untuk Filter Laporan */}
      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent className="pb-safe">
          <DrawerHeader className="text-left">
            <DrawerTitle>Filter Laporan</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-filter" className="text-sm font-medium">
                Pilih Proyek
              </label>
              <select
                id="project-filter"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Semua Proyek</option>
                {uniqueProjects.map((proj) => (
                  <option key={proj} value={proj}>
                    {proj}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="date-start" className="text-sm font-medium">
                  Dari Tanggal
                </label>
                <Input
                  id="date-start"
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="date-end" className="text-sm font-medium">
                  Sampai Tanggal
                </label>
                <Input
                  id="date-end"
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <DrawerFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={clearFilter}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
              Terapkan
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
