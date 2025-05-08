
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, User, Shield, Camera, ArrowRight } from "lucide-react";
import { connectWallet } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Secure Your Digital Identity on the <span className="text-purple-300">Blockchain</span>
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              BlockSecure ID provides a decentralized solution for protecting your personal information,
              managing consent, and fighting fraud through blockchain technology.
            </p>
            
            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-lg py-6"
                onClick={() => navigate("/auth", { state: { defaultTab: "login" } })}
              >
                Log In <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-purple-300 text-purple-100 hover:bg-purple-900/50 text-lg py-6"
                onClick={() => navigate("/auth", { state: { defaultTab: "signup" } })}
              >
                Sign Up <User className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/15 transition-all">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-indigo-500/30 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Identity Protection</h3>
                <p className="text-purple-100">Your digital identity is secured with blockchain technology, providing tamper-proof protection.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/15 transition-all">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-purple-500/30 flex items-center justify-center mb-4">
                  <Camera className="h-7 w-7 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Facial Recognition</h3>
                <p className="text-purple-100">Recover your account using our secure facial recognition technology.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/15 transition-all">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="h-14 w-14 rounded-full bg-indigo-500/30 flex items-center justify-center mb-4">
                  <Wallet className="h-7 w-7 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Blockchain Security</h3>
                <p className="text-purple-100">Connect your wallet and securely manage your digital identity and documents.</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Connect Wallet */}
            <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-0 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <Wallet className="h-5 w-5 text-purple-300 mr-2" />
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-purple-100 mb-4">
                  Connect your MetaMask wallet to interact with our blockchain features 
                  and securely manage your digital identity.
                </p>
                <Button 
                  onClick={handleConnectWallet} 
                  variant="outline" 
                  className="w-full border-purple-300 text-purple-100 hover:bg-purple-800/50"
                >
                  {walletAddress ? 
                    `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
                    "Connect Wallet"
                  }
                </Button>
              </CardContent>
            </Card>
            
            {/* Help & Support */}
            <Card className="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 border-0 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <Shield className="h-5 w-5 text-indigo-300 mr-2" />
                  Help & Support
                </h3>
                <p className="text-sm text-purple-100 mb-4">
                  Need assistance with our platform? Access our user manual or contact our helpline for personalized support.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => navigate("/user-manual")}
                    variant="outline"
                    className="border-indigo-300 text-purple-100 hover:bg-indigo-800/50"
                  >
                    User Manual
                  </Button>
                  <Button 
                    onClick={() => navigate("/contact")}
                    variant="outline"
                    className="border-indigo-300 text-purple-100 hover:bg-indigo-800/50"
                  >
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Footer Banner */}
          <div className="text-center py-8">
            <p className="text-purple-300 font-semibold">BlockSecure ID — Powered by Blockchain Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
