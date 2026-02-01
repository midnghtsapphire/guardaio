import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GitBranch, 
  Bug, 
  CheckSquare, 
  Rocket, 
  Shield, 
  FileSearch,
  ExternalLink,
  Star,
  Users,
  Building2,
  Github,
  GitPullRequest,
  AlertCircle,
  Clock,
  Workflow,
  Database,
  Lock,
  Eye,
  Code,
  Clipboard,
  Server
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Tool {
  name: string;
  description: string;
  category: string;
  url: string;
  stars: string;
  license: string;
  govGrade: boolean;
  features: string[];
  usedBy?: string[];
}

const DevOpsTools = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tools: Tool[] = [
    // Code Review Tools
    {
      name: "SonarQube Community",
      description: "Continuous code quality and security inspection platform",
      category: "Code Review",
      url: "https://github.com/SonarSource/sonarqube",
      stars: "8.5k+",
      license: "LGPL-3.0",
      govGrade: true,
      features: [
        "Static code analysis",
        "Security vulnerability detection",
        "Code smell identification",
        "Technical debt tracking",
        "CI/CD integration"
      ],
      usedBy: ["US DoD", "NASA", "EU Commission"]
    },
    {
      name: "Semgrep",
      description: "Fast, open-source static analysis for finding bugs and enforcing code standards",
      category: "Code Review",
      url: "https://github.com/returntocorp/semgrep",
      stars: "9k+",
      license: "LGPL-2.1",
      govGrade: true,
      features: [
        "Pattern-based code search",
        "Security rule library",
        "Custom rule creation",
        "Multi-language support",
        "GitHub Actions integration"
      ],
      usedBy: ["Dropbox", "Slack", "Snowflake"]
    },
    {
      name: "CodeClimate",
      description: "Automated code review for maintainability and test coverage",
      category: "Code Review",
      url: "https://github.com/codeclimate/codeclimate",
      stars: "2.5k+",
      license: "AGPL-3.0",
      govGrade: false,
      features: [
        "Maintainability scoring",
        "Duplication detection",
        "Complexity analysis",
        "Pull request integration"
      ]
    },

    // Bug Tracking
    {
      name: "Redmine",
      description: "Flexible project management and issue tracking system",
      category: "Bug Tracking",
      url: "https://github.com/redmine/redmine",
      stars: "5k+",
      license: "GPL-2.0",
      govGrade: true,
      features: [
        "Issue tracking",
        "Project wikis",
        "Time tracking",
        "Gantt charts",
        "Role-based access control"
      ],
      usedBy: ["French Ministry", "German Federal Agencies"]
    },
    {
      name: "Bugzilla",
      description: "Server-based bug tracking system from Mozilla Foundation",
      category: "Bug Tracking",
      url: "https://github.com/bugzilla/bugzilla",
      stars: "600+",
      license: "MPL-2.0",
      govGrade: true,
      features: [
        "Advanced search",
        "Email integration",
        "Time tracking",
        "Custom workflows",
        "Enterprise security"
      ],
      usedBy: ["Mozilla", "NASA", "Linux Kernel"]
    },
    {
      name: "MantisBT",
      description: "Web-based bug tracking system with simple interface",
      category: "Bug Tracking",
      url: "https://github.com/mantisbt/mantisbt",
      stars: "1.5k+",
      license: "GPL-2.0",
      govGrade: false,
      features: [
        "Email notifications",
        "Source control integration",
        "Custom fields",
        "Multi-project support"
      ]
    },

    // QA Testing
    {
      name: "Robot Framework",
      description: "Generic automation framework for acceptance testing and RPA",
      category: "QA Testing",
      url: "https://github.com/robotframework/robotframework",
      stars: "8.5k+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "Keyword-driven testing",
        "Data-driven testing",
        "Selenium integration",
        "API testing",
        "Parallel execution"
      ],
      usedBy: ["Nokia", "Cisco", "NASA JPL"]
    },
    {
      name: "Playwright",
      description: "Cross-browser automation library from Microsoft",
      category: "QA Testing",
      url: "https://github.com/microsoft/playwright",
      stars: "60k+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "Multi-browser support",
        "Auto-waiting",
        "Network interception",
        "Mobile emulation",
        "Visual comparisons"
      ],
      usedBy: ["Microsoft", "VS Code", "Azure"]
    },
    {
      name: "Cypress",
      description: "JavaScript end-to-end testing framework",
      category: "QA Testing",
      url: "https://github.com/cypress-io/cypress",
      stars: "45k+",
      license: "MIT",
      govGrade: false,
      features: [
        "Time travel debugging",
        "Automatic waiting",
        "Real-time reloads",
        "Network stubbing"
      ]
    },
    {
      name: "OWASP ZAP",
      description: "Security testing proxy for finding vulnerabilities",
      category: "QA Testing",
      url: "https://github.com/zaproxy/zaproxy",
      stars: "12k+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "Automated security scanning",
        "API testing",
        "Authentication handling",
        "CI/CD integration",
        "Fuzzing"
      ],
      usedBy: ["OWASP", "US CISA", "UK NCSC"]
    },

    // Change Control
    {
      name: "Gerrit",
      description: "Web-based code review and project management for Git",
      category: "Change Control",
      url: "https://github.com/GerritCodeReview/gerrit",
      stars: "900+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "Pre-commit code review",
        "Fine-grained access control",
        "CI/CD triggers",
        "Inline commenting",
        "Vote-based approval"
      ],
      usedBy: ["Google", "Android", "OpenStack"]
    },
    {
      name: "GitLab CE",
      description: "Complete DevOps platform with built-in CI/CD",
      category: "Change Control",
      url: "https://gitlab.com/gitlab-org/gitlab",
      stars: "N/A (GitLab)",
      license: "MIT",
      govGrade: true,
      features: [
        "Merge request workflow",
        "Protected branches",
        "Audit logging",
        "Compliance pipelines",
        "Security scanning"
      ],
      usedBy: ["Goldman Sachs", "Siemens", "US Air Force"]
    },
    {
      name: "Reviewable",
      description: "GitHub code review tool with advanced features",
      category: "Change Control",
      url: "https://github.com/nickstenning/reviewable",
      stars: "500+",
      license: "MIT",
      govGrade: false,
      features: [
        "Line-by-line discussions",
        "Review completion tracking",
        "Custom approval rules"
      ]
    },

    // Deployment & Rollout
    {
      name: "ArgoCD",
      description: "Declarative GitOps continuous delivery for Kubernetes",
      category: "Deployment",
      url: "https://github.com/argoproj/argo-cd",
      stars: "15k+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "GitOps workflows",
        "Rollback support",
        "Multi-cluster deployment",
        "SSO integration",
        "RBAC"
      ],
      usedBy: ["Intuit", "Tesla", "Adobe"]
    },
    {
      name: "Flux",
      description: "GitOps toolkit for Kubernetes from CNCF",
      category: "Deployment",
      url: "https://github.com/fluxcd/flux2",
      stars: "5.5k+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "Multi-tenancy",
        "Helm support",
        "Kustomize integration",
        "Notification controller"
      ],
      usedBy: ["Weaveworks", "AWS", "D2iQ"]
    },
    {
      name: "Spinnaker",
      description: "Multi-cloud continuous delivery platform from Netflix",
      category: "Deployment",
      url: "https://github.com/spinnaker/spinnaker",
      stars: "9k+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "Multi-cloud support",
        "Canary deployments",
        "Blue/green deployments",
        "Manual judgments",
        "Pipeline templates"
      ],
      usedBy: ["Netflix", "Google", "Microsoft"]
    },

    // Government-Specific Tools
    {
      name: "OpenSCAP",
      description: "NIST security compliance assessment toolkit",
      category: "Compliance",
      url: "https://github.com/OpenSCAP/openscap",
      stars: "1.2k+",
      license: "LGPL-2.1",
      govGrade: true,
      features: [
        "SCAP 1.2/1.3 support",
        "STIG automation",
        "CVE scanning",
        "Compliance reports",
        "NIST 800-53 profiles"
      ],
      usedBy: ["US DoD", "DISA", "Red Hat"]
    },
    {
      name: "Compliance Masonry",
      description: "Automate documentation for FedRAMP, FISMA compliance",
      category: "Compliance",
      url: "https://github.com/opencontrol/compliance-masonry",
      stars: "200+",
      license: "CC0-1.0",
      govGrade: true,
      features: [
        "OpenControl format",
        "SSP generation",
        "Component reuse",
        "Gap analysis"
      ],
      usedBy: ["18F", "GSA", "Cloud.gov"]
    },
    {
      name: "InSpec",
      description: "Infrastructure testing and compliance framework",
      category: "Compliance",
      url: "https://github.com/inspec/inspec",
      stars: "2.7k+",
      license: "Apache-2.0",
      govGrade: true,
      features: [
        "CIS Benchmark profiles",
        "STIG profiles",
        "Cloud resource testing",
        "Agentless execution"
      ],
      usedBy: ["Chef", "MITRE", "US Treasury"]
    }
  ];

  const categories = ['all', ...new Set(tools.map(t => t.category))];
  
  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory);

  const govTools = tools.filter(t => t.govGrade);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Code Review': return <Code className="w-4 h-4" />;
      case 'Bug Tracking': return <Bug className="w-4 h-4" />;
      case 'QA Testing': return <CheckSquare className="w-4 h-4" />;
      case 'Change Control': return <GitPullRequest className="w-4 h-4" />;
      case 'Deployment': return <Rocket className="w-4 h-4" />;
      case 'Compliance': return <Shield className="w-4 h-4" />;
      default: return <Workflow className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Github className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{tools.length}</div>
                <div className="text-sm text-muted-foreground">Open Source Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{govTools.length}</div>
                <div className="text-sm text-muted-foreground">Gov-Grade Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Free & Open</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tools" className="gap-2">
            <Workflow className="w-4 h-4" />
            All Tools
          </TabsTrigger>
          <TabsTrigger value="govgrade" className="gap-2">
            <Building2 className="w-4 h-4" />
            Government Grade
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <GitBranch className="w-4 h-4" />
            Recommended Workflow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="gap-1"
              >
                {cat !== 'all' && getCategoryIcon(cat)}
                {cat === 'all' ? 'All Categories' : cat}
              </Button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="glass border-border/50 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {tool.name}
                          {tool.govGrade && (
                            <Badge className="bg-green-500/20 text-green-500 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Gov Grade
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">{tool.description}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {tool.stars}
                      </span>
                      <Badge variant="outline" className="text-xs">{tool.license}</Badge>
                      <Badge variant="secondary" className="text-xs gap-1">
                        {getCategoryIcon(tool.category)}
                        {tool.category}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {tool.features.slice(0, 4).map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                      {tool.features.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{tool.features.length - 4} more
                        </Badge>
                      )}
                    </div>
                    
                    {tool.usedBy && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Used by: {tool.usedBy.join(', ')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="govgrade">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-500" />
                Government-Grade Open Source Tools
              </CardTitle>
              <CardDescription>
                Tools used by US DoD, NASA, CISA, and other government agencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead>Key Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {govTools.map(tool => (
                    <TableRow key={tool.name}>
                      <TableCell>
                        <a 
                          href={tool.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary flex items-center gap-1"
                        >
                          {tool.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          {getCategoryIcon(tool.category)}
                          {tool.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{tool.license}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tool.usedBy?.join(', ') || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tool.features.slice(0, 2).join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                Recommended DevOps Workflow
              </CardTitle>
              <CardDescription>
                Enterprise-grade CI/CD pipeline using open source tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Workflow Diagram */}
              <div className="grid md:grid-cols-6 gap-4">
                {[
                  { step: 1, name: "Code", tool: "GitLab CE", icon: Code, color: "bg-blue-500" },
                  { step: 2, name: "Review", tool: "Gerrit + Semgrep", icon: Eye, color: "bg-purple-500" },
                  { step: 3, name: "Test", tool: "Playwright + OWASP ZAP", icon: CheckSquare, color: "bg-green-500" },
                  { step: 4, name: "Build", tool: "GitLab CI", icon: Server, color: "bg-orange-500" },
                  { step: 5, name: "Deploy", tool: "ArgoCD", icon: Rocket, color: "bg-cyan-500" },
                  { step: 6, name: "Monitor", tool: "Prometheus + Grafana", icon: Eye, color: "bg-pink-500" },
                ].map((stage, idx) => (
                  <div key={stage.step} className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full ${stage.color}/20 flex items-center justify-center mb-2`}>
                      <stage.icon className={`w-6 h-6 ${stage.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="font-medium text-sm">{stage.name}</div>
                    <div className="text-xs text-muted-foreground">{stage.tool}</div>
                    {idx < 5 && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">→</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Detailed Steps */}
              <div className="space-y-4 mt-8">
                <h4 className="font-medium">Implementation Steps:</h4>
                
                <div className="space-y-3">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">1</span>
                      Code Review Gate
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                      <li>• All commits require code review via Gerrit</li>
                      <li>• Semgrep runs static analysis on every PR</li>
                      <li>• SonarQube gates for code quality thresholds</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">2</span>
                      Automated Testing
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                      <li>• Unit tests with Vitest/Jest</li>
                      <li>• E2E tests with Playwright</li>
                      <li>• Security scans with OWASP ZAP</li>
                      <li>• Accessibility audits with axe-core</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">3</span>
                      Compliance Validation
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                      <li>• OpenSCAP for NIST/STIG compliance</li>
                      <li>• InSpec profiles for CIS Benchmarks</li>
                      <li>• Compliance Masonry for SSP documentation</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">4</span>
                      GitOps Deployment
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                      <li>• ArgoCD for declarative deployments</li>
                      <li>• Canary releases with Flagger</li>
                      <li>• Automatic rollback on failure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevOpsTools;
