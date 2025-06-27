import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { SettingsProvider } from "@/contexts/SettingsContext";

// Layouts
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProfessionalLayout } from "@/layouts/ProfessionalLayout";

// Auth Pages
import Auth from "@/pages/auth/Auth";
import AdminLogin from "@/pages/auth/AdminLogin";
import ProfessionalLogin from "@/pages/auth/ProfessionalLogin";

// App Pages
import Home from "@/pages/home/Home";
import Journal from "@/pages/journal/Journal";
import Community from "@/pages/community/Community";
import CategoryPosts from "@/pages/community/CategoryPosts";
import PostDetails from "@/pages/community/PostDetails";
import Mindful from "@/pages/mindful/Mindful";
import Insights from "@/pages/insights/Insights";
import HabitTracker from "@/pages/habit-tracker/HabitTracker";
import Settings from "@/pages/profile/Settings";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ProfessionalVerifications from "@/pages/admin/ProfessionalVerifications";
import ReportedContent from "@/pages/admin/ReportedContent";
import AdminSettings from "@/pages/admin/AdminSettings";
import UserManagement from "@/pages/admin/UserManagement";
import AdminCommunity from "@/pages/admin/AdminCommunity";
import AdminCategoryPosts from "@/pages/admin/AdminCategoryPosts";
import AdminPostDetails from "@/pages/admin/AdminPostDetails";

// Professional Pages
import ProfessionalHome from "@/pages/professional/ProfessionalHome";
import ProfessionalCommunity from "@/pages/professional/ProfessionalCommunity";
import ProfessionalSettings from "@/pages/professional/ProfessionalSettings";
import ProfessionalCategoryPosts from "@/pages/professional/ProfessionalCategoryPosts";
import ProfessionalPostDetails from "@/pages/professional/ProfessionalPostDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route index element={<Auth />} />
                <Route path="admin" element={<AdminLogin />} />
                <Route path="professional" element={<ProfessionalLogin />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="verifications" element={<ProfessionalVerifications />} />
                <Route path="reports" element={<ReportedContent />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="community" element={<AdminCommunity />} />
                <Route path="community/category/:categoryId" element={<AdminCategoryPosts />} />
                <Route path="community/post/:postId" element={<AdminPostDetails />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
              
              {/* Professional Routes */}
              <Route path="/professional" element={<ProfessionalLayout />}>
                <Route index element={<ProfessionalHome />} />
                <Route path="community" element={<ProfessionalCommunity />} />
                <Route path="community/category/:categoryId" element={<ProfessionalCategoryPosts />} />
                <Route path="community/post/:postId" element={<ProfessionalPostDetails />} />
                <Route path="settings" element={<ProfessionalSettings />} />
                <Route path="*" element={<Navigate to="/professional" replace />} />
              </Route>
              
              {/* App Routes */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="journal" element={<Journal />} />
                <Route path="community" element={<Community />} />
                <Route path="community/category/:categoryId" element={<CategoryPosts />} />
                <Route path="community/post/:postId" element={<PostDetails />} />
                <Route path="mindful" element={<Mindful />} />
                <Route path="insights" element={<Insights />} />
                <Route path="habit-tracker" element={<HabitTracker />} />
                <Route path="profile/settings" element={<Settings />} />
              </Route>
              
              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
