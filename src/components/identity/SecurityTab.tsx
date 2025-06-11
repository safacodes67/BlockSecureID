
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Camera } from "lucide-react";

interface SecurityTabProps {
  faceRegistered: boolean;
  handleFacialRecognition: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ faceRegistered, handleFacialRecognition }) => {
  return (
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
  );
};

export default SecurityTab;
