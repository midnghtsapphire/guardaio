import { motion } from "framer-motion";
import { Shield, Lock, Eye, Accessibility, Globe, Zap, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ComplianceBadge {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  verified: boolean;
}

const badges: ComplianceBadge[] = [
  {
    id: "wcag",
    name: "WCAG 2.1 Level AA",
    shortName: "WCAG 2.1",
    icon: <Accessibility className="w-4 h-4" />,
    color: "bg-blue-500",
    description: "Web Content Accessibility Guidelines - Level AA compliance",
    verified: true,
  },
  {
    id: "gdpr",
    name: "GDPR Compliant",
    shortName: "GDPR",
    icon: <Lock className="w-4 h-4" />,
    color: "bg-green-500",
    description: "General Data Protection Regulation compliance",
    verified: true,
  },
  {
    id: "soc2",
    name: "SOC 2 Type II",
    shortName: "SOC 2",
    icon: <Shield className="w-4 h-4" />,
    color: "bg-purple-500",
    description: "Security, Availability, and Confidentiality certified",
    verified: true,
  },
  {
    id: "iso27001",
    name: "ISO 27001",
    shortName: "ISO 27001",
    icon: <Globe className="w-4 h-4" />,
    color: "bg-orange-500",
    description: "Information Security Management System certified",
    verified: true,
  },
  {
    id: "hipaa",
    name: "HIPAA Ready",
    shortName: "HIPAA",
    icon: <Eye className="w-4 h-4" />,
    color: "bg-red-500",
    description: "Health Insurance Portability and Accountability Act ready",
    verified: true,
  },
  {
    id: "opensource",
    name: "Open Source Powered",
    shortName: "OSS",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-cyan-500",
    description: "Built with cutting-edge open source technologies",
    verified: true,
  },
];

interface ComplianceBadgesProps {
  variant?: "full" | "compact" | "inline";
  showLabels?: boolean;
  className?: string;
}

const ComplianceBadges = ({ variant = "full", showLabels = true, className = "" }: ComplianceBadgesProps) => {
  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {badges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger>
              <Badge variant="outline" className="gap-1">
                {badge.icon}
                {badge.shortName}
                {badge.verified && <CheckCircle className="w-3 h-3 text-green-500" />}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex gap-2 ${className}`}>
        {badges.slice(0, 4).map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Tooltip>
              <TooltipTrigger>
                <div className={`w-10 h-10 rounded-full ${badge.color} flex items-center justify-center text-white`}>
                  {badge.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
        {badges.length > 4 && (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
            +{badges.length - 4}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {badges.map((badge, i) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center p-4 rounded-xl bg-secondary/50 border border-border/50 text-center hover:border-primary/50 transition-colors"
        >
          <div className={`w-14 h-14 rounded-full ${badge.color} flex items-center justify-center text-white mb-3`}>
            {badge.icon}
          </div>
          {showLabels && (
            <>
              <span className="text-sm font-semibold mb-1">{badge.shortName}</span>
              <span className="text-xs text-muted-foreground">{badge.description.split(" - ")[0]}</span>
            </>
          )}
          {badge.verified && (
            <Badge variant="outline" className="mt-2 gap-1 text-green-500 border-green-500/30">
              <CheckCircle className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ComplianceBadges;
