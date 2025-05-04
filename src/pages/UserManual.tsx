
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Home as HomeIcon, User, Banknote, Shield, Key, FileText, Wallet, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const UserManual = () => {
  const [selectedTab, setSelectedTab] = useState("getting-started");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Manual</h1>
          <p className="text-muted-foreground">Learn how to use BlockSecure ID effectively</p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 mb-6">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="identity">Identity Management</TabsTrigger>
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to BlockSecure ID</CardTitle>
              <CardDescription>
                Your guide to getting started with blockchain-based identity management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: Create Your Account</h3>
                <div className="pl-4 border-l-2 border-muted space-y-2">
                  <p>Sign up as either an Individual or a Bank institution:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Navigate to the homepage and click on "Sign Up"</li>
                    <li>Choose your account type (Individual or Bank)</li>
                    <li>Fill in the required information</li>
                    <li>Create a secure password</li>
                    <li>Store your 12-word recovery phrase securely</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 2: Connect Your Wallet</h3>
                <div className="pl-4 border-l-2 border-muted space-y-2">
                  <p>Connect your MetaMask wallet to enable blockchain features:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Install MetaMask browser extension if you haven't already</li>
                    <li>Click "Connect Wallet" on the homepage or dashboard</li>
                    <li>Approve the connection request in your MetaMask popup</li>
                    <li>Your wallet address will now be associated with your account</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 3: Set Up Your Digital Identity</h3>
                <div className="pl-4 border-l-2 border-muted space-y-2">
                  <p>Complete your digital identity creation process:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Navigate to the Identity tab in the dashboard</li>
                    <li>Upload required KYC documents (ID proof, signature)</li>
                    <li>Optional: Set up facial recognition for account recovery</li>
                    <li>Your identity will be secured on the blockchain</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The dashboard provides a complete overview of your digital identity:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Identity</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">View and manage your blockchain-secured digital identity</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Consents</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Control how your data is shared and with whom</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <h3 className="font-medium">Fraud Reports</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Report fraudulent activities and check website safety</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium">Security</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Manage account security settings and recovery options</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity Management Tab */}
        <TabsContent value="identity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Managing Your Digital Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Understanding Your DID (Decentralized Identifier)</h3>
                <p>Your DID is a unique identifier stored on the blockchain that:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provides cryptographic proof of your identity</li>
                  <li>Allows secure verification without revealing personal information</li>
                  <li>Cannot be tampered with or deleted</li>
                  <li>Gives you full control over your identity</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Document Management</h3>
                <p>Upload and manage your identity documents securely:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Personal ID (Aadhaar, PAN, Voter ID)</li>
                  <li>Digital Signature</li>
                  <li>Additional documents as needed</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Note:</strong> Only document hashes are stored on the blockchain. 
                  The actual documents are encrypted and stored securely in the database.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consent Management Tab */}
        <TabsContent value="consent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Managing Consents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">How Consent Works</h3>
                <p>You control who can access your data and for what purpose:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Grant specific permissions to individual banks or institutions</li>
                  <li>Set validity periods for each consent</li>
                  <li>Revoke consent at any time</li>
                  <li>View a complete audit trail of all consent activities</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Managing Your Consents</h3>
                <p>To manage your data sharing consents:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Navigate to the Consents tab in the dashboard</li>
                  <li>View all active consents</li>
                  <li>Click on any consent to view details</li>
                  <li>Use the "Revoke" button to cancel data sharing permission</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recovery Options</h3>
                <p>BlockSecure ID provides multiple account recovery methods:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>12-Word Recovery Phrase:</strong> Your primary backup method</li>
                  <li><strong>Facial Recognition:</strong> Secondary verification when available</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-medium text-amber-800">Important Recovery Information</h4>
                  </div>
                  <p className="text-sm text-amber-700">
                    Store your 12-word recovery phrase in a secure location. Anyone with access to this 
                    phrase can recover your account. Do not share it with anyone.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Blockchain Security</h3>
                <p>Your identity is secured by blockchain technology which provides:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Immutable record of identity creation and changes</li>
                  <li>Cryptographic proof of ownership</li>
                  <li>Decentralized verification</li>
                  <li>Protection against unauthorized alterations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a blockchain-based digital identity?</AccordionTrigger>
                  <AccordionContent>
                    A blockchain-based digital identity uses distributed ledger technology to create a secure, 
                    tamper-proof record of your identity. Unlike traditional identity systems, it gives you 
                    full control over your data and how it's shared. Your personal information is encrypted 
                    and only the verification proof is stored on the blockchain.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How secure is my data on BlockSecure ID?</AccordionTrigger>
                  <AccordionContent>
                    Your data is secured using multiple layers of protection. Personal documents are encrypted 
                    and stored in a secure database. Only document hashes (unique digital fingerprints) are stored 
                    on the blockchain, not the actual documents. Access is controlled through cryptographic keys 
                    and you explicitly grant permission for any data sharing.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>What happens if I lose my recovery phrase?</AccordionTrigger>
                  <AccordionContent>
                    If you've set up facial recognition, you can use it as a secondary recovery method. 
                    Otherwise, without your recovery phrase, regaining access to your account may be extremely 
                    difficult. This is why it's crucial to store your recovery phrase securely and consider 
                    enabling facial recognition as a backup.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Do I need a crypto wallet to use BlockSecure ID?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you need a MetaMask wallet to fully utilize the blockchain features of BlockSecure ID. 
                    The wallet provides the cryptographic keys needed to secure your identity on the blockchain 
                    and to sign consent transactions. You don't need to purchase any cryptocurrency to use the basic features.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I report suspicious or fraudulent activity?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Fraud Reports section in your dashboard. There you can report suspicious websites, 
                    phishing attempts, or any fraudulent activity related to digital identity. These reports are 
                    verified and added to a shared database to protect other users from similar threats.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>Can banks or institutions access my documents without permission?</AccordionTrigger>
                  <AccordionContent>
                    No, banks and institutions can only access your documents or personal information after you 
                    explicitly grant consent. Each consent is recorded on the blockchain and can be revoked at any 
                    time. You can also set time limits for how long the consent remains valid.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you couldn't find the answer to your question, please contact our support team. 
                We're here to help!
              </p>
              <Link to="/contact">
                <Button className="w-full">Contact Support</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManual;
