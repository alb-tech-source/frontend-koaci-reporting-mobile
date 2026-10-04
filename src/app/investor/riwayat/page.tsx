"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { ClientOnly } from "@/shared/components/ClientOnly";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { emptyListFilter, matchesListFilter } from "@/shared/lib/list-filter";

import { ProjectList } from "@/features/investor-portofolio/ProjectList";
import { fetchMyInvestments } from "@/features/investor-portofolio/api";

function RiwayatContent() {
  const router = useRouter();
  const [filter, setFilter] = useState(emptyListFilter);

  const { data: investments, isLoading, isError, refetch } = useQuery({
    queryKey: ["investor", "my-investments"],
    queryFn: fetchMyInvestments,
  });

  const uniqueProjects = useMemo(() => {
    if (!investments) return [];
    return [...new Set(investments.map((inv) => inv.projectKey))];
  }, [investments]);

  const filteredInvestments = useMemo(() => {
    if (!investments) return [];
    return investments.filter((inv) =>
      matchesListFilter(
        { projectKey: inv.projectKey, companyName: inv.companyName, date: inv.createdAt },
        filter,
      ),
    );
  }, [investments, filter]);

  const header = (
    <div className="flex items-center gap-2 px-2 py-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Kembali ke portofolio"
        onClick={() => router.push("/investor/portofolio")}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-base font-semibold text-foreground">Riwayat Investasi</h1>
    </div>
  );

  let content;
  if (isLoading) {
    content = (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  } else if (isError || !investments) {
    content = (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">Gagal memuat riwayat investasi.</p>
        <Button variant="outline" size="touch" onClick={() => void refetch()}>Coba Lagi</Button>
      </Card>
    );
  } else {
    content = (
      <div className="space-y-3">
        <SearchFilterBar
          value={filter}
          onChange={setFilter}
          projects={uniqueProjects}
          title="Filter Investasi"
        />

        {filteredInvestments.length > 0 ? (
          <ProjectList projects={filteredInvestments} />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Investasi tidak ditemukan.</p>
          </Card>
        )}
      </div>
    );
  }

  return <InvestorShell header={header}>{content}</InvestorShell>;
}

export default function RiwayatPage() {
  return (
    <ClientOnly fallback={<p className="p-4 text-muted-foreground">Memuat...</p>}>
      <RiwayatContent />
    </ClientOnly>
  );
}
