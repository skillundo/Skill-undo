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
      <div className="flex-1 min-w-0 pt-14 pb-20 lg:ml-64 lg:pt-0 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
