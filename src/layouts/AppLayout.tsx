
import { TopNavbar } from "@/components/TopNavbar";
import { BottomNavbar } from "@/components/BottomNavbar";
import { useUser } from "@/contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export function AppLayout() {
  const { isAuthenticated, isLoading, user } = useUser();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="animate-pulse-soft text-center">
          <div className="h-10 w-10 rounded-full bg-mindscape-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect admins to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <div className="mobile-container">
      <TopNavbar />
      <main className="page-container">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
}
