import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Link as LinkIcon, DollarSign, Copy, Mail, CheckCircle, TrendingUp, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AffiliateData {
  id: string;
  affiliate_code: string;
  name: string;
  email: string;
  commission_rate: number;
  total_earnings: number;
  pending_payout: number;
  status: string;
}

const paymentTiers = [
  { amount: 100, label: "$100", description: "Starter payout" },
  { amount: 200, label: "$200", description: "Growth payout" },
  { amount: 300, label: "$300", description: "Pro payout" },
  { amount: 500, label: "$500", description: "Business payout" },
  { amount: 1000, label: "$1,000", description: "Enterprise payout" },
];

const AffiliateSystem = () => {
  const { user } = useAuth();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching affiliate data:", error);
      }

      setAffiliateData(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAffiliateLink = () => {
    if (!affiliateData) return "";
    return `${window.location.origin}?ref=${affiliateData.affiliate_code}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generateAffiliateLink());
    toast.success("Affiliate link copied to clipboard!");
  };

  const sendInviteEmail = async () => {
    if (!inviteEmail || !affiliateData) return;

    setIsSendingInvite(true);
    try {
      const { error } = await supabase.functions.invoke("send-analysis-report", {
        body: {
          to: inviteEmail,
          subject: "Join DeepGuard - AI Deepfake Detection",
          template: "affiliate_invite",
          data: {
            affiliateCode: affiliateData.affiliate_code,
            affiliateName: affiliateData.name,
            signupLink: generateAffiliateLink(),
          },
        },
      });

      if (error) throw error;

      toast.success(`Invite sent to ${inviteEmail}!`);
      setInviteEmail("");
    } catch (err) {
      console.error("Error sending invite:", err);
      toast.error("Failed to send invite");
    } finally {
      setIsSendingInvite(false);
    }
  };

  const requestPayout = async (amount: number) => {
    if (!affiliateData || affiliateData.pending_payout < amount) {
      toast.error("Insufficient balance for this payout");
      return;
    }

    // This would integrate with Stripe for actual payouts
    toast.success(`Payout of $${amount} requested! Processing within 3-5 business days.`);
  };

  if (!user) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="pt-6 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Sign in to access the affiliate program</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="pt-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!affiliateData) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Join Our Affiliate Program
          </CardTitle>
          <CardDescription>
            Earn 10% commission on every referral. No limit on earnings!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold">10% Commission</p>
              <p className="text-sm text-muted-foreground">On all referrals</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold">Recurring Revenue</p>
              <p className="text-sm text-muted-foreground">Lifetime commissions</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 text-center">
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold">Fast Payouts</p>
              <p className="text-sm text-muted-foreground">One-click via Stripe</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => toast.info("Apply at affiliates@deepguard.ai")}>
            Apply to Become an Affiliate
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold">${affiliateData.total_earnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6 text-center">
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">${affiliateData.pending_payout.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Available for Payout</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-bold">{affiliateData.commission_rate}%</p>
              <p className="text-sm text-muted-foreground">Commission Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border/50">
            <CardContent className="pt-6 text-center">
              <Badge variant={affiliateData.status === "active" ? "default" : "secondary"} className="mb-2">
                {affiliateData.status}
              </Badge>
              <p className="text-lg font-mono">{affiliateData.affiliate_code}</p>
              <p className="text-sm text-muted-foreground">Your Code</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Affiliate Link */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Your Affiliate Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={generateAffiliateLink()} readOnly className="font-mono text-sm" />
            <Button onClick={copyLink} variant="outline" className="gap-2 shrink-0">
              <Copy className="w-4 h-4" />
              Copy
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email to invite..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button
              onClick={sendInviteEmail}
              disabled={isSendingInvite || !inviteEmail}
              className="gap-2 shrink-0"
            >
              <Mail className="w-4 h-4" />
              {isSendingInvite ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* One-Click Payouts */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            One-Click Payouts
          </CardTitle>
          <CardDescription>
            Request instant payouts via Stripe. Available balance: ${affiliateData.pending_payout.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {paymentTiers.map((tier) => (
              <Button
                key={tier.amount}
                variant={affiliateData.pending_payout >= tier.amount ? "default" : "outline"}
                disabled={affiliateData.pending_payout < tier.amount}
                onClick={() => requestPayout(tier.amount)}
                className="flex-col h-auto py-4"
              >
                <span className="text-lg font-bold">{tier.label}</span>
                <span className="text-xs text-muted-foreground">{tier.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateSystem;
