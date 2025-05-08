
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { supabase } from "@/integrations/supabase/client";
import { User, Lock, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignupFormProps {
  userType: "user" | "bank";
}

export const SignupForm: React.FC<SignupFormProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [managerCode, setManagerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  // Function to generate a mnemonic and wallet address
  const generateCredentials = () => {
    try {
      // Generate a random mnemonic (24 words entropy by default)
      const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase;
      if (!mnemonic) throw new Error("Failed to generate mnemonic");
      
      // Create a wallet from the mnemonic
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      
      setMnemonic(mnemonic);
      setWallet(wallet.address);
      
      return { mnemonic, wallet: wallet.address };
    } catch (error) {
      console.error("Error generating credentials:", error);
      setError("Failed to generate blockchain credentials. Please try again.");
      return null;
    }
  };

  // Validate manager code
  const validateManagerCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from("manager_codes")
        .select("*")
        .eq("code", code)
        .eq("used", false)
        .single();
      
      if (error || !data) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // Mark manager code as used
  const markManagerCodeAsUsed = async (code: string) => {
    try {
      await supabase
        .from("manager_codes")
        .update({ used: true })
        .eq("code", code);
    } catch (error) {
      console.error("Error marking manager code as used:", error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Validate password strength
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (userType === "bank") {
        // Validate manager code for bank signup
        const isValidCode = await validateManagerCode(managerCode);
        if (!isValidCode) {
          setError("Invalid or already used manager code");
          setLoading(false);
          return;
        }
      }

      // Generate blockchain credentials
      const credentials = generateCredentials();
      if (!credentials) {
        setLoading(false);
        return;
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Signup failed. Please try again.");
      }

      // Store user or bank data in respective tables
      if (userType === "user") {
        const { error: identityError } = await supabase
          .from("user_identities")
          .insert({
            name,
            email,
            mobile,
            mnemonic_phrase: credentials.mnemonic,
            wallet_address: credentials.wallet,
          });

        if (identityError) {
          throw identityError;
        }

        // Store in localStorage for easy access
        localStorage.setItem(
          "userAuth",
          JSON.stringify({
            name,
            email,
            mnemonic: credentials.mnemonic,
            wallet: credentials.wallet,
          })
        );
      } else {
        // For bank account
        const { error: bankError } = await supabase
          .from("bank_entities")
          .insert({
            bank_name: bankName,
            branch_name: branchName,
            ifsc_code: ifscCode,
            manager_code: managerCode,
            mnemonic_phrase: credentials.mnemonic,
            wallet_address: credentials.wallet,
          });

        if (bankError) {
          throw bankError;
        }

        // Mark manager code as used
        await markManagerCodeAsUsed(managerCode);

        // Store in localStorage for easy access
        localStorage.setItem(
          "bankAuth",
          JSON.stringify({
            name: bankName,
            branch: branchName,
            mnemonic: credentials.mnemonic,
            wallet: credentials.wallet,
          })
        );
      }

      toast({
        title: "Account created!",
        description: "You have successfully created an account.",
      });

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {userType === "user" ? (
        // Individual user signup form
        <>
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              placeholder="+91 9999999999"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
        </>
      ) : (
        // Bank signup form
        <>
          <div className="grid gap-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="State Bank of India"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              placeholder="Mumbai Main"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              placeholder="SBIN0001234"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="managerCode">Manager Code</Label>
            <Input
              id="managerCode"
              placeholder="Enter your manager code"
              value={managerCode}
              onChange={(e) => setManagerCode(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              This code was provided by the system admin
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Manager Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="manager@bank.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </>
      )}
      
      {/* Common password fields */}
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : userType === "user" ? (
          <>
            <User className="mr-2 h-4 w-4" />
            Create Individual Account
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Create Bank Account
          </>
        )}
      </Button>
    </form>
  );
};
