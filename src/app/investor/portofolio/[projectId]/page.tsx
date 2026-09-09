import { InvestorShell } from "@/components/layout/InvestorShell";

export default async function ProjectDetailPage({
  params,
}: Readonly<{
  params: Promise<{ projectId: string }>;
}>) {
  const { projectId } = await params;
  return <InvestorShell>...{projectId}...</InvestorShell>;
}
