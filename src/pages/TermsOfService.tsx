import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const TermsOfService = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 15, 2026";
  const effectiveDate = "February 1, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using DeepGuard's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.

These Terms apply to all visitors, users, and others who access or use the Service.`
    },
    {
      title: "2. Description of Service",
      content: `DeepGuard provides AI-powered deepfake and synthetic media detection services including:

- Image authenticity analysis
- Video manipulation detection
- Audio deepfake identification
- URL and website content verification
- Comparison and forensic analysis tools

Our service uses advanced machine learning algorithms to analyze media files and provide confidence scores regarding their authenticity.`
    },
    {
      title: "3. User Accounts",
      content: `To access certain features, you must register for an account. You agree to:

- Provide accurate, current, and complete information
- Maintain the security of your password and account
- Accept responsibility for all activities under your account
- Notify us immediately of any unauthorized access

We reserve the right to terminate accounts that violate these terms or remain inactive for extended periods.`
    },
    {
      title: "4. Acceptable Use",
      content: `You agree NOT to use the Service to:

- Upload malicious software or harmful content
- Attempt to reverse engineer our detection algorithms
- Use the service for illegal surveillance or harassment
- Circumvent usage limits or access restrictions
- Resell or redistribute our analysis results without permission
- Submit content that infringes on intellectual property rights
- Interfere with or disrupt the integrity of the service`
    },
    {
      title: "5. Intellectual Property",
      content: `The Service and its original content, features, and functionality are owned by DeepGuard and are protected by international copyright, trademark, and other intellectual property laws.

**Your Content:** You retain ownership of media files you upload. By uploading, you grant us a limited license to process and analyze the content solely for providing the service.

**Our Technology:** Our detection algorithms, models, and analysis methods are proprietary and confidential.`
    },
    {
      title: "6. Disclaimer of Warranties",
      content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.

We do not guarantee that:
- Analysis results will be 100% accurate
- The service will be uninterrupted or error-free
- All deepfakes or manipulated media will be detected
- Results will be suitable for legal proceedings without expert verification

Our analysis provides probabilistic assessments and should be used as one factor in your evaluation, not as definitive proof.`
    },
    {
      title: "7. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEEPGUARD SHALL NOT BE LIABLE FOR:

- Indirect, incidental, special, or consequential damages
- Loss of profits, data, or business opportunities
- Damages arising from reliance on analysis results
- Any amount exceeding the fees paid in the preceding 12 months

This limitation applies regardless of the legal theory under which damages are sought.`
    },
    {
      title: "8. Subscription and Payments",
      content: `**Billing:** Subscription fees are billed in advance on a monthly or annual basis.

**Cancellation:** You may cancel at any time. Access continues until the end of the current billing period.

**Refunds:** We offer a 14-day money-back guarantee for new subscriptions. After this period, fees are non-refundable.

**Price Changes:** We may modify pricing with 30 days' notice. Continued use constitutes acceptance.`
    },
    {
      title: "9. Termination",
      content: `We may terminate or suspend your account immediately, without prior notice, for:

- Breach of these Terms
- Fraudulent, abusive, or illegal activity
- Non-payment of fees
- At our sole discretion with 30 days' notice

Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive will remain in effect.`
    },
    {
      title: "10. Governing Law",
      content: `These Terms shall be governed by the laws of the State of California, without regard to conflict of law provisions.

Any disputes shall be resolved in the state or federal courts located in San Francisco County, California.`
    },
    {
      title: "11. Changes to Terms",
      content: `We reserve the right to modify these Terms at any time. We will notify users of material changes via email or prominent notice on our website.

Continued use after changes constitutes acceptance of the modified terms.`
    },
    {
      title: "12. Contact Information",
      content: `For questions about these Terms, contact us at:

**Email:** legal@deepguard.ai
**Address:** DeepGuard Inc., 123 AI Security Lane, San Francisco, CA 94102`
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service | DeepGuard</title>
        <meta name="description" content="Read DeepGuard's terms of service governing the use of our deepfake detection platform." />
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
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
                <p className="text-muted-foreground">
                  Last updated: {lastUpdated} | Effective: {effectiveDate}
                </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Welcome to DeepGuard. These Terms of Service ("Terms") govern your access to and use of 
                our deepfake detection services, website, and applications.
              </p>

              <div className="space-y-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-2xl p-6"
                  >
                    <h2 className="font-display text-xl font-semibold mb-4">{section.title}</h2>
                    <div className="text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
