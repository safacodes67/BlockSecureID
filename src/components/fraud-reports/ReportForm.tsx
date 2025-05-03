
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface ReportFormProps {
  reportMode: "fraud" | "url";
  onCancel: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ reportMode, onCancel, onSubmit }) => {
  return (
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
        <form onSubmit={onSubmit} className="space-y-6">
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
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Submit Report</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
