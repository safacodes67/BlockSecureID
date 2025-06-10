
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateMnemonic } from "@/lib/blockchain";

interface SignupFormProps {
  userType: "user" | "bank";
}

export const SignupForm: React.FC<SignupFormProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
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

      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name: userName,
            mobile: userMobile
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Generate mnemonic phrase for the user
      const mnemonicPhrase = generateMnemonic();
      
      // Create user in our database
      const { data, error } = await supabase
        .from("user_identities")
        .insert({
          name: userName,
          email: userEmail,
          mobile: userMobile,
          mnemonic_phrase: mnemonicPhrase,
        })
        .select()
        .single();

      if (error) throw error;

      // Store auth info in localStorage for immediate access
      const authInfo = {
        id: data.id,
        name: userName,
        email: userEmail,
        mobile: userMobile,
        type: "user"
      };
      localStorage.setItem("userAuth", JSON.stringify(authInfo));

      toast({
        title: "Account Created Successfully",
        description: "Welcome to BlockSecure ID! Please check your email for verification.",
      });

      navigate("/dashboard");

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

      // Create auth user with bank email format
      const bankEmail = `${ifscCode.toLowerCase()}@bank.blocksecure.com`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: bankEmail,
        password: bankPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            bank_name: bankName,
            branch_name: branchName,
            ifsc_code: ifscCode
          }
        }
      });

      if (authError) throw authError;

      // Generate mnemonic phrase for the bank
      const mnemonicPhrase = generateMnemonic();
      
      // Create bank entity
      const { data, error } = await supabase
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

      if (error) throw error;

      // Mark manager code as used
      await supabase
        .from("manager_codes")
        .update({ used: true })
        .eq("code", managerCode);

      // Store auth info in localStorage
      const authInfo = {
        id: data.id,
        name: bankName,
        branch: branchName,
        ifsc: ifscCode,
        type: "bank"
      };
      localStorage.setItem("bankAuth", JSON.stringify(authInfo));

      toast({
        title: "Bank Account Created Successfully",
        description: "Welcome to BlockSecure ID! Your bank account has been created.",
      });

      navigate("/dashboard");

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
