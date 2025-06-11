
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MnemonicDisplayProps {
  mnemonic: string;
  onContinue: () => void;
}

const MnemonicDisplay: React.FC<MnemonicDisplayProps> = ({ mnemonic, onContinue }) => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const words = mnemonic.split(' ');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Recovery phrase copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the recovery phrase",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = () => {
    const element = document.createElement("a");
    const file = new Blob([`BlockSecure ID Recovery Phrase\n\n${mnemonic}\n\nKeep this phrase safe and secure. You will need it to recover your account.`], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = "blocksecure-recovery-phrase.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Recovery phrase saved to your downloads",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-800">
            🔐 Your Recovery Phrase
          </CardTitle>
          <CardDescription className="text-amber-700">
            This 12-word phrase is the ONLY way to recover your account. Store it safely!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white p-4 rounded-lg border-2 border-amber-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Recovery Phrase</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isVisible ? "Hide" : "Show"}
              </Button>
            </div>
            
            {isVisible ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {words.map((word, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-center">
                    <span className="text-xs text-gray-500">{index + 1}.</span>
                    <div className="font-mono font-semibold">{word}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 p-8 rounded text-center mb-4">
                <p className="text-gray-500">Click "Show" to reveal your recovery phrase</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex-1">
                {isCopied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
              <Button onClick={downloadAsFile} variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ Important Security Notice</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Never share this phrase with anyone</li>
              <li>• Store it in a safe, offline location</li>
              <li>• We cannot recover your account if you lose this phrase</li>
              <li>• Anyone with this phrase can access your account</li>
            </ul>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confirm"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              I have safely stored my recovery phrase and understand that losing it means losing access to my account
            </label>
          </div>
          
          <Button 
            onClick={onContinue} 
            disabled={!isConfirmed}
            className="w-full"
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MnemonicDisplay;
