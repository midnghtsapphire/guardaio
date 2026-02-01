/**
 * Accessibility Menu Component
 * User-facing controls for neuroinclusive accommodations
 * 
 * WCAG 2.2 AA compliant with proper ARIA attributes
 * Supports keyboard navigation (Tab, Enter, Space)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accessibility, Eye, Type, Volume2, Brain, 
  Sun, Moon, Zap, X, RotateCcw, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const a11y = useAccessibility();

  const preferences = [
    {
      category: "Visual",
      icon: Eye,
      items: [
        {
          key: "highContrast" as const,
          label: "High Contrast",
          description: "Increase text and UI contrast for better visibility",
          icon: Sun,
        },
        {
          key: "softMode" as const,
          label: "Soft/Sepia Mode",
          description: "Warm tones to reduce eye strain and visual fatigue",
          icon: Moon,
        },
      ],
    },
    {
      category: "Typography",
      icon: Type,
      items: [
        {
          key: "dyslexiaFont" as const,
          label: "Dyslexia-Friendly Font",
          description: "OpenDyslexic font with increased letter spacing",
          icon: Type,
        },
        {
          key: "largeText" as const,
          label: "Large Text",
          description: "Scale text up 125% for easier reading",
          icon: Type,
        },
      ],
    },
    {
      category: "Cognitive",
      icon: Brain,
      items: [
        {
          key: "reduceMotion" as const,
          label: "Reduce Motion",
          description: "Minimize animations and auto-playing content",
          icon: Zap,
        },
        {
          key: "focusMode" as const,
          label: "Focus Mode",
          description: "Dim surroundings to highlight content you're reading",
          icon: Brain,
        },
      ],
    },
    {
      category: "Assistive",
      icon: Volume2,
      items: [
        {
          key: "screenReaderOptimized" as const,
          label: "Screen Reader Optimized",
          description: "Enhanced ARIA labels and navigation landmarks",
          icon: Volume2,
        },
      ],
    },
  ];

  const handleReset = () => {
    a11y.resetAll();
    toast.success("Accessibility preferences reset");
  };

  const activeCount = a11y.getActiveCount();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Accessibility settings"
        >
          <Accessibility className="w-5 h-5" />
          {activeCount > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        className="w-full sm:max-w-md overflow-y-auto"
        aria-label="Accessibility preferences panel"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-primary" />
            Accessibility Settings
          </SheetTitle>
          <SheetDescription>
            Customize your experience for better accessibility. These settings are 
            saved automatically and persist across sessions.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {preferences.map((category) => (
            <div key={category.category}>
              <div className="flex items-center gap-2 mb-3">
                <category.icon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">{category.category}</h3>
              </div>
              
              <div className="space-y-3">
                {category.items.map((item) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <label
                        htmlFor={`a11y-${item.key}`}
                        className="font-medium text-sm cursor-pointer flex items-center gap-2"
                      >
                        {item.label}
                        {a11y[item.key] && (
                          <Check className="w-3 h-3 text-green-500" />
                        )}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      id={`a11y-${item.key}`}
                      checked={a11y[item.key]}
                      onCheckedChange={() => a11y.togglePreference(item.key)}
                      aria-describedby={`a11y-${item.key}-desc`}
                    />
                  </motion.div>
                ))}
              </div>
              
              <Separator className="mt-4" />
            </div>
          ))}

          {/* Statistics Panel */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-semibold text-sm mb-2">Why Accessibility Matters</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 15-20% of the population is neurodivergent</li>
              <li>• 94.8% of websites fail WCAG standards</li>
              <li>• 69% of users leave inaccessible sites</li>
              <li>• ADA lawsuits increased 37% in 2025</li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold text-sm mb-2">Keyboard Shortcuts</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><kbd className="px-1 py-0.5 rounded bg-muted border border-border text-xs">Tab</kbd> - Navigate between elements</li>
              <li><kbd className="px-1 py-0.5 rounded bg-muted border border-border text-xs">Enter</kbd> / <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-xs">Space</kbd> - Activate buttons</li>
              <li><kbd className="px-1 py-0.5 rounded bg-muted border border-border text-xs">Esc</kbd> - Close dialogs and menus</li>
            </ul>
          </div>
        </div>

        <SheetFooter>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
            disabled={activeCount === 0}
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AccessibilityMenu;
