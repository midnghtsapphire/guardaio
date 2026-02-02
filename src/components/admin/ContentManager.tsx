import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, FileText, Users, Building2, Mail, Globe, Image, Shield, BookOpen, Briefcase, Heart, AlertTriangle, CheckCircle, RotateCcw, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface ContentSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
  isPublished: boolean;
}

const ContentManager = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // About Page Content
  const [aboutContent, setAboutContent] = useState({
    heroTitle: "Fighting Deepfakes, Protecting Truth",
    heroSubtitle: "Guardaio is an AI-powered platform dedicated to detecting synthetic media and protecting people from digital deception.",
    missionStatement: "Our mission is to protect individuals and organizations from the growing threat of AI-generated deepfakes and synthetic media. We believe everyone deserves access to tools that can verify the authenticity of digital content.",
    visionStatement: "A world where truth is verifiable and synthetic media cannot be used to deceive, manipulate, or harm.",
    foundedYear: "2024",
    teamSize: "25+",
    analysesPerformed: "1M+",
    accuracyRate: "99.2%",
  });

  // Contact Page Content
  const [contactContent, setContactContent] = useState({
    mainEmail: "hello@guardaio.com",
    supportEmail: "support@guardaio.com",
    pressEmail: "press@guardaio.com",
    partnershipsEmail: "partnerships@guardaio.com",
    address: "123 Innovation Drive, San Francisco, CA 94102",
    phone: "+1 (555) 123-4567",
    responseTime: "24 hours",
  });

  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    twitter: "https://twitter.com/GuardaioAI",
    linkedin: "https://linkedin.com/company/guardaio",
    github: "https://github.com/guardaio",
    discord: "https://discord.gg/guardaio",
    youtube: "https://youtube.com/@guardaio",
  });

  // Homepage Content
  const [homepageContent, setHomepageContent] = useState({
    heroHeadline: "Detect Deepfakes with Military-Grade AI",
    heroSubheadline: "Protect yourself from synthetic media manipulation. Our advanced AI analyzes images, videos, and audio to expose AI-generated fakes.",
    ctaPrimary: "Analyze Now - Free",
    ctaSecondary: "Watch Demo",
    featuresTitle: "Enterprise-Grade Detection",
    featuresSubtitle: "Powered by cutting-edge AI trained on millions of deepfake samples",
  });

  // Team Members
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Dr. Sarah Chen", role: "CEO & Co-Founder", bio: "PhD in Computer Vision from Stanford. Former AI researcher at Google DeepMind.", image: "" },
    { id: "2", name: "Marcus Johnson", role: "CTO & Co-Founder", bio: "15+ years in cybersecurity. Former lead engineer at Palantir.", image: "" },
    { id: "3", name: "Dr. Elena Rodriguez", role: "Chief Scientist", bio: "Expert in generative AI detection. 50+ publications in top conferences.", image: "" },
    { id: "4", name: "James Liu", role: "VP of Engineering", bio: "Scaled systems at Netflix and Uber. Expert in high-performance ML infrastructure.", image: "" },
  ]);

  // Legal Content
  const [legalContent, setLegalContent] = useState({
    companyName: "Guardaio Inc.",
    jurisdiction: "Delaware, USA",
    dataProcessingLocation: "United States, European Union",
    dpoEmail: "dpo@guardaio.com",
    privacyLastUpdated: "2024-01-15",
    termsLastUpdated: "2024-01-15",
  });

  // SEO Settings
  const [seoSettings, setSeoSettings] = useState({
    defaultTitle: "Guardaio - AI Deepfake Detection | Protect from Synthetic Media",
    defaultDescription: "Detect deepfake images, videos & audio in real-time. Protect yourself from AI scams, virtual kidnapping, romance fraud & voice cloning. Free analysis tool.",
    ogImage: "/og-image.png",
    twitterHandle: "@GuardaioAI",
    canonicalUrl: "https://guardaio.com",
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    toast.success(`${section} content saved successfully!`);
  };

  const handleInputChange = () => {
    setHasUnsavedChanges(true);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: crypto.randomUUID(),
      name: "New Team Member",
      role: "Role",
      bio: "Bio...",
      image: ""
    }]);
    handleInputChange();
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    handleInputChange();
  };

  const updateTeamMember = (id: string, field: string, value: string) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
    handleInputChange();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Content Manager
          </h2>
          <p className="text-muted-foreground">Edit website content, team info, and settings</p>
        </div>
        {hasUnsavedChanges && (
          <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500">
            <AlertTriangle className="w-3 h-3" />
            Unsaved Changes
          </Badge>
        )}
      </div>

      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="about" className="gap-2">
            <Building2 className="w-4 h-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="homepage" className="gap-2">
            <Globe className="w-4 h-4" />
            Homepage
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="w-4 h-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-2">
            <Shield className="w-4 h-4" />
            Legal
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Globe className="w-4 h-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* About Page Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
              <CardDescription>Edit the About page hero section and company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input 
                    value={aboutContent.heroTitle}
                    onChange={(e) => {
                      setAboutContent({...aboutContent, heroTitle: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Founded Year</Label>
                  <Input 
                    value={aboutContent.foundedYear}
                    onChange={(e) => {
                      setAboutContent({...aboutContent, foundedYear: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea 
                  value={aboutContent.heroSubtitle}
                  onChange={(e) => {
                    setAboutContent({...aboutContent, heroSubtitle: e.target.value});
                    handleInputChange();
                  }}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Mission Statement</Label>
                <Textarea 
                  value={aboutContent.missionStatement}
                  onChange={(e) => {
                    setAboutContent({...aboutContent, missionStatement: e.target.value});
                    handleInputChange();
                  }}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Vision Statement</Label>
                <Textarea 
                  value={aboutContent.visionStatement}
                  onChange={(e) => {
                    setAboutContent({...aboutContent, visionStatement: e.target.value});
                    handleInputChange();
                  }}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Input 
                    value={aboutContent.teamSize}
                    onChange={(e) => {
                      setAboutContent({...aboutContent, teamSize: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Analyses Performed</Label>
                  <Input 
                    value={aboutContent.analysesPerformed}
                    onChange={(e) => {
                      setAboutContent({...aboutContent, analysesPerformed: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Accuracy Rate</Label>
                  <Input 
                    value={aboutContent.accuracyRate}
                    onChange={(e) => {
                      setAboutContent({...aboutContent, accuracyRate: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => window.open('/about', '_blank')} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button onClick={() => handleSave('About')} disabled={isSaving} className="gap-2">
                  {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Homepage Tab */}
        <TabsContent value="homepage" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Homepage Content</CardTitle>
              <CardDescription>Edit the main landing page headlines and CTAs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Hero Headline</Label>
                <Input 
                  value={homepageContent.heroHeadline}
                  onChange={(e) => {
                    setHomepageContent({...homepageContent, heroHeadline: e.target.value});
                    handleInputChange();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Hero Subheadline</Label>
                <Textarea 
                  value={homepageContent.heroSubheadline}
                  onChange={(e) => {
                    setHomepageContent({...homepageContent, heroSubheadline: e.target.value});
                    handleInputChange();
                  }}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary CTA Button</Label>
                  <Input 
                    value={homepageContent.ctaPrimary}
                    onChange={(e) => {
                      setHomepageContent({...homepageContent, ctaPrimary: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA Button</Label>
                  <Input 
                    value={homepageContent.ctaSecondary}
                    onChange={(e) => {
                      setHomepageContent({...homepageContent, ctaSecondary: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features Section Title</Label>
                <Input 
                  value={homepageContent.featuresTitle}
                  onChange={(e) => {
                    setHomepageContent({...homepageContent, featuresTitle: e.target.value});
                    handleInputChange();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Features Section Subtitle</Label>
                <Textarea 
                  value={homepageContent.featuresSubtitle}
                  onChange={(e) => {
                    setHomepageContent({...homepageContent, featuresSubtitle: e.target.value});
                    handleInputChange();
                  }}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => window.open('/', '_blank')} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button onClick={() => handleSave('Homepage')} disabled={isSaving} className="gap-2">
                  {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage team member profiles shown on the About page</CardDescription>
                </div>
                <Button onClick={addTeamMember} size="sm" className="gap-2">
                  <Users className="w-4 h-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member, index) => (
                <Collapsible key={member.id}>
                  <Card className="border-border/50">
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input 
                              value={member.name}
                              onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Input 
                              value={member.role}
                              onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Bio</Label>
                          <Textarea 
                            value={member.bio}
                            onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input 
                            value={member.image}
                            onChange={(e) => updateTeamMember(member.id, 'image', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeTeamMember(member.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button onClick={() => handleSave('Team')} disabled={isSaving} className="gap-2">
                  {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update contact emails, address, and support info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Main Email</Label>
                  <Input 
                    value={contactContent.mainEmail}
                    onChange={(e) => {
                      setContactContent({...contactContent, mainEmail: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input 
                    value={contactContent.supportEmail}
                    onChange={(e) => {
                      setContactContent({...contactContent, supportEmail: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Press Email</Label>
                  <Input 
                    value={contactContent.pressEmail}
                    onChange={(e) => {
                      setContactContent({...contactContent, pressEmail: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Partnerships Email</Label>
                  <Input 
                    value={contactContent.partnershipsEmail}
                    onChange={(e) => {
                      setContactContent({...contactContent, partnershipsEmail: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input 
                  value={contactContent.address}
                  onChange={(e) => {
                    setContactContent({...contactContent, address: e.target.value});
                    handleInputChange();
                  }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={contactContent.phone}
                    onChange={(e) => {
                      setContactContent({...contactContent, phone: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Response Time</Label>
                  <Input 
                    value={contactContent.responseTime}
                    onChange={(e) => {
                      setContactContent({...contactContent, responseTime: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => window.open('/contact', '_blank')} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button onClick={() => handleSave('Contact')} disabled={isSaving} className="gap-2">
                  {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Update social media profile URLs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Twitter/X</Label>
                  <Input 
                    value={socialLinks.twitter}
                    onChange={(e) => {
                      setSocialLinks({...socialLinks, twitter: e.target.value});
                      handleInputChange();
                    }}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input 
                    value={socialLinks.linkedin}
                    onChange={(e) => {
                      setSocialLinks({...socialLinks, linkedin: e.target.value});
                      handleInputChange();
                    }}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input 
                    value={socialLinks.github}
                    onChange={(e) => {
                      setSocialLinks({...socialLinks, github: e.target.value});
                      handleInputChange();
                    }}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discord</Label>
                  <Input 
                    value={socialLinks.discord}
                    onChange={(e) => {
                      setSocialLinks({...socialLinks, discord: e.target.value});
                      handleInputChange();
                    }}
                    placeholder="https://discord.gg/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube</Label>
                  <Input 
                    value={socialLinks.youtube}
                    onChange={(e) => {
                      setSocialLinks({...socialLinks, youtube: e.target.value});
                      handleInputChange();
                    }}
                    placeholder="https://youtube.com/@..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button onClick={() => handleSave('Social Links')} disabled={isSaving} className="gap-2">
                  {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Tab */}
        <TabsContent value="legal" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>Update company legal details for policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input 
                    value={legalContent.companyName}
                    onChange={(e) => {
                      setLegalContent({...legalContent, companyName: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jurisdiction</Label>
                  <Input 
                    value={legalContent.jurisdiction}
                    onChange={(e) => {
                      setLegalContent({...legalContent, jurisdiction: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Processing Locations</Label>
                  <Input 
                    value={legalContent.dataProcessingLocation}
                    onChange={(e) => {
                      setLegalContent({...legalContent, dataProcessingLocation: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>DPO Email</Label>
                  <Input 
                    value={legalContent.dpoEmail}
                    onChange={(e) => {
                      setLegalContent({...legalContent, dpoEmail: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Privacy Policy Last Updated</Label>
                  <Input 
                    type="date"
                    value={legalContent.privacyLastUpdated}
                    onChange={(e) => {
                      setLegalContent({...legalContent, privacyLastUpdated: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Terms Last Updated</Label>
                  <Input 
                    type="date"
                    value={legalContent.termsLastUpdated}
                    onChange={(e) => {
                      setLegalContent({...legalContent, termsLastUpdated: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => window.open('/privacy', '_blank')} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Privacy
                </Button>
                <Button variant="outline" onClick={() => window.open('/terms', '_blank')} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Terms
                </Button>
                <Button onClick={() => handleSave('Legal')} disabled={isSaving} className="gap-2">
                  {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Configure default meta tags and Open Graph settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Page Title</Label>
                <Input 
                  value={seoSettings.defaultTitle}
                  onChange={(e) => {
                    setSeoSettings({...seoSettings, defaultTitle: e.target.value});
                    handleInputChange();
                  }}
                />
                <p className="text-xs text-muted-foreground">{seoSettings.defaultTitle.length}/60 characters recommended</p>
              </div>

              <div className="space-y-2">
                <Label>Default Meta Description</Label>
                <Textarea 
                  value={seoSettings.defaultDescription}
                  onChange={(e) => {
                    setSeoSettings({...seoSettings, defaultDescription: e.target.value});
                    handleInputChange();
                  }}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">{seoSettings.defaultDescription.length}/160 characters recommended</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>OG Image URL</Label>
                  <Input 
                    value={seoSettings.ogImage}
                    onChange={(e) => {
                      setSeoSettings({...seoSettings, ogImage: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter Handle</Label>
                  <Input 
                    value={seoSettings.twitterHandle}
                    onChange={(e) => {
                      setSeoSettings({...seoSettings, twitterHandle: e.target.value});
                      handleInputChange();
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input 
                  value={seoSettings.canonicalUrl}
                  onChange={(e) => {
                    setSeoSettings({...seoSettings, canonicalUrl: e.target.value});
                    handleInputChange();
                  }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button onClick={() => handleSave('SEO')} disabled={isSaving} className="gap-2">
                  {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;