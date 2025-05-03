
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, Home, UserCircle, FileCheck, Flag, Menu, X
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
  { name: "Identity", path: "/identity", icon: <UserCircle className="h-5 w-5" /> },
  { name: "Consents", path: "/consents", icon: <FileCheck className="h-5 w-5" /> },
  { name: "Fraud Reports", path: "/fraud-reports", icon: <Flag className="h-5 w-5" /> },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button 
        variant="outline" 
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blockchain-primary" />
              <span className="text-xl font-bold">BlockSecure ID</span>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800
                              ${location.pathname === item.path 
                                ? 'bg-blockchain-muted text-blockchain-primary font-medium' 
                                : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <ConnectWalletButton />
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Spacer for content on desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
};

// Placeholder wallet connection button
const ConnectWalletButton = () => {
  return (
    <Button className="w-full gradient-bg">
      Connect Wallet
    </Button>
  );
};
