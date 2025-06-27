
import { useUser } from "@/contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";
import { ProfessionalHeader } from "@/components/professional/ProfessionalHeader";
import { ProfessionalBottomNav } from "@/components/professional/ProfessionalBottomNav";

export function ProfessionalLayout() {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pro-primary to-pro-secondary">
        <div className="animate-pulse-soft text-center">
          <div className="h-12 w-12 rounded-full bg-white/20 mx-auto mb-4 animate-bounce-soft"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || user.role !== 'professional') {
    return <Navigate to="/auth/professional" replace />;
  }
  
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ProfessionalHeader />
      <main className="flex-1 overflow-y-auto pt-16 pb-20 px-4 container max-w-7xl mx-auto">
        <Outlet />
      </main>
      <ProfessionalBottomNav />
    </div>
  );
}
