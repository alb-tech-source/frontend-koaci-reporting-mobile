"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { watchSession } from "@/features/auth/session";
import { Toaster } from "@/shared/components/ui/sonner";
import { bindSessionToQueryCache, createQueryClient } from "@/shared/lib/queryClient";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => bindSessionToQueryCache(queryClient), [queryClient]);
  useEffect(() => watchSession(), []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
