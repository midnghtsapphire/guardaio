import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  Copy, 
  Check, 
  Code, 
  Palette,
  Download,
  ExternalLink,
  Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type BadgeStyle = 'minimal' | 'detailed' | 'compact';
type BadgeTheme = 'light' | 'dark' | 'green';

const CarbonBadgeGenerator = () => {
  const [url, setUrl] = useState("");
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>('minimal');
  const [badgeTheme, setBadgeTheme] = useState<BadgeTheme>('dark');
  const [copied, setCopied] = useState(false);

  // Simulated values (would come from actual audit)
  const mockData = {
    grade: 'B',
    co2: 0.24,
    greenHost: true,
  };

  const getEmbedCode = () => {
    const baseUrl = 'https://greenweb.deepguard.app/badge';
    return `<a href="${baseUrl}?url=${encodeURIComponent(url || 'example.com')}" target="_blank">
  <img src="${baseUrl}/image?url=${encodeURIComponent(url || 'example.com')}&style=${badgeStyle}&theme=${badgeTheme}" 
       alt="Carbon Score - ${mockData.grade}" 
       width="${badgeStyle === 'compact' ? '120' : badgeStyle === 'minimal' ? '180' : '240'}" />
</a>`;
  };

  const getMarkdownCode = () => {
    const baseUrl = 'https://greenweb.deepguard.app/badge';
    return `[![Carbon Score](${baseUrl}/image?url=${encodeURIComponent(url || 'example.com')}&style=${badgeStyle}&theme=${badgeTheme})](${baseUrl}?url=${encodeURIComponent(url || 'example.com')})`;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const BadgePreview = () => {
    const themes = {
      light: { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200' },
      dark: { bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-700' },
      green: { bg: 'bg-green-900', text: 'text-green-50', border: 'border-green-700' },
    };

    const gradeColors = {
      A: 'bg-green-500',
      B: 'bg-lime-500',
      C: 'bg-yellow-500',
      D: 'bg-orange-500',
      E: 'bg-red-400',
      F: 'bg-red-600',
    };

    const theme = themes[badgeTheme];

    if (badgeStyle === 'compact') {
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.bg} ${theme.border} border`}>
          <Leaf className={`w-4 h-4 text-green-500`} />
          <span className={`font-bold ${theme.text}`}>{mockData.grade}</span>
        </div>
      );
    }

    if (badgeStyle === 'minimal') {
      return (
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg ${theme.bg} ${theme.border} border`}>
          <div className={`w-8 h-8 rounded-full ${gradeColors[mockData.grade as keyof typeof gradeColors]} flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">{mockData.grade}</span>
          </div>
          <div>
            <div className={`text-sm font-medium ${theme.text}`}>{mockData.co2}g CO₂</div>
            <div className={`text-xs ${badgeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>per visit</div>
          </div>
        </div>
      );
    }

    // Detailed style
    return (
      <div className={`inline-block p-4 rounded-xl ${theme.bg} ${theme.border} border min-w-[200px]`}>
        <div className="flex items-center gap-3 mb-3">
          <Leaf className="w-5 h-5 text-green-500" />
          <span className={`font-semibold ${theme.text}`}>Carbon Score</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full ${gradeColors[mockData.grade as keyof typeof gradeColors]} flex items-center justify-center`}>
            <span className="text-white font-bold text-2xl">{mockData.grade}</span>
          </div>
          <div>
            <div className={`text-lg font-bold ${theme.text}`}>{mockData.co2}g CO₂</div>
            <div className={`text-sm ${badgeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>per page view</div>
          </div>
        </div>
        {mockData.greenHost && (
          <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className={`text-xs ${badgeTheme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Green Hosted</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Carbon Badge Generator
          </CardTitle>
          <CardDescription>
            Create an embeddable badge to display your website's carbon score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Your Website URL</Label>
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Style Selection */}
            <div className="space-y-3">
              <Label>Badge Style</Label>
              <RadioGroup value={badgeStyle} onValueChange={(v) => setBadgeStyle(v as BadgeStyle)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="compact" />
                  <Label htmlFor="compact" className="font-normal cursor-pointer">Compact (pill)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimal" id="minimal" />
                  <Label htmlFor="minimal" className="font-normal cursor-pointer">Minimal (score + CO₂)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed" id="detailed" />
                  <Label htmlFor="detailed" className="font-normal cursor-pointer">Detailed (full card)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <Label>Badge Theme</Label>
              <RadioGroup value={badgeTheme} onValueChange={(v) => setBadgeTheme(v as BadgeTheme)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="font-normal cursor-pointer">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="font-normal cursor-pointer">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="green" id="green" />
                  <Label htmlFor="green" className="font-normal cursor-pointer">Green</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview & Code */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Preview */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Badge Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 bg-secondary/30 rounded-lg min-h-[150px]">
              <motion.div
                key={`${badgeStyle}-${badgeTheme}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <BadgePreview />
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Embed Code */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="w-4 h-4" />
              Embed Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="html">
              <TabsList className="mb-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html">
                <div className="relative">
                  <pre className="p-4 bg-secondary/50 rounded-lg text-xs overflow-x-auto">
                    <code>{getEmbedCode()}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 gap-1"
                    onClick={() => copyCode(getEmbedCode())}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="markdown">
                <div className="relative">
                  <pre className="p-4 bg-secondary/50 rounded-lg text-xs overflow-x-auto">
                    <code>{getMarkdownCode()}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 gap-1"
                    onClick={() => copyCode(getMarkdownCode())}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Badge Benefits */}
      <Card className="glass border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Why Display a Carbon Badge?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Build Trust",
                description: "Show visitors you care about environmental impact",
              },
              {
                title: "Track Progress",
                description: "Badges update automatically as you optimize",
              },
              {
                title: "Join the Movement",
                description: "Be part of the sustainable web community",
              },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonBadgeGenerator;
