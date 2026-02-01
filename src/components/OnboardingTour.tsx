import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Shield, 
  Upload, 
  Keyboard, 
  Sparkles,
  BarChart3,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  target: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: "top" | "bottom" | "left" | "right" | "center";
}

const tourSteps: TourStep[] = [
  {
    target: "#hero",
    title: "Welcome to DeepGuard",
    description: "Your AI-powered shield against deepfakes and disinformation. Let's take a quick tour of the key features.",
    icon: <Shield className="w-6 h-6" />,
    position: "center",
  },
  {
    target: "#analyzer",
    title: "Powerful Analysis Tools",
    description: "Upload images, videos, or audio files to detect AI-generated manipulation. Choose from 6 analysis modes including batch processing and URL analysis.",
    icon: <Upload className="w-6 h-6" />,
    position: "top",
  },
  {
    target: "#features",
    title: "Advanced Detection",
    description: "Our AI analyzes multiple signals including facial inconsistencies, audio artifacts, and metadata anomalies to identify synthetic content.",
    icon: <Sparkles className="w-6 h-6" />,
    position: "top",
  },
  {
    target: "#analyzer",
    title: "Visual Heatmaps",
    description: "See exactly where manipulation was detected with our interactive heatmap overlay. Adjust sensitivity to fine-tune detection thresholds.",
    icon: <BarChart3 className="w-6 h-6" />,
    position: "top",
  },
  {
    target: "#pricing",
    title: "Share & Export",
    description: "Generate detailed PDF reports and share analysis results with colleagues. Perfect for journalists, researchers, and security teams.",
    icon: <Share2 className="w-6 h-6" />,
    position: "top",
  },
  {
    target: "body",
    title: "Keyboard Shortcuts",
    description: "Press ? anytime to see all keyboard shortcuts. Use 1-6 to switch modes, H for heatmap, and Ctrl+E to export reports.",
    icon: <Keyboard className="w-6 h-6" />,
    position: "center",
  },
];

const STORAGE_KEY = "deepguard_onboarding_complete";

const OnboardingTour = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      // Delay start to let page load
      const timer = setTimeout(() => setIsActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateTargetPosition = useCallback(() => {
    if (!isActive) return;
    
    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element && step.position !== "center") {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isActive]);

  useEffect(() => {
    updateTargetPosition();
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition);
    
    return () => {
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition);
    };
  }, [updateTargetPosition]);

  useEffect(() => {
    if (isActive) {
      const step = tourSteps[currentStep];
      const element = document.querySelector(step.target);
      if (element && step.position !== "center") {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Update position after scroll
        setTimeout(updateTargetPosition, 500);
      }
    }
  }, [currentStep, isActive, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsActive(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];
  const isCenter = step.position === "center" || !targetRect;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (isCenter || !targetRect) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 20;
    const tooltipWidth = 400;
    const tooltipHeight = 250;

    switch (step.position) {
      case "top":
        return {
          position: "fixed",
          top: Math.max(padding, targetRect.top - tooltipHeight - padding),
          left: Math.min(
            Math.max(padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2),
            window.innerWidth - tooltipWidth - padding
          ),
        };
      case "bottom":
        return {
          position: "fixed",
          top: Math.min(targetRect.bottom + padding, window.innerHeight - tooltipHeight - padding),
          left: Math.min(
            Math.max(padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2),
            window.innerWidth - tooltipWidth - padding
          ),
        };
      default:
        return {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Spotlight on target */}
          {targetRect && !isCenter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[101] rounded-xl ring-4 ring-primary/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
              style={{
                top: targetRect.top - 10,
                left: targetRect.left - 10,
                width: targetRect.width + 20,
                height: targetRect.height + 20,
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[102] w-[90vw] max-w-[400px] glass rounded-2xl p-6 shadow-2xl border border-primary/20"
            style={getTooltipStyle()}
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Skip tour"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
              {step.icon}
            </div>

            {/* Content */}
            <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-6 bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {tourSteps.length}
              </span>

              <Button
                variant="hero"
                size="sm"
                onClick={handleNext}
                className="gap-1"
              >
                {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
                {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;

// Export a function to restart the tour
export const restartOnboardingTour = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};
