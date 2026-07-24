"use client";

import { useRouter } from "next/navigation"

import type { InvestmentProject } from "./types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: InvestmentProject[];
}

export function ProjectList({ projects }: Readonly<ProjectListProps>) {
  const router = useRouter();

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-foreground">
        Daftar Investasi
      </h2>
      <div className="space-y-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() =>
              router.push(`/investor/portofolio/${project.id}`)
            }
          />
        ))}
      </div>
    </section>
  );
}
