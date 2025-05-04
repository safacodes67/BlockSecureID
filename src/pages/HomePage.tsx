
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, User, Banknote, Wallet, Shield, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  
  // User authentication states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobile, setUserMobile] = useState("");
  
  // Bank authentication states
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [managerCode, setManagerCode] = useState("");
  
  // Mnemonic phrase (would be generated securely in a production app)
  const [mnemonicPhrase, setMnemonicPhrase] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    // Check if wallet is already connected in localStorage
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  // Function to generate a secure 12-word mnemonic phrase
  const generateMnemonic = () => {
    // In production, this should be cryptographically secure
    // This is a simple placeholder
    const wordList = [
      "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", 
      "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid",
      "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
      "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance",
      "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
      "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album",
      "alcohol", "alert", "alien", "all", "alley", "allow", "almost", "alone"
    ];
    
    const selectedWords = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      selectedWords.push(wordList[randomIndex]);
    }
    
    return selectedWords.join(" ");
  };

  // Function to validate manager code against database
  const validateManagerCode = async (code) => {
    try {
      const { data, error } = await supabase
        .from('manager_codes')
        .select('*')
        .eq('code', code)
        .eq('used', false)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data ? true : false;
    } catch (error) {
      console.error('Error validating manager code:', error);
      return false;
    }
  };

  // Function to mark manager code as used
  const markManagerCodeAsUsed = async (code) => {
    try {
      const { error } = await supabase
        .from('manager_codes')
        .update({ used: true })
        .eq('code', code);
      
      if (error) {
        console.error('Error marking manager code as used:', error);
      }
    } catch (error) {
      console.error('Error marking manager code as used:', error);
    }
  };

  // Handle user registration
  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!userName || !userEmail || !userMobile) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Generate mnemonic phrase
      const mnemonic = generateMnemonic();
      setMnemonicPhrase(mnemonic);
      
      // Store in Supabase
      const { data, error } = await supabase
        .from('user_identities')
        .insert([
          {
            name: userName,
            email: userEmail,
            mobile: userMobile,
            mnemonic_phrase: mnemonic
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration Successful",
        description: "Your identity has been created and stored in the database.",
      });
      
      // Store in localStorage for session
      localStorage.setItem("userAuth", JSON.stringify({
        type: "user",
        name: userName,
        email: userEmail,
        mobile: userMobile,
        mnemonic: mnemonic,
        timestamp: new Date().toISOString()
      }));
    } catch (error: any) {
      console.error('Error creating user identity:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create your identity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bank registration
  const handleBankRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!bankName || !branchName || !ifscCode || !managerCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Validate manager code
      const isValidCode = await validateManagerCode(managerCode);
      if (!isValidCode) {
        toast({
          title: "Authorization Failed",
          description: "Invalid or already used manager code",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Generate mnemonic phrase
      const mnemonic = generateMnemonic();
      setMnemonicPhrase(mnemonic);
      
      // Store in Supabase
      const { data, error } = await supabase
        .from('bank_entities')
        .insert([
          {
            bank_name: bankName,
            branch_name: branchName,
            ifsc_code: ifscCode,
            manager_code: managerCode,
            mnemonic_phrase: mnemonic
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Mark manager code as used
      await markManagerCodeAsUsed(managerCode);
      
      toast({
        title: "Bank Registration Successful",
        description: "Bank identity has been created and stored in the database.",
      });
      
      // Store in localStorage for session
      localStorage.setItem("bankAuth", JSON.stringify({
        type: "bank",
        name: bankName,
        branch: branchName,
        ifsc: ifscCode,
        mnemonic: mnemonic,
        timestamp: new Date().toISOString()
      }));
    } catch (error: any) {
      console.error('Error creating bank entity:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create bank identity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
  
  // Function to continue to dashboard
  const handleContinue = () => {
    navigate("/dashboard");
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
              <CardTitle className="text-2xl text-center">Create Your Digital Identity</CardTitle>
              <CardDescription className="text-center">
                Choose your account type to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Individual User</span>
                  </TabsTrigger>
                  <TabsTrigger value="bank" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    <span>Bank Entity</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* User Registration Form */}
                <TabsContent value="user">
                  <div className="space-y-6">
                    {mnemonicPhrase ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                          <h3 className="text-lg font-medium text-green-800 mb-2">Identity Created Successfully!</h3>
                          <p className="text-green-700 mb-4">Please save your secret recovery phrase:</p>
                          <div className="p-3 bg-white border border-green-300 rounded-md">
                            <p className="font-mono text-sm break-all">{mnemonicPhrase}</p>
                          </div>
                          <p className="mt-4 text-sm text-green-700">
                            This phrase gives you access to your digital identity. Never share it with anyone!
                          </p>
                        </div>
                        <Button className="w-full" onClick={handleContinue}>
                          OK, I've Saved It <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleUserRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="userName">Full Name</Label>
                            <Input
                              id="userName"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="userEmail">Email Address</Label>
                            <Input
                              id="userEmail"
                              type="email"
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userMobile">Mobile Number</Label>
                          <Input
                            id="userMobile"
                            value={userMobile}
                            onChange={(e) => setUserMobile(e.target.value)}
                            placeholder="Enter your mobile number"
                            required
                          />
                        </div>
                        <div className="pt-4">
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating Identity..." : "Create Your Identity"} {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </TabsContent>
                
                {/* Bank Registration Form */}
                <TabsContent value="bank">
                  <div className="space-y-6">
                    {mnemonicPhrase ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                          <h3 className="text-lg font-medium text-blue-800 mb-2">Bank Identity Created Successfully!</h3>
                          <p className="text-blue-700 mb-4">Please save your institutional recovery phrase:</p>
                          <div className="p-3 bg-white border border-blue-300 rounded-md">
                            <p className="font-mono text-sm break-all">{mnemonicPhrase}</p>
                          </div>
                          <p className="mt-4 text-sm text-blue-700">
                            This phrase gives authorized personnel access to your bank's digital identity. Store it securely!
                          </p>
                        </div>
                        <Button className="w-full" onClick={handleContinue}>
                          OK, I've Saved It <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleBankRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                              id="bankName"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              placeholder="Enter bank name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="branchName">Branch Name</Label>
                            <Input
                              id="branchName"
                              value={branchName}
                              onChange={(e) => setBranchName(e.target.value)}
                              placeholder="Enter branch name"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            placeholder="Enter IFSC code"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="managerCode">Manager Authorization Code</Label>
                          <Input
                            id="managerCode"
                            type="text"
                            value={managerCode}
                            onChange={(e) => setManagerCode(e.target.value)}
                            placeholder="e.g., MGRA1234"
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter one of the test codes: MGRA1234 or MGRB5678
                          </p>
                        </div>
                        <div className="pt-4">
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating Bank Identity..." : "Create Bank Identity"} {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
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
                  <Link className="h-5 w-5 text-blue-600" />
                  Check URL Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Verify website security and protect yourself from phishing attempts
                  with our blockchain-powered URL verification tool.
                </p>
                <Button 
                  onClick={() => navigate("/url-checker")}
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-100"
                >
                  Security Check Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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
                    <User className="h-5 w-5 text-purple-600" />
                    Consent Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Control who has access to your data with our decentralized 
                    consent management system.
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;
