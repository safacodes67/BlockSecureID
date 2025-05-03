
// Smart contract interfaces

// ConsentManager.sol interface
export interface ConsentRequest {
  requestId: string;
  lenderId: string;
  userId: string;
  purpose: string;
  dataRequested: string[];
  status: "pending" | "approved" | "rejected" | "revoked";
  timestamp: number;
}

export interface ConsentManagerContract {
  requestConsent: (userId: string, purpose: string, dataRequested: string[]) => Promise<string>;
  approveConsent: (requestId: string) => Promise<void>;
  rejectConsent: (requestId: string) => Promise<void>;
  revokeConsent: (requestId: string) => Promise<void>;
  getConsentRequests: (userId: string) => Promise<ConsentRequest[]>;
  getConsentStatus: (requestId: string) => Promise<string>;
}

// FraudReporter.sol interface
export interface FraudReport {
  reportId: string;
  reporterAddress: string;
  upiId: string;
  fraudType: string;
  description: string;
  evidenceHash: string; // IPFS hash of evidence
  timestamp: number;
  status: "pending" | "verified" | "disputed";
}

export interface FraudReporterContract {
  reportFraud: (upiId: string, fraudType: string, description: string, evidenceHash: string) => Promise<string>;
  getFraudReports: () => Promise<FraudReport[]>;
  getFraudReportsByUpiId: (upiId: string) => Promise<FraudReport[]>;
  verifyFraudReport: (reportId: string) => Promise<void>;
  disputeFraudReport: (reportId: string) => Promise<void>;
}

// IdentityManager.sol interface
export interface UserIdentity {
  userId: string;
  didDocument: string; // DID document URI or hash
  kycHash: string; // Hash of KYC documents
  created: number;
  status: "active" | "revoked";
}

export interface IdentityManagerContract {
  createIdentity: (didDocument: string, kycHash: string) => Promise<string>;
  getIdentity: (userId: string) => Promise<UserIdentity>;
  revokeIdentity: (userId: string) => Promise<void>;
  updateIdentity: (userId: string, didDocument: string, kycHash: string) => Promise<void>;
}
