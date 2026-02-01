import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { keyboardShortcutsList } from "@/hooks/use-keyboard-shortcuts";

const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="glass"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-glow"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Shortcuts Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2 pr-4">
              {keyboardShortcutsList.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                    {shortcut.key}
                  </kbd>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
          <p className="text-xs text-muted-foreground mt-2">
            Press <kbd className="px-1 py-0.5 text-xs font-mono bg-muted rounded border border-border">?</kbd> anywhere to toggle this dialog
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KeyboardShortcutsHelp;
