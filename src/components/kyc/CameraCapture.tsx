
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, XCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface CameraCaptureProps {
  onCapture: (imageData: string | null) => void;
  userId: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, userId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      // Reset previous errors
      setCameraError(null);
      
      // Request camera permissions
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);
      setStream(cameraStream);
      setIsActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
      setCameraError(error.message || "Unable to access your camera");
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Cleanup function
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  // Take picture
  const capturePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        onCapture(imageData);
        stopCamera(); // Stop the camera after capture
      }
    }
  };

  // Reset and retake photo
  const retakePicture = () => {
    setCapturedImage(null);
    onCapture(null);
    startCamera();
  };

  // Upload image to Supabase Storage
  const uploadImage = async () => {
    if (!capturedImage || !userId) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Convert base64 to blob
      const base64Data = capturedImage.split(',')[1];
      const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
      
      // Generate a unique filename
      const filename = `face_${new Date().getTime()}.jpg`;
      const filePath = `${userId}/${filename}`;

      // Progress simulation for better UX
      let progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Check if bucket exists
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) {
        throw new Error(`Error checking buckets: ${bucketsError.message}`);
      }
      
      const userDocumentsBucket = buckets?.find(b => b.name === 'user_documents');
      
      if (!userDocumentsBucket) {
        toast({
          title: "Storage Error",
          description: "Storage bucket not found. Please contact support.",
          variant: "destructive",
        });
        throw new Error("Storage bucket 'user_documents' not found");
      }
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('user_documents')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });
      
      clearInterval(progressInterval);
      
      if (error) throw error;
      
      setUploadProgress(100);
      
      // Get public URL
      const { data: publicURLData } = supabase.storage
        .from('user_documents')
        .getPublicUrl(filePath);
      
      // Update user's face_registered status
      const { error: userUpdateError } = await supabase
        .from("user_identities")
        .update({ face_registered: true })
        .eq("id", userId);
        
      if (userUpdateError) {
        console.error("Error updating user face registration status:", userUpdateError);
      }
      
      toast({
        title: "Face Registration Complete",
        description: "Your facial image has been successfully registered",
      });
      
      // Add the URL to the input
      onCapture(publicURLData.publicUrl);
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      {!isActive && !capturedImage && hasPermission !== false ? (
        <div className="flex justify-center">
          <Button 
            onClick={startCamera} 
            className="w-full"
            type="button"
          >
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        </div>
      ) : null}
      
      {hasPermission === false && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="font-medium mb-2">Camera Access Denied</h3>
          <p className="text-sm">{cameraError || "Please grant camera permissions in your browser settings and refresh the page."}</p>
        </div>
      )}
      
      {isActive && !capturedImage ? (
        <div className="space-y-4">
          <div className="relative bg-black rounded-md overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button 
              onClick={capturePicture} 
              type="button"
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>
            
            <Button 
              onClick={stopCamera} 
              variant="outline" 
              type="button"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      
      {capturedImage ? (
        <div className="space-y-4">
          <div className="relative bg-black rounded-md overflow-hidden">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-auto"
            />
          </div>
          
          {isUploading && (
            <div className="w-full">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center mt-1">{uploadProgress}%</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-2">
            {isUploading ? (
              <Button disabled>
                Uploading... {uploadProgress}%
              </Button>
            ) : (
              <>
                <Button 
                  onClick={uploadImage}
                  type="button"
                  variant="default"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Use Photo
                </Button>
                
                <Button 
                  onClick={retakePicture} 
                  variant="outline"
                  type="button"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
