import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, ArrowRight, ChevronRight, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory: string;
  readTime: string;
  tags: string[];
  lastUpdated: string;
}

const articles: Article[] = [
  // Getting Started
  {
    id: "gs-1",
    title: "How to Upload Your First File for Analysis",
    excerpt: "Learn the step-by-step process of uploading images, videos, or audio files for deepfake detection.",
    content: `
## Getting Started with File Upload

DeepGuard makes it easy to analyze media files for potential manipulation. Here's how to get started:

### Step 1: Navigate to the Analyzer
Click the "Analyze Media" button on the homepage or navigate to your dashboard.

### Step 2: Choose Your Upload Method
- **Drag and Drop**: Simply drag files from your computer onto the upload zone
- **Click to Browse**: Click the upload area to open your file browser
- **URL Analysis**: Paste a direct URL to analyze online media

### Step 3: Supported Formats
- **Images**: JPEG, PNG, WebP, GIF, BMP, TIFF
- **Videos**: MP4, MOV, AVI, WebM, MKV
- **Audio**: MP3, WAV, M4A, OGG, FLAC

### Step 4: Wait for Analysis
Analysis typically takes 2-10 seconds depending on file size and type.

### Step 5: Review Results
You'll receive a detailed report with confidence scores and specific findings.
    `,
    category: "Getting Started",
    subcategory: "First Steps",
    readTime: "3 min",
    tags: ["upload", "beginner", "files"],
    lastUpdated: "2026-01-28"
  },
  {
    id: "gs-2",
    title: "Understanding Your Dashboard",
    excerpt: "A complete guide to navigating the DeepGuard dashboard and its features.",
    content: `
## Dashboard Overview

Your dashboard is the central hub for all DeepGuard activities.

### Main Sections

#### Analysis History
View all your past analyses with filtering and search capabilities.

#### Quick Actions
- New Analysis
- Batch Upload
- Export Reports

#### Statistics Panel
Track your usage, detection rates, and subscription status.

### Keyboard Shortcuts
- Press **1-6** to switch analysis modes
- Press **H** to toggle heatmap overlay
- Press **?** to view all shortcuts
    `,
    category: "Getting Started",
    subcategory: "Dashboard",
    readTime: "5 min",
    tags: ["dashboard", "navigation", "overview"],
    lastUpdated: "2026-01-25"
  },
  {
    id: "gs-3",
    title: "Creating Your Account",
    excerpt: "Step-by-step guide to setting up your DeepGuard account with security best practices.",
    content: `
## Account Creation Guide

### Registration Steps
1. Click "Sign Up" on the homepage
2. Enter your email address
3. Create a strong password (minimum 8 characters)
4. Verify your email address
5. Complete your profile

### Security Recommendations
- Enable two-factor authentication
- Use a unique password
- Keep your recovery codes safe

### Account Types
- **Free**: 5 analyses per day
- **Pro**: Unlimited analyses
- **Enterprise**: Custom limits + API access
    `,
    category: "Getting Started",
    subcategory: "Account Setup",
    readTime: "4 min",
    tags: ["account", "signup", "security"],
    lastUpdated: "2026-01-20"
  },

  // Account & Billing
  {
    id: "ab-1",
    title: "Managing Your Subscription",
    excerpt: "Learn how to upgrade, downgrade, or cancel your DeepGuard subscription.",
    content: `
## Subscription Management

### Upgrading Your Plan
1. Go to Profile > Billing
2. Click "Upgrade Plan"
3. Select your new plan
4. Confirm payment

### Downgrading
Downgrades take effect at the end of your billing period.

### Cancellation
You can cancel anytime. Access continues until period ends.

### Refund Policy
Pro-rated refunds available within 14 days of purchase.
    `,
    category: "Account & Billing",
    subcategory: "Subscriptions",
    readTime: "4 min",
    tags: ["billing", "subscription", "upgrade"],
    lastUpdated: "2026-01-22"
  },
  {
    id: "ab-2",
    title: "Setting Up Two-Factor Authentication",
    excerpt: "Secure your account with 2FA using authenticator apps or SMS.",
    content: `
## Two-Factor Authentication Setup

### Why Use 2FA?
Adds an extra layer of security beyond your password.

### Setup Options
- **Authenticator App** (Recommended): Google Authenticator, Authy, 1Password
- **SMS**: Receive codes via text message

### Steps to Enable
1. Go to Profile > Security
2. Click "Enable 2FA"
3. Scan QR code with your app
4. Enter verification code
5. Save backup codes securely

### Recovery
Keep backup codes in a safe place for account recovery.
    `,
    category: "Account & Billing",
    subcategory: "Security Settings",
    readTime: "5 min",
    tags: ["2fa", "security", "authentication"],
    lastUpdated: "2026-01-18"
  },
  {
    id: "ab-3",
    title: "Payment Methods and Invoices",
    excerpt: "How to update payment methods, view invoices, and manage billing preferences.",
    content: `
## Payment & Invoice Management

### Accepted Payment Methods
- Credit/Debit Cards (Visa, Mastercard, Amex)
- PayPal
- Bank Transfer (Enterprise only)

### Updating Payment Method
1. Navigate to Profile > Billing
2. Click "Payment Methods"
3. Add new method or edit existing

### Viewing Invoices
All invoices are available in your billing dashboard with PDF download.

### Tax Information
VAT invoices available for EU customers.
    `,
    category: "Account & Billing",
    subcategory: "Payments",
    readTime: "3 min",
    tags: ["payment", "invoice", "billing"],
    lastUpdated: "2026-01-15"
  },

  // Uploading & Analysis
  {
    id: "ua-1",
    title: "Batch Analysis: Analyzing Multiple Files",
    excerpt: "How to upload and analyze multiple files simultaneously for efficient processing.",
    content: `
## Batch Analysis Guide

### Benefits of Batch Analysis
- Process up to 50 files at once
- Consolidated reports
- Time savings for large projects

### How to Use
1. Click "Batch Upload" on dashboard
2. Select multiple files (Ctrl/Cmd + Click)
3. Name your batch
4. Start analysis

### Batch Reports
- Summary overview
- Individual file results
- Export as single PDF

### Limits
- Free: 5 files per batch
- Pro: 50 files per batch
- Enterprise: Custom limits
    `,
    category: "Uploading & Analysis",
    subcategory: "Batch Processing",
    readTime: "4 min",
    tags: ["batch", "multiple files", "efficiency"],
    lastUpdated: "2026-01-26"
  },
  {
    id: "ua-2",
    title: "URL Analysis: Checking Online Media",
    excerpt: "Analyze images and videos directly from URLs without downloading.",
    content: `
## URL Analysis Feature

### Supported Sources
- Direct image/video URLs
- Social media posts (with limitations)
- Cloud storage links
- News article images

### How to Analyze
1. Copy the direct media URL
2. Paste into the URL analyzer
3. Click "Analyze"

### Tips
- Use direct file URLs when possible
- Some platforms may block access
- HTTPS URLs recommended

### Limitations
- Maximum file size: 100MB
- Some platforms restrict access
- Requires public URL
    `,
    category: "Uploading & Analysis",
    subcategory: "URL Analysis",
    readTime: "3 min",
    tags: ["url", "online", "media"],
    lastUpdated: "2026-01-24"
  },
  {
    id: "ua-3",
    title: "Audio Deepfake Detection",
    excerpt: "Detect AI-generated voice and audio manipulation with our specialized analyzer.",
    content: `
## Audio Analysis Guide

### What We Detect
- Voice cloning
- Audio splicing
- Pitch manipulation
- Background noise injection
- Synthetic speech patterns

### Supported Formats
MP3, WAV, M4A, OGG, FLAC, AAC

### Analysis Process
1. Upload audio file
2. System analyzes voice patterns
3. Spectral analysis performed
4. Results with confidence score

### Best Results
- Use high-quality audio (320kbps+)
- Longer samples improve accuracy
- Clear voice without heavy editing
    `,
    category: "Uploading & Analysis",
    subcategory: "Audio Detection",
    readTime: "5 min",
    tags: ["audio", "voice", "detection"],
    lastUpdated: "2026-01-23"
  },

  // Understanding Results
  {
    id: "ur-1",
    title: "Interpreting Confidence Scores",
    excerpt: "What do the percentage scores mean and how should you interpret them?",
    content: `
## Understanding Confidence Scores

### Score Ranges
- **0-30%**: Low likelihood of manipulation
- **31-60%**: Some indicators detected, review recommended
- **61-85%**: High likelihood of manipulation
- **86-100%**: Very strong indicators of deepfake

### What Affects Scores
- Image/video quality
- Compression artifacts
- Editing history
- AI generation method

### Important Notes
- Scores are probabilistic, not definitive
- Consider context and source
- Use for guidance, not legal proof
    `,
    category: "Understanding Results",
    subcategory: "Confidence Scores",
    readTime: "4 min",
    tags: ["confidence", "scores", "interpretation"],
    lastUpdated: "2026-01-27"
  },
  {
    id: "ur-2",
    title: "Reading Heatmap Overlays",
    excerpt: "How to use heatmap visualizations to identify manipulated regions.",
    content: `
## Heatmap Analysis Guide

### What Heatmaps Show
- Red areas: High manipulation probability
- Yellow areas: Moderate indicators
- Green areas: Likely authentic

### Using Heatmaps
1. Complete analysis
2. Press 'H' or click Heatmap toggle
3. Hover for detailed scores

### Common Patterns
- Face swaps show red around facial features
- Spliced images show edges highlighted
- GAN artifacts appear as patterns

### Tips
- Zoom in on highlighted areas
- Compare with original if available
    `,
    category: "Understanding Results",
    subcategory: "Visualizations",
    readTime: "4 min",
    tags: ["heatmap", "visualization", "regions"],
    lastUpdated: "2026-01-21"
  },

  // API & Integrations
  {
    id: "ai-1",
    title: "Getting Started with the API",
    excerpt: "Quick start guide for integrating DeepGuard into your applications.",
    content: `
## API Quick Start

### Authentication
\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.deepguard.ai/v1/analyze
\`\`\`

### Endpoints
- POST /analyze - Submit media for analysis
- GET /results/{id} - Retrieve analysis results
- GET /history - List past analyses

### Rate Limits
- Pro: 100 requests/minute
- Enterprise: Custom limits

### SDKs Available
- JavaScript/TypeScript
- Python
- Go
- Ruby
    `,
    category: "API & Integrations",
    subcategory: "API Basics",
    readTime: "6 min",
    tags: ["api", "integration", "developer"],
    lastUpdated: "2026-01-26"
  },
  {
    id: "ai-2",
    title: "Webhook Integration",
    excerpt: "Set up webhooks to receive real-time notifications when analysis completes.",
    content: `
## Webhook Configuration

### Setting Up Webhooks
1. Go to API Settings
2. Click "Add Webhook"
3. Enter your endpoint URL
4. Select events to receive

### Webhook Payload
\`\`\`json
{
  "event": "analysis.complete",
  "analysis_id": "abc123",
  "confidence": 85,
  "status": "likely_manipulated"
}
\`\`\`

### Security
- Verify webhook signatures
- Use HTTPS endpoints
- Implement retry handling
    `,
    category: "API & Integrations",
    subcategory: "Webhooks",
    readTime: "5 min",
    tags: ["webhook", "notifications", "api"],
    lastUpdated: "2026-01-19"
  },

  // Security & Privacy
  {
    id: "sp-1",
    title: "How We Protect Your Data",
    excerpt: "Learn about DeepGuard's security measures and data handling practices.",
    content: `
## Data Protection Overview

### Encryption
- TLS 1.3 for data in transit
- AES-256 for data at rest
- End-to-end encryption for sensitive files

### Data Retention
- Uploaded files: Deleted within 24 hours
- Analysis results: Stored until you delete
- Logs: Retained for 30 days

### Compliance
- GDPR compliant
- SOC 2 Type II certified
- CCPA compliant

### Your Controls
- Delete data anytime
- Export your data
- Opt-out of analytics
    `,
    category: "Security & Privacy",
    subcategory: "Data Protection",
    readTime: "4 min",
    tags: ["security", "privacy", "encryption"],
    lastUpdated: "2026-01-25"
  },
  {
    id: "sp-2",
    title: "GDPR Rights and Requests",
    excerpt: "How to exercise your data rights under GDPR regulations.",
    content: `
## Your GDPR Rights

### Available Rights
- Right to access
- Right to rectification
- Right to erasure
- Right to data portability
- Right to object

### Making a Request
1. Go to Profile > Privacy
2. Click "Data Request"
3. Select request type
4. Submit

### Response Times
- Access requests: 30 days
- Deletion: 72 hours
- Export: 7 days

### Contact
privacy@deepguard.ai
    `,
    category: "Security & Privacy",
    subcategory: "GDPR",
    readTime: "3 min",
    tags: ["gdpr", "rights", "privacy"],
    lastUpdated: "2026-01-17"
  },
];

