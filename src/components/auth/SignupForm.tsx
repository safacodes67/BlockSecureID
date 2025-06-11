
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateMnemonic } from "@/lib/blockchain";
import MnemonicDisplay from "./MnemonicDisplay";

interface SignupFormProps {
  userType: "user" | "bank";
}

export const SignupForm: React.FC<SignupFormProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState("");
  
  // User form state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userPassword, setUserPassword] = useState("");
  
  // Bank form state
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [managerCode, setManagerCode] = useState("");
  const [bankPassword, setBankPassword] = useState("");

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userName || !userEmail || !userMobile || !userPassword) {
        throw new Error("Please fill in all fields");
      }

      // Generate mnemonic phrase for the user
      const mnemonicPhrase = generateMnemonic();
      setGeneratedMnemonic(mnemonicPhrase);

      console.log("Starting user signup process...");

      // Create user in our database first (without auth)
      const { data: userData, error: userError } = await supabase
        .from("user_identities")
        .insert({
          name: userName,
          email: userEmail,
          mobile: userMobile,
          mnemonic_phrase: mnemonicPhrase,
        })
        .select()
        .single();

      if (userError) {
        console.error("User creation error:", userError);
        throw userError;
      }

      console.log("User created successfully:", userData);

      // Store auth info in localStorage for immediate access
      const authInfo = {
        id: userData.id,
        name: userName,
        email: userEmail,
        mobile: userMobile,
        type: "user"
      };
      localStorage.setItem("userAuth", JSON.stringify(authInfo));

      toast({
        title: "Account Created Successfully",
        description: "Please save your recovery phrase safely!",
      });

      // Show mnemonic instead of navigating directly
      setShowMnemonic(true);

    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBankSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!bankName || !branchName || !ifscCode || !managerCode || !bankPassword) {
        throw new Error("Please fill in all fields");
      }

      console.log("Starting bank signup process...");

      // Verify manager code
      const { data: managerData, error: managerError } = await supabase
        .from("manager_codes")
        .select("*")
        .eq("code", managerCode)
        .eq("used", false)
        .single();

      if (managerError || !managerData) {
        throw new Error("Invalid or already used manager code");
      }

      // Generate mnemonic phrase for the bank
      const mnemonicPhrase = generateMnemonic();
      setGeneratedMnemonic(mnemonicPhrase);

      // Create bank entity
      const { data: bankData, error: bankError } = await supabase
        .from("bank_entities")
        .insert({
          bank_name: bankName,
          branch_name: branchName,
          ifsc_code: ifscCode,
          manager_code: managerCode,
          mnemonic_phrase: mnemonicPhrase,
        })
        .select()
        .single();

      if (bankError) {
        console.error("Bank creation error:", bankError);
        throw bankError;
      }

      console.log("Bank created successfully:", bankData);

      // Mark manager code as used
      await supabase
        .from("manager_codes")
        .update({ used: true })
        .eq("code", managerCode);

      // Store auth info in localStorage
      const authInfo = {
        id: bankData.id,
        name: bankName,
        branch: branchName,
        ifsc: ifscCode,
        type: "bank"
      };
      localStorage.setItem("bankAuth", JSON.stringify(authInfo));

      toast({
        title: "Bank Account Created Successfully",
        description: "Please save your recovery phrase safely!",
      });

      // Show mnemonic instead of navigating directly
      setShowMnemonic(true);

    } catch (error: any) {
      console.error("Bank signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create bank account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAfterMnemonic = () => {
    navigate("/dashboard");
  };

  if (showMnemonic) {
    return (
      <MnemonicDisplay 
        mnemonic={generatedMnemonic} 
        onContinue={handleContinueAfterMnemonic}
      />
    );
  }

  return (
    <div className="space-y-4">
      {userType === "user" ? (
        <form onSubmit={handleUserSignup} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={userMobile}
              onChange={(e) => setUserMobile(e.target.value)}
              placeholder="Enter your mobile number"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleBankSignup} className="space-y-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Enter branch name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="Enter IFSC code"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="managerCode">Manager Code</Label>
            <Input
              id="managerCode"
              type="text"
              value={managerCode}
              onChange={(e) => setManagerCode(e.target.value)}
              placeholder="Enter manager authorization code"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="bankPassword">Password</Label>
            <Input
              id="bankPassword"
              type="password"
              value={bankPassword}
              onChange={(e) => setBankPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Bank Account..." : "Create Bank Account"}
          </Button>
        </form>
      )}
    </div>
  );
};
