
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

export const get_user_loans = `
CREATE OR REPLACE FUNCTION get_user_loans(user_id UUID)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  borrower_id UUID,
  bank_id UUID,
  loan_amount DECIMAL,
  loan_purpose TEXT,
  status TEXT,
  documents JSONB,
  face_verified BOOLEAN,
  manager_verified BOOLEAN,
  bank_name TEXT,
  borrower_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.created_at,
    l.borrower_id,
    l.bank_id,
    l.loan_amount,
    l.loan_purpose,
    l.status,
    l.documents,
    l.face_verified,
    l.manager_verified,
    be.bank_name,
    ui.name as borrower_name
  FROM 
    loans l
  LEFT JOIN
    bank_entities be ON l.bank_id = be.id
  LEFT JOIN
    user_identities ui ON l.borrower_id = ui.id
  WHERE
    l.borrower_id = user_id
  ORDER BY
    l.created_at DESC;
END;
$$;
`;

export const get_bank_loans = `
CREATE OR REPLACE FUNCTION get_bank_loans(bank_id UUID)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  borrower_id UUID,
  bank_id UUID,
  loan_amount DECIMAL,
  loan_purpose TEXT,
  status TEXT,
  documents JSONB,
  face_verified BOOLEAN,
  manager_verified BOOLEAN,
  bank_name TEXT,
  borrower_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.created_at,
    l.borrower_id,
    l.bank_id,
    l.loan_amount,
    l.loan_purpose,
    l.status,
    l.documents,
    l.face_verified,
    l.manager_verified,
    be.bank_name,
    ui.name as borrower_name
  FROM 
    loans l
  LEFT JOIN
    bank_entities be ON l.bank_id = be.id
  LEFT JOIN
    user_identities ui ON l.borrower_id = ui.id
  WHERE
    l.bank_id = bank_id
  ORDER BY
    l.created_at DESC;
END;
$$;
`;
