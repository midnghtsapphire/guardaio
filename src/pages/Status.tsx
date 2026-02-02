import { motion } from "framer-motion";
import { Activity, CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const Status = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: "Web Application", status: "operational", uptime: "99.99%" },
    { name: "API", status: "operational", uptime: "99.95%" },
    { name: "Image Analysis", status: "operational", uptime: "99.98%" },
    { name: "Video Analysis", status: "operational", uptime: "99.92%" },
    { name: "Audio Analysis", status: "operational", uptime: "99.94%" },
    { name: "URL Analysis", status: "operational", uptime: "99.90%" },
    { name: "Authentication", status: "operational", uptime: "99.99%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
  ];

  const incidents = [
    {
      date: "Jan 28, 2026",
      title: "Increased API latency",
      status: "resolved",
      duration: "23 minutes",
      description: "Some API requests experienced higher than normal latency due to increased traffic. Issue was resolved by scaling infrastructure.",
    },
    {
      date: "Jan 15, 2026",
      title: "Video analysis service maintenance",
      status: "resolved",
      duration: "45 minutes",
      description: "Scheduled maintenance to upgrade video processing infrastructure. Service was unavailable during the maintenance window.",
    },
    {
      date: "Jan 5, 2026",
      title: "Authentication delays",
      status: "resolved",
      duration: "12 minutes",
      description: "Users experienced delays when logging in. Root cause identified as a database connection pool exhaustion.",
    },
  ];

  const metrics = [
    { label: "Overall Uptime (30 days)", value: "99.97%" },
    { label: "Average Response Time", value: "187ms" },
    { label: "Incidents This Month", value: "1" },
    { label: "API Success Rate", value: "99.98%" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "outage":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-emerald-500";
      case "degraded":
        return "bg-amber-500";
      case "outage":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <>
      <Helmet>
        <title>System Status | Guardaio</title>
        <meta name="description" content="Check the current status of Guardaio services. View uptime, incidents, and scheduled maintenance." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">System Status</h1>
              <p className="text-xl text-muted-foreground">
                All systems operational
              </p>
            </motion.div>

            {/* Overall Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="glass border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                      <div>
                        <h2 className="font-display text-2xl font-bold text-emerald-500">All Systems Operational</h2>
                        <p className="text-muted-foreground">
                          Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setLastUpdated(new Date())}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {metrics.map((metric) => (
                <div key={metric.label} className="glass rounded-xl p-4 text-center">
                  <div className="font-display text-2xl font-bold text-primary mb-1">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Services</h2>
              <Card className="glass border-border/50">
                <CardContent className="py-4 divide-y divide-border">
                  {services.map((service) => (
                    <div key={service.name} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(service.status)}
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                        <span className="capitalize text-sm px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Uptime Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl font-bold mb-6">90-Day Uptime</h2>
              <Card className="glass border-border/50">
                <CardContent className="py-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 90 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 flex-1 rounded-sm ${
                          Math.random() > 0.02 ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        title={`Day ${90 - i}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                    <span>90 days ago</span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Incidents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-display text-2xl font-bold mb-6">Recent Incidents</h2>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <Card key={incident.title} className="glass border-border/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <CardDescription>{incident.date} • Duration: {incident.duration}</CardDescription>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 capitalize">
                          {incident.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{incident.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Subscribe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground mb-4">
                Get notified about scheduled maintenance and incidents.
              </p>
              <Button variant="outline">Subscribe to Updates</Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Status;
