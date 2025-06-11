
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserCircle, CheckCircle, Shield } from "lucide-react";

interface IdentityData {
  did: string;
  createdOn: string;
  transactionHash: string;
  name?: string;
  email?: string;
  phone?: string;
  aadharNumber?: string;
  panNumber?: string;
  walletAddress?: string;
  type?: "user" | "bank";
}

interface IdentityOverviewProps {
  identityStatus: "not_created" | "creating" | "created";
  identityData: IdentityData | null;
}

const IdentityOverview: React.FC<IdentityOverviewProps> = ({ identityStatus, identityData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity Overview</CardTitle>
        <CardDescription>Your decentralized identity information</CardDescription>
      </CardHeader>
      <CardContent>
        {identityStatus === "not_created" ? (
          <div className="text-center py-8">
            <UserCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Blockchain Identity Found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created your blockchain identity yet
            </p>
            <Button onClick={() => window.location.href = '/create-identity'}>Create Blockchain Identity</Button>
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
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Blockchain Identity Verified</p>
                <p className="text-sm text-muted-foreground">Your digital identity is active on the blockchain</p>
              </div>
            </div>
            
            <div className="space-y-4 border rounded-md p-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">DID Identifier</p>
                  <p className="font-mono">{identityData?.did}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created On</p>
                  <p>{identityData?.createdOn}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="text-green-500">Active</p>
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground">Transaction Hash</p>
                <p className="font-mono text-xs break-all">{identityData?.transactionHash}</p>
              </div>
              
              {identityData?.walletAddress && (
                <div>
                  <p className="text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-xs break-all">{identityData.walletAddress}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-muted-foreground">Personal Information</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {identityData?.name}</p>
                    <p><strong>Email:</strong> {identityData?.email}</p>
                    <p><strong>Phone:</strong> {identityData?.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Identity Documents</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Aadhar:</strong> {identityData?.aadharNumber ? `****${identityData.aadharNumber.slice(-4)}` : 'Not provided'}</p>
                    <p><strong>PAN:</strong> {identityData?.panNumber ? `****${identityData.panNumber.slice(-4)}` : 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-blue-800">Identity Protection</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Your identity is secured with blockchain technology and stored in the Supabase database.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Revoke Identity</Button>
              <Button>Manage Access</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentityOverview;
