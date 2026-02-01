import { motion } from "framer-motion";
import { Cookie, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CookiePolicy = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 15, 2026";

  const essentialCookies = [
    { name: "session_id", purpose: "Maintains your login session", duration: "Session", type: "Essential" },
    { name: "csrf_token", purpose: "Security protection against CSRF attacks", duration: "Session", type: "Essential" },
    { name: "auth_token", purpose: "Authentication and authorization", duration: "7 days", type: "Essential" },
  ];

  const functionalCookies = [
    { name: "theme_preference", purpose: "Remembers your light/dark mode preference", duration: "1 year", type: "Functional" },
    { name: "language", purpose: "Stores your language preference", duration: "1 year", type: "Functional" },
    { name: "onboarding_complete", purpose: "Tracks if you've completed the tour", duration: "1 year", type: "Functional" },
  ];

  const analyticsCookies = [
    { name: "_ga", purpose: "Google Analytics - distinguishes users", duration: "2 years", type: "Analytics" },
    { name: "_gid", purpose: "Google Analytics - distinguishes users", duration: "24 hours", type: "Analytics" },
    { name: "_gat", purpose: "Google Analytics - throttles request rate", duration: "1 minute", type: "Analytics" },
  ];

  const allCookies = [...essentialCookies, ...functionalCookies, ...analyticsCookies];

  const sections = [
    {
      title: "What Are Cookies?",
      content: `Cookies are small text files that are stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.

Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (remain until they expire or are deleted).`
    },
    {
      title: "How We Use Cookies",
      content: `DeepGuard uses cookies for the following purposes:

**Essential Cookies:** Required for the website to function properly. Without these, you cannot use our service.

**Functional Cookies:** Remember your preferences like theme and language settings.

**Analytics Cookies:** Help us understand how visitors interact with our website to improve our service.

**Performance Cookies:** Monitor and improve the speed and performance of our platform.`
    },
    {
      title: "Third-Party Cookies",
      content: `Some cookies are placed by third-party services that appear on our pages:

**Google Analytics:** We use Google Analytics to understand how visitors use our site. Google may use this data in accordance with their privacy policy.

**Payment Processors:** When you make a purchase, our payment provider may set cookies to process your transaction securely.

We do not allow advertising cookies or tracking for targeted advertising purposes.`
    },
    {
      title: "Managing Cookies",
      content: `You can control cookies through your browser settings:

**Disable All Cookies:** You can set your browser to block all cookies, but this may prevent our service from working correctly.

**Delete Cookies:** You can delete existing cookies at any time through your browser settings.

**Cookie Preferences:** You can choose to accept only essential cookies while blocking others.

**Browser Settings:** Most browsers provide options to:
- See what cookies are stored
- Delete individual or all cookies
- Block third-party cookies
- Block all cookies from specific sites`
    },
    {
      title: "Your Consent",
      content: `When you first visit our website, we display a cookie consent banner. By clicking "Accept All," you consent to our use of all cookies described in this policy.

You can change your preferences at any time by clicking the cookie settings link in the footer of our website.

Essential cookies are always active as they are necessary for the website to function.`
    },
    {
      title: "Updates to This Policy",
      content: `We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.

We will notify you of any material changes by posting the new policy on this page with an updated revision date.`
    }
  ];

  return (
    <>
      <Helmet>
        <title>Cookie Policy | DeepGuard</title>
        <meta name="description" content="Learn about how DeepGuard uses cookies to improve your experience on our platform." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-24">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Cookie className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold">Cookie Policy</h1>
                <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                This Cookie Policy explains how DeepGuard uses cookies and similar technologies 
                to recognize you when you visit our website.
              </p>

              <div className="space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-2xl p-6"
                  >
                    <h2 className="font-display text-xl font-semibold mb-4">{section.title}</h2>
                    <div className="text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass rounded-2xl p-6"
                >
                  <h2 className="font-display text-xl font-semibold mb-4">Cookies We Use</h2>
                  <p className="text-muted-foreground mb-4">
                    Below is a detailed list of the cookies we use on our website:
                  </p>
                  <div className="rounded-lg overflow-hidden border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cookie Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allCookies.map((cookie) => (
                          <TableRow key={cookie.name}>
                            <TableCell className="font-mono text-sm">{cookie.name}</TableCell>
                            <TableCell className="text-muted-foreground">{cookie.purpose}</TableCell>
                            <TableCell>{cookie.duration}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                cookie.type === "Essential" ? "bg-primary/20 text-primary" :
                                cookie.type === "Functional" ? "bg-blue-500/20 text-blue-400" :
                                "bg-orange-500/20 text-orange-400"
                              }`}>
                                {cookie.type}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="glass rounded-2xl p-6"
                >
                  <h2 className="font-display text-xl font-semibold mb-4">Contact Us</h2>
                  <div className="text-muted-foreground">
                    <p>If you have questions about our use of cookies, please contact us:</p>
                    <p className="mt-2"><strong>Email:</strong> privacy@deepguard.ai</p>
                    <p><strong>Address:</strong> DeepGuard Inc., 123 AI Security Lane, San Francisco, CA 94102</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
