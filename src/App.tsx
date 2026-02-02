import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ThemeTransitionProvider } from "@/hooks/use-theme-transition";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import History from "./pages/History";
import Profile from "./pages/Profile";
import SharedAnalysis from "./pages/SharedAnalysis";
import Bookmarklet from "./pages/Bookmarklet";
import Dashboard from "./pages/Dashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import GDPR from "./pages/GDPR";
import DesktopApp from "./pages/DesktopApp";
import API from "./pages/API";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import PressKit from "./pages/PressKit";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import HelpCenter from "./pages/HelpCenter";
import Community from "./pages/Community";
import Status from "./pages/Status";
import Security from "./pages/Security";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import DeepfakeQuiz from "./pages/DeepfakeQuiz";
import Sustainability from "./pages/Sustainability";
import Team from "./pages/Team";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <AccessibilityProvider>
                <ThemeTransitionProvider>
                  <Toaster />
                  <Sonner />
                  <ErrorBoundary title="App crashed">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/shared" element={<SharedAnalysis />} />
                      <Route path="/bookmarklet" element={<Bookmarklet />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/cookies" element={<CookiePolicy />} />
                      <Route path="/gdpr" element={<GDPR />} />
                      <Route path="/desktop" element={<DesktopApp />} />
                      <Route path="/api" element={<API />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/press" element={<PressKit />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/docs" element={<Documentation />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/status" element={<Status />} />
                      <Route path="/security" element={<Security />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/quiz" element={<DeepfakeQuiz />} />
                      <Route path="/sustainability" element={<Sustainability />} />
                      <Route path="/team" element={<Team />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </ThemeTransitionProvider>
              </AccessibilityProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
