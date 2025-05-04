
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, FileCheck, Flag, Search, Wallet, Link, Lock, HelpCircle, Camera } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const UserManual = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">BlockSecure ID User Manual</h1>
        <p className="text-muted-foreground mt-2">
          A comprehensive guide to using our blockchain-based identity management platform
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="identity">Digital Identity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Getting Started with BlockSecure ID
              </CardTitle>
              <CardDescription>
                Learn how to set up and start using your blockchain-based digital identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Creating Your Account</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Step 1:</strong> Visit the BlockSecure ID homepage at <span className="font-mono">https://blocksecure.id</span>
                  </p>
                  <p>
                    <strong>Step 2:</strong> Click on the "Sign Up" tab and choose your account type (Individual or Bank)
                  </p>
                  <p>
                    <strong>Step 3:</strong> Fill in the required information:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Individual Users:</strong> Name, Email, Mobile Number, and Password</li>
                    <li><strong>Bank Entities:</strong> Bank Name, Branch Name, IFSC Code, Manager Code, and Password</li>
                  </ul>
                  <p>
                    <strong>Step 4:</strong> Optionally register your face for recovery purposes
                  </p>
                  <p>
                    <strong>Step 5:</strong> Click "Create Your Identity" or "Create Bank Identity"
                  </p>
                  <p>
                    <strong>Step 6:</strong> Save your 12-word recovery phrase in a secure location
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Connecting Your Wallet</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Step 1:</strong> Ensure you have MetaMask installed in your browser
                  </p>
                  <p>
                    <strong>Step 2:</strong> Click the "Connect Wallet" button on the homepage or in the sidebar
                  </p>
                  <p>
                    <strong>Step 3:</strong> Approve the connection request in your MetaMask extension
                  </p>
                  <p>
                    <strong>Step 4:</strong> Your wallet address will appear in the button once connected
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Navigating the Dashboard</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Step 1:</strong> After logging in and connecting your wallet, you'll be directed to the Dashboard
                  </p>
                  <p>
                    <strong>Step 2:</strong> Use the sidebar navigation to access different features:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5">
                    <li className="flex items-center gap-1">
                      <Home className="h-4 w-4 text-purple-600" /> Home
                    </li>
                    <li className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-purple-600" /> Dashboard
                    </li>
                    <li className="flex items-center gap-1">
                      <User className="h-4 w-4 text-purple-600" /> Identity
                    </li>
                    <li className="flex items-center gap-1">
                      <FileCheck className="h-4 w-4 text-purple-600" /> Consents
                    </li>
                    <li className="flex items-center gap-1">
                      <Flag className="h-4 w-4 text-purple-600" /> Fraud Reports
                    </li>
                    <li className="flex items-center gap-1">
                      <Search className="h-4 w-4 text-purple-600" /> URL Checker
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Managing Your Digital Identity
              </CardTitle>
              <CardDescription>
                Learn how to manage and secure your decentralized digital identity (DID)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Accessing Your Digital Identity</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Step 1:</strong> Navigate to the "Identity" section from the sidebar
                  </p>
                  <p>
                    <strong>Step 2:</strong> The Overview tab shows your DID information including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>DID Identifier (your unique blockchain identity)</li>
                    <li>Creation Date</li>
                    <li>Status (Active or Inactive)</li>
                    <li>Transaction Hash (blockchain confirmation)</li>
                    <li>Personal Information (name, email, etc.)</li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Identity Security Features</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Blockchain Verification:</strong> Your identity is secured with immutable blockchain technology
                  </p>
                  <p>
                    <strong>Recovery Options:</strong> Multiple ways to recover your account:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>12-word recovery phrase</li>
                    <li>Facial recognition (if registered)</li>
                    <li>Email-based password reset</li>
                  </ul>
                  <p>
                    <strong>Access Control:</strong> Manage who can view your identity information
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium text-amber-800">Important Identity Security Tips</h4>
                </div>
                <ul className="list-disc pl-5 text-sm text-amber-700">
                  <li>Never share your 12-word recovery phrase with anyone</li>
                  <li>Keep a physical backup of your recovery phrase in a secure location</li>
                  <li>Register your face for an additional recovery option</li>
                  <li>Regularly check your identity status and access logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-purple-600" />
                Document Management & KYC
              </CardTitle>
              <CardDescription>
                Upload and manage your identity verification documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Uploading KYC Documents</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Step 1:</strong> Navigate to the "Identity" section and select the "KYC Documents" tab
                  </p>
                  <p>
                    <strong>Step 2:</strong> Upload your personal identification documents:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Personal ID:</strong> Aadhaar Card, PAN Card, or Voter ID</li>
                    <li><strong>Digital Signature:</strong> For document signing purposes</li>
                    <li><strong>Additional Documents:</strong> Any other required documents</li>
                  </ul>
                  <p>
                    <strong>Step 3:</strong> For additional documents, provide a name before uploading
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Document Security</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>End-to-End Encryption:</strong> Your documents are encrypted before storage
                  </p>
                  <p>
                    <strong>Blockchain Hashing:</strong> Document hashes are stored on the blockchain for verification
                  </p>
                  <p>
                    <strong>Consent-Based Access:</strong> Only authorized parties can access your documents
                  </p>
                  <p>
                    <strong>Audit Trail:</strong> All document access is logged for security purposes
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Document Formats & Size Limits</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Supported Formats:</strong> PDF, JPG, PNG, DOC, DOCX
                  </p>
                  <p>
                    <strong>Maximum File Size:</strong> 5MB per document
                  </p>
                  <p>
                    <strong>Image Resolution:</strong> Minimum 300 DPI recommended for clarity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                Security & Recovery Options
              </CardTitle>
              <CardDescription>
                Learn how to secure your account and recover access if needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Account Recovery Methods</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Primary Method - 12-Word Recovery Phrase:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Generated during account creation</li>
                    <li>Store securely offline in multiple locations</li>
                    <li>Enter in recovery form when needed</li>
                  </ul>
                  
                  <p className="mt-2">
                    <strong>Secondary Method - Facial Recognition:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Optional but recommended for enhanced security</li>
                    <li>Setup in the Identity → Security tab</li>
                    <li>Uses your device camera for verification</li>
                  </ul>
                  
                  <p className="mt-2">
                    <strong>Tertiary Method - Email Recovery:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Password reset link sent to registered email</li>
                    <li>Requires proving identity through other means</li>
                    <li>Contact support if this is your only option</li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Facial Recognition Setup</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Step 1:</strong> Navigate to the "Identity" section and select the "Security" tab
                  </p>
                  <p>
                    <strong>Step 2:</strong> Click on "Register Face for Recovery"
                  </p>
                  <p>
                    <strong>Step 3:</strong> Position your face in the frame and follow the instructions
                  </p>
                  <p>
                    <strong>Step 4:</strong> Confirm registration when completed
                  </p>
                  <p>
                    <strong>Note:</strong> Use good lighting and remove glasses for best results
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Recovering Your Account</h3>
                <div className="pl-5 space-y-2 text-sm">
                  <p>
                    <strong>Using Recovery Phrase:</strong>
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Click "Login" on the homepage</li>
                    <li>Select "Recovery Phrase" under the login form</li>
                    <li>Enter your 12-word phrase exactly as provided</li>
                    <li>Follow prompts to reset your password</li>
                  </ol>
                  
                  <p className="mt-2">
                    <strong>Using Facial Recognition:</strong>
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Click "Login" on the homepage</li>
                    <li>Select "Facial Recognition" under the login form</li>
                    <li>Position your face in the frame</li>
                    <li>After verification, you'll receive access to your recovery phrase</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions and answers about BlockSecure ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">What is a decentralized identity (DID)?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  A decentralized identity is a digital identity that you own and control, stored on a blockchain
                  instead of a centralized database. It allows you to selectively share verified information
                  about yourself without revealing everything.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">Why do I need to connect a wallet?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your wallet serves as your authentication key to the blockchain. It's required to sign transactions,
                  verify your identity, and secure your data on the blockchain network.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">What happens if I forget my 12-word recovery phrase?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  If you've registered for facial recognition, you can use that to recover your phrase.
                  Otherwise, contact our support team who may be able to help through alternative verification methods,
                  though full recovery cannot be guaranteed without your phrase.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">Is my facial recognition data secure?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Yes, we use advanced encryption for your facial biometric data. The actual biometric template
                  is stored securely and is only used for verification. We never store actual images of your face.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">Can I use BlockSecure ID on mobile devices?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Yes, the platform is fully responsive and works on mobile browsers. For the best experience
                  with wallet integration, we recommend using a browser with MetaMask extension support.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">How do I update my KYC documents?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Navigate to the Identity → Documents section and upload new versions of your documents.
                  Previous versions will be archived for reference but the new versions will be used for verification.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">What should I do if I suspect my account has been compromised?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Immediately contact our support team and use your recovery phrase to reset your password.
                  We recommend also revoking all access permissions from the Identity → Security section.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">Where can I get more help?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Visit our Contact page to reach our support team directly. You can also access this User Manual
                  anytime by clicking the "User Manual" icon in the sidebar.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManual;
