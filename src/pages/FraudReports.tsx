
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Flag, Upload, AlertCircle, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UrlChecker from "@/components/UrlChecker";
import { FraudReport } from "@/types/fraudReport";

const FraudReports = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [reportMode, setReportMode] = useState<"fraud" | "url">("fraud");

  const [fraudReports, setFraudReports] = useState<FraudReport[]>([
    {
      id: "fr-001",
      reporterAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      fraudType: "Unauthorized Loan",
      upiId: "fraudster@ybl",
      description: "Loan created without my consent. UPI ID used for receiving funds.",
      evidenceHash: "Qmf9T7kSdFgLnRg5K3F7LASSPf4JYLZnYZ8NJ8bKSAhzP9",
      reportDate: "May 3, 2025",
      status: "verified"
    },
    {
      id: "fr-002",
      reporterAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      fraudType: "Fake KYC",
      upiId: "scammer@okaxis",
      description: "Someone used my identity documents for KYC and created multiple accounts.",
      evidenceHash: "QmT8KLhWdVwWYG2zpXSZCvNHEj6MmyM6RJs7Bnxrd9jmQx",
      reportDate: "May 2, 2025",
      status: "verified"
    },
    {
      id: "fr-003",
      reporterAddress: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
      fraudType: "Phishing Attempt",
      upiId: "phisher@paytm",
      description: "Received a phishing SMS claiming to be from a bank, asking for OTP.",
      evidenceHash: "QmNZLGFnrzRjxjdQzxFrKQMvJJPaQ8YMSTfb9YZQMYnLTL",
      reportDate: "April 29, 2025",
      status: "pending"
    },
    {
      id: "fr-004",
      reporterAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      fraudType: "Phishing URL",
      url: "http://banklogin-secure-verify.tk/login",
      description: "Received this fake banking URL via email claiming my account needs verification.",
      evidenceHash: "QmT8KLhWdVwWYG2zpXSZCvNHEj6MmyM6RJs7Bnxrd9jmQx",
      reportDate: "May 1, 2025",
      status: "verified"
    },
  ]);

  const filteredReports = searchQuery
    ? fraudReports.filter(report => 
        (report.upiId && report.upiId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.url && report.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : fraudReports;

  const handleSubmitReport = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Fraud Report Submitted",
      description: "Your report has been recorded on the blockchain",
    });
    setShowReportForm(false);
  };

  const handleReportUrl = (url: string) => {
    setReportMode("url");
    setShowReportForm(true);
    // Here you would pre-fill the form with the URL
    toast({
      title: "URL Added to Report",
      description: "Complete the form to submit the phishing URL report",
    });
  };

  const FraudReportCard = ({ report }: { report: FraudReport }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{report.fraudType}</CardTitle>
            <CardDescription>Reported on {report.reportDate}</CardDescription>
          </div>
          {report.status === "verified" && (
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
              <AlertCircle className="mr-1 h-3 w-3" /> Verified Fraud
            </Badge>
          )}
          {report.status === "pending" && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              Under Review
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            {report.upiId && (
              <div>
                <p className="text-sm text-muted-foreground">UPI ID</p>
                <p className="font-medium">{report.upiId}</p>
              </div>
            )}
            {report.url && (
              <div>
                <p className="text-sm text-muted-foreground">Malicious URL</p>
                <p className="font-medium text-red-500 break-all">{report.url}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Evidence</p>
              <p className="font-mono text-xs truncate">{report.evidenceHash}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p>{report.description}</p>
          </div>
          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fraud Reports</h1>
          <p className="text-muted-foreground">View and submit fraud reports to the blockchain</p>
        </div>
        <Button 
          onClick={() => {
            setReportMode("fraud");
            setShowReportForm(!showReportForm);
          }}
          className="gradient-bg"
        >
          <Flag className="mr-2 h-4 w-4" /> Report Fraud
        </Button>
      </div>

      {showReportForm ? (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>
              {reportMode === "fraud" ? "Submit Fraud Report" : "Report Malicious URL"}
            </CardTitle>
            <CardDescription>
              {reportMode === "fraud" 
                ? "Report unauthorized activities or suspicious behavior" 
                : "Report phishing or malicious URLs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fraudType">Fraud Type</Label>
                <select 
                  id="fraudType" 
                  className="w-full p-2 border rounded"
                  defaultValue={reportMode === "url" ? "phishing" : ""}
                >
                  <option value="">Select fraud type</option>
                  <option value="unauthorized_loan">Unauthorized Loan</option>
                  <option value="fake_kyc">Fake KYC</option>
                  <option value="phishing">Phishing Attempt</option>
                  <option value="phishing_url">Phishing URL</option>
                  <option value="identity_theft">Identity Theft</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {reportMode === "fraud" ? (
                <div className="space-y-2">
                  <Label htmlFor="upiId">Fraudulent UPI ID</Label>
                  <Input id="upiId" placeholder="Enter UPI ID (e.g., user@okaxis)" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="url">Malicious URL</Label>
                  <Input id="url" placeholder="Enter the suspicious URL" />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide details about the fraudulent activity" 
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Upload Evidence</Label>
                <div className="border border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm mb-2">
                    Drag and drop screenshots, documents, or other evidence
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Files will be uploaded to IPFS for permanent, tamper-proof storage
                  </p>
                  <Button type="button" variant="outline" size="sm">Browse Files</Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowReportForm(false)}>Cancel</Button>
                <Button type="submit">Submit Report</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="verified">Verified Fraud</TabsTrigger>
              <TabsTrigger value="phishing">Phishing URLs</TabsTrigger>
              <TabsTrigger value="urlChecker">URL Checker</TabsTrigger>
            </TabsList>

            <TabsContent value="urlChecker">
              <UrlChecker onReportUrl={handleReportUrl} />
            </TabsContent>

            <TabsContent value="all">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search by UPI ID, URL or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredReports.length > 0 ? (
                <div>
                  {filteredReports.map(report => (
                    <FraudReportCard key={report.id} report={report} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No fraud reports found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="verified">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search verified fraud reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredReports.filter(r => r.status === "verified").length > 0 ? (
                <div>
                  {filteredReports
                    .filter(r => r.status === "verified")
                    .map(report => (
                      <FraudReportCard key={report.id} report={report} />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No verified fraud reports found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="phishing">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search phishing URLs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredReports.filter(r => r.fraudType.includes("Phishing") && r.url).length > 0 ? (
                <div>
                  {filteredReports
                    .filter(r => r.fraudType.includes("Phishing") && r.url)
                    .map(report => (
                      <FraudReportCard key={report.id} report={report} />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No phishing URL reports found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FraudReports;
