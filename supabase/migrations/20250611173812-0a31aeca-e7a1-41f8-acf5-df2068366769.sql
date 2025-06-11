
-- Add kyc_documents column to user_identities table to store KYC information
ALTER TABLE user_identities 
ADD COLUMN kyc_documents JSONB;

-- Add kyc_documents column to bank_entities table as well for consistency
ALTER TABLE bank_entities 
ADD COLUMN kyc_documents JSONB;
