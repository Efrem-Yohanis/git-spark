import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/Dashboard";
import MetricDetail from "./pages/MetricDetail";
import BasePreparation from "./pages/BasePreparation";
import TableDetailPage from "./pages/base-preparation/TableDetailPage";
import CBECampaign from "./pages/campaigns/CBECampaign";
import WinbackChurner from "./pages/campaigns/WinbackChurner";
import PinReset from "./pages/campaigns/PinReset";
import CourtIssue from "./pages/ops-support/CourtIssue";
import DormantList from "./pages/ops-support/DormantList";
import DormantListPerformance from "./pages/ops-support/DormantListPerformance";
import Pinlock from "./pages/ops-support/Pinlock";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="metric/:metricId" element={<MetricDetail />} />
              <Route path="base-preparation" element={<BasePreparation />} />
              <Route path="base-preparation/table/:tableName" element={<TableDetailPage />} />
              <Route path="campaigns/cbe" element={<CBECampaign />} />
              <Route path="campaigns/winback" element={<WinbackChurner />} />
              <Route path="campaigns/ga-pin-reset/pin-reset" element={<PinReset />} />
              <Route path="ops-support/court-issue" element={<CourtIssue />} />
              <Route path="ops-support/dormant-list" element={<DormantList />} />
              <Route path="ops-support/dormant-list-performance" element={<DormantListPerformance />} />
              <Route path="ops-support/pinlock" element={<Pinlock />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
