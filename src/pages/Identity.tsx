
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Upload, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Identity = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [identityStatus, setIdentityStatus] = useState<"not_created" | "creating" | "created">("not_created");
  
  // Placeholder function to simulate creating identity
  const handleCreateIdentity = () => {
    setIdentityStatus("creating");
    // Simulate blockchain delay
    setTimeout(() => {
      setIdentityStatus("created");
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
                        <p className="font-mono">did:polygon:0x3ab...e45f</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created On</p>
                        <p>May 3, 2025</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="text-blockchain-primary">Active</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Transaction Hash</p>
                      <p className="font-mono">0x7d8c9a4b5f6e7d8c9a4b5f6e7d8c9a4b5f6e7d8c</p>
                    </div>
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
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter your full name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number (Last 4 digits only)</Label>
                  <Input id="aadhaar" placeholder="Enter last 4 digits" maxLength={4} />
                  <p className="text-xs text-muted-foreground">We only store a hash of this information for verification purposes</p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleCreateIdentity}>Create Identity</Button>
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
                  <Button>Browse Files</Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Document Security</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your documents are encrypted and only accessible with your consent. Only document hashes 
                    are stored on the blockchain, ensuring privacy and security.
                  </p>
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
