
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, User, Banknote, Wallet, Shield, Link, Camera, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { connectWallet, isMetaMaskInstalled } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");

  // Check for wallet connection and auth status on mount
  React.useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
    
    // Check if user is already logged in
    const userAuth = localStorage.getItem("userAuth");
    const bankAuth = localStorage.getItem("bankAuth");
    
    if (userAuth || bankAuth) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask extension to connect your wallet",
          variant: "destructive",
        });
        window.open("https://metamask.io/download/", "_blank");
        return;
      }
      
      toast({
        title: "Connecting Wallet",
        description: "Please approve the connection request in MetaMask",
      });
      
      const accounts = await connectWallet();
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });
        
        // Store wallet address
        localStorage.setItem("walletAddress", accounts[0]);
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  // Handle navigation to auth page
  const handleAuthNavigation = (defaultTab: string = "login") => {
    navigate("/auth", { state: { defaultTab } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">Secure Your Digital Identity on the Blockchain</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              BlockSecure ID provides a decentralized solution for protecting your personal information,
              managing consent, and fighting fraud through blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                size="lg" 
                className="bg-white text-purple-900 hover:bg-purple-50"
                onClick={() => handleAuthNavigation("signup")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => handleAuthNavigation("login")}
              >
                Log In
              </Button>
            </div>
          </div>
          
          {/* Main Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur border-0 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-300" />
                  KYC Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100">
                  Complete our secure KYC process with facial recognition and document verification to 
                  establish your immutable digital identity.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-0 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-purple-300" />
                  Instant Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100">
                  Apply for loans with trusted bank partners using your verified identity. 
                  No paperwork, instant approvals, and competitive rates.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-0 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-purple-300" />
                  Blockchain Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100">
                  Your identity is secured on the blockchain, giving you complete control over 
                  who can access your personal information.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Connect Wallet and Support Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connect Wallet */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-purple-600" />
                  Connect Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your MetaMask wallet to interact with our blockchain features 
                  and securely manage your digital identity.
                </p>
                <Button 
                  onClick={handleConnectWallet} 
                  variant="outline" 
                  className="w-full border-purple-200 hover:bg-purple-100"
                >
                  {walletAddress ? 
                    `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
                    "Connect Wallet"
                  }
                </Button>
              </CardContent>
            </Card>
            
            {/* Help & Support */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Need assistance with our platform? Access our user manual or contact our helpline for personalized support.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => navigate("/user-manual")}
                    variant="outline"
                    className="w-full border-blue-200 hover:bg-blue-100"
                  >
                    User Manual
                  </Button>
                  <Button 
                    onClick={() => navigate("/contact")}
                    variant="outline"
                    className="w-full border-blue-200 hover:bg-blue-100"
                  >
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* How It Works Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">How BlockSecure ID Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-700">1</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create Account</h3>
                  <p className="text-sm text-gray-600">
                    Sign up as an individual user or bank entity and connect your wallet to the platform.
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2 text-purple-600"
                    onClick={() => handleAuthNavigation("signup")}
                  >
                    Get Started <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-700">2</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Verify Identity</h3>
                  <p className="text-sm text-gray-600">
                    Complete facial recognition and submit your documents for KYC verification.
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2 text-purple-600"
                    onClick={() => navigate("/kyc")}
                  >
                    Learn More <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-700">3</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Access Services</h3>
                  <p className="text-sm text-gray-600">
                    Apply for loans, manage consents, and use your secure digital identity across services.
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2 text-purple-600"
                    onClick={() => navigate("/loans")}
                  >
                    Explore Services <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* About Us */}
          <Card className="bg-white/30 backdrop-blur border-0">
            <CardHeader>
              <CardTitle className="text-white">About BlockSecure ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                BlockSecure ID is a blockchain-based identity management platform that helps users and banks 
                secure their digital identity, manage consent, and protect against fraud. Our solution provides 
                advanced security through decentralized identity technology.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
