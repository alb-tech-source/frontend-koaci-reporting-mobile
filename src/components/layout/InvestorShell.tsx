import type { ReactNode } from "react";

import { BottomNav, type BottomNavItem } from "./BottomNav";

interface InvestorShellProps {
  children: ReactNode;
  navItems?: BottomNavItem[];
  /** Optional sticky header slot (title, greeting, etc.) */
  header?: ReactNode;
}

/**
 * Mobile-first shell for the investor web app.
 * On desktop the content column is capped at max-w-md and centered so
 * the app keeps its mobile feel when opened in a browser.
 */
export function InvestorShell({ children, navItems, header }: InvestorShellProps) {
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