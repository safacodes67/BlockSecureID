
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FraudReport } from "@/types/fraudReport";

interface FraudReportCardProps {
  report: FraudReport;
}

const FraudReportCard: React.FC<FraudReportCardProps> = ({ report }) => (
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

export default FraudReportCard;
