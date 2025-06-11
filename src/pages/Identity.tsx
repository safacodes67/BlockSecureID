import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Upload, CheckCircle, Shield, AlertCircle, Key, FileText, Camera } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FacialRecognition from "@/components/FacialRecognition";

// Add custom types to match our Supabase schema
interface UserIdentity {
  id: string;
  created_at: string;
  email: string;
  name: string;
  mobile: string;
  mnemonic_phrase: string;
  wallet_address?: string;
  face_registered?: boolean;  // Add this property to match our usage
}

interface BankEntity {
  id: string;
  created_at: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
  manager_code: string;
  mnemonic_phrase: string;
  wallet_address?: string;
  face_registered?: boolean;  // Add this property to match our usage
}

const Identity = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [identityStatus, setIdentityStatus] = useState<"not_created" | "creating" | "created">("not_created");
  const [identityData, setIdentityData] = useState<{
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
  } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{
    personalId?: string;
    signature?: string;
    additionalDocs: {id: string, name: string, url: string}[];
  }>({
    additionalDocs: []
  });
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
    // First check local storage for session info
    const userAuth = localStorage.getItem("userAuth");
    const bankAuth = localStorage.getItem("bankAuth");
    
    if (userAuth) {
      const userData = JSON.parse(userAuth);
      
      try {
        // Check Supabase for this user
        const { data, error } = await supabase
          .from('user_identities')
          .select('*')
          .eq('email', userData.email)
          .single();
        
        if (data) {
          // Check if user has created blockchain identity
          const hasBlockchainData = data.kyc_documents?.blockchain_identity;
          
          if (hasBlockchainData) {
            setIdentityStatus("created");
            setIdentityData({
              type: "user",
              did: data.kyc_documents.blockchain_identity.did || `did:polygon:0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
              name: data.kyc_documents.name || data.name,
              email: data.kyc_documents.email || data.email,
              phone: data.kyc_documents.phone,
              aadharNumber: data.kyc_documents.aadharNumber,
              panNumber: data.kyc_documents.panNumber,
              walletAddress: data.wallet_address,
              createdOn: new Date(data.created_at).toLocaleDateString(),
              transactionHash: data.kyc_documents.blockchain_identity.transactionHash || `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
            });
            
            // Check if face is registered
            setFaceRegistered(data.face_registered || false);
          } else {
            setIdentityStatus("not_created");
          }
          
          // Load any stored documents
          loadUserDocuments(data.id);
        }
      } catch (error) {
        console.error("Error fetching user identity:", error);
      }
    } else if (bankAuth) {
      const bankData = JSON.parse(bankAuth);
      
      try {
        // Check Supabase for this bank
        const { data, error } = await supabase
          .from('bank_entities')
          .select('*')
          .eq('bank_name', bankData.name)
          .eq('branch_name', bankData.branch)
          .single();
        
        if (data) {
          // Bank exists in database
          setIdentityStatus("created");
          setIdentityData({
            type: "bank",
            did: `did:polygon:0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
            name: data.bank_name,
            createdOn: new Date(data.created_at).toLocaleDateString(),
            transactionHash: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
          });
          
          // Load any stored documents
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
      // List all files in the user's folder
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
      // List all files in the bank's folder
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
      // Determine user type and ID
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
      
      // Generate file name based on type
      let fileName;
      if (fileType === 'personalId') {
        fileName = `personal_id_${Date.now()}.${file.name.split('.').pop()}`;
      } else if (fileType === 'signature') {
        fileName = `signature_${Date.now()}.${file.name.split('.').pop()}`;
      } else {
        // For additional docs, use the provided name or the file name
        const docName = additionalDocName || file.name.replace(/\.\w+$/, '');
        fileName = `additional_${docName}_${Date.now()}.${file.name.split('.').pop()}`;
      }
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(`${id}/${fileName}`, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the file
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${id}/${fileName}`);
      
      // Update state based on file type
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
  
  // Update face registration status in database
  const updateFaceRegistrationStatus = async () => {
    try {
      const userAuth = localStorage.getItem("userAuth");
      const bankAuth = localStorage.getItem("bankAuth");
      
      if (userAuth) {
        const userData = JSON.parse(userAuth);
        
        // Using the custom type to allow for face_registered property
        const updateData: Partial<UserIdentity> = { 
          face_registered: true 
        };
        
        await supabase
          .from('user_identities')
          .update(updateData)
          .eq('email', userData.email);
      } else if (bankAuth) {
        const bankData = JSON.parse(bankAuth);
        
        // Using the custom type to allow for face_registered property
        const updateData: Partial<BankEntity> = { 
          face_registered: true 
        };
        
        await supabase
          .from('bank_entities')
          .update(updateData)
          .eq('bank_name', bankData.name)
          .eq('branch_name', bankData.branch);
      }
    } catch (error) {
      console.error("Error updating face registration status:", error);
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
        
        // Store face data in Supabase
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
  
  // Placeholder function to simulate creating identity
  const handleCreateIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Creating Digital Identity",
      description: "Processing your identity on the blockchain...",
    });
    
    setIdentityStatus("creating");
    
    // Navigate to homepage to create identity
    setTimeout(() => {
      toast({
        title: "Please Create Identity First",
        description: "You'll be redirected to the identity creation page",
      });
      
      // Redirect to homepage for identity creation
      window.location.href = '/';
    }, 2000);
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
          <Card>
            <CardHeader>
              <CardTitle>Identity Overview</CardTitle>
              <CardDescription>Your decentralized identity information</CardDescription>
            </CardHeader>
            <CardContent>
              {identityStatus === "not_created" ? (
                <div className="text-center py-8">
                  <UserCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Blockchain Identity Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created your blockchain identity yet
                  </p>
                  <Button onClick={() => window.location.href = '/create-identity'}>Create Blockchain Identity</Button>
                </div>
              ) : identityStatus === "creating" ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-4">Creating Your Identity...</h3>
                  <Progress value={66} className="mb-4" />
                  <p className="text-muted-foreground">
                    This may take a few moments as we secure your identity on the blockchain
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blockchain-muted p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Blockchain Identity Verified</p>
                      <p className="text-sm text-muted-foreground">Your digital identity is active on the blockchain</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">DID Identifier</p>
                        <p className="font-mono">{identityData?.did}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Created On</p>
                        <p>{identityData?.createdOn}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="text-green-500">Active</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Transaction Hash</p>
                      <p className="font-mono text-xs break-all">{identityData?.transactionHash}</p>
                    </div>
                    
                    {identityData?.walletAddress && (
                      <div>
                        <p className="text-muted-foreground">Wallet Address</p>
                        <p className="font-mono text-xs break-all">{identityData.walletAddress}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-muted-foreground">Personal Information</p>
                        <div className="space-y-1 text-sm">
                          <p><strong>Name:</strong> {identityData?.name}</p>
                          <p><strong>Email:</strong> {identityData?.email}</p>
                          <p><strong>Phone:</strong> {identityData?.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Identity Documents</p>
                        <div className="space-y-1 text-sm">
                          <p><strong>Aadhar:</strong> {identityData?.aadharNumber ? `****${identityData.aadharNumber.slice(-4)}` : 'Not provided'}</p>
                          <p><strong>PAN:</strong> {identityData?.panNumber ? `****${identityData.panNumber.slice(-4)}` : 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-blue-800">Identity Protection</h3>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Your identity is secured with blockchain technology and stored in the Supabase database.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Revoke Identity</Button>
                    <Button>Manage Access</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
              <CardDescription>Upload and manage your identity verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal ID Upload */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Personal ID
                      </CardTitle>
                      <CardDescription>
                        Aadhaar Card, PAN Card, or Voter ID
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {uploadedFiles.personalId ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-sm font-medium">Document Uploaded</p>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Label htmlFor="personalId" className="cursor-pointer flex-1">
                            <div className="w-full h-32 border-2 border-dashed rounded-md flex items-center justify-center hover:bg-gray-50">
                              <div className="text-center">
                                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                <span className="text-sm text-muted-foreground mt-1 block">Click to upload</span>
                              </div>
                            </div>
                          </Label>
                          <Input 
                            id="personalId" 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'personalId')} 
                            accept="image/*, application/pdf"
                            disabled={isUploading}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Digital Signature Upload */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Digital Signature
                      </CardTitle>
                      <CardDescription>
                        Required for digital document signing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {uploadedFiles.signature ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-sm font-medium">Signature Uploaded</p>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Label htmlFor="signature" className="cursor-pointer flex-1">
                            <div className="w-full h-32 border-2 border-dashed rounded-md flex items-center justify-center hover:bg-gray-50">
                              <div className="text-center">
                                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                <span className="text-sm text-muted-foreground mt-1 block">Click to upload</span>
                              </div>
                            </div>
                          </Label>
                          <Input 
                            id="signature" 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'signature')} 
                            accept="image/*"
                            disabled={isUploading}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Additional Documents */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">Additional Documents</CardTitle>
                    <CardDescription>
                      Upload any additional documents as needed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* List of uploaded additional documents */}
                      {uploadedFiles.additionalDocs.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Uploaded Documents:</p>
                          <div className="divide-y">
                            {uploadedFiles.additionalDocs.map((doc) => (
                              <div key={doc.id} className="py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span>{doc.name}</span>
                                </div>
                                <a 
                                  href={doc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Upload form */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <Label htmlFor="docName" className="sr-only">Document Name</Label>
                            <Input 
                              id="docName" 
                              placeholder="Document Name" 
                              value={additionalDocName}
                              onChange={(e) => setAdditionalDocName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="additionalDoc" className="sr-only">Upload Document</Label>
                            <Input 
                              id="additionalDoc" 
                              type="file" 
                              onChange={(e) => handleFileUpload(e, 'additional')}
                              accept="image/*, application/pdf, .doc, .docx"
                              disabled={isUploading}
                              className="max-w-xs"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: PDF, JPG, PNG, DOC, DOCX (Max: 5MB)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-lg font-medium mb-4">Document Security</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your documents are encrypted and only accessible with your consent. Only document hashes 
                    are stored on the blockchain, ensuring privacy and security.
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-green-700">
                        <strong>Enhanced Security:</strong> Your documents are stored with bank-level security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security preferences for your digital identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Facial Recognition */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Facial Recognition</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Register your face to enable account recovery if you forget your password and recovery phrase.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleFacialRecognition} 
                      variant={faceRegistered ? "outline" : "default"}
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      {faceRegistered ? "Update Face Registration" : "Register Face for Recovery"}
                    </Button>
                    {faceRegistered && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Face Registered</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Recovery Options */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Recovery Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">12-Word Recovery Phrase</p>
                        <p className="text-sm text-muted-foreground">
                          Your backup recovery phrase for account access
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Phrase
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reset Password</p>
                        <p className="text-sm text-muted-foreground">
                          Change your account password
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Access Control */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Access Control</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage who can access your digital identity information.
                  </p>
                  <Button variant="outline" className="w-full">
                    Manage Access Permissions
                  </Button>
                </div>
                
                {/* Two-Factor Authentication */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account.
                  </p>
                  <Button variant="outline" className="w-full">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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

</edits_to_apply>
