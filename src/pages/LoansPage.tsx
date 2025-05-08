
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, CheckCircle, X, PlusCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DocumentUploader from "@/components/kyc/DocumentUploader";
import { Loan } from "@/types/loans";

const LoansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isBank, setIsBank] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showNewLoanDialog, setShowNewLoanDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showLoanDetailsDialog, setShowLoanDetailsDialog] = useState(false);
  
  // New loan form states
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [bankId, setBankId] = useState("");
  const [banksList, setBanksList] = useState<{ id: string, bank_name: string }[]>([]);
  const [incomeProofUrl, setIncomeProofUrl] = useState<string | null>(null);
  const [collateralProofUrl, setCollateralProofUrl] = useState<string | null>(null);
  const [submittingLoan, setSubmittingLoan] = useState(false);
  
  // Check auth status and load loans
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "You must be logged in to access loans",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        setUserEmail(session.user.email);
        
        // Check if user is individual or bank
        const bankAuth = localStorage.getItem("bankAuth");
        if (bankAuth) {
          setIsBank(true);
          const bankData = JSON.parse(bankAuth);
          
          // Get bank ID from name
          const { data: bankIdData, error: bankIdError } = await supabase
            .from("bank_entities")
            .select("id")
            .eq("bank_name", bankData.name)
            .single();
            
          if (bankIdError) {
            console.error("Error getting bank ID:", bankIdError);
            return;
          }
          
          setUserId(bankIdData.id);
          
          // Load loans for this bank
          loadBankLoans(bankIdData.id);
        } else {
          // Get user ID from email
          const { data: userData, error: userError } = await supabase
            .from("user_identities")
            .select("id")
            .eq("email", session.user.email)
            .single();
            
          if (userError) {
            console.error("Error getting user ID:", userError);
            return;
          }
          
          setUserId(userData.id);
          
          // Load loans for this user
          loadUserLoans(userData.id);
          
          // Load banks list for loan application
          loadBanks();
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Load loans for a user
  const loadUserLoans = async (userId: string) => {
    try {
      // Since the loans table might not be in the TypeScript definitions yet, we use any type
      const { data, error } = await supabase
        .from('loans')
        .select('*, bank_entities(bank_name)')
        .eq('borrower_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the loans data
      const formattedLoans = data.map((loan: any) => ({
        ...loan,
        bank_name: loan.bank_entities?.bank_name
      }));
      
      setLoans(formattedLoans);
    } catch (error) {
      console.error("Error loading loans:", error);
      toast({
        title: "Error",
        description: "Failed to load loans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load loans for a bank
  const loadBankLoans = async (bankId: string) => {
    try {
      // Since the loans table might not be in the TypeScript definitions yet, we use any type
      const { data, error } = await supabase
        .from('loans')
        .select('*, user_identities(name)')
        .eq('bank_id', bankId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the loans data
      const formattedLoans = data.map((loan: any) => ({
        ...loan,
        borrower_name: loan.user_identities?.name
      }));
      
      setLoans(formattedLoans);
    } catch (error) {
      console.error("Error loading loans:", error);
      toast({
        title: "Error",
        description: "Failed to load loans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load banks list
  const loadBanks = async () => {
    try {
      const { data, error } = await supabase
        .from("bank_entities")
        .select("id, bank_name");
      
      if (error) throw error;
      
      setBanksList(data);
    } catch (error) {
      console.error("Error loading banks:", error);
    }
  };

  // Submit new loan application
  const handleSubmitLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !bankId || !loanAmount || !loanPurpose || !incomeProofUrl || !collateralProofUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload the required documents",
        variant: "destructive",
      });
      return;
    }
    
    setSubmittingLoan(true);
    
    try {
      // Insert new loan using raw SQL with a single object (not an array)
      const { data, error } = await supabase
        .rpc('insert_loan', {
          p_borrower_id: userId,
          p_bank_id: bankId,
          p_loan_amount: parseFloat(loanAmount),
          p_loan_purpose: loanPurpose,
          p_status: 'pending',
          p_income_proof: incomeProofUrl,
          p_collateral_proof: collateralProofUrl
        });
      
      if (error) throw error;
      
      // Add the new loan to the list
      const selectedBank = banksList.find(bank => bank.id === bankId);
      
      // Load the newly created loan
      const { data: newLoanData, error: newLoanError } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .eq('borrower_id', userId);
      
      if (newLoanError) throw newLoanError;
      
      if (newLoanData && newLoanData[0]) {
        const newLoan: Loan = {
          ...newLoanData[0],
          bank_name: selectedBank?.bank_name
        };
        setLoans([newLoan, ...loans]);
      }
      
      toast({
        title: "Loan Application Submitted",
        description: "Your loan application has been submitted for review",
      });
      
      // Reset form and close dialog
      setLoanAmount("");
      setLoanPurpose("");
      setBankId("");
      setIncomeProofUrl(null);
      setCollateralProofUrl(null);
      setShowNewLoanDialog(false);
      
    } catch (error: any) {
      console.error("Error submitting loan:", error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit loan application",
        variant: "destructive",
      });
    } finally {
      setSubmittingLoan(false);
    }
  };

  // View loan details
  const handleViewLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowLoanDetailsDialog(true);
  };

  // Update loan status (for banks)
  const updateLoanStatus = async (loanId: string, status: "approved" | "rejected") => {
    if (!loanId) return;
    
    try {
      const { error } = await supabase
        .rpc('update_loan_status', {
          p_loan_id: loanId,
          p_status: status
        });
      
      if (error) throw error;
      
      // Update loan in the list
      setLoans(loans.map(loan => 
        loan.id === loanId ? { ...loan, status } : loan
      ));
      
      toast({
        title: `Loan ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `The loan has been ${status}`,
      });
      
      setShowLoanDetailsDialog(false);
      
    } catch (error: any) {
      console.error("Error updating loan status:", error);
      toast({
        title: "Update Error",
        description: error.message || "Failed to update loan status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{isBank ? "Loan Applications" : "My Loans"}</h1>
        
        {!isBank && (
          <Button onClick={() => setShowNewLoanDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <p>Loading loans...</p>
        </div>
      ) : loans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-lg text-gray-500 mb-4">No loans found</p>
            {!isBank && (
              <Button onClick={() => setShowNewLoanDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Apply for Your First Loan
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <Card key={loan.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    ₹{loan.loan_amount.toLocaleString("en-IN")}
                  </CardTitle>
                  <Badge className={
                    loan.status === "approved" ? "bg-green-100 text-green-800" :
                    loan.status === "rejected" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }>
                    {loan.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {isBank ? `Applicant: ${loan.borrower_name}` : `Bank: ${loan.bank_name}`}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 line-clamp-2">{loan.loan_purpose}</p>
                <div className="text-xs text-gray-500 mb-4">
                  Applied on {new Date(loan.created_at).toLocaleDateString()}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewLoan(loan)}
                >
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* New Loan Application Dialog */}
      <Dialog open={showNewLoanDialog} onOpenChange={setShowNewLoanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for a New Loan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitLoan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-select">Select Bank</Label>
              <select
                id="bank-select"
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a Bank</option>
                {banksList.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bank_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
              <Input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loan-purpose">Loan Purpose</Label>
              <Textarea
                id="loan-purpose"
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                placeholder="Describe the purpose of this loan"
                rows={3}
                required
              />
            </div>
            
            {/* Document Uploaders */}
            <div className="space-y-4">
              <h3 className="font-medium">Required Documents</h3>
              
              {userId && (
                <>
                  <DocumentUploader
                    userId={userId}
                    documentType="Income Proof"
                    onUpload={setIncomeProofUrl}
                    allowedTypes=".jpg,.jpeg,.png,.pdf"
                  />
                  
                  <DocumentUploader
                    userId={userId}
                    documentType="Collateral Proof"
                    onUpload={setCollateralProofUrl}
                    allowedTypes=".jpg,.jpeg,.png,.pdf"
                  />
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewLoanDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingLoan || !incomeProofUrl || !collateralProofUrl}
              >
                {submittingLoan ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Loan Details Dialog */}
      {selectedLoan && (
        <Dialog open={showLoanDetailsDialog} onOpenChange={setShowLoanDetailsDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Loan Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">₹{selectedLoan.loan_amount.toLocaleString("en-IN")}</h3>
                <Badge className={
                  selectedLoan.status === "approved" ? "bg-green-100 text-green-800" :
                  selectedLoan.status === "rejected" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }>
                  {selectedLoan.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date Applied</p>
                  <p>{new Date(selectedLoan.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isBank ? "Applicant" : "Bank"}</p>
                  <p>{isBank ? selectedLoan.borrower_name : selectedLoan.bank_name}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Loan Purpose</p>
                <p className="mt-1">{selectedLoan.loan_purpose}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Supporting Documents</h4>
                {selectedLoan.documents?.income_proof && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Income Proof</p>
                    <a 
                      href={selectedLoan.documents.income_proof} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                      View Document <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                )}
                
                {selectedLoan.documents?.collateral_proof && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Collateral Proof</p>
                    <a 
                      href={selectedLoan.documents.collateral_proof} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                      View Document <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
              
              {isBank && selectedLoan.status === "pending" && (
                <>
                  <Separator />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => updateLoanStatus(selectedLoan.id, "rejected")}
                      className="border-red-200 hover:bg-red-50 text-red-600"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => updateLoanStatus(selectedLoan.id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LoansPage;
