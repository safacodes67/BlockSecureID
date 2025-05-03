
export interface FraudReport {
  id: string;
  reporterAddress: string;
  fraudType: string;
  upiId?: string;
  url?: string;
  description: string;
  evidenceHash: string;
  reportDate: string;
  status: "pending" | "verified" | "disputed";
}
