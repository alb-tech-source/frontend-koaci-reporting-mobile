import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Koaci Reporting App",
  description: "Sistem pelaporan investasi syariah PT Koaci Sinergi Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-100 dark:bg-zinc-950 antialiased`}>
        <Providers>
          <main className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-x-hidden bg-background shadow-2xl">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}