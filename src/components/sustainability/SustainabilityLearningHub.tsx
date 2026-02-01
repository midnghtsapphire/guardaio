import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Code, 
  Scale, 
  GraduationCap,
  Clock,
  CheckCircle,
  Play,
  Lock,
  Award,
  FileText,
  Briefcase,
  Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  completedModules: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  cle?: boolean; // Continuing Legal Education credit
  instructor: string;
}

const SustainabilityLearningHub = () => {
  const [selectedTrack, setSelectedTrack] = useState<'developer' | 'attorney'>('developer');

  const developerCourses: Course[] = [
    {
      id: 'green-principles',
      title: 'Principles of Green Software',
      description: 'Learn the core principles: Energy Efficiency, Hardware Efficiency, and Carbon Awareness. Understand the "Carbon Handprint" concept.',
      duration: '2h 30m',
      modules: 5,
      completedModules: 0,
      level: 'Beginner',
      tags: ['Fundamentals', 'Carbon Awareness'],
      instructor: 'Green Software Foundation',
    },
    {
      id: 'measuring-api',
      title: 'Measuring Carbon with Our API',
      description: 'Integrate carbon measurement into your CI/CD pipeline. Learn to use Eco-CI for build-time emissions tracking.',
      duration: '1h 45m',
      modules: 4,
      completedModules: 0,
      level: 'Intermediate',
      tags: ['API', 'CI/CD', 'Automation'],
      instructor: 'GreenWeb Team',
    },
    {
      id: 'frontend-optimization',
      title: 'Frontend Carbon Optimization',
      description: 'Master image optimization (WebP/AVIF), lazy loading, dark mode for OLED savings, and font subsetting techniques.',
      duration: '3h 15m',
      modules: 6,
      completedModules: 2,
      level: 'Intermediate',
      tags: ['Frontend', 'Performance', 'Images'],
      instructor: 'GreenWeb Team',
    },
    {
      id: 'green-backend',
      title: 'Green Backend Architecture',
      description: 'Static vs. dynamic sites, time-shifting workloads to green grid periods, serverless efficiency patterns.',
      duration: '2h 45m',
      modules: 5,
      completedModules: 0,
      level: 'Advanced',
      tags: ['Backend', 'Architecture', 'Serverless'],
      instructor: 'GreenWeb Team',
    },
    {
      id: 'sci-deep-dive',
      title: 'SCI Specification Deep Dive',
      description: 'Master the Software Carbon Intensity formula. Separate operational and embodied emissions for accurate reporting.',
      duration: '2h',
      modules: 4,
      completedModules: 0,
      level: 'Advanced',
      tags: ['SCI', 'Metrics', 'Reporting'],
      instructor: 'Green Software Foundation',
    },
  ];

  const attorneyCourses: Course[] = [
    {
      id: 'regulatory-landscape',
      title: 'The Regulatory Landscape',
      description: 'EU CSRD, California SB 253, and emerging digital emissions reporting requirements. Scope 1, 2, and 3 obligations.',
      duration: '3h',
      modules: 5,
      completedModules: 0,
      level: 'Beginner',
      tags: ['CSRD', 'SB 253', 'Compliance'],
      cle: true,
      instructor: 'Environmental Law Institute',
    },
    {
      id: 'greenwashing-litigation',
      title: 'Avoiding Greenwashing Litigation',
      description: 'Legal risks of unsubstantiated eco-friendly claims. Canada Bill C-59, EU Green Claims Directive, FTC Green Guides.',
      duration: '2h 30m',
      modules: 4,
      completedModules: 1,
      level: 'Intermediate',
      tags: ['Greenwashing', 'Litigation', 'Risk'],
      cle: true,
      instructor: 'Environmental Law Institute',
    },
    {
      id: 'sustainability-contracts',
      title: 'Contracting for Sustainability',
      description: 'Draft supplier standards requiring carbon disclosure. SLAs with SCI score requirements. Vendor audit clauses.',
      duration: '2h 15m',
      modules: 4,
      completedModules: 0,
      level: 'Intermediate',
      tags: ['Contracts', 'SLAs', 'Vendors'],
      cle: true,
      instructor: 'GreenWeb Legal Team',
    },
    {
      id: 'ip-open-source',
      title: 'IP & Open Source Green Tools',
      description: 'Licensing considerations for open-source sustainability tools (Apache 2.0, MIT). Liability for AI-driven carbon decisions.',
      duration: '1h 45m',
      modules: 3,
      completedModules: 0,
      level: 'Advanced',
      tags: ['Open Source', 'Licensing', 'IP'],
      cle: true,
      instructor: 'GreenWeb Legal Team',
    },
    {
      id: 'scope3-supply-chain',
      title: 'Scope 3 & Digital Supply Chains',
      description: 'How cloud providers, CDNs, and SaaS fit into Scope 3. Due diligence requirements for digital vendors.',
      duration: '2h',
      modules: 4,
      completedModules: 0,
      level: 'Advanced',
      tags: ['Scope 3', 'Supply Chain', 'Due Diligence'],
      cle: true,
      instructor: 'Environmental Law Institute',
    },
  ];

  const courses = selectedTrack === 'developer' ? developerCourses : attorneyCourses;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-500';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-500';
      case 'Advanced': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Track Selector */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Learning Hub</h2>
              <p className="text-muted-foreground">
                Master digital sustainability through expert-led courses
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedTrack === 'developer' ? 'default' : 'outline'}
                onClick={() => setSelectedTrack('developer')}
                className="gap-2"
              >
                <Code className="w-4 h-4" />
                For Developers
              </Button>
              <Button
                variant={selectedTrack === 'attorney' ? 'default' : 'outline'}
                onClick={() => setSelectedTrack('attorney')}
                className="gap-2"
              >
                <Scale className="w-4 h-4" />
                For Attorneys
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Track Description */}
      <motion.div
        key={selectedTrack}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`border-2 ${selectedTrack === 'developer' ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-purple-500/30 bg-purple-500/5'}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedTrack === 'developer' ? 'bg-cyan-500/20' : 'bg-purple-500/20'}`}>
                {selectedTrack === 'developer' ? (
                  <Code className="w-6 h-6 text-cyan-500" />
                ) : (
                  <Briefcase className="w-6 h-6 text-purple-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  {selectedTrack === 'developer' ? 'Developer Track' : 'Attorney Track (CLE)'}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {selectedTrack === 'developer' 
                    ? 'Practical implementation, green coding patterns, and CI/CD integration for building sustainable software.'
                    : 'Regulatory compliance, greenwashing prevention, and sustainability contract drafting. Approved for CLE credits.'
                  }
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <BookOpen className="w-3 h-3" />
                    {courses.length} Courses
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {courses.reduce((acc, c) => acc + parseFloat(c.duration), 0).toFixed(0)}+ Hours
                  </Badge>
                  {selectedTrack === 'attorney' && (
                    <Badge className="gap-1 bg-purple-500/20 text-purple-500">
                      <Award className="w-3 h-3" />
                      CLE Approved
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass border-border/50 h-full hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                      {course.cle && (
                        <Badge className="bg-purple-500/20 text-purple-500 gap-1">
                          <GraduationCap className="w-3 h-3" />
                          CLE
                        </Badge>
                      )}
                    </div>
                  </div>
                  {course.completedModules === course.modules ? (
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ) : course.completedModules > 0 ? (
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-yellow-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Play className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {course.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{course.completedModules}/{course.modules} modules</span>
                  </div>
                  <Progress 
                    value={(course.completedModules / course.modules) * 100}
                    className="h-2"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    {course.completedModules > 0 ? 'Continue' : 'Start'}
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Resources Section */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Green Software Patterns",
                description: "Catalog of patterns for building carbon-efficient software",
                url: "https://patterns.greensoftware.foundation/",
                icon: Leaf,
              },
              {
                title: "CO2.js Library",
                description: "Open source library for estimating digital emissions",
                url: "https://github.com/thegreenwebfoundation/co2.js",
                icon: Code,
              },
              {
                title: "SCI Specification",
                description: "Official Software Carbon Intensity standard",
                url: "https://sci.greensoftware.foundation/",
                icon: Award,
              },
            ].map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
              >
                <resource.icon className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-medium mb-1">{resource.title}</h4>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityLearningHub;
