-- Allow users to update their own analysis history (for share_token)
CREATE POLICY "Users can update their own analysis history" 
ON public.analysis_history 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);