
import { useUser } from "@/contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useUser();
  
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
  
  // Redirect to home if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
