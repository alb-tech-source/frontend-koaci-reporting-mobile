import { InvestorShell } from "@/components/layout/InvestorShell";
import { PortfolioSummaryCard } from "@/features/investor-portofolio/PortfolioSummaryCard";
import { ProjectList } from "@/features/investor-portofolio/ProjectList";
import {
  fetchPortfolioSummary,
  fetchInvestmentProjects,
} from "@/features/investor-portofolio/dummy-data";

export default async function PortofolioPage() {
  const summary = await fetchPortfolioSummary();
  const projects = await fetchInvestmentProjects();

  return (
    <InvestorShell
      header={
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold">Portofolio Saya</h1>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Menyisipkan data ke properti yang tepat secara eksplisit */}
        <PortfolioSummaryCard 
          investorName={summary.investorName}
          totalActiveInvestment={summary.totalActiveInvestment}
          activeProjects={summary.activeProjects}
        />
        
        <ProjectList projects={projects} />
      </div>
    </InvestorShell>
  );
}