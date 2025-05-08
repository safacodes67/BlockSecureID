
export interface Loan {
  id: string;
  created_at: string;
  borrower_id: string;
  bank_id: string;
  loan_amount: number;
  loan_purpose: string;
  status: "pending" | "approved" | "rejected";
  documents: {
    income_proof?: string;
    collateral_proof?: string;
  };
  borrower_name?: string;
  bank_name?: string;
  face_verified?: boolean;
  manager_verified?: boolean;
}
