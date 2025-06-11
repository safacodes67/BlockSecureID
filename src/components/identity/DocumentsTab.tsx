
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Upload, FileText, Key, Shield } from "lucide-react";

interface UploadedFiles {
  personalId?: string;
  signature?: string;
  additionalDocs: { id: string; name: string; url: string }[];
}

interface DocumentsTabProps {
  uploadedFiles: UploadedFiles;
  isUploading: boolean;
  additionalDocName: string;
  setAdditionalDocName: (name: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, fileType: 'personalId' | 'signature' | 'additional') => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  uploadedFiles,
  isUploading,
  additionalDocName,
  setAdditionalDocName,
  handleFileUpload
}) => {
  return (
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
  );
};

export default DocumentsTab;
