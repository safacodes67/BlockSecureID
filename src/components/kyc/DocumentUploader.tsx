
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
  onUpload: (url: string | null) => void;
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

  const createBucketIfNotExists = async (bucketName: string) => {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        return false;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        // Create bucket
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          return false;
        }
        
        console.log(`Created bucket: ${bucketName}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error in createBucketIfNotExists:", error);
      return false;
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Determine bucket name based on context
      const bucketName = 'user_documents';
      
      // Ensure bucket exists
      const bucketReady = await createBucketIfNotExists(bucketName);
      if (!bucketReady) {
        throw new Error("Failed to prepare storage bucket");
      }
      
      // Create a sanitized filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType.replace(/\s+/g, '_')}_${new Date().getTime()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Start upload progress simulation for UI feedback
      let progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
      
      clearInterval(progressInterval);
      
      if (error) {
        console.error("Upload error:", error);
        throw new Error(error.message);
      }
      
      // Set progress to 100% when complete
      setProgress(100);
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      setUploadedUrl(publicUrlData.publicUrl);
      onUpload(publicUrlData.publicUrl);
      
      toast({
        title: "Document Uploaded",
        description: `Your ${documentType} has been successfully uploaded`,
      });
      
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadedUrl(null);
    onUpload(null);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="border rounded-md p-4">
      <Label className="text-sm font-medium mb-2 block">{documentType}</Label>
      
      {!uploadedUrl ? (
        <div className="space-y-3">
          <div className="flex items-center">
            <Input 
              type="file" 
              ref={inputRef}
              onChange={handleFileChange}
              accept={allowedTypes}
              className="text-sm"
            />
          </div>
          
          {file && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-sm">
                <File className="h-4 w-4 mr-2 text-blue-500" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  onClick={handleUpload}
                  disabled={uploading}
                  size="sm"
                  className="text-xs"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetUpload}
                  size="sm"
                  className="text-xs"
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
              
              {uploading && (
                <div className="w-full">
                  <Progress value={progress} className="h-1" />
                  <p className="text-xs text-center mt-1">{progress}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center bg-green-50 text-green-700 p-2 rounded-md">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">Document uploaded successfully</span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs"
              asChild
            >
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={resetUpload}
            >
              <X className="h-3 w-3 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-3">
        Accepted file types: {allowedTypes.replace(/\./g, '').replace(/,/g, ', ')}
      </p>
    </div>
  );
};

export default DocumentUploader;
