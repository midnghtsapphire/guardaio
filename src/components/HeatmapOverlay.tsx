import { motion } from "framer-motion";

export type HeatmapRegion = {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  width: number; // 0-100 percentage
  height: number; // 0-100 percentage
  intensity: number; // 0-1 (0 = low suspicion, 1 = high suspicion)
  label: string;
};

interface HeatmapOverlayProps {
  imageUrl: string;
  regions: HeatmapRegion[];
  className?: string;
}

const getIntensityColor = (intensity: number): string => {
  // Interpolate from green (safe) through yellow (warning) to red (danger)
  if (intensity < 0.4) {
    // Green to yellow
    const t = intensity / 0.4;
    const r = Math.round(255 * t);
    const g = 255;
    return `rgba(${r}, ${g}, 0, 0.4)`;
  } else if (intensity < 0.7) {
    // Yellow to orange
    const t = (intensity - 0.4) / 0.3;
    const r = 255;
    const g = Math.round(255 - (100 * t));
    return `rgba(${r}, ${g}, 0, 0.5)`;
  } else {
    // Orange to red
    const t = (intensity - 0.7) / 0.3;
    const r = 255;
    const g = Math.round(155 - (155 * t));
    return `rgba(${r}, ${g}, 0, 0.6)`;
  }
};

const getBorderColor = (intensity: number): string => {
  if (intensity < 0.4) return "border-green-500/60";
  if (intensity < 0.7) return "border-yellow-500/60";
  return "border-red-500/60";
};

const HeatmapOverlay = ({ imageUrl, regions, className = "" }: HeatmapOverlayProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Original image */}
      <img
        src={imageUrl}
        alt="Analyzed image"
        className="w-full h-auto"
      />
      
      {/* Heatmap overlay container */}
      <div className="absolute inset-0">
        {regions.map((region, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            className={`absolute border-2 ${getBorderColor(region.intensity)} rounded-md cursor-pointer group`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
              background: getIntensityColor(region.intensity),
            }}
          >
            {/* Pulsing border effect for high intensity regions */}
            {region.intensity >= 0.7 && (
              <motion.div
                className="absolute inset-0 border-2 border-red-500 rounded-md"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                <p className="text-xs font-medium">{region.label}</p>
                <p className="text-[10px] text-muted-foreground">
                  Suspicion: {Math.round(region.intensity * 100)}%
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border"
      >
        <p className="text-[10px] font-medium mb-1.5 text-muted-foreground">Detection Intensity</p>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-500/50" />
          <div className="w-3 h-3 rounded-sm bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-sm bg-orange-500/50" />
          <div className="w-3 h-3 rounded-sm bg-red-500/50" />
        </div>
        <div className="flex justify-between text-[8px] text-muted-foreground mt-0.5">
          <span>Low</span>
          <span>High</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeatmapOverlay;
