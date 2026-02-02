import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Users, DollarSign, TrendingUp, Search, RefreshCw, ExternalLink, Eye, Ban, CheckCircle, XCircle, Clock, AlertTriangle, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Subscription {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  plan: string;
  amount: number;
  currency: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

interface SubscriptionStats {
  totalActive: number;
  totalRevenue: number;
  mrr: number;
  churnRate: number;
  newThisMonth: number;
  canceledThisMonth: number;
}

// Mock data for demo
const mockSubscriptions: Subscription[] = [
  {
    id: "sub_1234567890",
    customerId: "cus_abc123",
    customerEmail: "john@example.com",
    customerName: "John Doe",
    status: "active",
    plan: "Guardaio Pro",
    amount: 2900,
    currency: "usd",
    currentPeriodEnd: "2024-02-15T00:00:00Z",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "sub_0987654321",
    customerId: "cus_def456",
    customerEmail: "jane@company.com",
    customerName: "Jane Smith",
    status: "active",
    plan: "Guardaio Pro",
    amount: 2900,
    currency: "usd",
    currentPeriodEnd: "2024-02-20T00:00:00Z",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "sub_5555555555",
    customerId: "cus_ghi789",
    customerEmail: "mike@startup.io",
    customerName: "Mike Johnson",
    status: "past_due",
    plan: "Guardaio Pro",
    amount: 2900,
    currency: "usd",
    currentPeriodEnd: "2024-01-25T00:00:00Z",
    cancelAtPeriodEnd: false,
    createdAt: "2023-12-25T00:00:00Z",
  },
  {
    id: "sub_6666666666",
    customerId: "cus_jkl012",
    customerEmail: "sarah@media.net",
    customerName: "Sarah Williams",
    status: "canceled",
    plan: "Guardaio Pro",
    amount: 2900,
    currency: "usd",
    currentPeriodEnd: "2024-01-10T00:00:00Z",
    cancelAtPeriodEnd: true,
    createdAt: "2023-11-10T00:00:00Z",
  },
  {
    id: "sub_7777777777",
    customerId: "cus_mno345",
    customerEmail: "alex@tech.co",
    customerName: "Alex Brown",
    status: "trialing",
    plan: "Guardaio Pro",
    amount: 2900,
    currency: "usd",
    currentPeriodEnd: "2024-02-01T00:00:00Z",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-25T00:00:00Z",
  },
];

const mockStats: SubscriptionStats = {
  totalActive: 247,
  totalRevenue: 28750,
  mrr: 7163,
  churnRate: 2.4,
  newThisMonth: 34,
  canceledThisMonth: 6,
};

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [stats, setStats] = useState<SubscriptionStats>(mockStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = 
      sub.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Subscription["status"]) => {
    const variants: Record<Subscription["status"], { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      active: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
      trialing: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      past_due: { variant: "destructive", icon: <AlertTriangle className="w-3 h-3" /> },
      canceled: { variant: "outline", icon: <XCircle className="w-3 h-3" /> },
      incomplete: { variant: "outline", icon: <Clock className="w-3 h-3" /> },
    };
    const { variant, icon } = variants[status];
    return (
      <Badge variant={variant} className="gap-1 capitalize">
        {icon}
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Subscription data refreshed");
    setIsLoading(false);
  };

  const handleViewDetails = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setShowDetailDialog(true);
  };

  const handleCancelSubscription = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setShowCancelDialog(true);
  };

  const confirmCancelSubscription = async () => {
    if (!selectedSubscription) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubscription.id
          ? { ...sub, cancelAtPeriodEnd: true }
          : sub
      )
    );
    
    toast.success(`Subscription for ${selectedSubscription.customerEmail} will be canceled at period end`);
    setShowCancelDialog(false);
    setSelectedSubscription(null);
    setIsLoading(false);
  };

  const handleReactivateSubscription = async (sub: Subscription) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id ? { ...s, cancelAtPeriodEnd: false, status: "active" } : s
      )
    );
    
    toast.success(`Subscription for ${sub.customerEmail} reactivated`);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Subscription Manager
          </h2>
          <p className="text-muted-foreground">Manage customer subscriptions and billing</p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Users className="w-5 h-5" />
              Active Subscribers
            </div>
            <p className="text-4xl font-bold">{stats.totalActive}</p>
            <p className="text-xs text-muted-foreground mt-1">Total active</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <DollarSign className="w-5 h-5" />
              Total Revenue
            </div>
            <p className="text-4xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Recurring
            </div>
            <p className="text-4xl font-bold">${stats.mrr.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">MRR</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <AlertTriangle className="w-5 h-5" />
              Churn Rate
            </div>
            <p className="text-4xl font-bold">{stats.churnRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Monthly</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              New This Month
            </div>
            <p className="text-4xl font-bold text-green-500">+{stats.newThisMonth}</p>
            <p className="text-xs text-muted-foreground mt-1">Subscribers</p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Canceled
            </div>
            <p className="text-4xl font-bold text-red-500">-{stats.canceledThisMonth}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, or subscription ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
          <CardDescription>View and manage all customer subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Period End</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.customerName}</p>
                      <p className="text-sm text-muted-foreground">{sub.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sub.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(sub.status)}
                      {sub.cancelAtPeriodEnd && (
                        <span className="text-xs text-muted-foreground">Cancels at period end</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(sub.amount, sub.currency)}/mo</TableCell>
                  <TableCell>{formatDate(sub.currentPeriodEnd)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(sub)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {sub.status === "active" && !sub.cancelAtPeriodEnd && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleCancelSubscription(sub)}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                      {sub.cancelAtPeriodEnd && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-500"
                          onClick={() => handleReactivateSubscription(sub)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stripe Dashboard Link */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Advanced Management</h3>
              <p className="text-sm text-muted-foreground">
                Access the Stripe Dashboard for detailed subscription management, invoices, and analytics
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => window.open("https://dashboard.stripe.com/subscriptions", "_blank")}>
              <ExternalLink className="w-4 h-4" />
              Open Stripe Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              Full details for subscription {selectedSubscription?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedSubscription.customerName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedSubscription.customerEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Plan</Label>
                  <p className="font-medium">{selectedSubscription.plan}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedSubscription.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-medium">
                    {formatCurrency(selectedSubscription.amount, selectedSubscription.currency)}/month
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="font-medium">{formatDate(selectedSubscription.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Current Period End</Label>
                  <p className="font-medium">{formatDate(selectedSubscription.currentPeriodEnd)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Subscription ID</Label>
                  <p className="font-mono text-sm">{selectedSubscription.id}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="gap-2" onClick={() => window.open(`https://dashboard.stripe.com/subscriptions/${selectedSubscription.id}`, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                  View in Stripe
                </Button>
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Email Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this subscription? The customer will retain access until the end of their current billing period.
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="py-4">
              <p>
                <strong>Customer:</strong> {selectedSubscription.customerName} ({selectedSubscription.customerEmail})
              </p>
              <p>
                <strong>Plan:</strong> {selectedSubscription.plan}
              </p>
              <p>
                <strong>Ends:</strong> {formatDate(selectedSubscription.currentPeriodEnd)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Active
            </Button>
            <Button variant="destructive" onClick={confirmCancelSubscription} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManager;