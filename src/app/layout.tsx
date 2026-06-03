import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skillundo - Peer-to-Peer Student Marketplace",
  description: "A unified platform for students to hire peers and offer skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
