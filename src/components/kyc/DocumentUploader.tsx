
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploaderProps {
  userId: string;
  documentType: string;
  onUpload: (url: string) => void;
  allowedTypes?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  userId, 
  documentType, 
  onUpload,
  allowedTypes = ".jpg,.jpeg,.png,.pdf" 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Create a sanitized filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType.replace(/\s+/g, '_')}_${new Date().getTime()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('user_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('user_documents')
        .getPublicUrl(filePath);
      
      setUploadedUrl(publicUrlData.publicUrl);
      onUpload(publicUrlData.publicUrl);
      
      toast({
        title: "Document Uploaded",
        description: `Your ${documentType} has been successfully uploaded`,
      });
      
      // Simulate progress for better UX
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(Math.min(currentProgress, 100));
        if (currentProgress >= 100) clearInterval(interval);
      }, 100);
      
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadedUrl(null);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={`document-${documentType}`}>{documentType}</Label>
      
      {!uploadedUrl ? (
        <>
          <div className="flex items-center gap-2">
            <Input
              id={`document-${documentType}`}
              type="file"
              ref={inputRef}
              accept={allowedTypes}
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {file && !uploading && (
              <Button 
                type="button" 
                onClick={handleUpload}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            )}
            
            {uploading && (
              <Button 
                disabled 
                size="sm"
              >
                Uploading...
              </Button>
            )}
          </div>
          
          {file && (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded border text-sm">
              <div className="flex items-center">
                <File className="h-4 w-4 mr-2 text-gray-500" />
                <span className="truncate max-w-[180px]">{file.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetUpload}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {uploading && (
            <Progress value={progress} className="h-1" />
          )}
        </>
      ) : (
        <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200 text-sm">
          <div className="flex items-center text-green-700">
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            <span>Document uploaded successfully</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetUpload}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