const categories = [
  {
    name: "Getting Started",
    icon: "🚀",
    subcategories: ["First Steps", "Dashboard", "Account Setup", "Quick Tips"]
  },
  {
    name: "Account & Billing",
    icon: "🔧",
    subcategories: ["Subscriptions", "Security Settings", "Payments", "Profile Management"]
  },
  {
    name: "Uploading & Analysis",
    icon: "📤",
    subcategories: ["File Upload", "Batch Processing", "URL Analysis", "Audio Detection", "Video Analysis"]
  },
  {
    name: "Understanding Results",
    icon: "📊",
    subcategories: ["Confidence Scores", "Visualizations", "Reports", "Findings Explained"]
  },
  {
    name: "API & Integrations",
    icon: "🔌",
    subcategories: ["API Basics", "Webhooks", "SDKs", "Rate Limits", "Examples"]
  },
  {
    name: "Security & Privacy",
    icon: "🔒",
    subcategories: ["Data Protection", "GDPR", "Compliance", "Best Practices"]
  },
];

const HelpArticles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  if (selectedArticle) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <Button 
          variant="ghost" 
          onClick={() => setSelectedArticle(null)}
          className="gap-2"
        >
          ← Back to Articles
        </Button>
        
        <Card className="glass border-border/50">
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>{selectedArticle.category}</Badge>
              <Badge variant="outline">{selectedArticle.subcategory}</Badge>
            </div>
            <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedArticle.readTime}
              </span>
              <span>Updated: {selectedArticle.lastUpdated}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {selectedArticle.content}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
              {selectedArticle.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12"
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-semibold mb-4">Categories</h3>
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedCategory(null)}
          >
            All Articles ({articles.length})
          </Button>
          {categories.map(category => (
            <Collapsible 
              key={category.name}
              open={expandedCategories.includes(category.name)}
              onOpenChange={() => toggleCategory(category.name)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant={selectedCategory === category.name ? "default" : "ghost"}
                  className="w-full justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(category.name);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedCategories.includes(category.name) ? 'rotate-90' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-8 space-y-1 mt-1">
                {category.subcategories.map(sub => (
                  <Button
                    key={sub}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-muted-foreground"
                  >
                    {sub}
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Articles List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {selectedCategory || "All Articles"} ({filteredArticles.length})
            </h3>
          </div>
          
          {filteredArticles.length === 0 ? (
            <Card className="glass border-border/50 p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="glass border-border/50 h-full hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{article.subcategory}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-base leading-tight">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{article.excerpt}</CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-1">
                          {article.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpArticles;
