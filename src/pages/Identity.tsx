
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FacialRecognition from "@/components/FacialRecognition";
import IdentityOverview from "@/components/identity/IdentityOverview";
import DocumentsTab from "@/components/identity/DocumentsTab";
import SecurityTab from "@/components/identity/SecurityTab";

// Type for KYC documents structure
interface KYCDocuments {
  blockchain_identity?: {
    did?: string;
    transactionHash?: string;
  };
  name?: string;
  email?: string;
  phone?: string;
  aadharNumber?: string;
  panNumber?: string;
  faceData?: string;
  faceRegisteredAt?: string;
}

interface IdentityData {
  did: string;
  createdOn: string;
  transactionHash: string;
  name?: string;
  email?: string;
  phone?: string;
  aadharNumber?: string;
  panNumber?: string;
  walletAddress?: string;
  type?: "user" | "bank";
}

interface UploadedFiles {
  personalId?: string;
  signature?: string;
  additionalDocs: { id: string; name: string; url: string }[];
}

const Identity = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [identityStatus, setIdentityStatus] = useState<"not_created" | "creating" | "created">("not_created");
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({ additionalDocs: [] });
  const [isUploading, setIsUploading] = useState(false);
  const [additionalDocName, setAdditionalDocName] = useState("");
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [faceRegistered, setFaceRegistered] = useState(false);
  const { toast } = useToast();
  
  // Check for existing identity on mount
  useEffect(() => {
    checkExistingIdentity();
  }, []);
  
  // Function to check if user has existing identity
  const checkExistingIdentity = async () => {
    const userAuth = localStorage.getItem("userAuth");
    const bankAuth = localStorage.getItem("bankAuth");
    
    if (userAuth) {
      const userData = JSON.parse(userAuth);
      
      try {
        const { data, error } = await supabase
          .from('user_identities')
          .select('*')
          .eq('email', userData.email)
          .single();
        
        if (data) {
          const kycDocs = data.kyc_documents as KYCDocuments | null;
          const hasBlockchainData = kycDocs?.blockchain_identity;
          
          if (hasBlockchainData) {
            setIdentityStatus("created");
            setIdentityData({
              type: "user",
              did: kycDocs.blockchain_identity?.did || `did:polygon:0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
              name: kycDocs.name || data.name,
              email: kycDocs.email || data.email,
              phone: kycDocs.phone,
              aadharNumber: kycDocs.aadharNumber,
              panNumber: kycDocs.panNumber,
              walletAddress: data.wallet_address,
              createdOn: new Date(data.created_at).toLocaleDateString(),
              transactionHash: kycDocs.blockchain_identity?.transactionHash || `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
            });
            
            setFaceRegistered(data.face_registered || false);
          } else {
            setIdentityStatus("not_created");
          }
          
          loadUserDocuments(data.id);
        }
      } catch (error) {
        console.error("Error fetching user identity:", error);
      }
    } else if (bankAuth) {
      const bankData = JSON.parse(bankAuth);
      
      try {
        const { data, error } = await supabase
          .from('bank_entities')
          .select('*')
          .eq('bank_name', bankData.name)
          .eq('branch_name', bankData.branch)
          .single();
        
        if (data) {
          setIdentityStatus("created");
          setIdentityData({
            type: "bank",
            did: `did:polygon:0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
            name: data.bank_name,
            createdOn: new Date(data.created_at).toLocaleDateString(),
            transactionHash: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
          });
          
          loadBankDocuments(data.id);
        }
      } catch (error) {
        console.error("Error fetching bank identity:", error);
      }
    }
  };
  
  // Load user documents from storage
  const loadUserDocuments = async (userId: string) => {
    try {
      const { data: files, error } = await supabase.storage
        .from('user_documents')
        .list(`${userId}`);
      
      if (error) throw error;
      
      if (files && files.length > 0) {
        const personalIdFile = files.find(file => file.name.startsWith('personal_id_'));
        const signatureFile = files.find(file => file.name.startsWith('signature_'));
        const additionalFiles = files.filter(file => file.name.startsWith('additional_'));
        
        const updatedFiles = {
          personalId: personalIdFile ? personalIdFile.name : undefined,
          signature: signatureFile ? signatureFile.name : undefined,
          additionalDocs: await Promise.all(additionalFiles.map(async file => {
            const { data: url } = supabase.storage
              .from('user_documents')
              .getPublicUrl(`${userId}/${file.name}`);
            
            return {
              id: file.name,
              name: file.name.replace('additional_', '').replace(/\.\w+$/, ''),
              url: url.publicUrl
            };
          }))
        };
        
        setUploadedFiles(updatedFiles);
      }
    } catch (error) {
      console.error("Error loading user documents:", error);
    }
  };
  
  // Load bank documents from storage
  const loadBankDocuments = async (bankId: string) => {
    try {
      const { data: files, error } = await supabase.storage
        .from('bank_documents')
        .list(`${bankId}`);
      
      if (error) throw error;
      
      if (files && files.length > 0) {
        const personalIdFile = files.find(file => file.name.startsWith('personal_id_'));
        const signatureFile = files.find(file => file.name.startsWith('signature_'));
        const additionalFiles = files.filter(file => file.name.startsWith('additional_'));
        
        const updatedFiles = {
          personalId: personalIdFile ? personalIdFile.name : undefined,
          signature: signatureFile ? signatureFile.name : undefined,
          additionalDocs: await Promise.all(additionalFiles.map(async file => {
            const { data: url } = supabase.storage
              .from('bank_documents')
              .getPublicUrl(`${bankId}/${file.name}`);
            
            return {
              id: file.name,
              name: file.name.replace('additional_', '').replace(/\.\w+$/, ''),
              url: url.publicUrl
            };
          }))
        };
        
        setUploadedFiles(updatedFiles);
      }
    } catch (error) {
      console.error("Error loading bank documents:", error);
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'personalId' | 'signature' | 'additional') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    
    try {
      let id, bucketName;
      const userAuth = localStorage.getItem("userAuth");
      const bankAuth = localStorage.getItem("bankAuth");
      
      if (userAuth) {
        const userData = JSON.parse(userAuth);
        const { data, error } = await supabase
          .from('user_identities')
          .select('id')
          .eq('email', userData.email)
          .single();
        
        if (error) throw error;
        id = data.id;
        bucketName = 'user_documents';
      } else if (bankAuth) {
        const bankData = JSON.parse(bankAuth);
        const { data, error } = await supabase
          .from('bank_entities')
          .select('id')
          .eq('bank_name', bankData.name)
          .eq('branch_name', bankData.branch)
          .single();
        
        if (error) throw error;
        id = data.id;
        bucketName = 'bank_documents';
      } else {
        throw new Error("No authenticated user found");
      }
      
      let fileName;
      if (fileType === 'personalId') {
        fileName = `personal_id_${Date.now()}.${file.name.split('.').pop()}`;
      } else if (fileType === 'signature') {
        fileName = `signature_${Date.now()}.${file.name.split('.').pop()}`;
      } else {
        const docName = additionalDocName || file.name.replace(/\.\w+$/, '');
        fileName = `additional_${docName}_${Date.now()}.${file.name.split('.').pop()}`;
      }
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(`${id}/${fileName}`, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${id}/${fileName}`);
      
      if (fileType === 'personalId') {
        setUploadedFiles(prev => ({...prev, personalId: fileName}));
      } else if (fileType === 'signature') {
        setUploadedFiles(prev => ({...prev, signature: fileName}));
      } else {
        const newDoc = {
          id: fileName,
          name: additionalDocName || file.name.replace(/\.\w+$/, ''),
          url: data.publicUrl
        };
        setUploadedFiles(prev => ({
          ...prev, 
          additionalDocs: [...prev.additionalDocs, newDoc]
        }));
        setAdditionalDocName("");
      }
      
      toast({
        title: "Upload Successful",
        description: `${fileType === 'additional' ? 'Document' : fileType === 'personalId' ? 'Personal ID' : 'Digital Signature'} uploaded successfully.`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle facial recognition capture
  const handleFacialRecognition = () => {
    setShowFaceCapture(true);
  };

  const handleFaceCapture = async (imageData: string) => {
    try {
      const userAuth = localStorage.getItem("userAuth");
      
      if (userAuth) {
        const userData = JSON.parse(userAuth);
        
        const { error } = await supabase
          .from('user_identities')
          .update({ 
            face_registered: true,
            kyc_documents: {
              ...identityData,
              faceData: imageData,
              faceRegisteredAt: new Date().toISOString()
            }
          })
          .eq('email', userData.email);

        if (error) throw error;

        setFaceRegistered(true);
        setShowFaceCapture(false);
        
        toast({
          title: "Face Registration Successful",
          description: "Your face has been registered for account recovery.",
        });
      }
    } catch (error) {
      console.error("Error registering face:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register facial data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Digital Identity</h1>
        <p className="text-muted-foreground">Manage your secure decentralized identity (DID)</p>
      </div>

      <Tabs defaultValue={selectedTab} className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">KYC Documents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <IdentityOverview 
            identityStatus={identityStatus}
            identityData={identityData}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab
            uploadedFiles={uploadedFiles}
            isUploading={isUploading}
            additionalDocName={additionalDocName}
            setAdditionalDocName={setAdditionalDocName}
            handleFileUpload={handleFileUpload}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab
            faceRegistered={faceRegistered}
            handleFacialRecognition={handleFacialRecognition}
          />
        </TabsContent>
      </Tabs>
      
      {/* Face Capture Dialog */}
      <Dialog open={showFaceCapture} onOpenChange={setShowFaceCapture}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Face Recognition Setup</DialogTitle>
          </DialogHeader>
          <FacialRecognition 
            onCapture={handleFaceCapture}
            onClose={() => setShowFaceCapture(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Identity;
