import { InvestorShell } from "@/components/layout/InvestorShell";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <InvestorShell>...{projectId}...</InvestorShell>;
}