"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Download, FileText, Loader2, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { InvestorShell } from "@/components/layout/InvestorShell";
import { ClientOnly } from "@/shared/components/ClientOnly";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { fetchMyInvestments } from "@/features/investor-portofolio/api";
import { fetchMyReceipts, getReceiptDownloadUrl } from "@/features/investor-portofolio/receiptApi";
import { formatFileSize, statusBadgeVariant, statusLabel } from "@/features/investor-portofolio/utils";
import { formatDateID, formatIDR } from "@/shared/lib/format";

function InvestmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const investmentId = params.investmentId as string;
  
  const [isDownloading, setIsDownloading] = useState(false);

  const investmentsQuery = useQuery({ queryKey: ["investor", "my-investments"], queryFn: fetchMyInvestments });
  const receiptsQuery = useQuery({ queryKey: ["investor", "my-receipts"], queryFn: fetchMyReceipts });

  const investment = investmentsQuery.data?.find((inv) => inv.investmentId === investmentId) ?? null;
  const myReceipt = receiptsQuery.data?.find((r) => r.investmentId === investmentId) ?? null;

  const header = (
    <div className="flex items-center gap-2 px-2 py-2">
      <Button variant="ghost" size="icon" onClick={() => router.push("/investor/portofolio")}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-base font-semibold text-foreground">Detail Investasi</h1>
    </div>
  );

  const handleDownloadReceipt = async () => {
    if (!myReceipt) return;
    setIsDownloading(true);
    try {
      const url = await getReceiptDownloadUrl(myReceipt.receiptId);
      if (!url) throw new Error("URL tidak tersedia");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Gagal mengunduh kwitansi.");
    } finally {
      setIsDownloading(false);
    }
  };

  let content;
  if (investmentsQuery.isLoading) {
    content = (
      <div className="space-y-4">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );
  } else if (investmentsQuery.isError || !investment) {
    content = (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">Data investasi tidak ditemukan.</p>
        <Button variant="outline" size="touch" onClick={() => router.push("/investor/portofolio")}>
          Kembali ke Portofolio
        </Button>
      </Card>
    );
  } else {
    let receiptContent;
    if (!myReceipt) {
      receiptContent = <p className="text-sm text-muted-foreground">Kwitansi belum tersedia. Hubungi tim Koaci jika Anda sudah melakukan pembayaran.</p>;
    } else {
      receiptContent = (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{myReceipt.receiptName}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(myReceipt.fileSizeBytes)} · Diunggah {formatDateID(myReceipt.uploadedAt)}
              </p>
            </div>
          </div>
          <Button size="touch" className="w-full" disabled={isDownloading} onClick={() => void handleDownloadReceipt()}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Unduh Kwitansi
          </Button>
        </div>
      );
    }

    content = (
      <div className="space-y-4">
        <Card className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{investment.projectKey}</p>
              <p className="text-xs text-muted-foreground">{investment.companyName}</p>
            </div>
            <Badge variant={statusBadgeVariant(investment.projectStatus)}>
              {statusLabel(investment.projectStatus)}
            </Badge>
          </div>
          <Separator />
          <Row label="Kebutuhan Pendanaan" value={formatIDR(investment.fundingRequired)} />
          <Row label="Progress Proyek" value={`${investment.latestProgress ?? 0}%`} />
        </Card>

        <Card className="space-y-3 p-4">
          <p className="text-sm font-semibold text-foreground">Investasi Saya</p>
          <Separator />
          <Row label="Nominal" value={formatIDR(investment.amount)} />
          <Row label="Jumlah Paket" value={`${investment.totalPackage} paket`} />
          <Row label="Metode Pembayaran" value={investment.paymentMethod === "cash" ? "Tunai" : "Transfer"} />
          <Row label="No. Kwitansi" value={investment.receiptNumber || "—"} />
          <Row label="Tanggal Investasi" value={formatDateID(investment.createdAt)} />
        </Card>

        <Card className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-brand" />
            <p className="text-sm font-semibold text-foreground">Kwitansi Investasi</p>
          </div>
          <Separator />
          {receiptsQuery.isLoading ? <Skeleton className="h-16 rounded-xl" /> : receiptContent}
        </Card>
      </div>
    );
  }

  return <InvestorShell header={header}>{content}</InvestorShell>;
}

function Row({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function InvestmentDetailPage() {
  return (
    <ClientOnly fallback={<p className="p-4 text-muted-foreground">Memuat detail...</p>}>
      <InvestmentDetailContent />
    </ClientOnly>
  );
}
