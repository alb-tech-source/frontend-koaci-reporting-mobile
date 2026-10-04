"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronRight } from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ClientOnly } from "@/shared/components/ClientOnly";
import { useAuthStore } from "@/shared/store/authStore";

import { fetchInvestmentSummary } from "@/features/investor-beranda/api";
import { BerandaHeader } from "@/features/investor-beranda/BerandaHeader";
import { BerandaSummaryCard } from "@/features/investor-beranda/BerandaSummaryCard";
import { ShortcutGrid } from "@/features/investor-beranda/ShortcutGrid";
import { ProjectCard } from "@/features/investor-portofolio/ProjectCard";

import { fetchMyInvestments } from "@/features/investor-portofolio/api";

const LATEST_INVESTMENT_COUNT = 2;

export default function BerandaPage() {
  return (
    <ClientOnly
      fallback={
        <InvestorShell>
          <BerandaSkeleton />
        </InvestorShell>
      }
    >
      <BerandaContent />
    </ClientOnly>
  );
}

function BerandaContent() {
  const user = useAuthStore((s) => s.user);
  const investorName =
    `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Investor";

  const summaryQuery = useQuery({
    queryKey: ["investor", "investment-summary"],
    queryFn: fetchInvestmentSummary,
  });

  // Backend mengurutkan dari yang terbaru; daftar ini berbagi cache dengan halaman riwayat
  const investmentsQuery = useQuery({
    queryKey: ["investor", "my-investments"],
    queryFn: fetchMyInvestments,
  });
  const latestInvestments =
    investmentsQuery.data?.slice(0, LATEST_INVESTMENT_COUNT) ?? [];

  let summaryContent;
  if (summaryQuery.isLoading) {
    summaryContent = <Skeleton className="h-32 w-full rounded-2xl" />;
  } else if (summaryQuery.isError || !summaryQuery.data) {
    summaryContent = (
      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          Gagal memuat ringkasan investasi.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void summaryQuery.refetch()}
        >
          Coba Lagi
        </Button>
      </Card>
    );
  } else {
    summaryContent = (
      <BerandaSummaryCard
        totalActiveInvestment={summaryQuery.data.totalActiveInvestment}
        activeProjects={summaryQuery.data.activeProjects}
      />
    );
  }

  return (
    <InvestorShell header={<BerandaHeader investorName={investorName} />}>
      <div className="space-y-6">
        {summaryContent}

        <ShortcutGrid />

        {investmentsQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
        ) : null}

        {latestInvestments.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Investasi Terbaru
              </h2>
              <Link
                href="/investor/riwayat"
                className="inline-flex items-center gap-0.5 text-xs font-medium text-brand hover:underline"
              >
                Lihat Semua <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="space-y-3">
              {latestInvestments.map((inv) => (
                <ProjectCard key={inv.investmentId} investment={inv} />
              ))}
            </div>
          </section>
        )}
      </div>
    </InvestorShell>
  );
}

function BerandaSkeleton() {
  return (
    <div className="space-y-6 px-4 pt-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-5 w-32 rounded-md" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-36 w-full rounded-2xl" />
    </div>
  );
}
