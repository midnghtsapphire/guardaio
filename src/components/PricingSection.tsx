import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Stripe price IDs
const STRIPE_PRICES = {
  pro: "price_1Sw3c3PQSlgZ7ZKjvE0B53fR", // $29/month Pro plan
};

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
    priceId: null,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals and journalists",
    features: [
      "Unlimited analyses",
      "Desktop app access",
      "Advanced detection models",
      "Priority support",
      "Detailed reports",
      "API access (100 calls/day)",
      "Batch analysis",
      "Voice clone detection",
    ],
    cta: "Subscribe Now",
    popular: true,
    priceId: STRIPE_PRICES.pro,
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
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
    priceId: null,
  },
];

const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!plan.priceId) {
      if (plan.name === "Free") {
        navigate("/auth");
      } else {
        navigate("/contact");
      }
      return;
    }

    if (!user) {
      toast.info("Please sign in to subscribe");
      navigate("/auth");
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: plan.priceId,
          tier: plan.name.toLowerCase(),
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

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
          <Badge variant="outline" className="mb-4 gap-2">
            <CreditCard className="w-4 h-4" />
            Powered by Stripe
          </Badge>
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
                onClick={() => handleSubscribe(plan)}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  plan.cta
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
