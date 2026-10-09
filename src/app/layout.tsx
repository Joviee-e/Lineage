import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { LineageProvider } from "../lib/state/LineageContext";
import { DemoControlBar } from "../components/common/DemoControlBar";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LINEAGE — Find. Verify. Protect. | Hyperlocal Medicine Discovery & Traceability",
  description: "AI-Powered medicine discovery, inventory intelligence, and pharmaceutical batch traceability platform. Never silently substitute prescribed medicines.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
        <LineageProvider>
          <Suspense fallback={null}>
            <DemoControlBar />
          </Suspense>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </LineageProvider>
      </body>
    </html>
  );
}
