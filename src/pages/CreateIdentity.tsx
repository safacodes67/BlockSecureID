
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wallet, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { connectWallet, isMetaMaskInstalled, createBlockchainIdentity } from "@/lib/blockchain";

const CreateIdentity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadharNumber: "",
    panNumber: ""
  });

  const handleConnectWallet = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to create your blockchain identity",
          variant: "destructive",
        });
        return;
      }

      const accounts = await connectWallet();
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your MetaMask wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.aadharNumber || !formData.panNumber) {
      toast({
        title: "All Fields Required",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create blockchain identity
      const blockchainResult = await createBlockchainIdentity({
        ...formData,
        walletAddress
      });

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check localStorage for user auth as fallback
      const userAuth = localStorage.getItem("userAuth");
      let userId = null;

      if (session) {
        // Get user from Supabase session
        const { data: userData } = await supabase
          .from("user_identities")
          .select("id")
          .eq("email", session.user.email)
          .single();
        userId = userData?.id;
      } else if (userAuth) {
        // Get user from localStorage
        const userData = JSON.parse(userAuth);
        userId = userData.id;
      }

      if (!userId) {
        throw new Error("User not found. Please login again.");
      }

      // Update user identity with blockchain data
      const { error: updateError } = await supabase
        .from("user_identities")
        .update({
          wallet_address: walletAddress,
          kyc_documents: {
            ...formData,
            blockchain_identity: blockchainResult,
            created_at: new Date().toISOString()
          }
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      toast({
        title: "Identity Created Successfully",
        description: "Your blockchain identity has been created and stored securely",
      });

      navigate("/identity");

    } catch (error: any) {
      console.error("Error creating identity:", error);
      toast({
        title: "Identity Creation Failed",
        description: error.message || "Failed to create blockchain identity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Create Your Blockchain Identity
            </CardTitle>
            <CardDescription>
              Connect your wallet and provide your details to create a secure blockchain identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Connection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 1: Connect Your Wallet</h3>
              {!isConnected ? (
                <Button onClick={handleConnectWallet} className="w-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect MetaMask Wallet
                </Button>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 font-medium">✓ Wallet Connected</p>
                  <p className="text-green-600 text-sm">{walletAddress}</p>
                </div>
              )}
            </div>

            {/* Identity Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 2: Provide Your Details</h3>
              <form onSubmit={handleCreateIdentity} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                    <Input
                      id="aadharNumber"
                      name="aadharNumber"
                      type="text"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 12-digit Aadhar number"
                      maxLength={12}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="panNumber">PAN Card Number *</Label>
                    <Input
                      id="panNumber"
                      name="panNumber"
                      type="text"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-character PAN number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!isConnected || loading}
                >
                  {loading ? "Creating Identity..." : "Create Blockchain Identity"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateIdentity;
