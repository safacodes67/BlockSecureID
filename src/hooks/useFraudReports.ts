
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
    // New verified fraud reports
    {
      id: "fr-005",
      reporterAddress: "0x3A21D6C7bE4D37C2f29C49A74D64352B63FAe342",
      fraudType: "Phishing URL",
      url: "https://login-account-verification-secure.cf/auth",
      description: "High risk phishing URL sent via SMS pretending to be my bank. Claims account is locked.",
      evidenceHash: "QmX9F56gHjKs8TyY6M3e7cVZLQf2RGLjJnHM42JF8sT47V",
      reportDate: "May 2, 2025",
      status: "verified"
    },
    {
      id: "fr-006",
      reporterAddress: "0x91A7F9B7B836D408B7BcBe36FD754272c95C8F13",
      fraudType: "Phishing URL",
      url: "http://password-reset-urgent-action.ga/secure",
      description: "Email claiming my account was compromised and needs password reset. Has suspicious attachment.",
      evidenceHash: "QmZYnK94NjbS6H3FRgQpYeJ7G8xZ9LQf2V5Q6RLGJnVrXs",
      reportDate: "May 1, 2025",
      status: "verified"
    },
    {
      id: "fr-007",
      reporterAddress: "0x7e23F9e7C4B2fEA54b5f77C9381dbA5F89E5cB34",
      fraudType: "Phishing URL",
      url: "https://verify-account-suspicious-activity.tk/verify",
      description: "URL sent via WhatsApp claiming suspicious activity on my account. Asks for full card details.",
      evidenceHash: "QmP8J4TnF56gGwD9V7yRs8JF2MqSL7G3H5Yj8TrKF5sZ9Q",
      reportDate: "April 30, 2025",
      status: "verified"
    },
    {
      id: "fr-008",
      reporterAddress: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t",
      fraudType: "Identity Theft",
      upiId: "identity.thief@ybl",
      description: "Someone created multiple loan accounts using my Aadhaar details. Received debt collection calls.",
      evidenceHash: "QmR7T8K9L5S3W2F1G4H6J0D9C8B7A6S5D4F3G2H1J0K9L",
      reportDate: "May 3, 2025",
      status: "verified"
    },
    {
      id: "fr-009",
      reporterAddress: "0x2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T1u",
      fraudType: "UPI Fraud",
      upiId: "quickmoney@paytm",
      description: "Received a fake payment request claiming to be from electricity board. Lost ₹15,000.",
      evidenceHash: "QmT9S8R7Q6P5N4M3L2K1J0H9G8F7D6S5A4F3G2H1J0K9L",
      reportDate: "April 29, 2025",
      status: "verified"
    }
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
