import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Camera, EyeOff, Eye, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CameraCapture from "@/components/kyc/CameraCapture";

interface SignupFormProps {
  userType: "user" | "bank";
}

export const SignupForm: React.FC<SignupFormProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mnemonicPhrase, setMnemonicPhrase] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isFaceRegistered, setIsFaceRegistered] = useState(false);
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);
  const [faceImageUrl, setFaceImageUrl] = useState<string | null>(null);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  
  // User form states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userPassword, setUserPassword] = useState("");
  
  // Bank form states
  const [bankName, setBankName] = useState("");
  const [bankEmail, setBankEmail] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [managerCode, setManagerCode] = useState("");
  const [bankPassword, setBankPassword] = useState("");

  // Function to generate a secure 12-word mnemonic phrase
  const generateMnemonic = () => {
    // In production, this should be cryptographically secure
    // This is a simple placeholder
    const wordList = [
      "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", 
      "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid",
      "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
      "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance",
      "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
      "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album",
      "alcohol", "alert", "alien", "all", "alley", "allow", "almost", "alone"
    ];
    
    const selectedWords = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      selectedWords.push(wordList[randomIndex]);
    }
    
    return selectedWords.join(" ");
  };

  // Function to validate manager code against database
  const validateManagerCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('manager_codes')
        .select('*')
        .eq('code', code)
        .eq('used', false)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data ? true : false;
    } catch (error) {
      console.error('Error validating manager code:', error);
      return false;
    }
  };

  // Function to mark manager code as used
  const markManagerCodeAsUsed = async (code: string) => {
    try {
      const { error } = await supabase
        .from('manager_codes')
        .update({ used: true })
        .eq('code', code);
      
      if (error) {
        console.error('Error marking manager code as used:', error);
      }
    } catch (error) {
      console.error('Error marking manager code as used:', error);
    }
  };

  // Handle user registration
  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
      });
      
      if (authError) throw authError;
      
      // Generate mnemonic phrase
      const mnemonic = generateMnemonic();
      setMnemonicPhrase(mnemonic);
      
      // Store in Supabase
      const { data, error } = await supabase
        .from('user_identities')
        .insert([
          {
            name: userName,
            email: userEmail,
            mobile: userMobile,
            mnemonic_phrase: mnemonic,
            face_registered: isFaceRegistered
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // If face is registered, update with face image URL
      if (isFaceRegistered && faceImageUrl && data[0].id) {
        const { error: updateError } = await supabase
          .from('user_identities')
          .update({
            face_image_url: faceImageUrl
          })
          .eq('id', data[0].id);
          
        if (updateError) {
          console.error("Error updating face image URL:", updateError);
        }
      }
      
      toast({
        title: "Registration Successful",
        description: "Your identity has been created and stored in the database.",
      });
      
      // Store in localStorage for session
      localStorage.setItem("userAuth", JSON.stringify({
        type: "user",
        name: userName,
        email: userEmail,
        mobile: userMobile,
        timestamp: new Date().toISOString()
      }));
      
      // Show mnemonic phrase to user
      setShowMnemonic(true);
      
    } catch (error: any) {
      console.error('Error creating user identity:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create your identity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle bank registration
  const handleBankRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate manager code
      const isValidCode = await validateManagerCode(managerCode);
      if (!isValidCode) {
        toast({
          title: "Authorization Failed",
          description: "Invalid or already used manager code",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // First create auth user for the bank
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: bankEmail,
        password: bankPassword,
      });
      
      if (authError) throw authError;
      
      // Generate mnemonic phrase
      const mnemonic = generateMnemonic();
      setMnemonicPhrase(mnemonic);
      
      // Store in Supabase
      const { data, error } = await supabase
        .from('bank_entities')
        .insert([
          {
            bank_name: bankName,
            branch_name: branchName,
            ifsc_code: ifscCode,
            manager_code: managerCode,
            mnemonic_phrase: mnemonic,
            face_registered: isFaceRegistered
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // If face is registered, update with face image URL
      if (isFaceRegistered && faceImageUrl && data[0].id) {
        const { error: updateError } = await supabase
          .from('bank_entities')
          .update({
            face_image_url: faceImageUrl
          })
          .eq('id', data[0].id);
          
        if (updateError) {
          console.error("Error updating face image URL:", updateError);
        }
      }
      
      // Mark manager code as used
      await markManagerCodeAsUsed(managerCode);
      
      toast({
        title: "Bank Registration Successful",
        description: "Bank identity has been created and stored in the database.",
      });
      
      // Store in localStorage for session
      localStorage.setItem("bankAuth", JSON.stringify({
        type: "bank",
        name: bankName,
        branch: branchName,
        ifsc: ifscCode,
        timestamp: new Date().toISOString()
      }));
      
      // Show mnemonic phrase to user
      setShowMnemonic(true);
      
    } catch (error: any) {
      console.error('Error creating bank entity:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create bank identity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle facial registration
  const handleFaceRegistration = () => {
    // Generate a temporary ID for file storage
    const tempId = `temp-${new Date().getTime()}`;
    setTempUserId(tempId);
    setShowFaceRegistration(true);
  };

  // Handle captured face image
  const handleFaceCaptured = (imageUrl: string | null) => {
    if (imageUrl) {
      setFaceImageUrl(imageUrl);
      setIsFaceRegistered(true);
      setShowFaceRegistration(false);
      
      toast({
        title: "Face Registration Successful",
        description: "Your face has been registered for recovery purposes",
      });
    }
  };

  return (
    <div className="space-y-4">
      {userType === "user" ? (
        <form onSubmit={handleUserRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address</Label>
              <Input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userMobile">Mobile Number</Label>
            <Input
              id="userMobile"
              value={userMobile}
              onChange={(e) => setUserMobile(e.target.value)}
              placeholder="Enter your mobile number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPassword">Password</Label>
            <div className="relative">
              <Input
                id="userPassword"
                type={showPassword ? "text" : "password"}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Create a secure password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className={isFaceRegistered ? "bg-green-50" : ""}
              onClick={handleFaceRegistration}
            >
              {isFaceRegistered ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Face Registered
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Register Face
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">Optional: For account recovery</span>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Your Identity"} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleBankRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankEmail">Bank Email</Label>
              <Input
                id="bankEmail"
                type="email"
                value={bankEmail}
                onChange={(e) => setBankEmail(e.target.value)}
                placeholder="Enter bank email"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter branch name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                placeholder="Enter IFSC code"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerCode">Manager Authorization Code</Label>
            <Input
              id="managerCode"
              type="text"
              value={managerCode}
              onChange={(e) => setManagerCode(e.target.value)}
              placeholder="e.g., MGRA1234"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter one of the valid manager codes provided to you
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankPassword">Password</Label>
            <div className="relative">
              <Input
                id="bankPassword"
                type={showPassword ? "text" : "password"}
                value={bankPassword}
                onChange={(e) => setBankPassword(e.target.value)}
                placeholder="Create a secure password"
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className={isFaceRegistered ? "bg-green-50" : ""}
              onClick={handleFaceRegistration}
            >
              {isFaceRegistered ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Face Registered
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Register Face
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">Optional: For account recovery</span>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Bank Identity..." : "Create Bank Identity"} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      )}
      
      {/* Recovery Phrase Dialog */}
      <Dialog open={showMnemonic} onOpenChange={setShowMnemonic}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Recovery Phrase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">12-Word Recovery Phrase</h3>
              <p className="text-yellow-700 mb-4">Please save this phrase in a secure location:</p>
              <div className="p-3 bg-white border border-yellow-300 rounded-md">
                <p className="font-mono text-sm break-all">{mnemonicPhrase}</p>
              </div>
              <p className="mt-4 text-sm text-yellow-700">
                This phrase gives you access to your digital identity. Never share it with anyone!
              </p>
            </div>
            <Button className="w-full" onClick={() => {
              setShowMnemonic(false);
              navigate("/dashboard");
            }}>
              I've Saved My Recovery Phrase
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Facial Registration Dialog */}
      <Dialog open={showFaceRegistration} onOpenChange={setShowFaceRegistration}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Your Face</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {tempUserId && (
              <CameraCapture
                onCapture={handleFaceCaptured}
                userId={tempUserId}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
