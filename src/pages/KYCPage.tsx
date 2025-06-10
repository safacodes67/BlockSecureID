
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Camera, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CameraCapture from "@/components/kyc/CameraCapture";
import DocumentUploader from "@/components/kyc/DocumentUploader";

const KYCPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [idProof, setIdProof] = useState<string | null>(null);
  const [addressProof, setAddressProof] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage first for immediate access
        const userAuth = localStorage.getItem("userAuth");
        
        if (userAuth) {
          const userData = JSON.parse(userAuth);
          setUserEmail(userData.email);
          setUserId(userData.id);
          setLoading(false);
          return;
        }

        // Fallback to Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "You must be logged in to access the KYC page",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        setUserEmail(session.user.email);
        
        // Get user ID from user_identities table
        const { data: userData, error: userError } = await supabase
          .from("user_identities")
          .select("id")
          .eq("email", session.user.email)
          .maybeSingle();
          
        if (userError || !userData) {
          toast({
            title: "User Not Found",
            description: "Your user profile was not found in the system",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setUserId(userData.id);
        setLoading(false);
        
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleSubmitKYC = async () => {
    if (!userId) return;
    
    setSubmitting(true);
    
    try {
      // Update user record with KYC data
      const { error } = await supabase
        .from("user_identities")
        .update({
          face_registered: !!faceImage,
          kyc_documents: {
            face_image: faceImage,
            id_proof: idProof,
            address_proof: addressProof,
            submission_date: new Date().toISOString(),
            status: "submitted"
          }
        })
        .eq("id", userId);
      
      if (error) throw error;
      
      toast({
        title: "KYC Submitted Successfully",
        description: "Your identity verification documents have been submitted for review",
      });
      
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Error submitting KYC:", error);
      toast({
        title: "Submission Error",
        description: error.message || "There was an error submitting your KYC documents",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
      
      <Card>
        <CardHeader>
          <CardTitle>Identity Verification (KYC)</CardTitle>
          <CardDescription>
            Please complete your identity verification by uploading the required documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Face Capture Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Camera className="mr-2 h-5 w-5 text-indigo-500" />
              Facial Recognition
            </h3>
            <p className="text-sm text-muted-foreground">
              Take a clear photo of your face for identity verification and account recovery
            </p>
            
            {userId && (
              <CameraCapture 
                onCapture={setFaceImage} 
                userId={userId}
              />
            )}
          </div>
          
          <Separator />
          
          {/* Document Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Upload className="mr-2 h-5 w-5 text-indigo-500" />
              Document Verification
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload clear images or PDF files of the following documents
            </p>
            
            {userId && (
              <div className="space-y-6">
                <DocumentUploader 
                  userId={userId} 
                  documentType="ID Proof" 
                  onUpload={setIdProof}
                />
                
                <DocumentUploader 
                  userId={userId} 
                  documentType="Address Proof" 
                  onUpload={setAddressProof}
                />
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Submit Section */}
          <div className="flex flex-col">
            <Button
              onClick={handleSubmitKYC}
              disabled={submitting || !faceImage || !idProof || !addressProof}
              className="ml-auto"
            >
              {submitting ? "Submitting..." : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit KYC Documents
                </>
              )}
            </Button>
            
            {(!faceImage || !idProof || !addressProof) && (
              <p className="text-sm text-amber-600 mt-2">
                All documents are required before submission
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCPage;
