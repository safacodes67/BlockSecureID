
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Key, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordRecoveryProps {
  onBack: () => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"mnemonic" | "reset">("mnemonic");
  const [mnemonic, setMnemonic] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMnemonicVerification = async () => {
    if (!mnemonic.trim()) {
      toast({
        title: "Error",
        description: "Please enter your 12-word recovery phrase",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if mnemonic exists in database
      const { data, error } = await supabase
        .from("user_identities")
        .select("email")
        .eq("mnemonic_phrase", mnemonic.trim())
        .single();

      if (error || !data) {
        throw new Error("Invalid recovery phrase");
      }

      setEmail(data.email);
      setStep("reset");
      toast({
        title: "Recovery phrase verified",
        description: "Now set your new password",
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: "Invalid recovery phrase. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully",
        description: "You can now log in with your new password",
      });

      onBack();
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <CardTitle>Account Recovery</CardTitle>
            </div>
          </div>
          <CardDescription>
            {step === "mnemonic" 
              ? "Enter your 12-word recovery phrase to reset your password"
              : "Set your new password"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "mnemonic" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="mnemonic">Recovery Phrase</Label>
                <Textarea
                  id="mnemonic"
                  placeholder="Enter your 12-word recovery phrase separated by spaces"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleMnemonicVerification} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Recovery Phrase"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button 
                onClick={handlePasswordReset} 
                className="w-full"
                disabled={loading}
              >
                <Key className="h-4 w-4 mr-2" />
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordRecovery;
