import { InvestorShell } from "@/components/layout/InvestorShell";

export default function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  return <InvestorShell>...{projectId}...</InvestorShell>;
}