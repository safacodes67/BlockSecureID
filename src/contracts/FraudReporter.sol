
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FraudReporter {
    struct FraudReport {
        string reportId;
        address reporterAddress;
        string upiId;
        string fraudType;
        string description;
        string evidenceHash; // IPFS hash
        string status; // "pending", "verified", "disputed"
        uint256 timestamp;
    }
    
    mapping(string => FraudReport) public fraudReports;
    mapping(string => string[]) public upiIdReports; // UPI ID -> Report IDs
    string[] public allReportIds;
    
    event FraudReported(string reportId, address reporter, string upiId);
    event ReportStatusChanged(string reportId, string status);
    
    function generateReportId() internal view returns (string memory) {
        // This is a simplified implementation
        // In production, use a more secure method
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return string(abi.encodePacked("fr-", randomNumber));
    }
    
    function reportFraud(
        string memory upiId,
        string memory fraudType,
        string memory description,
        string memory evidenceHash
    ) public returns (string memory) {
        string memory reportId = generateReportId();
        
        FraudReport memory newReport = FraudReport({
            reportId: reportId,
            reporterAddress: msg.sender,
            upiId: upiId,
            fraudType: fraudType,
            description: description,
            evidenceHash: evidenceHash,
            status: "pending",
            timestamp: block.timestamp
        });
        
        fraudReports[reportId] = newReport;
        upiIdReports[upiId].push(reportId);
        allReportIds.push(reportId);
        
        emit FraudReported(reportId, msg.sender, upiId);
        return reportId;
    }
    
    function verifyReport(string memory reportId) public {
        // In a real implementation, this would be restricted to verified entities
        FraudReport storage report = fraudReports[reportId];
        report.status = "verified";
        
        emit ReportStatusChanged(reportId, "verified");
    }
    
    function disputeReport(string memory reportId) public {
        // In a real implementation, this would have more checks
        FraudReport storage report = fraudReports[reportId];
        report.status = "disputed";
        
        emit ReportStatusChanged(reportId, "disputed");
    }
    
    function getFraudReportsByUpiId(string memory upiId) public view returns (string[] memory) {
        return upiIdReports[upiId];
    }
    
    function getAllReports() public view returns (string[] memory) {
        return allReportIds;
    }
}
