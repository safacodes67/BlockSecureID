
import { useState } from "react";
import { FraudReport } from "@/types/fraudReport";

// This is a mock hook that would connect to blockchain in a real implementation
const useFraudReports = () => {
  const [fraudReports, setFraudReports] = useState<FraudReport[]>([
    {
      id: "fr-001",
      reporterAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      fraudType: "Unauthorized Loan",
      upiId: "fraudster@ybl",
      description: "Loan created without my consent. UPI ID used for receiving funds.",
      evidenceHash: "Qmf9T7kSdFgLnRg5K3F7LASSPf4JYLZnYZ8NJ8bKSAhzP9",
      reportDate: "May 3, 2025",
      status: "verified"
    },
    {
      id: "fr-002",
      reporterAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      fraudType: "Fake KYC",
      upiId: "scammer@okaxis",
      description: "Someone used my identity documents for KYC and created multiple accounts.",
      evidenceHash: "QmT8KLhWdVwWYG2zpXSZCvNHEj6MmyM6RJs7Bnxrd9jmQx",
      reportDate: "May 2, 2025",
      status: "verified"
    },
    {
      id: "fr-003",
      reporterAddress: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
      fraudType: "Phishing Attempt",
      upiId: "phisher@paytm",
      description: "Received a phishing SMS claiming to be from a bank, asking for OTP.",
      evidenceHash: "QmNZLGFnrzRjxjdQzxFrKQMvJJPaQ8YMSTfb9YZQMYnLTL",
      reportDate: "April 29, 2025",
      status: "pending"
    },
    {
      id: "fr-004",
      reporterAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      fraudType: "Phishing URL",
      url: "http://banklogin-secure-verify.tk/login",
      description: "Received this fake banking URL via email claiming my account needs verification.",
      evidenceHash: "QmT8KLhWdVwWYG2zpXSZCvNHEj6MmyM6RJs7Bnxrd9jmQx",
      reportDate: "May 1, 2025",
      status: "verified"
    },
  ]);

  const addFraudReport = (report: FraudReport) => {
    setFraudReports(prev => [report, ...prev]);
  };

  return {
    fraudReports,
    addFraudReport
  };
};

export default useFraudReports;
