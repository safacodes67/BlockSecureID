
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Identity from "./pages/Identity";
import Consents from "./pages/Consents";
import FraudReports from "./pages/FraudReports";
import UrlCheckerPage from "./pages/UrlCheckerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/identity" element={
            <MainLayout>
              <Identity />
            </MainLayout>
          } />
          <Route path="/consents" element={
            <MainLayout>
              <Consents />
            </MainLayout>
          } />
          <Route path="/fraud-reports" element={
            <MainLayout>
              <FraudReports />
            </MainLayout>
          } />
          <Route path="/url-checker" element={
            <MainLayout>
              <UrlCheckerPage />
            </MainLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
