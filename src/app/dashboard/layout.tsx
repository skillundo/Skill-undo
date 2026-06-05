import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black/[0.01] dark:bg-white/[0.01]">
      <DashboardSidebar />
      <div className="flex-1 ml-20 xl:ml-64 w-full">
        {children}
      </div>
    </div>
  );
}
