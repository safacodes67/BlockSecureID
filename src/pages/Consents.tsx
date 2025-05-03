
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsentRequest {
  id: string;
  organization: string;
  purpose: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  dataRequested: string[];
}

const Consents = () => {
  const { toast } = useToast();
  const [consents, setConsents] = useState<ConsentRequest[]>([
    {
      id: "req-001",
      organization: "QuickLoan Finance",
      purpose: "Personal Loan Application",
      requestDate: "May 3, 2025",
      status: "pending",
      dataRequested: ["Identity Verification", "Income Proof", "Credit History"]
    },
    {
      id: "req-002",
      organization: "SecureCredit Bank",
      purpose: "Credit Card Application",
      requestDate: "May 2, 2025",
      status: "pending",
      dataRequested: ["Identity Verification", "Address Proof"]
    },
    {
      id: "req-003",
      organization: "TrustHome Mortgage",
      purpose: "Home Loan Evaluation",
      requestDate: "April 28, 2025",
      status: "approved",
      dataRequested: ["Identity Verification", "Income Proof", "Property Documents", "Bank Statements"]
    },
    {
      id: "req-004",
      organization: "QuickCash Loans",
      purpose: "Short-term Loan",
      requestDate: "April 25, 2025",
      status: "rejected",
      dataRequested: ["Identity Verification", "Bank Access"]
    }
  ]);

  const handleApprove = (id: string) => {
    setConsents(consents.map(consent => 
      consent.id === id ? { ...consent, status: "approved" } : consent
    ));
    
    toast({
      title: "Consent Approved",
      description: "Your consent has been recorded on the blockchain",
    });
  };

  const handleReject = (id: string) => {
    setConsents(consents.map(consent => 
      consent.id === id ? { ...consent, status: "rejected" } : consent
    ));
    
    toast({
      title: "Consent Rejected",
      description: "The lender will not be able to access your data",
    });
  };

  const pendingConsents = consents.filter(c => c.status === "pending");
  const approvedConsents = consents.filter(c => c.status === "approved");
  const rejectedConsents = consents.filter(c => c.status === "rejected");

  const ConsentCard = ({ consent }: { consent: ConsentRequest }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{consent.organization}</CardTitle>
            <CardDescription>{consent.purpose}</CardDescription>
          </div>
          {consent.status === "pending" ? (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              <Clock className="mr-1 h-3 w-3" /> Pending
            </Badge>
          ) : consent.status === "approved" ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="mr-1 h-3 w-3" /> Approved
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
              <XCircle className="mr-1 h-3 w-3" /> Rejected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Requested on {consent.requestDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Data Requested:</p>
            <div className="flex flex-wrap gap-2">
              {consent.dataRequested.map((data, i) => (
                <Badge key={i} variant="secondary">{data}</Badge>
              ))}
            </div>
          </div>
          
          {consent.status === "pending" && (
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => handleReject(consent.id)}>Reject</Button>
              <Button onClick={() => handleApprove(consent.id)}>Approve</Button>
            </div>
          )}
          
          {consent.status === "approved" && (
            <div className="flex justify-end pt-2">
              <Button variant="destructive" onClick={() => handleReject(consent.id)}>Revoke Access</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Data Consent Management</h1>
        <p className="text-muted-foreground">Manage data access requests from lenders and financial institutions</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingConsents.length > 0 && (
              <span className="absolute top-1 right-1 bg-blockchain-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingConsents.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingConsents.length > 0 ? (
            <div>
              {pendingConsents.map(consent => (
                <ConsentCard key={consent.id} consent={consent} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No pending consent requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedConsents.length > 0 ? (
            <div>
              {approvedConsents.map(consent => (
                <ConsentCard key={consent.id} consent={consent} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No approved consents</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedConsents.length > 0 ? (
            <div>
              {rejectedConsents.map(consent => (
                <ConsentCard key={consent.id} consent={consent} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No rejected consents</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Consents;
