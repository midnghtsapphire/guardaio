import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-SUBSCRIPTIONS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Verify admin user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      throw new Error("Unauthorized: Admin access required");
    }

    logStep("Admin verified", { userId: user.id });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Fetch all subscriptions
    const allSubscriptions = await stripe.subscriptions.list({ limit: 100 });
    logStep("Fetched subscriptions", { count: allSubscriptions.data.length });

    // Fetch all products for plan names
    const products = await stripe.products.list({ limit: 100 });
    const productMap = new Map<string, string>(products.data.map((p: Stripe.Product) => [p.id, p.name]));

    // Calculate stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalActive = 0;
    let totalRevenue = 0;
    let mrr = 0;
    let newThisMonth = 0;
    let canceledThisMonth = 0;

    const subscriptions = await Promise.all(
      allSubscriptions.data.map(async (sub: Stripe.Subscription) => {
        // Get customer details
        const customer = await stripe.customers.retrieve(sub.customer as string);
        const customerData = customer as Stripe.Customer;

        const priceItem = sub.items.data[0];
        const productId = priceItem.price.product as string;
        const planName = productMap.get(productId) || "Unknown Plan";
        const amount = priceItem.price.unit_amount || 0;
        const currency = priceItem.price.currency;

        // Count stats
        if (sub.status === "active" || sub.status === "trialing") {
          totalActive++;
          mrr += amount;
        }

        const createdDate = new Date(sub.created * 1000);
        if (createdDate >= startOfMonth) {
          newThisMonth++;
        }

        if (sub.status === "canceled") {
          const canceledAt = sub.canceled_at ? new Date(sub.canceled_at * 1000) : null;
          if (canceledAt && canceledAt >= startOfMonth) {
            canceledThisMonth++;
          }
        }

        // Get total revenue from invoices for this subscription
        const invoices = await stripe.invoices.list({
          subscription: sub.id,
          status: "paid",
          limit: 100,
        });
        const subRevenue = invoices.data.reduce((sum: number, inv: Stripe.Invoice) => sum + (inv.amount_paid || 0), 0);
        totalRevenue += subRevenue;

        return {
          id: sub.id,
          customerId: sub.customer as string,
          customerEmail: customerData.email || "No email",
          customerName: customerData.name || "Unknown",
          status: sub.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
          plan: planName,
          amount,
          currency,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          createdAt: new Date(sub.created * 1000).toISOString(),
        };
      })
    );

    // Calculate churn rate
    const churnRate = totalActive > 0 
      ? Math.round((canceledThisMonth / (totalActive + canceledThisMonth)) * 100 * 10) / 10 
      : 0;

    const stats = {
      totalActive,
      totalRevenue: Math.round(totalRevenue / 100), // Convert cents to dollars
      mrr: Math.round(mrr / 100),
      churnRate,
      newThisMonth,
      canceledThisMonth,
    };

    logStep("Returning data", { subscriptionCount: subscriptions.length, stats });

    return new Response(JSON.stringify({ subscriptions, stats }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
