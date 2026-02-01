import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("getSession result:", session?.user?.email, error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    console.log("Attempting signup for:", email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });
    
    console.log("Signup result:", data?.user?.email, error?.message);
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    console.log("Attempting signin for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log("Signin result:", data?.user?.email, error?.message);
    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    console.log("Attempting Google signin via Lovable Cloud");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    
    if (result.error) {
      console.log("Google signin error:", result.error.message);
      return { error: result.error };
    }
    
    return { error: null };
  };

  const signOut = async () => {
    console.log("Signing out");
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    console.log("Requesting password reset for:", email);
    const redirectUrl = `${window.location.origin}/auth?mode=reset`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    console.log("Reset password result:", error?.message);
    return { error: error as Error | null };
  };

  const updatePassword = async (newPassword: string) => {
    console.log("Updating password");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    console.log("Update password result:", error?.message);
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signInWithGoogle,
      signOut, 
      resetPassword,
      updatePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
