
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, KeyRound, AlertTriangle, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface LoginFormProps {
  userType: "user" | "bank";
}

export const LoginForm: React.FC<LoginFormProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [showFacialRecovery, setShowFacialRecovery] = useState(false);

  // Login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check user type from profiles or bank_entities
      if (userType === "user") {
        const { data: userData, error: userError } = await supabase
          .from("user_identities")
          .select("*")
          .eq("email", email)
          .single();
        
        if (userError) throw userError;
        
        // Store user data in local storage
        localStorage.setItem("userAuth", JSON.stringify({
          type: "user",
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          timestamp: new Date().toISOString()
        }));
      } else {
        // Find bank by email (assuming bank email is stored)
        const { data: bankData, error: bankError } = await supabase
          .from("bank_entities")
          .select("*")
          .eq("bank_name", email)  // Using bank_name instead of email since there's no email field
          .single();
          
        if (bankError) {
          toast({
            title: "Bank not found",
            description: "Please check your credentials or sign up",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Store bank data in local storage
        localStorage.setItem("bankAuth", JSON.stringify({
          type: "bank",
          name: bankData.bank_name,
          branch: bankData.branch_name,
          ifsc: bankData.ifsc_code,
          timestamp: new Date().toISOString()
        }));
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back to BlockSecure ID.",
      });
      
      // Check if wallet is connected
      const wallet = localStorage.getItem("walletAddress");
      if (wallet) {
        navigate("/dashboard");
      } else {
        // Prompt to connect wallet before proceeding
        toast({
          title: "Connect Wallet Required",
          description: "Please connect your wallet to continue",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials, please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Recovery with mnemonic phrase
  const handleRecoveryPhraseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (userType === "user") {
        // Check for user with this recovery phrase
        const { data, error } = await supabase
          .from("user_identities")
          .select("*")
          .eq("mnemonic_phrase", recoveryPhrase)
          .single();
        
        if (error) throw new Error("Invalid recovery phrase");
        
        if (data) {
          // Reset password flow
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email);
          if (resetError) throw resetError;
          
          toast({
            title: "Recovery Successful",
            description: "Check your email to reset your password",
          });
          
          // Store user data
          localStorage.setItem("userAuth", JSON.stringify({
            type: "user",
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            timestamp: new Date().toISOString()
          }));
          
          setShowRecovery(false);
        }
      } else {
        // Check for bank with this recovery phrase
        const { data, error } = await supabase
          .from("bank_entities")
          .select("*")
          .eq("mnemonic_phrase", recoveryPhrase)
          .single();
        
        if (error) throw new Error("Invalid recovery phrase");
        
        if (data) {
          // For banks, we don't have email field, so we can't use resetPasswordForEmail
          // Instead, we'll just verify and authenticate the bank
          toast({
            title: "Recovery Successful",
            description: "Bank identity verified via recovery phrase",
          });
          
          // Store bank data
          localStorage.setItem("bankAuth", JSON.stringify({
            type: "bank",
            name: data.bank_name,
            branch: data.branch_name,
            ifsc: data.ifsc_code,
            timestamp: new Date().toISOString()
          }));
          
          setShowRecovery(false);
        }
      }
    } catch (error: any) {
      console.error("Recovery error:", error);
      toast({
        title: "Recovery Failed",
        description: error.message || "Invalid recovery phrase",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Facial Recognition Recovery
  const handleFacialRecovery = () => {
    setShowFacialRecovery(true);
    // This would typically integrate with a facial recognition API
    toast({
      title: "Facial Recognition",
      description: "Please look at the camera to verify your identity",
    });
    
    // Simulate facial recognition for demo purposes
    setTimeout(() => {
      toast({
        title: "Identity Verified",
        description: "Your recovery phrase will be displayed",
      });
      
      // In a real implementation, this would fetch the user's recovery phrase after verification
      setShowFacialRecovery(false);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
      
      <div className="text-center space-y-4 pt-2">
        <div className="flex items-center justify-center">
          <Separator className="w-1/3" />
          <span className="px-2 text-xs text-muted-foreground">Or recover with</span>
          <Separator className="w-1/3" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowRecovery(true)}
            className="text-sm"
          >
            <KeyRound className="h-4 w-4 mr-2" /> Recovery Phrase
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleFacialRecovery}
            className="text-sm"
          >
            <Camera className="h-4 w-4 mr-2" /> Facial Recognition
          </Button>
        </div>
      </div>
      
      {/* Recovery Phrase Dialog */}
      <Dialog open={showRecovery} onOpenChange={setShowRecovery}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recover with 12-Word Phrase</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRecoveryPhraseSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recovery-phrase">Enter your 12-word recovery phrase</Label>
              <Input
                id="recovery-phrase"
                placeholder="Enter your recovery phrase"
                value={recoveryPhrase}
                onChange={(e) => setRecoveryPhrase(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter all 12 words of your recovery phrase, separated by spaces.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRecovery(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Recover Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Facial Recognition Dialog */}
      <Dialog open={showFacialRecovery} onOpenChange={setShowFacialRecovery}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Facial Recognition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="w-full h-64 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
              <Camera className="h-20 w-20 text-gray-400" />
            </div>
            <p className="text-sm">
              Position your face in the center of the frame to verify your identity.
            </p>
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setShowFacialRecovery(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
