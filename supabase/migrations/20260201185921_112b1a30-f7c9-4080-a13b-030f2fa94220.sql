-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage anomalies" ON public.metadata_anomalies;

-- Create more restrictive policies - only admins can manage via has_role function
CREATE POLICY "Admins can manage metadata anomalies"
ON public.metadata_anomalies
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));