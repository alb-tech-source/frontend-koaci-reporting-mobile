"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AlertTriangle, Filter, Search } from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { ClientOnly } from "@/shared/components/ClientOnly";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/shared/components/ui/drawer";

import { PortfolioSummaryCard } from "@/features/investor-portofolio/PortfolioSummaryCard";
import { ProjectList } from "@/features/investor-portofolio/ProjectList";
import { fetchMyInvestments, computePortfolioSummary } from "@/features/investor-portofolio/api";
import { useAuthStore } from "@/shared/store/authStore";

function PortofolioContent() {
  const user = useAuthStore((s) => s.user);
  
  // State Filter
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const { data: projects, isLoading, isError, refetch } = useQuery({
    queryKey: ["investment-projects"],
    queryFn: fetchMyInvestments,
  });

  const summary = useMemo(() => {
    if (!projects) return undefined;
    const investorName = `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Investor";
    return computePortfolioSummary(projects, investorName);
  }, [projects, user]);

  // Filter & Search
  const uniqueProjects = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map((p) => p.projectKey))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p => {
      const matchSearch = 
        p.projectKey.toLowerCase().includes(search.toLowerCase()) || 
        p.companyName.toLowerCase().includes(search.toLowerCase());
      const matchProject = projectFilter
        ? p.projectKey === projectFilter
        : true;
      const matchStartDate = dateStart 
        ? new Date(p.createdAt) >= new Date(dateStart) 
        : true;
      const matchEndDate = dateEnd 
        ? new Date(p.createdAt) <= new Date(dateEnd) 
        : true;
      
      return matchSearch && matchProject && matchStartDate && matchEndDate;
    });
  }, [projects, search, dateStart, dateEnd, projectFilter]);

  const clearFilter = () => {
    setDateStart("");
    setDateEnd("");
    setProjectFilter("");
    setIsFilterOpen(false);
  };

  const header = (
    <div className="px-4 py-3">
      <h1 className="text-lg font-semibold">Portofolio Saya</h1>
    </div>
  );

  if (isLoading) {
    return (
      <InvestorShell header={header}>
        <p className="text-sm text-muted-foreground px-4">Memuat portofolio...</p>
      </InvestorShell>
    );
  }

  if (isError || !projects) {
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

  return (
    <InvestorShell header={header}>
      <div className="space-y-6 px-4 pb-4">
        {summary && (
          <PortfolioSummaryCard
            investorName={summary.investorName}
            activeProjects={summary.activeProjects}
            totalActiveInvestment={summary.totalInvested} 
          />
        )}
        
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            Daftar Investasi
          </h2>
          
          <div className="flex gap-2">
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
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {filteredProjects.length > 0 ? (
             <ProjectList projects={filteredProjects} />
          ) : (
             <Card className="p-8 text-center">
               <p className="text-sm text-muted-foreground">Investasi tidak ditemukan.</p>
             </Card>
          )}
        </section>
      </div>

      {/* Sheet Modal untuk Filter Investasi */}
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