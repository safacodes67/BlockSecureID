
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConsentManager {
    struct Consent {
        string requestId;
        address lenderId;
        address userId;
        string purpose;
        string[] dataRequested;
        string status; // "pending", "approved", "rejected", "revoked"
        uint256 timestamp;
    }
    
    mapping(string => Consent) public consents;
    mapping(address => string[]) public userConsents;
    
    event ConsentRequested(string requestId, address lenderId, address userId, string purpose);
    event ConsentStatusChanged(string requestId, string status);
    
    function generateRequestId() internal view returns (string memory) {
        // This is a simplified implementation
        // In production, use a more secure method
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return string(abi.encodePacked("req-", randomNumber));
    }
    
    function requestConsent(
        address userId, 
        string memory purpose, 
        string[] memory dataRequested
    ) public returns (string memory) {
        string memory requestId = generateRequestId();
        
        Consent memory newConsent = Consent({
            requestId: requestId,
            lenderId: msg.sender,
            userId: userId,
            purpose: purpose,
            dataRequested: dataRequested,
            status: "pending",
            timestamp: block.timestamp
        });
        
        consents[requestId] = newConsent;
        userConsents[userId].push(requestId);
        
        emit ConsentRequested(requestId, msg.sender, userId, purpose);
        return requestId;
    }
    
    function approveConsent(string memory requestId) public {
        Consent storage consent = consents[requestId];
        require(consent.userId == msg.sender, "Only the user can approve consent");
        require(keccak256(abi.encodePacked(consent.status)) == keccak256(abi.encodePacked("pending")), "Consent must be pending");
        
        consent.status = "approved";
        consent.timestamp = block.timestamp;
        
        emit ConsentStatusChanged(requestId, "approved");
    }
    
    function rejectConsent(string memory requestId) public {
        Consent storage consent = consents[requestId];
        require(consent.userId == msg.sender, "Only the user can reject consent");
        require(keccak256(abi.encodePacked(consent.status)) == keccak256(abi.encodePacked("pending")), "Consent must be pending");
        
        consent.status = "rejected";
        consent.timestamp = block.timestamp;
        
        emit ConsentStatusChanged(requestId, "rejected");
    }
    
    function revokeConsent(string memory requestId) public {
        Consent storage consent = consents[requestId];
        require(consent.userId == msg.sender, "Only the user can revoke consent");
        require(keccak256(abi.encodePacked(consent.status)) == keccak256(abi.encodePacked("approved")), "Consent must be approved");
        
        consent.status = "revoked";
        consent.timestamp = block.timestamp;
        
        emit ConsentStatusChanged(requestId, "revoked");
    }
    
    function getConsentStatus(string memory requestId) public view returns (string memory) {
        return consents[requestId].status;
    }
    
    function getUserConsents(address userId) public view returns (string[] memory) {
        return userConsents[userId];
    }
}
