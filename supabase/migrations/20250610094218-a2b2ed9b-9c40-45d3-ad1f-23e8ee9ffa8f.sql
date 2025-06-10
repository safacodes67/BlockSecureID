
-- First, ensure user_identities has a unique constraint on id (it should already be primary key, but let's be explicit)
-- If the primary key already exists, this will be ignored
ALTER TABLE public.user_identities ADD CONSTRAINT user_identities_pkey PRIMARY KEY (id);

-- Create the loan_applications table
CREATE TABLE public.loan_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL NOT NULL CHECK (amount > 0),
  purpose TEXT NOT NULL,
  tenure_months INTEGER NOT NULL CHECK (tenure_months > 0),
  monthly_income DECIMAL NOT NULL CHECK (monthly_income > 0),
  employment_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint separately
ALTER TABLE public.loan_applications 
ADD CONSTRAINT fk_loan_applications_user_id 
FOREIGN KEY (user_id) REFERENCES public.user_identities(id) ON DELETE CASCADE;

-- Add Row Level Security (RLS)
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for loan applications
CREATE POLICY "Users can view their own loan applications" 
  ON public.loan_applications 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM public.user_identities WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Users can create their own loan applications" 
  ON public.loan_applications 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.user_identities WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Users can update their own loan applications" 
  ON public.loan_applications 
  FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.user_identities WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- Create indexes for better performance
CREATE INDEX idx_loan_applications_user_id ON public.loan_applications(user_id);
CREATE INDEX idx_loan_applications_status ON public.loan_applications(status);
