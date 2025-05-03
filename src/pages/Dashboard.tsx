
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Flag } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to BlockSecure ID</h1>
        <p className="text-muted-foreground">Secure your digital identity and manage consent on the blockchain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blockchain-primary" />
              <span>Digital Identity</span>
            </CardTitle>
            <CardDescription>Your secure on-chain identity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-2">
              <p className="text-sm mb-4">Create or manage your decentralized identity to secure your personal information.</p>
              <Button className="w-full" variant="outline">Manage Identity</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-blockchain-primary" />
              <span>Consent Requests</span>
            </CardTitle>
            <CardDescription>Pending requests: 2</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-2">
              <p className="text-sm mb-4">Review and approve consent requests from lenders and financial institutions.</p>
              <Button className="w-full" variant="outline">View Requests</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5 text-blockchain-primary" />
              <span>Fraud Reports</span>
            </CardTitle>
            <CardDescription>Public fraud ledger</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-2">
              <p className="text-sm mb-4">Report fraudulent activities or view recent fraud reports.</p>
              <Button className="w-full" variant="outline">Report Fraud</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent blockchain transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blockchain-primary pl-4 py-2">
              <p className="text-sm font-medium">KYC Documents Uploaded</p>
              <p className="text-xs text-muted-foreground">May 2, 2025 • Transaction: 0x12...3f56</p>
            </div>
            <div className="border-l-4 border-blockchain-primary pl-4 py-2">
              <p className="text-sm font-medium">Identity Created</p>
              <p className="text-xs text-muted-foreground">May 1, 2025 • Transaction: 0x98...2a41</p>
            </div>
            <div className="border-l-4 border-blockchain-secondary pl-4 py-2">
              <p className="text-sm font-medium">Account Created</p>
              <p className="text-xs text-muted-foreground">May 1, 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
