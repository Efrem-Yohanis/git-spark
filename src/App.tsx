import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Dashboard from "./pages/Dashboard";
import MetricDetail from "./pages/MetricDetail";
import BasePreparation from "./pages/BasePreparation";
import TableDetailPage from "./pages/base-preparation/TableDetailPage";
import CourtIssue from "./pages/ops-support/CourtIssue";
import DormantList from "./pages/ops-support/DormantList";
import Pinlock from "./pages/ops-support/Pinlock";
import SQLQueryLibrary from "./pages/SQLQueryLibrary";
import SQLQueryDetail from "./pages/SQLQueryDetail";
import CCBECampaign from "./pages/campaigns/CCBECampaign";
import GAPinResetCampaign from "./pages/campaigns/GAPinResetCampaign";
import WonBackChurner from "./pages/campaigns/WonBackChurner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="metric/:metricId" element={<MetricDetail />} />
            <Route path="base-preparation" element={<BasePreparation />} />
            <Route path="base-preparation/table/:tableName" element={<TableDetailPage />} />
            <Route path="campaign/ccbe" element={<CCBECampaign />} />
            <Route path="campaign/ga-pin-reset" element={<GAPinResetCampaign />} />
            <Route path="campaign/won-back-churner" element={<WonBackChurner />} />
            <Route path="ops-support/court-issue" element={<CourtIssue />} />
            <Route path="ops-support/dormant-list" element={<DormantList />} />
            <Route path="ops-support/pinlock" element={<Pinlock />} />
            <Route path="sql-query-library" element={<SQLQueryLibrary />} />
            <Route path="sql-query/:queryId" element={<SQLQueryDetail />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
