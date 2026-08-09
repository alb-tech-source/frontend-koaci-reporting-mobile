"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  
  // 1. Tarik nilainya ke dalam variabel agar aman dan bisa dibaca
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  
  // 2. Tampilkan di log dengan penanda yang sangat jelas
  console.log("=== CEK CLIENT ID GOOGLE ===");
  console.log("Tipe Data:", typeof clientId);
  console.log("Nilai:", clientId);
  console.log("Panjang Karakter:", clientId.length);
  console.log("============================");

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}