"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ClientOnly({ 
  children, 
  fallback 
}: Readonly<{ children: ReactNode; fallback?: ReactNode }>) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <>{fallback || (
        <div className="p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      )}</>
    );
  }

  return <>{children}</>;
}