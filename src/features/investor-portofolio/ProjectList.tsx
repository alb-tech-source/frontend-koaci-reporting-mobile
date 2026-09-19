"use client";

import { useRouter } from "next/navigation";

import type { MyInvestment } from "./types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: MyInvestment[];
}

export function ProjectList({ projects }: Readonly<ProjectListProps>) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {projects.map((investment) => (
        <ProjectCard
          key={investment.investmentId}
          investment={investment}
          onClick={() =>
            router.push(`/investor/portofolio/${investment.investmentId}`)
          }
        />
      ))}
    </div>
  );
}