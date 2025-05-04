
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, Home, UserCircle, FileCheck, Flag, Menu, X, Search, Book, LogOut
} from "lucide-react";
import { connectWallet, switchToMumbaiNetwork } from "@/lib/blockchain";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const navItems = [
  { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
  { name: "Dashboard", path: "/dashboard", icon: <Shield className="h-5 w-5" /> },
  { name: "Identity", path: "/identity", icon: <UserCircle className="h-5 w-5" /> },
  { name: "Consents", path: "/consents", icon: <FileCheck className="h-5 w-5" /> },
  { name: "Fraud Reports", path: "/fraud-reports", icon: <Flag className="h-5 w-5" /> },
  { name: "URL Checker", path: "/url-checker", icon: <Search className="h-5 w-5" /> },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected in localStorage
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      toast({
        title: "Connecting Wallet",
        description: "Please approve the connection request in MetaMask",
      });
      
      // First connect to wallet
      const accounts = await connectWallet();
      
      // Then switch to Mumbai network
      await switchToMumbaiNetwork();
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        
        // Store wallet address
        localStorage.setItem("walletAddress", address);
        
        // Update the user or bank entity in Supabase if relevant
        const userAuth = localStorage.getItem("userAuth");
        const bankAuth = localStorage.getItem("bankAuth");
        
        if (userAuth) {
          const userData = JSON.parse(userAuth);
          const { data, error } = await supabase
            .from('user_identities')
            .update({ wallet_address: address })
            .eq('email', userData.email);
            
          if (error) {
            console.error("Failed to update user wallet:", error);
          }
        } else if (bankAuth) {
          const bankData = JSON.parse(bankAuth);
          const { data, error } = await supabase
            .from('bank_entities')
            .update({ wallet_address: address })
            .eq('bank_name', bankData.name)
            .eq('branch_name', bankData.branch);
            
          if (error) {
            console.error("Failed to update bank wallet:", error);
          }
        }
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("userAuth");
      localStorage.removeItem("bankAuth");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      window.location.href = "/";
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-white" />
              <span className="text-xl font-bold">BlockSecure ID</span>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-white/10
                              ${location.pathname === item.path 
                                ? 'bg-white/20 font-medium' 
                                : 'text-gray-200'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto">
            <DialogTrigger asChild onClick={() => setShowManual(true)}>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <Book className="h-5 w-5 mr-3" />
                <span>User Manual</span>
              </Button>
            </DialogTrigger>
            
            <Button 
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Log Out</span>
            </Button>
          </div>

          <div className="p-4 mt-2">
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium mb-2">Blockchain Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <p className="text-xs">Polygon Mainnet Connected</p>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              onClick={handleConnectWallet}
              disabled={isConnecting}
            >
              {isConnecting 
                ? "Connecting..." 
                : walletAddress 
                  ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
                  : "Connect Wallet"
              }
            </Button>
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
      
      {/* User Manual Dialog */}
      <Dialog open={showManual} onOpenChange={setShowManual}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">BlockSecure ID User Manual</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium mb-2">Getting Started</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Create an Account</strong>: Register as an individual user or bank entity by providing the required information.
                </li>
                <li>
                  <strong>Save Your Recovery Phrase</strong>: After registration, you'll receive a 12-word recovery phrase. Store it securely as it's needed for account recovery.
                </li>
                <li>
                  <strong>Connect Your Wallet</strong>: Link your MetaMask wallet to enable blockchain interactions.
                </li>
                <li>
                  <strong>Complete KYC</strong>: Upload necessary identification documents in the Identity section.
                </li>
              </ol>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-2">Account Management</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Profile Updates</strong>: Modify your personal information in the Identity section.
                </li>
                <li>
                  <strong>Document Management</strong>: Upload and manage your KYC documents, including ID proof and digital signatures.
                </li>
                <li>
                  <strong>Account Recovery</strong>: Use your 12-word phrase or facial recognition if you forget your password.
                </li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Digital Identity</strong>: Manage your blockchain-based decentralized identity.
                </li>
                <li>
                  <strong>Consent Management</strong>: Control who can access your personal information.
                </li>
                <li>
                  <strong>Fraud Reporting</strong>: Report suspicious websites or fraudulent activities.
                </li>
                <li>
                  <strong>URL Security</strong>: Verify website security before proceeding.
                </li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-2">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">What is a recovery phrase?</p>
                  <p className="text-sm text-muted-foreground">A 12-word phrase generated during account creation that allows you to recover your account if you forget your password.</p>
                </div>
                <div>
                  <p className="font-medium">How does facial recognition work?</p>
                  <p className="text-sm text-muted-foreground">During registration, you can opt to register your face, which can be used as an alternative recovery method if you forget your password and recovery phrase.</p>
                </div>
                <div>
                  <p className="font-medium">Why do I need to connect a wallet?</p>
                  <p className="text-sm text-muted-foreground">The wallet connection enables blockchain interactions for securing your identity and verifying transactions.</p>
                </div>
                <div>
                  <p className="font-medium">What documents should I upload for KYC?</p>
                  <p className="text-sm text-muted-foreground">You should upload government-issued identification (Aadhaar, PAN, passport) and any additional documents required for verification.</p>
                </div>
                <div>
                  <p className="font-medium">How secure is my data?</p>
                  <p className="text-sm text-muted-foreground">Your data is secured using blockchain technology and encrypted storage. Only you control who can access your information.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="mb-3">Contact our support team for assistance:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-3">
                  <p className="font-medium">Vinutha</p>
                  <p className="text-sm">Phone: 7676890636</p>
                  <p className="text-sm">Email: vinuthah355@gmail.com</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="font-medium">Sumayya Fatima</p>
                  <p className="text-sm">Phone: 9380086453</p>
                  <p className="text-sm">Email: sumayyaf166@gmail.com</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="font-medium">Chandana</p>
                  <p className="text-sm">Phone: 7348961739</p>
                  <p className="text-sm">Email: reddychandhana974@gmail.com</p>
                </div>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Spacer for content on desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
};
