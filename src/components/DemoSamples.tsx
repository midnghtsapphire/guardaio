import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Image as ImageIcon } from "lucide-react";
import testImageA from "@/assets/test-image-a.jpg";
import testImageB from "@/assets/test-image-b.jpg";

interface DemoSample {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  type: "authentic" | "manipulated";
}

const demoSamples: DemoSample[] = [
  {
    id: "sample-a",
    name: "Portrait Photo",
    description: "Test with an authentic photograph",
    imageSrc: testImageA,
    type: "authentic",
  },
  {
    id: "sample-b",
    name: "AI Generated",
    description: "Test with AI-generated content",
    imageSrc: testImageB,
    type: "manipulated",
  },
];

interface DemoSamplesProps {
  onSelectSample: (file: File) => void;
  disabled?: boolean;
}

const DemoSamples = ({ onSelectSample, disabled }: DemoSamplesProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSampleClick = async (sample: DemoSample) => {
    if (disabled || loadingId) return;

    setLoadingId(sample.id);

    try {
      // Fetch the image and convert to File
      const response = await fetch(sample.imageSrc);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, "-")}.jpg`, {
        type: "image/jpeg",
      });

      onSelectSample(file);
    } catch (error) {
      console.error("Error loading demo sample:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Or try a demo sample</span>
      </div>

      <div className="flex items-center justify-center gap-4">
        {demoSamples.map((sample, index) => (
          <motion.button
            key={sample.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSampleClick(sample)}
            disabled={disabled || loadingId !== null}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
              disabled || loadingId
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 cursor-pointer"
            } ${
              sample.type === "authentic"
                ? "border-success/30 bg-success/5"
                : "border-warning/30 bg-warning/5"
            }`}
          >
            {/* Image preview */}
            <div className="w-32 h-24 relative overflow-hidden">
              <img
                src={sample.imageSrc}
                alt={sample.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Loading overlay */}
              {loadingId === sample.id && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Type badge */}
              <div
                className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                  sample.type === "authentic"
                    ? "bg-success/90 text-success-foreground"
                    : "bg-warning/90 text-warning-foreground"
                }`}
              >
                {sample.type === "authentic" ? (
                  <Sparkles className="w-2.5 h-2.5" />
                ) : (
                  <AlertTriangle className="w-2.5 h-2.5" />
                )}
                {sample.type === "authentic" ? "Real" : "AI"}
              </div>
            </div>

            {/* Label */}
            <div className="p-2 text-center bg-card/50">
              <p className="text-xs font-medium truncate">{sample.name}</p>
              <p className="text-[10px] text-muted-foreground">{sample.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DemoSamples;
