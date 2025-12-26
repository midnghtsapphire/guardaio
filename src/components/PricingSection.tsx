import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for occasional use",
    features: [
      "10 analyses per month",
      "Browser extension",
      "Basic detection models",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For professionals and journalists",
    features: [
      "Unlimited analyses",
      "Desktop app access",
      "Advanced detection models",
      "Priority support",
      "Detailed reports",
      "API access (100 calls/day)",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per month",
    description: "For newsrooms and organizations",
    features: [
      "Everything in Pro",
      "Unlimited API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] gradient-glow" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular
                  ? "glass border-2 border-primary shadow-glow"
                  : "glass"
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "glass"}
                className="w-full"
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
