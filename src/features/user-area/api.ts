import api from "@/shared/lib/axios";
import type { ProjectStatus } from "@/features/investor-portofolio/types";

export interface PublicProject {
  id: string;
  name: string;
  companyName: string;
  industrySector: string | null;
  fundingRequired: number;
  status: ProjectStatus;
}

// Bentuk item GET /projects/public: hanya proyek yang ditandai is_public oleh admin
interface ApiPublicProject {
  project_id?: string;
  project_name?: string | null;
  funding_required?: string | number;
  status?: string;
  company?: {
    company_name?: string;
    industry_sector?: string | null;
  } | null;
}

export function mapPublicProject(raw: ApiPublicProject): PublicProject {
  const companyName = raw.company?.company_name || "-";

  return {
    id: raw.project_id ?? "",
    // project_name opsional di backend; proyek tanpa nama memakai nama perusahaan
    name: raw.project_name?.trim() || companyName,
    companyName,
    industrySector: raw.company?.industry_sector || null,
    fundingRequired: Number(raw.funding_required) || 0,
    status: (raw.status as ProjectStatus) || "open",
  };
}

export async function fetchPublicProjects(): Promise<PublicProject[]> {
  const { data } = await api.get("/projects/public", { params: { limit: 100 } });
  const items: ApiPublicProject[] = data?.data ?? [];
  return items.map(mapPublicProject);
}
