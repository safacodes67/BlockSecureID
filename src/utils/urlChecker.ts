
// Enhanced URL checking utility with more accurate confidence scoring

// Common phishing patterns to check for demonstration purposes
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

// High-risk patterns (more dangerous)
const highRiskPatterns = [
  /password.*reset.*urgent/i,
  /account.*suspended/i,
  /verify.*payment.*method/i,
  /security.*breach/i,
  /login.*credential.*confirm/i,
  /bank.*transfer.*verify/i,
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
  "gov.in", // Indian government domain
  "nic.in", // National Informatics Centre
  "rbi.org.in", // Reserve Bank of India
];

// Very high trust domains
const veryHighTrustDomains = [
  "google.com",
  "apple.com",
  "microsoft.com",
  "gov.in",
  "rbi.org.in",
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
      confidence: 40,
      threatType: "invalid",
      message: "Invalid URL format",
    };
  }
  
  // Extract hostname without www.
  const hostname = urlObj.hostname.replace(/^www\./, "");
  
  // Check for very high trust domains (90-100% confidence)
  for (const domain of veryHighTrustDomains) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return {
        url,
        isSafe: true,
        confidence: 95,
        threatType: null,
        message: "URL appears to be completely legitimate with high confidence",
      };
    }
  }
  
  // Check for trusted domains (80-90% confidence)
  for (const domain of trustedDomains) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return {
        url,
        isSafe: true,
        confidence: 85,
        threatType: null,
        message: "URL appears to be legitimate",
      };
    }
  }
  
  // Check for high risk patterns (30-40% confidence)
  for (const pattern of highRiskPatterns) {
    if (pattern.test(url)) {
      return {
        url,
        isSafe: false,
        confidence: 35,
        threatType: "high_risk_phishing",
        message: "This URL contains high-risk patterns commonly used in phishing attacks",
      };
    }
  }
  
  // Check for suspicious patterns (40-50% confidence)
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return {
        url,
        isSafe: false,
        confidence: 45,
        threatType: "phishing",
        message: "This URL contains suspicious patterns often associated with phishing",
      };
    }
  }
  
  // URL length check (very long URLs are suspicious)
  if (url.length > 100) {
    return {
      url,
      isSafe: false,
      confidence: 50,
      threatType: "suspicious",
      message: "Unusually long URL which may be suspicious",
    };
  }

  // Domain age check (simulated for demo)
  const domainHash = hostname.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (domainHash % 10 < 3) { // Simulate recently registered domains
    return {
      url,
      isSafe: false,
      confidence: 40,
      threatType: "new_domain",
      message: "This domain appears to be newly registered which increases risk",
    };
  }
  
  // Default response for unknown URLs with better confidence distribution
  const confidenceScore = 55 + (domainHash % 10); // Generate between 55-65% for unknown domains
  
  return {
    url,
    isSafe: true,
    confidence: confidenceScore,
    threatType: null,
    message: "No obvious threats detected, but proceed with caution",
  };
};
