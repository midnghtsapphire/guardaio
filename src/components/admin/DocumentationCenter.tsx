import { useState } from "react";
import { motion } from "framer-motion";
import { Book, Code, Users, Wrench, ChevronRight, ExternalLink, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const DocumentationCenter = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const techDocs = [
    {
      title: "Architecture Overview",
      content: `DeepGuard is built on a modern JAMstack architecture:

**Frontend Stack:**
- React 18 with TypeScript for type-safe UI development
- Vite for fast development and optimized builds
- Tailwind CSS with custom design tokens for styling
- Framer Motion for smooth animations
- shadcn/ui for accessible component primitives

**Backend Stack:**
- Supabase (PostgreSQL) for database and auth
- Edge Functions (Deno) for serverless API endpoints
- Row Level Security (RLS) for data protection

**AI/ML Pipeline:**
- Lovable AI (Gemini 2.5 Flash) for media analysis
- Web Audio API for spectral analysis
- Canvas API for heatmap overlays

**Integrations:**
- Stripe for payment processing
- Resend for transactional emails
- Firecrawl for URL metadata extraction`
    },
    {
      title: "Database Schema",
      content: `**Core Tables:**

\`profiles\` - User profile data
- id, user_id, display_name, email, created_at, updated_at

\`analysis_history\` - Analysis records
- id, user_id, file_name, file_type, file_size, status, confidence, findings[], share_token

\`user_roles\` - Role-based access control
- id, user_id, role (admin | moderator | user)

\`affiliates\` - Affiliate program
- id, user_id, affiliate_code, commission_rate, total_earnings, pending_payout, status

\`affiliate_referrals\` - Referral tracking
- id, affiliate_id, referred_user_id, payment_id, commission_amount, status

\`payments\` - Payment records
- id, user_id, stripe_payment_id, stripe_customer_id, amount, currency, tier, affiliate_code, status

\`batch_analyses\` - Batch processing jobs
- id, user_id, name, total_files, completed_files, status, results, completed_at

\`compliance_tests\` - Security test results
- id, test_name, category, status, passed, details, run_by, run_at`
    },
    {
      title: "Security Architecture",
      content: `**Authentication:**
- Supabase Auth with email/password
- JWT tokens with refresh rotation
- Session management with secure cookies

**Authorization:**
- Row Level Security (RLS) on all tables
- Role-based access control (RBAC)
- has_role() function for permission checks

**Data Protection:**
- AES-256 encryption at rest
- TLS 1.3 encryption in transit
- Automatic file deletion within 24 hours

**API Security:**
- CORS headers on all endpoints
- Rate limiting on edge functions
- Input validation and sanitization

**Compliance:**
- GDPR data subject rights
- SOC 2 Type II controls
- ISO 27001 framework alignment`
    },
  ];

  const devDocs = [
    {
      title: "Getting Started",
      code: `# Clone and install
git clone https://github.com/your-repo/deepguard.git
cd deepguard
npm install

# Environment setup
cp .env.example .env
# Add your Supabase and API keys

# Development
npm run dev

# Build for production
npm run build`,
    },
    {
      title: "Adding a New Component",
      code: `// 1. Create component file
// src/components/MyComponent.tsx

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent = ({ title, onAction }: MyComponentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <h3 className="font-display font-semibold">{title}</h3>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyComponent;`,
    },
    {
      title: "Creating an Edge Function",
      code: `// supabase/functions/my-function/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();
    
    // Your logic here
    const result = { success: true, data };
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});`,
    },
    {
      title: "Using the Analysis API",
      code: `import { supabase } from "@/integrations/supabase/client";

// Analyze an image
const analyzeImage = async (file: File) => {
  const base64 = await fileToBase64(file);
  
  const { data, error } = await supabase.functions.invoke("analyze-media", {
    body: {
      media: base64,
      mediaType: file.type,
      fileName: file.name,
    },
  });

  if (error) throw error;
  return data;
};

// Save to history
const saveAnalysis = async (result: AnalysisResult) => {
  const { error } = await supabase.from("analysis_history").insert({
    file_name: result.fileName,
    file_type: result.fileType,
    file_size: result.fileSize,
    status: result.status,
    confidence: result.confidence,
    findings: result.findings,
    user_id: user.id,
  });
};`,
    },
  ];

  const userDocs = [
    {
      title: "Quick Start Guide",
      content: `**1. Create Account**
Sign up with your email or use Google/GitHub OAuth. Verify your email to activate.

**2. Upload Media**
Drag and drop images, videos, or audio files into the analyzer. Supported formats: JPG, PNG, WebP, MP4, MP3, WAV.

**3. Review Results**
View the confidence score (0-100%), detection findings, and heatmap overlay showing manipulation areas.

**4. Share & Export**
Generate a shareable link or export results as a PDF report.

**5. Keyboard Shortcuts**
- \`1-6\` Switch analyzer modes
- \`H\` Toggle heatmap
- \`S\` Adjust sensitivity
- \`Ctrl+E\` Export PDF
- \`?\` Show shortcuts`
    },
    {
      title: "Understanding Results",
      content: `**Confidence Score:**
- 0-30%: Likely Authentic - No significant manipulation detected
- 31-70%: Inconclusive - Some anomalies found, review carefully
- 71-100%: Likely Manipulated - Strong indicators of AI generation or editing

**Detection Findings:**
Each finding describes a specific anomaly:
- Face inconsistencies (blending, proportions)
- Lighting/shadow irregularities
- Compression artifacts
- Temporal inconsistencies (video)
- Voice spectral anomalies (audio)

**Heatmap:**
Red areas indicate regions with detected manipulations. Brighter = higher confidence.`
    },
    {
      title: "Subscription Tiers",
      content: `**Free Tier:**
- 5 analyses per day
- Basic detection
- 7-day history

**Pro ($29/month):**
- Unlimited analyses
- Advanced detection modes
- Full history
- Batch processing
- API access
- Priority support

**Enterprise (Custom):**
- Everything in Pro
- Dedicated support
- Custom integrations
- SLA guarantees
- Volume discounts`
    },
    {
      title: "API Access",
      content: `**Authentication:**
All API requests require a Bearer token from your dashboard.

**Rate Limits:**
- Free: 100 requests/day
- Pro: 10,000 requests/day
- Enterprise: Unlimited

**Endpoints:**
- POST /analyze-media - Analyze image/video
- POST /analyze-audio - Analyze audio
- POST /analyze-url - Analyze URL content
- GET /history - Get analysis history

See API documentation for full reference.`
    },
  ];

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-5 h-5 text-primary" />
          Documentation Center
        </CardTitle>
        <CardDescription>
          Technical, developer, and user documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tech" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="tech" className="gap-2">
              <Wrench className="w-4 h-4" />
              Tech Docs
            </TabsTrigger>
            <TabsTrigger value="dev" className="gap-2">
              <Code className="w-4 h-4" />
              Developer Docs
            </TabsTrigger>
            <TabsTrigger value="user" className="gap-2">
              <Users className="w-4 h-4" />
              User Docs
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px]">
            <TabsContent value="tech" className="space-y-4 mt-0">
              {techDocs.map((doc, i) => (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    {doc.title}
                  </h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {doc.content}
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="dev" className="space-y-4 mt-0">
              {devDocs.map((doc, i) => (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      {doc.title}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyCode(doc.code, doc.title)}
                      className="gap-1"
                    >
                      {copiedCode === doc.title ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy
                    </Button>
                  </div>
                  <pre className="text-xs bg-background/50 p-3 rounded-md overflow-x-auto">
                    <code>{doc.code}</code>
                  </pre>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="user" className="space-y-4 mt-0">
              {userDocs.map((doc, i) => (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30"
                >
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    {doc.title}
                  </h3>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {doc.content}
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentationCenter;
