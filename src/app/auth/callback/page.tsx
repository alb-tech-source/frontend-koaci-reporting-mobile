"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { establishSession, homePathForRole } from "@/features/auth/session";

// Backend sudah memasang cookie auth sebelum mengarahkan ke sini;
// halaman ini hanya membentuk sesi client lalu meneruskan ke beranda.
export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    establishSession()
      .then((role) => router.replace(homePathForRole(role)))
      .catch((error) => {
        console.error("Callback OAuth gagal", error);
        router.replace("/");
      });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Memproses login Google...</p>
    </div>
  );
}
