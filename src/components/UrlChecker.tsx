
import React, { useState } from "react";
import { checkUrl, UrlCheckResult } from "@/utils/urlChecker";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ShieldCheck, ShieldX, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FraudReport } from "@/types/fraudReport";

interface UrlCheckerProps {
  onReportUrl?: (url: string) => void;
}

const UrlChecker: React.FC<UrlCheckerProps> = ({ onReportUrl }) => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<UrlCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to check",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    // Simulate API call delay
    setTimeout(() => {
      const result = checkUrl(url.trim());
      setResult(result);
      setIsChecking(false);
    }, 1000);
  };

  const handleReport = () => {
    if (!result) return;
    
    if (onReportUrl) {
      onReportUrl(result.url);
    } else {
      toast({
        title: "URL Reported",
        description: "This URL has been recorded as suspicious",
      });
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          URL Security Checker
        </CardTitle>
        <CardDescription>
          Check if a URL is safe or potentially malicious
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter URL to check (e.g. example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleCheck()}
          />
          <Button onClick={handleCheck} disabled={isChecking}>
            {isChecking ? "Checking..." : "Check URL"}
          </Button>
        </div>

        {result && (
          <Alert variant={result.isSafe ? "default" : "destructive"} className="mt-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {result.isSafe ? (
                  result.confidence > 90 ? (
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <Shield className="h-5 w-5 text-yellow-500" />
                  )
                ) : (
                  <ShieldX className="h-5 w-5" />
                )}
              </div>
              <div>
                <AlertTitle className="flex items-center gap-2">
                  {result.isSafe
                    ? result.confidence > 90
                      ? "Safe URL"
                      : "Possibly Safe URL"
                    : "Potentially Malicious URL"}
                  <Badge 
                    variant={result.isSafe ? "outline" : "destructive"} 
                    className={
                      result.isSafe 
                        ? result.confidence > 90 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" 
                        : ""
                    }
                  >
                    {result.isSafe 
                      ? `${result.confidence}% confidence`
                      : result.threatType || "Suspicious"}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-1">{result.message}</p>
                  <p className="text-sm font-mono break-all">{result.url}</p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
      {result && !result.isSafe && (
        <CardFooter>
          <Button 
            variant="destructive" 
            className="ml-auto" 
            onClick={handleReport}
          >
            <ShieldX className="mr-2 h-4 w-4" />
            Report as Phishing
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UrlChecker;
