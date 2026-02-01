import { motion } from "framer-motion";
import { Code, Key, Zap, Shield, Clock, BarChart3, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";

const API = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const features = [
    { icon: Zap, title: "Fast Analysis", description: "Average response time under 2 seconds" },
    { icon: Shield, title: "Secure", description: "TLS encryption and API key authentication" },
    { icon: Clock, title: "99.9% Uptime", description: "Enterprise-grade reliability" },
    { icon: BarChart3, title: "Rate Limits", description: "Up to 1000 requests per minute" },
  ];

  const codeExamples = {
    curl: `curl -X POST https://api.deepguard.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/image.jpg",
    "options": {
      "detailed_report": true,
      "heatmap": true
    }
  }'`,
    python: `import requests

response = requests.post(
    "https://api.deepguard.ai/v1/analyze",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "image_url": "https://example.com/image.jpg",
        "options": {
            "detailed_report": True,
            "heatmap": True
        }
    }
)

result = response.json()
print(f"Confidence: {result['confidence']}%")
print(f"Status: {result['status']}")`,
    javascript: `const response = await fetch('https://api.deepguard.ai/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/image.jpg',
    options: {
      detailed_report: true,
      heatmap: true
    }
  })
});

const result = await response.json();
console.log(\`Confidence: \${result.confidence}%\`);
console.log(\`Status: \${result.status}\`);`,
  };

  const responseExample = `{
  "id": "ana_8f7d9c3e2b1a4f5d",
  "status": "suspicious",
  "confidence": 87,
  "created_at": "2026-01-15T10:30:00Z",
  "findings": [
    "Inconsistent facial boundaries detected",
    "Temporal artifacts in lip movements",
    "Unnatural eye reflection patterns"
  ],
  "metadata": {
    "file_type": "image/jpeg",
    "dimensions": "1920x1080",
    "analysis_time_ms": 1847
  }
}`;

  const endpoints = [
    { method: "POST", path: "/v1/analyze", description: "Analyze an image or video for deepfake indicators" },
    { method: "POST", path: "/v1/analyze/url", description: "Analyze media from a URL" },
    { method: "POST", path: "/v1/analyze/batch", description: "Analyze multiple files in one request" },
    { method: "GET", path: "/v1/analysis/{id}", description: "Retrieve analysis results by ID" },
    { method: "GET", path: "/v1/history", description: "List analysis history" },
    { method: "DELETE", path: "/v1/analysis/{id}", description: "Delete analysis record" },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>API Documentation | DeepGuard</title>
        <meta name="description" content="Integrate deepfake detection into your applications with the DeepGuard API. RESTful endpoints, SDKs, and comprehensive documentation." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <Code className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">API Documentation</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Integrate powerful deepfake detection into your applications with our RESTful API.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                  <Key className="w-5 h-5" />
                  Get API Key
                </Button>
                <Button size="lg" variant="outline">
                  View Full Docs
                </Button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-4 gap-6 mb-16"
            >
              {features.map((feature) => (
                <Card key={feature.title} className="glass border-border/50 text-center">
                  <CardContent className="pt-6">
                    <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Endpoints */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">API Endpoints</h2>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="divide-y divide-border">
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.path} className="p-4 flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                        endpoint.method === "POST" ? "bg-primary/20 text-primary" :
                        endpoint.method === "GET" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm">{endpoint.path}</code>
                      <span className="text-muted-foreground text-sm ml-auto hidden md:block">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Code Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Quick Start</h2>
              
              <Tabs defaultValue="curl" className="max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>
                
                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="glass rounded-xl p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-muted-foreground">{code}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(code)}
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>

            {/* Response Example */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Response Format</h2>
              <div className="relative">
                <pre className="glass rounded-xl p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-muted-foreground">{responseExample}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(responseExample)}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default API;
