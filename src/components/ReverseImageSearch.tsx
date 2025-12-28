import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Image, ExternalLink, Loader2, Globe, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

type SearchMatch = {
  url: string;
  title: string;
  description: string;
  source: string;
};

type ManualSearchLink = {
  name: string;
  url: string;
  icon: string;
};

type ImageAnalysis = {
  searchTerms: string;
  description: string;
  recognizedPeople: string[];
  possibleSources: string[];
  distinctiveElements: string[];
};

type ReverseSearchResult = {
  success: boolean;
  searchTerms: string;
  imageAnalysis: ImageAnalysis | null;
  matches: SearchMatch[];
  matchCount: number;
  manualSearchLinks: ManualSearchLink[];
  summary: string;
};

interface ReverseImageSearchProps {
  initialImageUrl?: string;
  onClose?: () => void;
}

const ReverseImageSearch = ({ initialImageUrl, onClose }: ReverseImageSearchProps) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [searching, setSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ReverseSearchResult | null>(null);
  const [autoSearchTriggered, setAutoSearchTriggered] = useState(false);

  // Auto-trigger search when external URL is provided (from bookmarklet)
  useEffect(() => {
    if (initialImageUrl && !autoSearchTriggered && !searching) {
      setAutoSearchTriggered(true);
      // Delay to let the UI render first
      setTimeout(() => {
        performSearch();
      }, 500);
    }
  }, [initialImageUrl, autoSearchTriggered, searching]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Please use an image under 5MB.");
      return;
    }

    setImageFile(file);
    setImageUrl("");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setImageFile(null);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageUrl("");
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const performSearch = async () => {
    if (!imageUrl && !imageFile) {
      return;
    }

    setSearching(true);
    setProgress(0);
    setResult(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 10 + 3;
      });
    }, 500);

    try {
      let body: any = {};
      
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        body.imageBase64 = base64;
      } else if (imageUrl) {
        body.imageUrl = imageUrl;
      }

      const { data, error } = await supabase.functions.invoke("reverse-image-search", {
        body,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data as ReverseSearchResult);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Reverse image search error:", error);
      alert(error instanceof Error ? error.message : "Search failed");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-full flex items-center justify-center glass"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <Search className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-display text-lg font-semibold">
                Reverse Image Search
              </h3>
              <p className="text-muted-foreground text-sm">
                Find where images appear online
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Image input options */}
        <div className="space-y-4">
          {/* URL input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Paste image URL..."
                className="pl-10"
                disabled={searching || !!imageFile}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* File upload */}
          <div className="flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={searching}
              />
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {imageFile ? imageFile.name : "Upload an image"}
                </span>
              </div>
            </label>
          </div>

          {/* Image preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <div className="rounded-lg overflow-hidden border border-border max-h-40 flex items-center justify-center bg-muted/20">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-40 object-contain"
                    onError={() => setImagePreview(null)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 bg-background/80"
                  onClick={clearImage}
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search button */}
          <Button
            onClick={performSearch}
            disabled={searching || (!imageUrl && !imageFile)}
            className="w-full"
          >
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search for this image
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Progress */}
      <AnimatePresence>
        {searching && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Analyzing and searching...</span>
              <span className="font-mono text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Finding matches across the web...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !searching && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div className={`glass rounded-xl p-4 border ${
              result.matchCount > 5 
                ? "border-warning/30 bg-warning/5" 
                : result.matchCount > 0 
                ? "border-primary/30" 
                : "border-success/30 bg-success/5"
            }`}>
              <div className="flex items-start gap-3">
                {result.matchCount > 5 ? (
                  <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                ) : result.matchCount > 0 ? (
                  <Search className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-sm">{result.summary}</p>
                  {result.searchTerms && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Search terms: "{result.searchTerms}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {result.imageAnalysis && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" />
                  Image Analysis
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{result.imageAnalysis.description}</p>
                  
                  {result.imageAnalysis.recognizedPeople?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs text-muted-foreground">People:</span>
                      {result.imageAnalysis.recognizedPeople.map((person, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {person}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {result.imageAnalysis.distinctiveElements?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs text-muted-foreground">Elements:</span>
                      {result.imageAnalysis.distinctiveElements.map((elem, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {elem}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Found matches */}
            {result.matches.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Found Online ({result.matchCount})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.matches.map((match, i) => (
                    <motion.a
                      key={i}
                      href={match.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {match.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {match.source}
                          </p>
                          {match.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {match.description}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Manual search links */}
            {result.manualSearchLinks.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3">
                  Search manually on:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.manualSearchLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-sm transition-colors"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReverseImageSearch;
