import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardMobileHeader } from "@/components/layout/DashboardMobileHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black/[0.01] dark:bg-white/[0.01]">
      <DashboardMobileHeader />
      <DashboardSidebar />
      <div className="flex-1 w-full pt-14 pb-20 xl:ml-64 xl:pt-0 xl:pb-0">
        {children}
      </div>
    </div>
  );
}
