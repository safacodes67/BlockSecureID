
import React from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <Outlet />
      </div>
      <Toaster />
      <Sonner />
    </div>
  );
};

export default MainLayout;
