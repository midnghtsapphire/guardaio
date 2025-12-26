import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  Brain, 
  Eye, 
  Globe, 
  Lock,
  Layers,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Multi-Model Detection",
    description: "Ensemble of CNN and RNN models trained on millions of deepfake samples for maximum accuracy.",
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Get instant results with our optimized inference pipeline. Most analyses complete in under 2 seconds.",
  },
  {
    icon: Brain,
    title: "Deep Learning Powered",
    description: "State-of-the-art neural networks including EfficientNet and ResNet for image analysis.",
  },
  {
    icon: Eye,
    title: "Visual Explanation",
    description: "Understand exactly why content was flagged with highlighted artifacts and inconsistencies.",
  },
  {
    icon: Globe,
    title: "Browser Extension",
    description: "Analyze media directly on Twitter, Facebook, TikTok, and YouTube without leaving the page.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your files are analyzed and immediately deleted. We never store or share your content.",
  },
  {
    icon: Layers,
    title: "Multi-Format Support",
    description: "Analyze images, videos, and audio files. Detect face swaps, voice cloning, and more.",
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    description: "Get comprehensive analysis reports with confidence scores and technical breakdowns.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Advanced <span className="text-gradient">Detection</span> Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Cutting-edge AI technology to protect you from misinformation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full glass rounded-2xl p-6 glass-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
