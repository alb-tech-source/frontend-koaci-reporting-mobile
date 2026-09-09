"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ClientOnly } from "@/shared/components/ClientOnly";

import { ActivityList } from "@/features/investor-beranda/ActivityList";
import { BerandaHeader } from "@/features/investor-beranda/BerandaHeader";
import { BerandaSummaryCard } from "@/features/investor-beranda/BerandaSummaryCard";
import { ShortcutGrid } from "@/features/investor-beranda/ShortcutGrid";
import { ProjectCard } from "@/features/investor-portofolio/ProjectCard";

import {
  fetchBerandaSummary,
  fetchLatestActivities,
  fetchLatestProjects,
} from "@/features/investor-beranda/dummy-data";

export default function BerandaPage() {
  return (
    <ClientOnly fallback={<InvestorShell><BerandaSkeleton /></InvestorShell>}>
      <BerandaContent />
    </ClientOnly>
  );
}

function BerandaContent() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["investor", "beranda", "summary"],
    queryFn: fetchBerandaSummary,
  });

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["investor", "beranda", "latest-projects"],
    queryFn: fetchLatestProjects,
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ["investor", "beranda", "activities"],
    queryFn: fetchLatestActivities,
  });

  const isLoading = loadingSummary || loadingProjects || loadingActivities;

  return (
    <InvestorShell
      header={
        summary ? (
          <BerandaHeader investorName={summary.investorName} unreadNotifications={summary.unreadNotifications} />
        ) : (
          <div className="px-4 py-3"><Skeleton className="h-8 w-48" /></div>
        )
      }
    >
      {isLoading ? (
        <BerandaSkeleton />
      ) : (
        <div className="space-y-6">
          {summary && (
            <BerandaSummaryCard totalActiveInvestment={summary.totalActiveInvestment} activeProjects={summary.activeProjects} />
          )}

          <ShortcutGrid />

          {projects && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Proyek Terbaru</h2>
                <Link href="/investor/portofolio" className="inline-flex items-center gap-0.5 text-xs font-medium text-brand hover:underline">
                  Lihat Semua <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
              <div className="space-y-3">
                {projects.slice(0, 2).map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>
          )}

          {activities && (
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">Aktivitas Terbaru</h2>
              <ActivityList activities={activities} />
            </section>
          )}
        </div>
      )}
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