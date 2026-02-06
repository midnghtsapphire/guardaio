/**
 * SecurityStatusBadge - Shows bot protection status in the analyzer
 * Displays remaining requests, protection status, and threat level
 */

import { Shield, ShieldCheck, ShieldAlert, ShieldOff, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SecurityStatusBadgeProps {
  isBlocked: boolean;
  remainingRequests: number;
  requiresChallenge?: boolean;
  confidence?: number;
  className?: string;
}

const SecurityStatusBadge = ({
  isBlocked,
  remainingRequests,
  requiresChallenge = false,
  confidence = 0,
  className,
}: SecurityStatusBadgeProps) => {
  const getStatus = () => {
    if (isBlocked) {
      return {
        icon: ShieldOff,
        label: "Blocked",
        variant: "destructive" as const,
        description: "Your access has been temporarily blocked due to suspicious activity",
      };
    }
    if (requiresChallenge) {
      return {
        icon: ShieldAlert,
        label: "Challenge Required",
        variant: "secondary" as const,
        description: "Additional verification needed to continue",
      };
    }
    if (remainingRequests < 10) {
      return {
        icon: ShieldAlert,
        label: `${remainingRequests} left`,
        variant: "secondary" as const,
        description: `Rate limit warning: ${remainingRequests} requests remaining this minute`,
      };
    }
    return {
      icon: ShieldCheck,
      label: "Protected",
      variant: "outline" as const,
      description: `Bot protection active • ${remainingRequests}/60 requests remaining`,
    };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={status.variant}
            className={cn(
              "gap-1.5 cursor-help transition-colors",
              status.variant === "destructive" && "animate-pulse",
              className
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs">{status.label}</span>
            {confidence > 30 && confidence < 75 && (
              <Activity className="w-3 h-3 ml-0.5 opacity-70" />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{status.description}</p>
            {confidence > 0 && (
              <p className="text-xs text-muted-foreground">
                Bot confidence: {confidence.toFixed(0)}%
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SecurityStatusBadge;
