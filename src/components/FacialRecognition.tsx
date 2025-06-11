
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, StopCircle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FacialRecognitionProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const FacialRecognition: React.FC<FacialRecognitionProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera. Please allow camera permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 image data
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      toast({
        title: "Face Captured Successfully",
        description: "Your facial data has been captured for identity verification.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Facial Recognition
            </CardTitle>
            <CardDescription>
              Position your face in the center of the frame
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          {!capturedImage ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-gray-100 rounded-md object-cover"
              />
              {isStreaming && (
                <div className="absolute inset-0 border-2 border-dashed border-white rounded-md flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-full opacity-50"></div>
                </div>
              )}
              {!isStreaming && (
                <div className="absolute inset-0 bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Starting camera...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-2">
          {!capturedImage ? (
            <>
              <Button
                onClick={capturePhoto}
                disabled={!isStreaming}
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                disabled={!isStreaming}
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </>
          ) : (
            <>
              <Button onClick={confirmCapture} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm
              </Button>
              <Button onClick={retakePhoto} variant="outline">
                Retake
              </Button>
            </>
          )}
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Your facial data is encrypted and used only for identity verification
        </p>
      </CardContent>
    </Card>
  );
};

export default FacialRecognition;
