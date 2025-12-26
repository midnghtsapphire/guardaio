import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Save, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setDisplayName(data.display_name || "");
        setEmail(data.email || user?.email || "");
      } else {
        setEmail(user?.email || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("user_id", user.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your changes have been saved",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl glass flex items-center justify-center">
              <Settings className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">Account Settings</h1>
              <p className="text-muted-foreground">
                Manage your profile and preferences
              </p>
            </div>
          </div>

          {/* Profile Section */}
          <div className="glass rounded-2xl p-8 mb-6">
            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This is how your name will appear across the app
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Your email address cannot be changed
                </p>
              </div>

              <Button
                variant="hero"
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Account Stats Section */}
          <div className="glass rounded-2xl p-8">
            <h2 className="font-display text-xl font-semibold mb-6">
              Account Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AccountStat
                label="Member Since"
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "N/A"}
              />
              <AccountStat
                label="Account Type"
                value="Free Tier"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Want unlimited analyses and advanced features?
              </p>
              <Button variant="glass" onClick={() => navigate("/#pricing")}>
                View Pricing Plans
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AccountStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-muted/50 rounded-xl p-4">
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default Profile;
