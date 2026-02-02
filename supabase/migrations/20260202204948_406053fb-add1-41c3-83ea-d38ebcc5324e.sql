-- Create error_reports table for tracking production crashes
CREATE TABLE public.error_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_type TEXT NOT NULL DEFAULT 'unknown',
  component_name TEXT,
  url TEXT,
  user_agent TEXT,
  user_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (errors can happen before auth)
CREATE POLICY "Anyone can report errors"
ON public.error_reports
FOR INSERT
WITH CHECK (true);

-- Only admins can view error reports
CREATE POLICY "Admins can view error reports"
ON public.error_reports
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create index for faster queries
CREATE INDEX idx_error_reports_created_at ON public.error_reports(created_at DESC);
CREATE INDEX idx_error_reports_error_type ON public.error_reports(error_type);