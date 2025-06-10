
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";

interface LoanApplication {
  id: string;
  amount: number;
  purpose: string;
  tenure_months: number;
  monthly_income: number;
  employment_type: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'revoked';
  applied_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

interface LoanApplicationsListProps {
  userId: string;
  refreshTrigger: number;
}

const LoanApplicationsList: React.FC<LoanApplicationsListProps> = ({ userId, refreshTrigger }) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [userId, refreshTrigger]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_applications' as any)
        .select('*')
        .eq('user_id', userId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching loan applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch loan applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('loan_applications' as any)
        .update({ 
          status: 'revoked',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: 'Access revoked by user'
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Access Revoked",
        description: "Loan application access has been revoked",
      });

      fetchApplications();
    } catch (error: any) {
      console.error("Error revoking access:", error);
      toast({
        title: "Error",
        description: "Failed to revoke access",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'revoked':
        return <Badge variant="outline"><Trash2 className="h-3 w-3 mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderApplicationCard = (application: LoanApplication) => (
    <Card key={application.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{formatCurrency(application.amount)}</CardTitle>
            <CardDescription>
              {application.purpose} • {application.tenure_months} months
            </CardDescription>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Monthly Income</p>
            <p className="font-medium">{formatCurrency(application.monthly_income)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Employment</p>
            <p className="font-medium">{application.employment_type.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Applied On</p>
            <p className="font-medium">{formatDate(application.applied_at)}</p>
          </div>
          {application.reviewed_at && (
            <div>
              <p className="text-muted-foreground">Reviewed On</p>
              <p className="font-medium">{formatDate(application.reviewed_at)}</p>
            </div>
          )}
        </div>

        {application.description && (
          <div className="mb-4">
            <p className="text-muted-foreground text-sm">Description</p>
            <p className="text-sm">{application.description}</p>
          </div>
        )}

        {application.reviewer_notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-muted-foreground text-sm">Reviewer Notes</p>
            <p className="text-sm">{application.reviewer_notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Application ID: {application.id.substring(0, 8)}...
          </span>
          
          {(application.status === 'pending' || application.status === 'approved') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRevokeAccess(application.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Revoke Access
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading applications...</p>
        </CardContent>
      </Card>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');
  const revokedApplications = applications.filter(app => app.status === 'revoked');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Loan Applications</CardTitle>
        <CardDescription>Track the status of your loan applications</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
            <TabsTrigger value="revoked">Revoked ({revokedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {applications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No loan applications found</p>
            ) : (
              applications.map(renderApplicationCard)
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            {pendingApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending applications</p>
            ) : (
              pendingApplications.map(renderApplicationCard)
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            {approvedApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No approved applications</p>
            ) : (
              approvedApplications.map(renderApplicationCard)
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            {rejectedApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No rejected applications</p>
            ) : (
              rejectedApplications.map(renderApplicationCard)
            )}
          </TabsContent>

          <TabsContent value="revoked" className="mt-4">
            {revokedApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No revoked applications</p>
            ) : (
              revokedApplications.map(renderApplicationCard)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationsList;
