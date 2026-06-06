import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skillundo - Peer-to-Peer Student Marketplace",
  description: "A unified platform for students to hire peers and offer skills.",
  verification: {
    google: "2K2ZGtAotQ6083p_XQHOP7XIBfhKr2JOE3udLVUZP-g",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black min-h-screen flex flex-col overflow-x-hidden w-full`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ThemeToggle />
            <Navbar />
            <main className="flex-1 flex w-full max-w-[1600px] mx-auto">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
