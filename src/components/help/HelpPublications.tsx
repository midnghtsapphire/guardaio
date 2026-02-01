import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, Calendar, Users, BookOpen, Award, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Publication {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  date: string;
  type: "whitepaper" | "research" | "case-study" | "technical" | "guide";
  pages: number;
  downloadUrl?: string;
  externalUrl?: string;
  tags: string[];
  citations?: number;
}

const publications: Publication[] = [
  // Whitepapers
  {
    id: "wp-1",
    title: "The State of Deepfake Detection in 2026",
    abstract: "A comprehensive analysis of current deepfake detection methodologies, their effectiveness, and emerging challenges. This whitepaper examines over 500 detection systems and provides actionable recommendations for organizations.",
    authors: ["Dr. Sarah Chen", "Marcus Johnson", "Elena Rodriguez"],
    date: "2026-01-15",
    type: "whitepaper",
    pages: 48,
    downloadUrl: "#",
    tags: ["deepfakes", "detection", "AI", "2026 trends"],
    citations: 127
  },
  {
    id: "wp-2",
    title: "Enterprise Security in the Age of Synthetic Media",
    abstract: "How organizations can protect themselves from deepfake-based attacks, including CEO fraud, synthetic identity theft, and disinformation campaigns. Includes implementation frameworks and ROI analysis.",
    authors: ["David Park", "Dr. Sarah Chen"],
    date: "2025-11-20",
    type: "whitepaper",
    pages: 36,
    downloadUrl: "#",
    tags: ["enterprise", "security", "fraud prevention"],
    citations: 89
  },
  {
    id: "wp-3",
    title: "Audio Deepfakes: The Invisible Threat",
    abstract: "Voice cloning technology has advanced to near-perfect replication. This whitepaper explores detection methods, case studies of audio deepfake attacks, and protection strategies.",
    authors: ["Dr. Michael Torres", "Anna Kim"],
    date: "2025-09-10",
    type: "whitepaper",
    pages: 32,
    downloadUrl: "#",
    tags: ["audio", "voice cloning", "detection"],
    citations: 156
  },

  // Research Papers
  {
    id: "rp-1",
    title: "GAN Artifact Detection Using Neural Fingerprinting",
    abstract: "Novel approach to identifying GAN-generated images through unique fingerprint patterns left by different generator architectures. Achieves 98.7% accuracy on benchmark datasets.",
    authors: ["Elena Rodriguez", "Dr. James Liu", "Dr. Sarah Chen"],
    date: "2025-12-05",
    type: "research",
    pages: 24,
    externalUrl: "https://arxiv.org",
    tags: ["GAN", "neural networks", "fingerprinting"],
    citations: 234
  },
  {
    id: "rp-2",
    title: "Temporal Consistency Analysis for Video Deepfake Detection",
    abstract: "Research into frame-by-frame consistency patterns that reveal video manipulation. Our method detects inconsistencies invisible to the human eye.",
    authors: ["Marcus Johnson", "Dr. Wei Zhang"],
    date: "2025-10-18",
    type: "research",
    pages: 18,
    externalUrl: "https://arxiv.org",
    tags: ["video", "temporal analysis", "consistency"],
    citations: 178
  },
  {
    id: "rp-3",
    title: "Cross-Modal Deepfake Detection: Lip Sync Analysis",
    abstract: "Detecting face swaps and lip-sync deepfakes by analyzing audio-visual correlation. Combines spectral analysis with facial landmark tracking.",
    authors: ["Anna Kim", "Dr. Michael Torres", "Dr. James Liu"],
    date: "2025-08-22",
    type: "research",
    pages: 22,
    externalUrl: "https://arxiv.org",
    tags: ["lip sync", "multimodal", "face detection"],
    citations: 145
  },

  // Case Studies
  {
    id: "cs-1",
    title: "How Reuters Verified 10,000 Images During Crisis Coverage",
    abstract: "Case study of DeepGuard's deployment at a major news organization during breaking news events. Includes workflow integration, accuracy metrics, and journalist feedback.",
    authors: ["DeepGuard Research Team"],
    date: "2026-01-08",
    type: "case-study",
    pages: 12,
    downloadUrl: "#",
    tags: ["journalism", "verification", "crisis response"]
  },
  {
    id: "cs-2",
    title: "Financial Services: Preventing Synthetic Identity Fraud",
    abstract: "A Fortune 500 bank reduced synthetic identity fraud by 94% using DeepGuard's API integration. Detailed implementation guide and results analysis.",
    authors: ["DeepGuard Enterprise Team"],
    date: "2025-11-30",
    type: "case-study",
    pages: 16,
    downloadUrl: "#",
    tags: ["finance", "fraud", "API integration"]
  },
  {
    id: "cs-3",
    title: "Political Campaign Protection: 2024 Election Security",
    abstract: "How three political campaigns used DeepGuard to monitor and respond to deepfake attacks during the 2024 election cycle.",
    authors: ["DeepGuard Security Team"],
    date: "2025-02-15",
    type: "case-study",
    pages: 20,
    downloadUrl: "#",
    tags: ["elections", "politics", "disinformation"]
  },

  // Technical Documentation
  {
    id: "td-1",
    title: "DeepGuard API v2.0 Technical Specification",
    abstract: "Complete technical documentation for the DeepGuard API including endpoints, authentication, rate limits, error handling, and code examples in 6 languages.",
    authors: ["DeepGuard Engineering"],
    date: "2026-01-20",
    type: "technical",
    pages: 64,
    downloadUrl: "#",
    tags: ["API", "documentation", "developer"]
  },
  {
    id: "td-2",
    title: "Detection Model Architecture Overview",
    abstract: "Technical deep-dive into DeepGuard's multi-model detection architecture, including the ensemble approach and confidence scoring methodology.",
    authors: ["Dr. James Liu", "Engineering Team"],
    date: "2025-12-10",
    type: "technical",
    pages: 28,
    downloadUrl: "#",
    tags: ["architecture", "models", "technical"]
  },

  // Guides
  {
    id: "g-1",
    title: "Media Literacy Guide: Spotting Deepfakes",
    abstract: "Educational guide for the general public on identifying potential deepfakes without technical tools. Includes visual examples and practical tips.",
    authors: ["DeepGuard Education Team"],
    date: "2025-12-01",
    type: "guide",
    pages: 24,
    downloadUrl: "#",
    tags: ["education", "media literacy", "public"]
  },
  {
    id: "g-2",
    title: "Journalist's Handbook for Synthetic Media",
    abstract: "Best practices for journalists when encountering potential deepfakes, including verification workflows, ethical considerations, and reporting guidelines.",
    authors: ["Dr. Sarah Chen", "Press Association"],
    date: "2025-10-05",
    type: "guide",
    pages: 40,
    downloadUrl: "#",
    tags: ["journalism", "ethics", "verification"]
  },
  {
    id: "g-3",
    title: "Legal Considerations for Deepfake Evidence",
    abstract: "Guide for legal professionals on using deepfake detection as evidence, including chain of custody, expert testimony, and jurisdiction-specific considerations.",
    authors: ["DeepGuard Legal Team", "External Counsel"],
    date: "2025-09-15",
    type: "guide",
    pages: 32,
    downloadUrl: "#",
    tags: ["legal", "evidence", "compliance"]
  },
];

