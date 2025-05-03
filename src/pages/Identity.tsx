
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Upload, CheckCircle, Shield, AlertCircle, Key, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Identity = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [identityStatus, setIdentityStatus] = useState<"not_created" | "creating" | "created">("not_created");
  const [identityData, setIdentityData] = useState<{
    did: string;
    createdOn: string;
    transactionHash: string;
  } | null>(null);
  const { toast } = useToast();
  
  // Check localStorage on mount to see if identity exists
  useEffect(() => {
    const storedIdentity = localStorage.getItem("userIdentity");
    if (storedIdentity) {
      try {
        setIdentityData(JSON.parse(storedIdentity));
        setIdentityStatus("created");
      } catch (e) {
        console.error("Error parsing stored identity", e);
      }
    }
  }, []);

  // Simulate connecting to Supabase
  const connectToSupabase = () => {
    toast({
      title: "Supabase Connection Required",
      description: "Please connect this project to Supabase to enable digital identity storage.",
      variant: "destructive",
    });
  };
  
  // Placeholder function to simulate creating identity
  const handleCreateIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Creating Digital Identity",
      description: "Processing your identity on the blockchain...",
    });
    
    setIdentityStatus("creating");
    
    // Simulate blockchain delay
    setTimeout(() => {
      // Create a new identity
      const newIdentity = {
        did: `did:polygon:0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        createdOn: "May 3, 2025",
        transactionHash: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      };
      
      // Store in localStorage
      localStorage.setItem("userIdentity", JSON.stringify(newIdentity));
      
      // Update state
      setIdentityData(newIdentity);
      setIdentityStatus("created");
      
      toast({
        title: "Identity Created",
        description: "Your digital identity has been successfully created and recorded on the blockchain.",
      });
      
      connectToSupabase();
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Digital Identity</h1>
        <p className="text-muted-foreground">Manage your secure decentralized identity (DID)</p>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Identity</TabsTrigger>
          <TabsTrigger value="documents">KYC Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Identity Overview</CardTitle>
              <CardDescription>Your decentralized identity information</CardDescription>
            </CardHeader>
            <CardContent>
              {identityStatus === "not_created" ? (
                <div className="text-center py-8">
                  <UserCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Identity Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created your digital identity yet
                  </p>
                  <Button onClick={() => setSelectedTab("create")}>Create Identity</Button>
                </div>
              ) : identityStatus === "creating" ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-4">Creating Your Identity...</h3>
                  <Progress value={66} className="mb-4" />
                  <p className="text-muted-foreground">
                    This may take a few moments as we secure your identity on the blockchain
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blockchain-muted p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-blockchain-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Identity Verified</p>
                      <p className="text-sm text-muted-foreground">Your digital identity is active on the blockchain</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">DID Identifier</p>
                        <p className="font-mono">{identityData?.did || "did:polygon:0x3ab...e45f"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created On</p>
                        <p>{identityData?.createdOn || "May 3, 2025"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="text-blockchain-primary">Active</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Transaction Hash</p>
                      <p className="font-mono">{identityData?.transactionHash || "0x7d8c9a4b5f6e7d8c9a4b5f6e7d8c9a4b5f6e7d8c"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-blue-800">Identity Protection</h3>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Your identity is secured with blockchain technology. For permanent storage and advanced features,
                      connect to Supabase.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                      onClick={connectToSupabase}
                    >
                      Connect to Supabase
                    </Button>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Revoke Identity</Button>
                    <Button>Manage Access</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Digital Identity</CardTitle>
              <CardDescription>Set up your secure identity on the Polygon blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleCreateIdentity}>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter your full name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number (Last 4 digits only)</Label>
                  <Input id="aadhaar" placeholder="Enter last 4 digits" maxLength={4} required />
                  <p className="text-xs text-muted-foreground">We only store a hash of this information for verification purposes</p>
                </div>

                <div className="bg-amber-50 p-4 rounded border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Storage Notice</h4>
                    <p className="text-sm text-amber-700">
                      For permanent storage of your digital identity, this app needs to be connected to Supabase.
                      Currently, your identity will be stored locally in the browser.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Create Identity</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
              <CardDescription>Upload and manage your identity verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border border-dashed rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your documents here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supported formats: PDF, JPG, PNG (Max: 5MB)
                  </p>
                  <Button onClick={connectToSupabase}>Browse Files</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 flex items-start gap-3">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Personal ID</h4>
                      <p className="text-sm text-muted-foreground">
                        Aadhaar Card, PAN Card, or Voter ID
                      </p>
                      <Button size="sm" variant="outline" className="mt-2" onClick={connectToSupabase}>
                        Upload
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 flex items-start gap-3">
                    <Key className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Digital Signature</h4>
                      <p className="text-sm text-muted-foreground">
                        Required for digital document signing
                      </p>
                      <Button size="sm" variant="outline" className="mt-2" onClick={connectToSupabase}>
                        Create
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Document Security</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your documents are encrypted and only accessible with your consent. Only document hashes 
                    are stored on the blockchain, ensuring privacy and security.
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-green-700">
                        <strong>Enhanced Security:</strong> Connect to Supabase to enable encrypted document storage with bank-level security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Identity;
