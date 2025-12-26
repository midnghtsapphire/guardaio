import { motion } from "framer-motion";
import { Shield, Zap, Brain, Eye, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-glow" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">AI-Powered Detection</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Detect{" "}
            <span className="text-gradient">Deepfakes</span>
            <br />
            in Real-Time
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Protect yourself from AI-generated manipulation with our advanced detection technology. 
            Analyze images, videos, and audio instantly.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button variant="hero" size="xl">
              <Upload className="w-5 h-5" />
              Start Analyzing
            </Button>
            <Button variant="glass" size="xl">
              Learn More
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {[
              { icon: Shield, value: "99.7%", label: "Accuracy" },
              { icon: Zap, value: "<2s", label: "Analysis Time" },
              { icon: Brain, value: "50M+", label: "Files Analyzed" },
              { icon: Eye, value: "24/7", label: "Real-time Protection" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass rounded-xl p-6 glass-hover cursor-default"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
