-- Add share_token column to analysis_history for public sharing
ALTER TABLE public.analysis_history 
ADD COLUMN share_token TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_analysis_history_share_token ON public.analysis_history(share_token);

-- Allow public access to shared analysis records (when share_token is provided)
CREATE POLICY "Anyone can view shared analysis" 
ON public.analysis_history 
FOR SELECT 
USING (share_token IS NOT NULL);