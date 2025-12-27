import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { WorkbenchProvider } from "@/lib/workbench-context";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Marketplace - Where Data Meets Gameplay",
  description: "The ultimate gaming data marketplace where developers, analysts, and creators discover, curate, and leverage game data to power next-level experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <WorkbenchProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster />
          </WorkbenchProvider>
      </body>
    </html>
  );
}
