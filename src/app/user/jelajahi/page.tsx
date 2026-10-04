"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Building2 } from "lucide-react";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatIDR } from "@/shared/lib/format";
import { statusBadgeVariant, statusLabel } from "@/features/investor-portofolio/utils";
import { fetchPublicProjects, type PublicProject } from "@/features/user-area/api";
import { userNav } from "@/features/user-area/nav";

export default function UserJelajahiPage() {
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ["user", "public-projects"],
    queryFn: fetchPublicProjects,
  });

  let list;
  if (isLoading) {
    list = (
      <div className="space-y-3">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    );
  } else if (error || !projects) {
    list = (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">Gagal memuat daftar proyek.</p>
        <Button variant="outline" size="touch" onClick={() => void refetch()}>
          Coba Lagi
        </Button>
      </Card>
    );
  } else if (projects.length === 0) {
    list = (
      <Card className="space-y-1 p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          Belum ada proyek yang ditampilkan
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Proyek investasi yang dibuka Koaci akan muncul di sini.
        </p>
      </Card>
    );
  } else {
    list = (
      <div className="space-y-3">
        {projects.map((project) => (
          <PublicProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <InvestorShell navItems={userNav}>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Jelajahi Proyek
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Proyek investasi yang tersedia di Koaci
          </p>
        </div>

        {list}

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Detail lengkap tersedia setelah akun Anda diverifikasi.
        </p>
      </div>
    </InvestorShell>
  );
}

function PublicProjectCard({ project }: Readonly<{ project: PublicProject }>) {
  // Tanpa project_name, judul sudah berisi nama perusahaan
  const company = [
    project.name === project.companyName ? null : project.companyName,
    project.industrySector,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="overflow-hidden p-0 shadow-card">
      <div className="h-1.5 w-full bg-accent-teal" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-sm font-semibold leading-snug text-foreground">
            {project.name}
          </p>
          <Badge variant={statusBadgeVariant(project.status)} className="shrink-0">
            {statusLabel(project.status)}
          </Badge>
        </div>

        {company && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{company}</span>
          </p>
        )}

        <div>
          <p className="text-xs text-muted-foreground">Kebutuhan Dana</p>
          <p className="mt-0.5 text-base font-bold text-foreground">
            {formatIDR(project.fundingRequired)}
          </p>
        </div>
      </div>
    </Card>
  );
}
