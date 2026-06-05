"use client";

import Link from "next/link";

export function DashboardMobileHeader() {
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-background/95 backdrop-blur-sm border-b border-border z-40 flex items-center px-4 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tighter">SKILLUNDO</span>
      </Link>
    </header>
  );
}
