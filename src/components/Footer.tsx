import { motion } from "framer-motion";
import { Shield, Github, Twitter, Linkedin, RotateCcw } from "lucide-react";
import { restartOnboardingTour } from "@/components/OnboardingTour";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: ["Features", "Pricing", "Browser Extension", "Desktop App", "API"],
    company: ["About", "Blog", "Careers", "Press Kit", "Contact"],
    resources: ["Documentation", "Help Center", "Community", "Status", "Security"],
    legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  };

  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">DeepGuard</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Protecting truth in the age of AI. Advanced deepfake detection for everyone.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center glass-hover transition-all"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map(([title, items], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-display font-semibold mb-4 capitalize">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} DeepGuard. All rights reserved.
          </p>
          <button
            onClick={restartOnboardingTour}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Tour
          </button>
          <p className="text-sm text-muted-foreground">
            Made with care to protect truth online.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
