import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="text-lg font-semibold text-foreground">
        Halaman tidak ditemukan
      </h1>
      <p className="text-sm text-muted-foreground">
        Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.
      </p>
      <Button asChild variant="primary" size="touch" className="mt-2">
        <Link href="/">Kembali ke Aplikasi</Link>
      </Button>
    </div>
  );
}
