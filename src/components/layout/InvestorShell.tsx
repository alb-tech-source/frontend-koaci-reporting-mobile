import type { ReactNode } from "react";

import { BottomNav, type BottomNavItem } from "./BottomNav";

interface InvestorShellProps {
  children: ReactNode;
  navItems?: BottomNavItem[];
  header?: ReactNode;
}

export function InvestorShell({ children, navItems, header }: Readonly<InvestorShellProps>) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-elevated">
        {header ? (
          <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
            {header}
          </header>
        ) : null}
        <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}