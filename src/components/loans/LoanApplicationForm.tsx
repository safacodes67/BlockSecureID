
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";

interface LoanApplicationFormProps {
  userId: string;
  onApplicationSubmitted: () => void;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ userId, onApplicationSubmitted }) => {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tenure, setTenure] = useState("");
  const [income, setIncome] = useState("");
  const [employment, setEmployment] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !purpose || !tenure || !income || !employment) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('loan_applications' as any)
        .insert({
          user_id: userId,
          amount: parseFloat(amount),
          purpose,
          tenure_months: parseInt(tenure),
          monthly_income: parseFloat(income),
          employment_type: employment,
          description,
          status: 'pending',
          applied_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully",
      });

      // Reset form
      setAmount("");
      setPurpose("");
      setTenure("");
      setIncome("");
      setEmployment("");
      setDescription("");
      
      onApplicationSubmitted();

    } catch (error: any) {
      console.error("Error submitting loan application:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit loan application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Apply for Loan
        </CardTitle>
        <CardDescription>
          Fill out the application form to apply for a loan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Loan Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter loan amount"
                min="1000"
                max="1000000"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="tenure">Loan Tenure (Months)</Label>
              <Select value={tenure} onValueChange={setTenure} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                  <SelectItem value="48">48 months</SelectItem>
                  <SelectItem value="60">60 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purpose">Loan Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="home">Home Purchase</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="income">Monthly Income ($)</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter monthly income"
                min="1000"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="employment">Employment Type</Label>
            <Select value={employment} onValueChange={setEmployment} required>
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="self_employed">Self Employed</SelectItem>
                <SelectItem value="business_owner">Business Owner</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional information about your loan request"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationForm;
