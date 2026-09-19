"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ClientOnly } from "@/shared/components/ClientOnly";
import { useAuthStore } from "@/shared/store/authStore";

import { ActivityList } from "@/features/investor-beranda/ActivityList";
import { BerandaHeader } from "@/features/investor-beranda/BerandaHeader";
import { BerandaSummaryCard } from "@/features/investor-beranda/BerandaSummaryCard";
import { ShortcutGrid } from "@/features/investor-beranda/ShortcutGrid";
import { ProjectCard } from "@/features/investor-portofolio/ProjectCard";

import { fetchMyInvestments, computePortfolioSummary } from "@/features/investor-portofolio/api";
import { fetchLatestActivities } from "@/features/investor-beranda/api";

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

  const { data: investments, isLoading: loadingInvestments } = useQuery({
    queryKey: ["investor", "my-investments"],
    queryFn: fetchMyInvestments,
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ["investor", "beranda", "activities"],
    queryFn: fetchLatestActivities,
  });

  const summary = useMemo(() => {
    if (!investments) return undefined;
    const investorName = `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Investor";
    const baseSummary = computePortfolioSummary(investments, investorName);
    return {
      ...baseSummary,
      unreadNotifications: 0,
    };
  }, [investments, user]);

  const isLoading = loadingInvestments || loadingActivities;

  const header = summary ? (
    <BerandaHeader
      investorName={summary.investorName}
      unreadNotifications={summary.unreadNotifications}
    />
  ) : (
    <div className="px-4 py-3">
      <Skeleton className="h-8 w-48" />
    </div>
  );

  let content;

  if (isLoading) {
    content = <BerandaSkeleton />;
  } else {
    const latestInvestments = investments?.slice(0, 2) ?? [];

    content = (
      <div className="space-y-6">
        {summary && (
          <BerandaSummaryCard
            totalActiveInvestment={summary.totalInvested}
            activeProjects={summary.activeProjects}
          />
        )}

        <ShortcutGrid />

        {latestInvestments.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Proyek Terbaru
              </h2>
              <Link
                href="/investor/portofolio"
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

        {activities && (
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Aktivitas Terbaru
            </h2>
            <ActivityList activities={activities} />
          </section>
        )}
      </div>
    );
  }

  return <InvestorShell header={header}>{content}</InvestorShell>;
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
