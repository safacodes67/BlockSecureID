
// Create functions to use with RPC for loan operations
export const insert_loan = `
CREATE OR REPLACE FUNCTION insert_loan(
  p_borrower_id UUID,
  p_bank_id UUID,
  p_loan_amount NUMERIC,
  p_loan_purpose TEXT,
  p_status TEXT DEFAULT 'pending',
  p_income_proof TEXT,
  p_collateral_proof TEXT
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_loan_id UUID;
BEGIN
  INSERT INTO loans(
    borrower_id,
    bank_id,
    loan_amount,
    loan_purpose,
    status,
    documents
  ) VALUES (
    p_borrower_id,
    p_bank_id,
    p_loan_amount,
    p_loan_purpose,
    p_status,
    jsonb_build_object(
      'income_proof', p_income_proof,
      'collateral_proof', p_collateral_proof
    )
  )
  RETURNING id INTO new_loan_id;
  
  RETURN new_loan_id;
END;
$$;
`;

export const update_loan_status = `
CREATE OR REPLACE FUNCTION update_loan_status(
  p_loan_id UUID,
  p_status TEXT
) 
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE loans
  SET status = p_status
  WHERE id = p_loan_id;
END;
$$;
`;
