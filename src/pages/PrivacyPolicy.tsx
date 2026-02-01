import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 15, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, upload media for analysis, or contact us for support.

**Personal Information:**
- Email address and account credentials
- Profile information (display name)
- Payment information (processed securely via third-party providers)

**Usage Data:**
- Media files uploaded for analysis (temporarily processed, not stored permanently)
- Analysis history and results
- Device information and IP addresses
- Browser type and operating system`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:

- Provide, maintain, and improve our deepfake detection services
- Process and analyze uploaded media files
- Send you technical notices, updates, and security alerts
- Respond to your comments, questions, and support requests
- Monitor and analyze trends, usage, and activities
- Detect, investigate, and prevent fraudulent or unauthorized activities`
    },
    {
      title: "3. Data Retention",
      content: `We retain your personal information for as long as your account is active or as needed to provide you services.

**Media Files:** Uploaded files are processed in real-time and are automatically deleted within 24 hours of analysis completion.

**Analysis History:** Your analysis history is retained until you delete it or close your account.

**Account Data:** We retain account information until you request deletion.`
    },
    {
      title: "4. Information Sharing",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:

- With service providers who assist in our operations
- To comply with legal obligations or court orders
- To protect the rights, property, or safety of DeepGuard, our users, or others
- With your consent or at your direction`
    },
    {
      title: "5. Security",
      content: `We implement industry-standard security measures to protect your data:

- End-to-end encryption for all data transmissions
- Secure cloud infrastructure with regular security audits
- Access controls and authentication protocols
- Regular security assessments and penetration testing

While we strive to protect your information, no method of transmission over the Internet is 100% secure.`
    },
    {
      title: "6. Your Rights",
      content: `You have the right to:

- Access and receive a copy of your personal data
- Correct inaccurate personal data
- Request deletion of your personal data
- Object to processing of your personal data
- Data portability
- Withdraw consent at any time

To exercise these rights, contact us at privacy@deepguard.ai`
    },
    {
      title: "7. Contact Us",
      content: `If you have questions about this Privacy Policy, please contact us:

**Email:** support
**Address:** PO Box 1433, Wellington Colorado 80549`
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | DeepGuard</title>
        <meta name="description" content="Learn how DeepGuard collects, uses, and protects your personal information." />
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
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                At DeepGuard, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our deepfake detection service.
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
