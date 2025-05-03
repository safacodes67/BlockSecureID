
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UrlChecker from "@/components/UrlChecker";
import useFraudReports from "@/hooks/useFraudReports";
import ReportsList from "@/components/fraud-reports/ReportsList";
import ReportForm from "@/components/fraud-reports/ReportForm";

const FraudReports = () => {
  const { toast } = useToast();
  const { fraudReports } = useFraudReports();
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportMode, setReportMode] = useState<"fraud" | "url">("fraud");
  const [activeTab, setActiveTab] = useState("all");

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
        <ReportForm 
          reportMode={reportMode}
          onCancel={() => setShowReportForm(false)}
          onSubmit={handleSubmitReport}
        />
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
              <ReportsList reports={fraudReports} />
            </TabsContent>

            <TabsContent value="verified">
              <ReportsList 
                reports={fraudReports} 
                filter={r => r.status === "verified"} 
                title="verified fraud reports"
              />
            </TabsContent>

            <TabsContent value="phishing">
              <ReportsList 
                reports={fraudReports} 
                filter={r => r.fraudType.includes("Phishing") && r.url !== undefined}
                title="phishing URL reports"
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FraudReports;
