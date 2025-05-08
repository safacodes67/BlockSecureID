
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Identity from "./pages/Identity";
import Consents from "./pages/Consents";
import FraudReports from "./pages/FraudReports";
import UrlCheckerPage from "./pages/UrlCheckerPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import KYCPage from "./pages/KYCPage";
import LoansPage from "./pages/LoansPage";
import Contact from "./pages/Contact";
import UserManual from "./pages/UserManual";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
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
            <Route path="/kyc" element={
              <MainLayout>
                <KYCPage />
              </MainLayout>
            } />
            <Route path="/loans" element={
              <MainLayout>
                <LoansPage />
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
            <Route path="/contact" element={
              <MainLayout>
                <Contact />
              </MainLayout>
            } />
            <Route path="/user-manual" element={
              <MainLayout>
                <UserManual />
              </MainLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
