
-- Create the user_documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'user_documents', 'User Documents', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'user_documents'
);
