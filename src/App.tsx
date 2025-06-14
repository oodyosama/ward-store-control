
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WarehouseProvider } from "@/contexts/WarehouseContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ItemsPageWithSupabase from "./pages/ItemsPageWithSupabase";
import WarehousesPage from "./pages/WarehousesPage";
import TransactionsPage from "./pages/TransactionsPage";
import ReportsPage from "./pages/ReportsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ScannerPage from "./pages/ScannerPage";
import ArchivePage from "./pages/ArchivePage";
import UsersPage from "./pages/UsersPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import POSPage from "./pages/POSPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Permission Protected Route component
function PermissionProtectedRoute({ 
  children, 
  requiredPermission 
}: { 
  children: React.ReactNode;
  requiredPermission: string;
}) {
  const { isAuthenticated, hasPermission, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasPermission(requiredPermission) && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Admin Protected Route component
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// App Routes component that uses auth context
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/items" element={
        <PermissionProtectedRoute requiredPermission="manage_items">
          <ItemsPageWithSupabase />
        </PermissionProtectedRoute>
      } />
      <Route path="/warehouses" element={
        <PermissionProtectedRoute requiredPermission="manage_warehouses">
          <WarehousesPage />
        </PermissionProtectedRoute>
      } />
      <Route path="/transactions" element={
        <PermissionProtectedRoute requiredPermission="manage_transactions">
          <TransactionsPage />
        </PermissionProtectedRoute>
      } />
      <Route path="/reports" element={
        <PermissionProtectedRoute requiredPermission="view_reports">
          <ReportsPage />
        </PermissionProtectedRoute>
      } />
      <Route path="/analytics" element={
        <PermissionProtectedRoute requiredPermission="view_reports">
          <AnalyticsPage />
        </PermissionProtectedRoute>
      } />
      <Route path="/scanner" element={
        <ProtectedRoute>
          <ScannerPage />
        </ProtectedRoute>
      } />
      <Route path="/archive" element={
        <ProtectedRoute>
          <ArchivePage />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <PermissionProtectedRoute requiredPermission="manage_users">
          <UsersPage />
        </PermissionProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <PermissionProtectedRoute requiredPermission="system_settings">
          <SettingsPage />
        </PermissionProtectedRoute>
      } />
      <Route path="/pos" element={
        <PermissionProtectedRoute requiredPermission="pos_access">
          <POSPage />
        </PermissionProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WarehouseProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </WarehouseProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
