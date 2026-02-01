import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Apple, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const MobileInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if already installed as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not dismissed before
      const dismissed = localStorage.getItem('pwaPromptDismissed');
      if (!dismissed && isMobile) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show iOS prompt if on iOS and not installed
    if (ios && !standalone && isMobile) {
      const dismissed = localStorage.getItem('pwaPromptDismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [isMobile]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  // Don't show if already installed or on desktop
  if (isStandalone || !isMobile || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <Card className="glass border-border/50 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                {isIOS ? (
                  <Apple className="w-6 h-6 text-primary" />
                ) : (
                  <Smartphone className="w-6 h-6 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Install DeepGuard App</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {isIOS 
                    ? "Tap Share → Add to Home Screen to install"
                    : "Get the full app experience on your device"
                  }
                </p>
                
                <div className="flex gap-2">
                  {!isIOS && deferredPrompt && (
                    <Button size="sm" onClick={handleInstall} className="gap-2">
                      <Download className="w-4 h-4" />
                      Install
                    </Button>
                  )}
                  {isIOS && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                      <span>Tap</span>
                      <div className="w-5 h-5 bg-primary/20 rounded flex items-center justify-center">
                        <Chrome className="w-3 h-3" />
                      </div>
                      <span>then "Add to Home Screen"</span>
                    </div>
                  )}
                  <Button size="sm" variant="ghost" onClick={handleDismiss}>
                    Not now
                  </Button>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileInstallPrompt;
