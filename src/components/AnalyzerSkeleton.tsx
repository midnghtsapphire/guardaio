import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const AnalyzerSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 mt-6"
    >
      {/* Result header skeleton */}
      <div className="rounded-xl p-6 glass border border-border/50">
        <div className="flex items-center gap-4">
          {/* Status icon skeleton */}
          <Skeleton className="w-14 h-14 rounded-full" />
          
          <div className="flex-1 space-y-2">
            {/* Status text skeleton */}
            <Skeleton className="h-7 w-48" />
            {/* Confidence skeleton */}
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Confidence badge skeleton */}
          <Skeleton className="h-16 w-16 rounded-xl" />
        </div>
      </div>

      {/* Findings skeleton */}
      <div className="rounded-xl p-4 glass border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-5 w-24" />
        </div>
        
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2"
            >
              <Skeleton className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" />
              <Skeleton 
                className="h-4 rounded" 
                style={{ width: `${60 + Math.random() * 30}%` }} 
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>

      {/* Shimmer animation overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.05) 50%, transparent 100%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default AnalyzerSkeleton;
