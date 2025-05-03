
import React from "react";
import UrlChecker from "@/components/UrlChecker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Search } from "lucide-react";

const UrlCheckerPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">URL Security Checker</h1>
        <p className="text-muted-foreground">Verify website security and report phishing attempts</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blockchain-primary" />
              How It Works
            </CardTitle>
            <CardDescription>
              Our blockchain-powered URL verification system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
                  alt="Digital Security" 
                  className="rounded-lg shadow-md w-full h-40 object-cover mb-4" 
                />
                <h3 className="font-medium mb-2">How We Detect Phishing</h3>
                <p className="text-sm">
                  Our algorithm uses blockchain analysis and machine learning to 
                  identify suspicious patterns in URLs, checking against known fraud 
                  records on the distributed ledger.
                </p>
              </div>
              <div className="flex-1">
                <img 
                  src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                  alt="Security Code" 
                  className="rounded-lg shadow-md w-full h-40 object-cover mb-4" 
                />
                <h3 className="font-medium mb-2">Community Protection</h3>
                <p className="text-sm">
                  When you report a fraudulent URL, it's recorded on the blockchain and 
                  immediately available to all users in our network, creating a 
                  decentralized shield against evolving threats.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <UrlChecker />
      </div>
    </div>
  );
};

export default UrlCheckerPage;
