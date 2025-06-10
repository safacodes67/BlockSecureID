
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Shield, X } from "lucide-react";
import CameraCapture from "./CameraCapture";

interface FacialRecognitionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onComplete: () => void;
}

const FacialRecognitionPrompt: React.FC<FacialRecognitionPromptProps> = ({
  isOpen,
  onClose,
  userId,
  onComplete
}) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleStartFaceRegistration = () => {
    setShowCamera(true);
  };

  const handleFaceCapture = (imageData: string | null) => {
    if (imageData) {
      onComplete();
      onClose();
    }
  };

  const handleSkipForNow = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Enhanced Security Setup
          </DialogTitle>
          <DialogDescription>
            Add facial recognition for additional account security and recovery options.
          </DialogDescription>
        </DialogHeader>
        
        {!showCamera ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Why enable facial recognition?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Secure account recovery if you forget your password</li>
                <li>• Additional security layer for sensitive operations</li>
                <li>• Quick and convenient identity verification</li>
                <li>• Enhanced fraud protection</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleStartFaceRegistration} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Set Up Facial Recognition
              </Button>
              
              <Button variant="outline" onClick={handleSkipForNow} className="w-full">
                Skip for Now
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              You can always enable this later in your security settings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <CameraCapture onCapture={handleFaceCapture} userId={userId} />
            
            <Button 
              variant="outline" 
              onClick={() => setShowCamera(false)}
              className="w-full"
            >
              <X className="mr-2 h-3 w-3" />
              Go Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FacialRecognitionPrompt;
