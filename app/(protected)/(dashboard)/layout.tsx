import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import AuthRedirect from "@/components/shared/AuthRedirect";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Check if user is onboarded, redirect to /onboarding if not */}
      <AuthRedirect requireOnboarded={true} redirectTo="/onboarding" />
      
      <div className="flex h-screen w-full bg-background py-3">
        <aside className="h-full">
          <DashboardSidebar />
        </aside>
        <main className="flex flex-col min-w-0 w-full">
          <section className="flex-1 py-4 px-6 overflow-auto">{children}</section>
        </main>
        {/* Floating Agent Mode Button */}
      </div>
    </>
  );
}
