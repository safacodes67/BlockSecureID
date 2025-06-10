
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Plus, List, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoanApplicationForm from "@/components/loans/LoanApplicationForm";
import LoanApplicationsList from "@/components/loans/LoanApplicationsList";

const LoansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Check local storage for auth
        const userAuth = localStorage.getItem("userAuth");
        if (!userAuth) {
          toast({
            title: "Authentication Required",
            description: "You must be logged in to access loans",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        const userData = JSON.parse(userAuth);
        setUserEmail(userData.email);
        
        // Get user ID from user_identities table
        const { data: userIdentity, error: userError } = await supabase
          .from("user_identities")
          .select("id")
          .eq("email", userData.email)
          .single();
          
        if (userError || !userIdentity) {
          toast({
            title: "User Not Found",
            description: "Your user profile was not found in the system",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setUserId(userIdentity.id);
      } else {
        setUserEmail(session.user.email);
        
        // Get user ID from user_identities table
        const { data: userIdentity, error: userError } = await supabase
          .from("user_identities")
          .select("id")
          .eq("email", session.user.email)
          .single();
          
        if (userError || !userIdentity) {
          toast({
            title: "User Not Found",
            description: "Your user profile was not found in the system",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setUserId(userIdentity.id);
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error("Error checking auth:", error);
      navigate("/auth");
    }
  };

  const handleApplicationSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab("applications");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Loan Management</h1>
          <p className="text-muted-foreground">Apply for loans and manage your applications</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Loan Types</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7 Types</div>
                  <p className="text-xs text-muted-foreground">Personal, Business, Education & more</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">From 8.5%</div>
                  <p className="text-xs text-muted-foreground">Competitive rates based on profile</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Max Loan Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1M</div>
                  <p className="text-xs text-muted-foreground">Subject to eligibility</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Simple steps to get your loan approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <h3 className="font-medium mb-2">Apply</h3>
                    <p className="text-sm text-muted-foreground">Fill out the loan application with your details</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                    <h3 className="font-medium mb-2">Review</h3>
                    <p className="text-sm text-muted-foreground">Our team reviews your application and documents</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                    <h3 className="font-medium mb-2">Approval</h3>
                    <p className="text-sm text-muted-foreground">Get approval and loan disbursement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => setActiveTab("apply")} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Apply for Loan
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("applications")} className="flex-1">
                <List className="mr-2 h-4 w-4" />
                View Applications
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="apply">
            {userId && (
              <LoanApplicationForm 
                userId={userId} 
                onApplicationSubmitted={handleApplicationSubmitted}
              />
            )}
          </TabsContent>

          <TabsContent value="applications">
            {userId && (
              <LoanApplicationsList 
                userId={userId} 
                refreshTrigger={refreshTrigger}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoansPage;
