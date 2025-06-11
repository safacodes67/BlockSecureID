
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Flag, Search, UserCircle, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to BlockSecure ID</h1>
        <p className="text-muted-foreground">Secure your digital identity and manage consent on the blockchain</p>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-800 to-indigo-700 p-8 text-white mb-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Secure Your Digital Identity on the Blockchain</h2>
          <p className="mb-6 opacity-90">
            BlockSecure ID provides a decentralized solution for protecting your personal information,
            managing consent, and fighting fraud through blockchain technology.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-white text-purple-700 hover:bg-gray-100 hover:text-purple-800">
              <Link to="/create-identity">
                <Plus className="mr-2 h-4 w-4" />
                Create My Identity
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/url-checker">Check URL Security</Link>
            </Button>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-medium mb-4">Navigate BlockSecure Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/identity" className="hover:no-underline">
          <Card className="hover:shadow-md transition-all hover:-translate-y-1 h-full bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-blockchain-primary">
                <UserCircle className="h-5 w-5" />
                <span>Digital Identity</span>
              </CardTitle>
              <CardDescription>Your secure on-chain identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-2">
                <p className="text-sm mb-4">Create or manage your decentralized identity to secure your personal information.</p>
                <img 
                  src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9" 
                  alt="Digital Identity" 
                  className="w-full h-24 object-cover rounded-md mb-3" 
                />
                <Button variant="outline" className="w-full">Manage Identity</Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/consents" className="hover:no-underline">
          <Card className="hover:shadow-md transition-all hover:-translate-y-1 h-full bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-blockchain-secondary">
                <FileCheck className="h-5 w-5" />
                <span>Consent Requests</span>
              </CardTitle>
              <CardDescription>Pending requests: 2</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-2">
                <p className="text-sm mb-4">Review and approve consent requests from lenders and financial institutions.</p>
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                  alt="Consent Management" 
                  className="w-full h-24 object-cover rounded-md mb-3" 
                />
                <Button variant="outline" className="w-full">View Requests</Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/fraud-reports" className="hover:no-underline">
          <Card className="hover:shadow-md transition-all hover:-translate-y-1 h-full bg-gradient-to-br from-red-50 to-white border-red-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Flag className="h-5 w-5" />
                <span>Fraud Reports</span>
              </CardTitle>
              <CardDescription>Public fraud ledger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-2">
                <p className="text-sm mb-4">Report fraudulent activities or view recent fraud reports.</p>
                <img 
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b" 
                  alt="Fraud Reporting" 
                  className="w-full h-24 object-cover rounded-md mb-3" 
                />
                <Button variant="outline" className="w-full">Report Fraud</Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/url-checker" className="hover:no-underline">
          <Card className="hover:shadow-md transition-all hover:-translate-y-1 h-full bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <Search className="h-5 w-5" />
                <span>URL Checker</span>
              </CardTitle>
              <CardDescription>Verify website security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-2">
                <p className="text-sm mb-4">Check if a URL is safe or potentially malicious before visiting.</p>
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
                  alt="URL Security" 
                  className="w-full h-24 object-cover rounded-md mb-3" 
                />
                <Button variant="outline" className="w-full">Check URLs</Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent blockchain transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blockchain-primary pl-4 py-2 bg-purple-50 rounded-r">
              <p className="text-sm font-medium">KYC Documents Uploaded</p>
              <p className="text-xs text-muted-foreground">May 2, 2025 • Transaction: 0x12...3f56</p>
            </div>
            <div className="border-l-4 border-blockchain-primary pl-4 py-2 bg-purple-50 rounded-r">
              <p className="text-sm font-medium">Identity Created</p>
              <p className="text-xs text-muted-foreground">May 1, 2025 • Transaction: 0x98...2a41</p>
            </div>
            <div className="border-l-4 border-blockchain-secondary pl-4 py-2 bg-blue-50 rounded-r">
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
