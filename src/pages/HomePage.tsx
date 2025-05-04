
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, User, Banknote, Wallet, Shield, Link, Camera, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState("user");
  const [walletAddress, setWalletAddress] = useState("");

  // Check for wallet connection on mount
  React.useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
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
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Secure Your Digital Identity on the Blockchain</h1>
            <p className="text-xl text-purple-100">
              BlockSecure ID provides a decentralized solution for protecting your personal information,
              managing consent, and fighting fraud through blockchain technology.
            </p>
          </div>
          
          {/* Main Card */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-center">BlockSecure ID Authentication</CardTitle>
              <CardDescription className="text-center">
                Login or create a new account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <div className="mb-6">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger 
                      value="user" 
                      onClick={() => setUserType("user")}
                      className={userType === "user" ? "bg-purple-100" : ""}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>Individual</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="bank" 
                      onClick={() => setUserType("bank")}
                      className={userType === "bank" ? "bg-blue-100" : ""}
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      <span>Bank</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Login Form Tab */}
                <TabsContent value="login">
                  <LoginForm userType={userType} />
                </TabsContent>
                
                {/* Sign Up Form Tab */}
                <TabsContent value="signup">
                  <SignupForm userType={userType} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Additional Actions */}
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
            
            {/* Security Check */}
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
          
          {/* Features Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">Blockchain-Powered Security Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Identity Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Your digital identity is secured with blockchain technology, 
                    providing tamper-proof protection for your personal information.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-purple-600" />
                    Facial Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Recover your account using our secure facial recognition technology
                    if you ever forget your recovery phrase.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link className="h-5 w-5 text-purple-600" />
                    Fraud Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Verify websites and report fraud to protect the community 
                    from phishing and other online threats.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* About Us Summary */}
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
