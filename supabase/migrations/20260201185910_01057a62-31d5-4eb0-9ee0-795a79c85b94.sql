-- Create table to track unusual metadata patterns for ML improvement
CREATE TABLE public.metadata_anomalies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anomaly_type TEXT NOT NULL, -- 'exif', 'filename', 'compression', 'timestamp', 'software', 'gps', 'camera'
  pattern_signature TEXT NOT NULL, -- Unique hash/signature of the pattern
  pattern_data JSONB NOT NULL DEFAULT '{}', -- Full pattern details
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rarity_score NUMERIC(5,2) DEFAULT 0, -- 0-100, higher = more rare
  is_suspicious BOOLEAN DEFAULT false,
  detection_context TEXT, -- 'deepfake', 'authentic', 'unknown'
  example_file_names TEXT[] DEFAULT '{}',
  notes TEXT
);

-- Create index for fast lookup by pattern signature
CREATE INDEX idx_metadata_anomalies_signature ON public.metadata_anomalies(pattern_signature);
CREATE INDEX idx_metadata_anomalies_type ON public.metadata_anomalies(anomaly_type);
CREATE INDEX idx_metadata_anomalies_rarity ON public.metadata_anomalies(rarity_score DESC);

-- Enable RLS
ALTER TABLE public.metadata_anomalies ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users (for research/learning)
CREATE POLICY "Authenticated users can view metadata anomalies"
ON public.metadata_anomalies
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only admins can insert/update anomalies (via edge function with service role)
CREATE POLICY "Service role can manage anomalies"
ON public.metadata_anomalies
FOR ALL
USING (true)
WITH CHECK (true);

-- Create table for known software signatures (AI tools, editors, cameras)
CREATE TABLE public.known_software_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  software_name TEXT NOT NULL,
  signature_pattern TEXT NOT NULL, -- Regex or exact match pattern
  category TEXT NOT NULL, -- 'ai_generator', 'photo_editor', 'camera', 'screen_capture', 'unknown'
  risk_level TEXT DEFAULT 'low', -- 'low', 'medium', 'high'
  description TEXT,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  occurrence_count INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX idx_known_software_name ON public.known_software_signatures(software_name);

-- Enable RLS
ALTER TABLE public.known_software_signatures ENABLE ROW LEVEL SECURITY;

-- Public read access for software signatures
CREATE POLICY "Anyone can view software signatures"
ON public.known_software_signatures
FOR SELECT
USING (true);

-- Seed with known AI generators and editing software
INSERT INTO public.known_software_signatures (software_name, signature_pattern, category, risk_level, description, is_verified) VALUES
('Adobe Photoshop', 'Adobe Photoshop|Photoshop', 'photo_editor', 'medium', 'Professional photo editing software', true),
('GIMP', 'GIMP|GNU Image', 'photo_editor', 'medium', 'Open source image editor', true),
('DALL-E', 'DALL-E|dalle|openai', 'ai_generator', 'high', 'OpenAI image generation', true),
('Midjourney', 'Midjourney|MJ_', 'ai_generator', 'high', 'Midjourney AI art generator', true),
('Stable Diffusion', 'Stable Diffusion|StableDiffusion|sd_|AUTOMATIC1111|ComfyUI', 'ai_generator', 'high', 'Open source AI image generation', true),
('Runway', 'Runway|runway', 'ai_generator', 'high', 'AI video and image generation', true),
('iPhone Camera', 'iPhone|iOS', 'camera', 'low', 'Apple iPhone camera', true),
('Samsung Camera', 'Samsung|Galaxy', 'camera', 'low', 'Samsung device camera', true),
('Google Pixel', 'Pixel|Google', 'camera', 'low', 'Google Pixel camera', true),
('Windows Snipping', 'Snipping Tool|Windows Screen', 'screen_capture', 'medium', 'Windows screenshot tool', true),
('macOS Screenshot', 'Preview|Screenshot|macOS', 'screen_capture', 'medium', 'macOS screenshot', true),
('FFmpeg', 'FFmpeg|libav', 'video_tool', 'medium', 'Video processing library', true),
('Canva', 'Canva', 'design_tool', 'medium', 'Online design platform', true),
('Figma', 'Figma', 'design_tool', 'low', 'Design collaboration tool', true),
('Faceswap', 'Faceswap|DeepFaceLab|FaceSwap', 'deepfake_tool', 'high', 'Face swapping deepfake tool', true),
('DeepFaceLab', 'DeepFaceLab|DFL', 'deepfake_tool', 'high', 'Deepfake creation software', true),
('Reface', 'Reface|reface', 'deepfake_tool', 'high', 'Face swap mobile app', true);

-- Create function to calculate rarity score
CREATE OR REPLACE FUNCTION public.calculate_rarity_score(occurrence INTEGER, total_count INTEGER)
RETURNS NUMERIC
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF total_count = 0 OR occurrence = 0 THEN
    RETURN 100;
  END IF;
  -- Logarithmic scale: lower occurrence = higher rarity
  RETURN GREATEST(0, LEAST(100, 100 - (LOG(occurrence::NUMERIC) / LOG(total_count::NUMERIC + 1)) * 100));
END;
$$;