import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Copy, 
  Check, 
  Play, 
  Terminal,
  Leaf,
  Zap,
  Database,
  Key,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SustainabilityAPIReference = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [testUrl, setTestUrl] = useState("https://example.com");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    toast.success("Code copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const runTest = async () => {
    setIsTesting(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const mockResponse = {
      success: true,
      url: testUrl,
      carbon: {
        grade: "B",
        co2_per_visit_grams: 0.24,
        percentile: 78,
        green_hosting: true,
      },
      data_transfer: {
        total_kb: 1250,
        breakdown: {
          images: 580,
          scripts: 320,
          stylesheets: 120,
          fonts: 150,
          other: 80,
        },
      },
      sci: {
        score: 18.5,
        operational_emissions: 12.3,
        embodied_emissions: 6.2,
      },
      methodology: "SWD-v4",
      timestamp: new Date().toISOString(),
    };
    
    setTestResult(JSON.stringify(mockResponse, null, 2));
    setIsTesting(false);
  };

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/audit",
      description: "Audit a URL and get carbon metrics",
      params: [
        { name: "url", type: "string", required: true, description: "The URL to audit" },
        { name: "methodology", type: "string", required: false, description: "SWD or SCI (default: SWD)" },
      ],
    },
    {
      method: "GET",
      path: "/api/v1/audit/{audit_id}",
      description: "Retrieve a previous audit result",
      params: [
        { name: "audit_id", type: "string", required: true, description: "The audit ID from a previous request" },
      ],
    },
    {
      method: "GET",
      path: "/api/v1/green-hosts",
      description: "Check if a domain uses green hosting",
      params: [
        { name: "domain", type: "string", required: true, description: "Domain to check (e.g., example.com)" },
      ],
    },
    {
      method: "GET",
      path: "/api/v1/grid-intensity",
      description: "Get current grid carbon intensity by region",
      params: [
        { name: "region", type: "string", required: true, description: "ISO 3166-1 country code" },
      ],
    },
  ];

  const codeExamples = {
    curl: `curl -X POST https://api.greenweb.deepguard.app/v1/audit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "methodology": "SWD"}'`,
    
    javascript: `import { GreenWebClient } from '@greenweb/api';

const client = new GreenWebClient('YOUR_API_KEY');

const result = await client.audit({
  url: 'https://example.com',
  methodology: 'SWD',
});

console.log(\`Grade: \${result.carbon.grade}\`);
console.log(\`CO2 per visit: \${result.carbon.co2_per_visit_grams}g\`);`,
    
    python: `from greenweb import GreenWebClient

client = GreenWebClient("YOUR_API_KEY")

result = client.audit(
    url="https://example.com",
    methodology="SWD"
)

print(f"Grade: {result.carbon.grade}")
print(f"CO2 per visit: {result.carbon.co2_per_visit_grams}g")`,
  };

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get started with the GreenWeb Carbon API in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Get API Key", icon: Key, description: "Sign up for a free API key" },
              { step: 2, title: "Install SDK", icon: Terminal, description: "npm install @greenweb/api" },
              { step: 3, title: "Make Request", icon: Leaf, description: "Audit your first URL" },
            ].map((item) => (
              <div key={item.step} className="p-4 rounded-lg bg-secondary/30 text-center">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-green-500">{item.step}</span>
                </div>
                <h4 className="font-medium mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Install via npm</span>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1"
                onClick={() => copyCode('npm install @greenweb/api', 'npm')}
              >
                {copied === 'npm' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <pre className="text-sm text-green-500 font-mono">npm install @greenweb/api</pre>
          </div>
        </CardContent>
      </Card>

      {/* Live Console */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-500" />
            Try It Out
          </CardTitle>
          <CardDescription>
            Test the API directly in your browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1"
            />
            <Button onClick={runTest} disabled={isTesting} className="gap-2">
              {isTesting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run
                </>
              )}
            </Button>
          </div>

          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-green-500/20 text-green-500">200 OK</Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={() => copyCode(testResult, 'result')}
                >
                  {copied === 'result' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  Copy
                </Button>
              </div>
              <ScrollArea className="h-[300px]">
                <pre className="p-4 bg-slate-950 rounded-lg text-sm text-green-400 font-mono overflow-x-auto">
                  {testResult}
                </pre>
              </ScrollArea>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-500" />
            Code Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>

            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang}>
                <div className="relative">
                  <pre className="p-4 bg-slate-950 rounded-lg text-sm text-gray-300 font-mono overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 gap-1"
                    onClick={() => copyCode(code, lang)}
                  >
                    {copied === lang ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Endpoints Reference */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            Endpoints Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpoints.map((endpoint, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Badge 
                    className={endpoint.method === 'GET' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono">{endpoint.path}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">Parameters:</span>
                  <div className="grid gap-2">
                    {endpoint.params.map((param, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <code className="text-primary">{param.name}</code>
                        <span className="text-muted-foreground">({param.type})</span>
                        {param.required && <Badge variant="outline" className="text-xs">required</Badge>}
                        <span className="text-muted-foreground">- {param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Methodology Links */}
      <Card className="glass border-green-500/20 bg-green-500/5">
        <CardContent className="pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-500" />
            Methodology & Standards
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Sustainable Web Design (SWD)",
                description: "Industry-standard model for estimating website carbon emissions",
                url: "https://sustainablewebdesign.org/calculating-digital-emissions/",
              },
              {
                title: "Software Carbon Intensity (SCI)",
                description: "Green Software Foundation specification for software emissions",
                url: "https://sci.greensoftware.foundation/",
              },
              {
                title: "CO2.js Library",
                description: "Open source library powering our calculations",
                url: "https://github.com/thegreenwebfoundation/co2.js",
              },
              {
                title: "Green Web Foundation",
                description: "Maintaining the green hosting database",
                url: "https://www.thegreenwebfoundation.org/",
              },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-500/10 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-green-500 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-medium group-hover:text-green-500 transition-colors">{link.title}</h4>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityAPIReference;
