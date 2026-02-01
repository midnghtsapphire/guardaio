import { motion } from "framer-motion";
import { Shield, ArrowLeft, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GDPR = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 15, 2026";

  const rights = [
    {
      title: "Right to Access",
      description: "You can request a copy of all personal data we hold about you.",
      icon: CheckCircle,
    },
    {
      title: "Right to Rectification",
      description: "You can request correction of inaccurate or incomplete personal data.",
      icon: CheckCircle,
    },
    {
      title: "Right to Erasure",
      description: "You can request deletion of your personal data ('right to be forgotten').",
      icon: CheckCircle,
    },
    {
      title: "Right to Restrict Processing",
      description: "You can request limitation of how we use your personal data.",
      icon: CheckCircle,
    },
    {
      title: "Right to Data Portability",
      description: "You can receive your data in a machine-readable format.",
      icon: CheckCircle,
    },
    {
      title: "Right to Object",
      description: "You can object to processing of your personal data for certain purposes.",
      icon: CheckCircle,
    },
    {
      title: "Rights Related to Automated Decisions",
      description: "You can request human review of automated decisions affecting you.",
      icon: CheckCircle,
    },
    {
      title: "Right to Withdraw Consent",
      description: "You can withdraw consent at any time where processing is based on consent.",
      icon: CheckCircle,
    },
  ];

  const sections = [
    {
      title: "Our Commitment to GDPR",
      content: `DeepGuard is committed to protecting your personal data in compliance with the General Data Protection Regulation (GDPR). This page explains how we handle your data and your rights as a data subject.

We process personal data lawfully, fairly, and transparently. We collect data only for specified, explicit, and legitimate purposes.`
    },
    {
      title: "Legal Basis for Processing",
      content: `We process your personal data based on the following legal grounds:

**Contractual Necessity:** Processing required to provide our deepfake detection services to you.

**Legitimate Interests:** Processing necessary for our legitimate business interests, such as improving our services and preventing fraud.

**Consent:** Where you have given explicit consent for specific processing activities.

**Legal Obligation:** Processing required to comply with applicable laws and regulations.`
    },
    {
      title: "Data We Collect",
      content: `**Account Information:**
- Email address
- Display name
- Account preferences

**Usage Data:**
- Analysis history and results
- Service usage patterns
- Device and browser information

**Media Files:**
- Files uploaded for analysis are processed temporarily
- Files are automatically deleted within 24 hours
- We do not store or use your media for any other purpose`
    },
    {
      title: "International Data Transfers",
      content: `Your data may be transferred to and processed in countries outside the European Economic Area (EEA). When this occurs, we ensure appropriate safeguards are in place:

- Standard Contractual Clauses approved by the European Commission
- Adequacy decisions where applicable
- Binding Corporate Rules for intra-group transfers

We only transfer data to third parties who demonstrate adequate protection measures.`
    },
    {
      title: "Data Retention",
      content: `We retain personal data only as long as necessary:

**Account Data:** Retained while your account is active, deleted within 30 days of account closure.

**Analysis History:** Retained until you delete it or close your account.

**Media Files:** Automatically deleted within 24 hours of analysis.

**Logs and Analytics:** Retained for up to 12 months for security and improvement purposes.`
    },
    {
      title: "Security Measures",
      content: `We implement appropriate technical and organizational measures to protect your data:

- Encryption in transit (TLS 1.3) and at rest (AES-256)
- Regular security assessments and penetration testing
- Access controls and authentication protocols
- Employee training on data protection
- Incident response procedures
- Regular backup and disaster recovery testing`
    },
    {
      title: "Data Protection Officer",
      content: `We have appointed a Data Protection Officer (DPO) to oversee our data protection strategy and compliance.

**Contact our DPO:**
Email: support
Address: PO Box 1433, Wellington Colorado 80549

You may contact our DPO for any data protection related inquiries.`
    },
    {
      title: "Supervisory Authority",
      content: `If you are not satisfied with how we handle your data protection concerns, you have the right to lodge a complaint with a supervisory authority.

For EU residents, you can contact your local Data Protection Authority. A list is available at the European Data Protection Board website.

We encourage you to contact us first so we can address your concerns directly.`
    }
  ];

  const handleDataRequest = () => {
    window.location.href = "mailto:support?subject=GDPR Data Request";
  };

  return (
    <>
      <Helmet>
        <title>GDPR Compliance | DeepGuard</title>
        <meta name="description" content="Learn about DeepGuard's GDPR compliance and your data protection rights." />
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
                <h1 className="font-display text-4xl font-bold">GDPR Compliance</h1>
                <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
              </div>
            </div>

            {/* Quick Action Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Exercise Your Rights
                  </CardTitle>
                  <CardDescription>
                    Submit a data subject access request or any GDPR-related inquiry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleDataRequest} className="gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Data Protection Officer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Your Rights Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="font-display text-2xl font-semibold mb-4">Your Data Rights Under GDPR</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {rights.map((right, index) => (
                  <motion.div
                    key={right.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="glass rounded-xl p-4 flex gap-3"
                  >
                    <right.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm">{right.title}</h3>
                      <p className="text-muted-foreground text-sm">{right.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Response Time Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20"
            >
              <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-accent">Response Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  We respond to all GDPR requests within 30 days. Complex requests may take up to 60 days, 
                  in which case we will notify you of the extension and reasons.
                </p>
              </div>
            </motion.div>

            {/* Detailed Sections */}
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
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

export default GDPR;
