
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityManager {
    struct Identity {
        address userId;
        string didDocument; // DID document URI or hash
        string kycHash; // Hash of KYC documents
        uint256 created;
        string status; // "active", "revoked"
    }
    
    mapping(address => Identity) public identities;
    
    event IdentityCreated(address indexed userId, uint256 timestamp);
    event IdentityUpdated(address indexed userId, uint256 timestamp);
    event IdentityRevoked(address indexed userId, uint256 timestamp);
    
    function createIdentity(string memory didDocument, string memory kycHash) public {
        require(identities[msg.sender].userId == address(0), "Identity already exists");
        
        Identity memory newIdentity = Identity({
            userId: msg.sender,
            didDocument: didDocument,
            kycHash: kycHash,
            created: block.timestamp,
            status: "active"
        });
        
        identities[msg.sender] = newIdentity;
        
        emit IdentityCreated(msg.sender, block.timestamp);
    }
    
    function updateIdentity(string memory didDocument, string memory kycHash) public {
        require(identities[msg.sender].userId != address(0), "Identity does not exist");
        require(keccak256(abi.encodePacked(identities[msg.sender].status)) == keccak256(abi.encodePacked("active")), "Identity is not active");
        
        Identity storage identity = identities[msg.sender];
        identity.didDocument = didDocument;
        identity.kycHash = kycHash;
        
        emit IdentityUpdated(msg.sender, block.timestamp);
    }
    
    function revokeIdentity() public {
        require(identities[msg.sender].userId != address(0), "Identity does not exist");
        require(keccak256(abi.encodePacked(identities[msg.sender].status)) == keccak256(abi.encodePacked("active")), "Identity is already revoked");
        
        identities[msg.sender].status = "revoked";
        
        emit IdentityRevoked(msg.sender, block.timestamp);
    }
    
    function getIdentity(address userId) public view returns (
        string memory didDocument,
        string memory kycHash,
        uint256 created,
        string memory status
    ) {
        Identity memory identity = identities[userId];
        return (
            identity.didDocument,
            identity.kycHash,
            identity.created,
            identity.status
        );
    }
    
    function hasActiveIdentity(address userId) public view returns (bool) {
        return (
            identities[userId].userId != address(0) &&
            keccak256(abi.encodePacked(identities[userId].status)) == keccak256(abi.encodePacked("active"))
        );
    }
}
