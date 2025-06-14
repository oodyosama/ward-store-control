
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WarehouseProvider } from "@/contexts/WarehouseContext";
import Index from "./pages/Index";
import ItemsPageWithSupabase from "./pages/ItemsPageWithSupabase";
import WarehousesPage from "./pages/WarehousesPage";
import TransactionsPage from "./pages/TransactionsPage";
import ReportsPage from "./pages/ReportsPage";
import ScannerPage from "./pages/ScannerPage";
import ArchivePage from "./pages/ArchivePage";
import UsersPage from "./pages/UsersPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import POSPage from "./pages/POSPage";
import NotFound from "./pages/NotFound";

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
        <WarehouseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/items" element={<ItemsPageWithSupabase />} />
              <Route path="/warehouses" element={<WarehousesPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/pos" element={<POSPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WarehouseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