const typeConfig = {
  whitepaper: { label: "Whitepaper", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  research: { label: "Research Paper", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  "case-study": { label: "Case Study", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  technical: { label: "Technical Doc", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  guide: { label: "Guide", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
};

const HelpPublications = () => {
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredPublications = selectedType === "all" 
    ? publications 
    : publications.filter(p => p.type === selectedType);

  const stats = {
    total: publications.length,
    whitepapers: publications.filter(p => p.type === "whitepaper").length,
    research: publications.filter(p => p.type === "research").length,
    caseStudies: publications.filter(p => p.type === "case-study").length,
    guides: publications.filter(p => p.type === "guide").length,
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Publications</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.whitepapers}</div>
            <div className="text-xs text-muted-foreground">Whitepapers</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{stats.research}</div>
            <div className="text-xs text-muted-foreground">Research Papers</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.caseStudies}</div>
            <div className="text-xs text-muted-foreground">Case Studies</div>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 mx-auto mb-2 text-pink-500" />
            <div className="text-2xl font-bold">{stats.guides}</div>
            <div className="text-xs text-muted-foreground">Guides</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary">
            All ({publications.length})
          </TabsTrigger>
          <TabsTrigger value="whitepaper" className="data-[state=active]:bg-blue-500">
            Whitepapers
          </TabsTrigger>
          <TabsTrigger value="research" className="data-[state=active]:bg-purple-500">
            Research
          </TabsTrigger>
          <TabsTrigger value="case-study" className="data-[state=active]:bg-green-500">
            Case Studies
          </TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:bg-orange-500">
            Technical
          </TabsTrigger>
          <TabsTrigger value="guide" className="data-[state=active]:bg-pink-500">
            Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPublications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass border-border/50 h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <Badge className={typeConfig[pub.type].color}>
                        {typeConfig[pub.type].label}
                      </Badge>
                      {pub.citations && (
                        <span className="text-xs text-muted-foreground">
                          {pub.citations} citations
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight mt-2">{pub.title}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {pub.date}
                      <span className="mx-1">•</span>
                      {pub.pages} pages
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {pub.abstract}
                    </p>
                    
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Authors: </span>
                      {pub.authors.join(", ")}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {pub.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {pub.downloadUrl && (
                        <Button size="sm" className="gap-1">
                          <Download className="w-3 h-3" />
                          Download PDF
                        </Button>
                      )}
                      {pub.externalUrl && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <ExternalLink className="w-3 h-3" />
                          View on arXiv
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Featured Research */}
      <Card className="glass border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Featured: Most Cited Research
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {publications
              .filter(p => p.citations)
              .sort((a, b) => (b.citations || 0) - (a.citations || 0))
              .slice(0, 3)
              .map(pub => (
                <div key={pub.id} className="p-4 rounded-lg bg-background/50">
                  <Badge className={typeConfig[pub.type].color + " mb-2"}>
                    {typeConfig[pub.type].label}
                  </Badge>
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{pub.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {pub.citations} citations • {pub.authors[0]}
                  </p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPublications;
