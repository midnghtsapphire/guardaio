import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle,
  FileCode,
  Eye,
  RefreshCw,
  Download,
  Filter,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnomalyRecord {
  id: string;
  anomaly_type: string;
  pattern_signature: string;
  pattern_data: unknown;
  occurrence_count: number;
  first_seen: string;
  last_seen: string;
  rarity_score: number | null;
  is_suspicious: boolean | null;
  detection_context: string | null;
  example_file_names: string[] | null;
  notes: string | null;
}

interface SoftwareSignature {
  id: string;
  software_name: string;
  signature_pattern: string;
  category: string;
  risk_level: string;
  description: string;
  occurrence_count: number;
  is_verified: boolean;
}

const MetadataAnomalyDashboard = () => {
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>([]);
  const [signatures, setSignatures] = useState<SoftwareSignature[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalPatterns: 0,
    suspiciousCount: 0,
    rareCount: 0,
    aiToolCount: 0,
    deepfakeToolCount: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch anomalies
      const { data: anomalyData } = await supabase
        .from('metadata_anomalies')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(100);

      // Fetch software signatures
      const { data: signatureData } = await supabase
        .from('known_software_signatures')
        .select('*')
        .order('occurrence_count', { ascending: false });

      if (anomalyData) {
        setAnomalies(anomalyData as AnomalyRecord[]);
        
        // Calculate stats
        setStats({
          totalPatterns: anomalyData.length,
          suspiciousCount: anomalyData.filter(a => a.is_suspicious === true).length,
          rareCount: anomalyData.filter(a => (a.rarity_score || 0) > 80).length,
          aiToolCount: anomalyData.filter(a => a.anomaly_type === 'software_ai').length,
          deepfakeToolCount: anomalyData.filter(a => a.anomaly_type === 'software_deepfake').length,
        });
      }

      if (signatureData) {
        setSignatures(signatureData as SoftwareSignature[]);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast.error('Failed to load metadata dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      anomalies,
      signatures,
      stats,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metadata-anomalies-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const filteredAnomalies = typeFilter === 'all' 
    ? anomalies 
    : anomalies.filter(a => a.anomaly_type === typeFilter);

  const anomalyTypes = [...new Set(anomalies.map(a => a.anomaly_type))];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai_generator': return 'text-purple-500 bg-purple-500/10';
      case 'deepfake_tool': return 'text-red-500 bg-red-500/10';
      case 'photo_editor': return 'text-yellow-500 bg-yellow-500/10';
      case 'camera': return 'text-green-500 bg-green-500/10';
      case 'screen_capture': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Metadata Anomaly Tracking
          </h2>
          <p className="text-muted-foreground">
            Track unusual patterns to improve detection accuracy
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <BarChart3 className="w-4 h-4" />
              Total Patterns
            </div>
            <p className="text-2xl font-bold mt-1">{stats.totalPatterns}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-500 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Suspicious
            </div>
            <p className="text-2xl font-bold mt-1">{stats.suspiciousCount}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-500 text-sm">
              <Sparkles className="w-4 h-4" />
              Rare (80%+)
            </div>
            <p className="text-2xl font-bold mt-1">{stats.rareCount}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-primary text-sm">
              <FileCode className="w-4 h-4" />
              AI Tools
            </div>
            <p className="text-2xl font-bold mt-1">{stats.aiToolCount}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <Eye className="w-4 h-4" />
              Deepfake Tools
            </div>
            <p className="text-2xl font-bold mt-1">{stats.deepfakeToolCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="anomalies">
        <TabsList>
          <TabsTrigger value="anomalies">Detected Anomalies</TabsTrigger>
          <TabsTrigger value="signatures">Software Signatures</TabsTrigger>
          <TabsTrigger value="insights">ML Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {anomalyTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {filteredAnomalies.length} patterns
            </span>
          </div>

          {/* Anomaly List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredAnomalies.map((anomaly, idx) => (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="p-4 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">
                        {anomaly.anomaly_type.replace(/_/g, ' ')}
                      </Badge>
                      <Badge 
                        variant={anomaly.is_suspicious === true ? 'destructive' : 'secondary'}
                      >
                        {anomaly.is_suspicious === true ? 'Suspicious' : 'Normal'}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary">
                        Rarity: {anomaly.rarity_score || 0}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Seen {anomaly.occurrence_count}x
                      </span>
                    </div>
                    <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto max-w-full">
                      {JSON.stringify(anomaly.pattern_data, null, 2)}
                    </pre>
                    {anomaly.example_file_names && anomaly.example_file_names.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Examples: {anomaly.example_file_names.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground shrink-0">
                    <p>First: {new Date(anomaly.first_seen).toLocaleDateString()}</p>
                    <p>Last: {new Date(anomaly.last_seen).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredAnomalies.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No anomalies detected yet. Analyze some media to start tracking patterns.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="signatures" className="space-y-4">
          <div className="grid gap-3">
            {signatures.map((sig, idx) => (
              <motion.div
                key={sig.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="p-4 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-4"
              >
                <div className={`p-2 rounded-lg ${getCategoryColor(sig.category)}`}>
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{sig.software_name}</span>
                    {sig.is_verified && (
                      <Badge variant="outline" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{sig.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pattern: <code className="bg-secondary px-1 rounded">{sig.signature_pattern}</code>
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={getRiskColor(sig.risk_level) as any}>
                    {sig.risk_level} risk
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sig.category.replace(/_/g, ' ')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                ML Training Insights
              </CardTitle>
              <CardDescription>
                How tracked patterns improve detection accuracy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Pattern Distribution</h4>
                  {anomalyTypes.map(type => {
                    const count = anomalies.filter(a => a.anomaly_type === type).length;
                    const percentage = (count / anomalies.length) * 100 || 0;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{type.replace(/_/g, ' ')}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Detection Context Distribution</h4>
                  {['deepfake', 'authentic', 'unknown'].map(ctx => {
                    const count = anomalies.filter(a => a.detection_context === ctx).length;
                    const percentage = (count / anomalies.length) * 100 || 0;
                    return (
                      <div key={ctx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{ctx}</span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className={`h-1.5 ${ctx === 'deepfake' ? '[&>div]:bg-destructive' : ctx === 'authentic' ? '[&>div]:bg-green-500' : ''}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium mb-2">Accuracy Improvement Potential</h4>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.totalPatterns} tracked patterns:
                </p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• {stats.rareCount} rare patterns help identify novel manipulation techniques</li>
                  <li>• {stats.aiToolCount} AI tool signatures enable instant detection</li>
                  <li>• {stats.deepfakeToolCount} deepfake tool markers flag high-risk content</li>
                  <li>• Continuous learning from {stats.suspiciousCount} suspicious patterns</li>
                </ul>
                <p className="text-sm font-medium text-primary mt-3">
                  Estimated accuracy boost: +{Math.min(15, Math.floor(stats.totalPatterns / 10))}% with current data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MetadataAnomalyDashboard;
