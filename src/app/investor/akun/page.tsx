"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, LogOut } from "lucide-react";
import { toast } from "sonner";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { DocumentListPanel } from "@/features/investor-akun/DocumentListPanel";
import { fetchInvestorDocuments, type InvestorDocument } from "@/features/investor-akun/documents";
import { fetchInvestorProfile } from "@/features/investor-akun/api";
import { sendVerifyEmail } from "@/features/auth/api";
import { HeirTab } from "@/features/investor-akun/HeirTab";
import { ProfileTab } from "@/features/investor-akun/ProfileTab";
import { accountStatusLabel, accountStatusVariant } from "@/features/investor-akun/types";

import { logout } from "@/shared/lib/auth";
import { useAuthStore } from "@/shared/store/authStore";
import { ClientOnly } from "@/shared/components/ClientOnly";

function initials(first?: string, last?: string) {
  const f = first ? first.charAt(0) : "U";
  const l = last ? last.charAt(0) : "";
  return `${f}${l}`.toUpperCase();
}

export default function InvestorAkunPage() {
  return (
    <ClientOnly fallback={<InvestorAkunSkeleton />}>
      <InvestorAkunContent />
    </ClientOnly>
  );
}

function InvestorAkunContent() {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);

  const profileQuery = useQuery({
    queryKey: ["investor", "profile"],
    queryFn: fetchInvestorProfile,
  });
  const profile = profileQuery.data;

  const documentsQuery = useQuery({
    queryKey: ["investor", "documents", profile?.investorId],
    queryFn: () => fetchInvestorDocuments(profile?.investorId as string),
    enabled: Boolean(profile?.investorId),
  });

  const documents: InvestorDocument[] = documentsQuery.data ?? [];

  const displayEmail = authUser?.email || profile?.email || "";
  const displayFirst = authUser?.firstName || profile?.firstName || "Investor";
  const displayLast = authUser?.lastName || profile?.lastName || "";

  const requestVerification = async () => {
    if (!displayEmail) {
      toast.error("Email tidak ditemukan. Silakan relog.");
      return;
    }
    try {
      console.log("Requesting verification email for:", displayEmail);
      await sendVerifyEmail(displayEmail);
      toast.success("Email verifikasi berhasil dikirim!");
      void queryClient.invalidateQueries({ queryKey: ["investor", "profile"] });
    } catch {
      toast.error("Gagal mengirim email verifikasi. Coba lagi nanti.");
    }
  };

  const header = (
    <div className="px-4 py-3">
      <h1 className="text-base font-semibold tracking-tight text-foreground">Akun Saya</h1>
    </div>
  );

  if (profileQuery.isPending) {
    return <InvestorAkunSkeleton />;
  }

  if (profileQuery.isError || !profile) {
    return (
      <InvestorShell header={header}>
        <div className="space-y-5">
          <Card className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger/10 text-danger">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted-foreground">
              Gagal memuat data profil. Coba lagi.
            </p>
            <Button size="sm" onClick={() => void profileQuery.refetch()}>
              Coba Lagi
            </Button>
          </Card>

          <Button variant="destructive" className="w-full" onClick={() => logout("/")}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Keluar dari Akun
          </Button>
        </div>
      </InvestorShell>
    );
  }

  return (
    <InvestorShell header={header}>
      <div className="space-y-5">
        <section className="flex flex-col items-center pt-1 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-brand/10 text-2xl font-bold text-brand">
            {initials(displayFirst, displayLast)}
          </span>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
            {displayFirst} {displayLast}
          </h2>
          <p className="text-sm text-muted-foreground">{displayEmail}</p>
          <Badge variant={accountStatusVariant[profile.status]} className="mt-2">
            {accountStatusLabel[profile.status]}
          </Badge>
        </section>

        <Tabs defaultValue="profil">
          <TabsList className="w-full">
            <TabsTrigger value="profil" className="flex-1">Profil</TabsTrigger>
            <TabsTrigger value="ahli-waris" className="flex-1">Ahli Waris</TabsTrigger>
            <TabsTrigger value="dokumen" className="flex-1">Dokumen</TabsTrigger>
          </TabsList>

          <TabsContent value="profil" className="mt-3">
            <ProfileTab profile={profile} onRequestVerification={requestVerification} />
          </TabsContent>

          <TabsContent value="ahli-waris" className="mt-3">
            <HeirTab profile={profile} onRequestVerification={requestVerification} />
          </TabsContent>

          <TabsContent value="dokumen" className="mt-3">
            {documentsQuery.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ) : (
              <DocumentListPanel documents={documents} />
            )}
          </TabsContent>
        </Tabs>

        <Button variant="destructive" className="w-full" onClick={() => logout("/")}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Keluar dari Akun
        </Button>
      </div>
    </InvestorShell>
  );
}

function InvestorAkunSkeleton() {
  return (
    <InvestorShell header={
      <div className="px-4 py-3">
        <h1 className="text-base font-semibold tracking-tight text-foreground">Akun Saya</h1>
      </div>
    }>
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-20 w-20 rounded-3xl" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </InvestorShell>
  );
}