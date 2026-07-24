"use client";

import { useQuery } from "@tanstack/react-query";
import { InvestorShell } from "@/components/layout/InvestorShell";
import { PortfolioSummaryCard } from "@/features/investor-portofolio/PortfolioSummaryCard";
import { ProjectList } from "@/features/investor-portofolio/ProjectList";
import {
  fetchPortfolioSummary,
  fetchInvestmentProjects,
} from "@/features/investor-portofolio/api";

export default function PortofolioPage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["portfolio-summary"],
    queryFn: fetchPortfolioSummary,
  });
  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["investment-projects"],
    queryFn: fetchInvestmentProjects,
  });

  const isLoading = loadingSummary || loadingProjects;

  return (
    <InvestorShell
      header={
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">Portofolio Saya</h1>
        </div>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat...</p>
      ) : (
        <div className="space-y-4">
          {summary && (
            <PortfolioSummaryCard
              investorName={summary.investorName}
              totalActiveInvestment={summary.totalActiveInvestment}
              activeProjects={summary.activeProjects}
            />
          )}
          {projects && <ProjectList projects={projects} />}
        </div>
      )}
    </InvestorShell>
  );
}