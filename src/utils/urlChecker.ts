
// Simple URL checking utility
// In a production environment, this would connect to a real phishing detection API

// Some common phishing patterns to check for demonstration purposes
const suspiciousPatterns = [
  /free.*gift/i,
  /claim.*prize/i,
  /verify.*account.*urgently/i,
  /bank.*verify/i,
  /password.*expired/i,
  /update.*payment.*information/i,
  /suspicious.*activity/i,
  /login.*verify/i,
  /authenticate.*device/i,
  /unusual.*activity/i,
  /.+\.tk\/.*/i, // .tk domains are often used in phishing
  /.+\.ga\/.*/i, // .ga domains are often used in phishing
  /.+\.cf\/.*/i, // .cf domains are often used in phishing
  /^(?!https:\/\/).*/i, // Non-HTTPS sites (simplified check, would need refinement)
  /paypal\.com\.[a-z]{2,}/i, // Suspicious PayPal domain
  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i, // IP address instead of domain name
];

// Trusted domains for demonstration
const trustedDomains = [
  "google.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "linkedin.com",
  "github.com",
  "stackoverflow.com",
  "medium.com",
  "wikipedia.org",
  "w3.org",
  "mozilla.org",
  "netflix.com",
  "spotify.com",
  "reddit.com",
  "nytimes.com",
];

export interface UrlCheckResult {
  url: string;
  isSafe: boolean;
  confidence: number; // 0-100
  threatType: string | null;
  message: string;
}

export const checkUrl = (url: string): UrlCheckResult => {
  // Basic URL validation
  let urlObj: URL;
  try {
    // If URL doesn't start with protocol, prepend https://
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = `https://${url}`;
    }
    urlObj = new URL(url);
  } catch (e) {
    return {
      url,
      isSafe: false,
      confidence: 90,
      threatType: "invalid",
      message: "Invalid URL format",
    };
  }
  
  // Extract hostname without www.
  const hostname = urlObj.hostname.replace(/^www\./, "");
  
  // Check for trusted domains
  for (const domain of trustedDomains) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return {
        url,
        isSafe: true,
        confidence: 95,
        threatType: null,
        message: "URL appears to be legitimate",
      };
    }
  }
  
  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return {
        url,
        isSafe: false,
        confidence: 80,
        threatType: "phishing",
        message: "This URL contains suspicious patterns often associated with phishing",
      };
    }
  }
  
  // Default response for unknown URLs
  return {
    url,
    isSafe: true,
    confidence: 60,
    threatType: null,
    message: "No obvious threats detected, but proceed with caution",
  };
};
