
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Identity from "./pages/Identity";
import CreateIdentity from "./pages/CreateIdentity";
import Consents from "./pages/Consents";
import FraudReports from "./pages/FraudReports";
import LoansPage from "./pages/LoansPage";
import UrlCheckerPage from "./pages/UrlCheckerPage";
import UserManual from "./pages/UserManual";
import Contact from "./pages/Contact";
import AuthPage from "./pages/AuthPage";
import KYCPage from "./pages/KYCPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/identity" element={<Identity />} />
              <Route path="/create-identity" element={<CreateIdentity />} />
              <Route path="/consents" element={<Consents />} />
              <Route path="/fraud-reports" element={<FraudReports />} />
              <Route path="/loans" element={<LoansPage />} />
              <Route path="/url-checker" element={<UrlCheckerPage />} />
              <Route path="/user-manual" element={<UserManual />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/kyc" element={<KYCPage />} />
            </Route>
            
            {/* Legacy route */}
            <Route path="/index" element={<Index />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
