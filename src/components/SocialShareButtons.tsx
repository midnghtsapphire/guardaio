import { Twitter, Linkedin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialShareButtonsProps {
  title: string;
  text: string;
  url?: string;
  status: "safe" | "warning" | "danger";
  confidence: number;
}

const SocialShareButtons = ({
  title,
  text,
  url,
  status,
  confidence,
}: SocialShareButtonsProps) => {
  const shareUrl = url || window.location.href;
  
  const getStatusEmoji = () => {
    switch (status) {
      case "safe": return "✅";
      case "warning": return "⚠️";
      case "danger": return "🚨";
    }
  };

  const shareText = `${getStatusEmoji()} ${title} - ${text} (${confidence}% confidence)\n\nAnalyzed with Guardaio AI`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, "_blank", "width=550,height=420");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Guardaio Analysis Result",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log("Share cancelled or failed");
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleTwitterShare}
              className="h-9 w-9 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50"
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X (Twitter)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLinkedInShare}
              className="h-9 w-9 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/50"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        {typeof navigator !== "undefined" && navigator.share && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNativeShare}
                className="h-9 w-9"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SocialShareButtons;
