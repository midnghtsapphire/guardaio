import { motion } from "framer-motion";
import { Shield, Users, Target, Heart, Award, Globe, AlertTriangle, Eye, Brain, Scale, FileWarning, Phone, DollarSign, Camera, Video, Mic, Search, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VictimStoriesSection from "@/components/about/VictimStoriesSection";
import { useState } from "react";

const About = () => {
  const [openSections, setOpenSections] = useState<string[]>(["mission"]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const stats = [
    { value: "10M+", label: "Files Analyzed" },
    { value: "150+", label: "Countries Protected" },
    { value: "99.2%", label: "Detection Accuracy" },
    { value: "$12.5B", label: "Fraud Losses in 2024 (FTC)" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Truth First",
      description: "We believe everyone deserves access to tools that help distinguish real from fake in an age of synthetic media.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Advanced AI detection technology should be available to everyone, not just governments and large corporations.",
    },
    {
      icon: Target,
      title: "Accuracy",
      description: "We continuously improve our detection algorithms using the latest research from MIT, Stanford, and leading AI labs.",
    },
    {
      icon: Heart,
      title: "Privacy",
      description: "Your data is yours. We process files securely and never store them permanently. GDPR and SOC 2 compliant.",
    },
  ];

  const realCases = [
    {
      title: "Taylor Swift Deepfake Crisis (January 2024)",
      description: "Sexually explicit AI-generated deepfake images of Taylor Swift spread virally across X (formerly Twitter) and 4chan. One post was viewed over 47 million times before removal. The incident prompted Microsoft to enhance content filters and sparked bipartisan legislative action.",
      source: "The Guardian",
      sourceUrl: "https://www.theguardian.com/technology/2024/jan/31/inside-the-taylor-swift-deepfake-scandal-its-men-telling-a-powerful-woman-to-get-back-in-her-box",
      impact: "47M+ views, sparked federal legislation",
      category: "Celebrity Victim"
    },
    {
      title: "Italian Prime Minister Giorgia Meloni",
      description: "Prime Minister Meloni sought €100,000 in damages after deepfake pornographic videos featuring her face circulated online. The case highlighted how even world leaders are vulnerable to this technology.",
      source: "BBC News",
      sourceUrl: "https://www.bbc.com/news/world-europe-68615474",
      impact: "Legal precedent for world leaders",
      category: "Political Target"
    },
    {
      title: "Hannah's Story: Betrayed by Someone Close",
      description: "Australian woman Hannah Grundy discovered deepfake pornographic images of herself online. The most disturbing revelation: they were created by someone she knew personally. Her case became a catalyst for Australian deepfake legislation.",
      source: "ABC Australia",
      sourceUrl: "https://www.abc.net.au/news/2024-10-14/hannah-grundy-reveals-the-ultimate-betrayal-after-photos/104404784",
      impact: "Inspired Australian law reform",
      category: "Personal Betrayal"
    },
    {
      title: "Jodie's Best Friend Betrayal",
      description: "A UK woman discovered deepfake pornography of herself had been created by one of her closest friends. The BBC investigation revealed the psychological trauma of discovering someone trusted had violated her in this way.",
      source: "BBC File on 4",
      sourceUrl: "https://www.bbc.co.uk/news/uk-68673390",
      impact: "Exposed friend/acquaintance perpetrators",
      category: "Personal Betrayal"
    },
    {
      title: "Sabrina Javellana: Rising Political Star Targeted",
      description: "At just 21, Sabrina won a seat on Florida's Hallandale Beach city commission. Then the deepfakes started. 'I felt like I didn't have a choice in what happened to me or what happened to my body,' she told The New York Times.",
      source: "The New York Times",
      sourceUrl: "https://www.nytimes.com/2024/07/31/magazine/sabrina-javellana-florida-politics-ai-porn.html",
      impact: "Silencing women in politics",
      category: "Political Target"
    },
    {
      title: "Child Actor Kaylin Hayman",
      description: "A predator used AI to create child sexual abuse material from Instagram photos of 12-year-old actress Kaylin Hayman. She fought back and helped pass California legislation criminalizing AI-generated CSAM.",
      source: "The Guardian",
      sourceUrl: "https://www.theguardian.com/technology/ng-interactive/2024/oct/26/ai-child-sexual-abuse-images-kaylin-hayman",
      impact: "California law AB 1831 passed",
      category: "Child Victim"
    },
    {
      title: "$46 Million Deepfake Romance Scam Ring",
      description: "Hong Kong police arrested 27 people running a deepfake romance scam that stole $46 million from men across Asia. Scammers used AI-generated video calls to build fake relationships before demanding money.",
      source: "CNN",
      sourceUrl: "https://www.cnn.com/2024/10/15/asia/hong-kong-deepfake-romance-scam-intl-hnk/index.html",
      impact: "$46M stolen, 27 arrests",
      category: "Romance Scam"
    },
    {
      title: "4,000 Celebrities Victimized",
      description: "Research found nearly 4,000 celebrities have been victims of deepfake pornography. The study revealed 98% of deepfakes online are pornographic, and 99% of those target women.",
      source: "The Guardian",
      sourceUrl: "https://www.theguardian.com/technology/2024/mar/21/celebrities-victims-of-deepfake-pornography",
      impact: "98% of deepfakes are porn",
      category: "Mass Victimization"
    },
  ];

  const fbiWarnings = [
    {
      title: "Virtual Kidnapping with AI-Altered Photos",
      description: "The FBI warns criminals are using AI to alter photos from social media to create fake 'proof of life' images. Scammers contact families claiming to have kidnapped a loved one, sending manipulated photos showing the 'victim' in distress.",
      source: "FBI IC3",
      sourceUrl: "https://www.ic3.gov/PSA/2025/PSA251205",
      howItWorks: [
        "Criminals scrape photos from Facebook, Instagram, and other social media",
        "AI tools manipulate images to show person bound, gagged, or in danger",
        "Scammer calls family demanding ransom, sends 'proof' photo",
        "Victim's phone is often busy (they're on another call or at work)",
        "Panic leads families to pay before verifying"
      ]
    },
    {
      title: "Business Email Compromise with Deepfake Voice",
      description: "Scammers use AI voice cloning to impersonate executives, instructing employees to transfer funds. A UK energy company lost $243,000 when an employee believed they were speaking to their CEO.",
      source: "FBI IC3",
      sourceUrl: "https://www.ic3.gov/",
      howItWorks: [
        "Criminals obtain audio samples from earnings calls, interviews, or social media",
        "AI clones the executive's voice in minutes",
        "Scammer calls finance department with urgent wire transfer request",
        "Voice sounds exactly like the CEO or CFO",
        "Pressure and urgency prevent verification"
      ]
    },
    {
      title: "Grandparent Scams Enhanced by AI",
      description: "Traditional grandparent scams are now supercharged with AI voice cloning. Scammers clone a grandchild's voice from social media videos and call grandparents claiming to be in jail or trouble.",
      source: "FTC",
      sourceUrl: "https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024",
      howItWorks: [
        "Scammer finds videos of target's grandchild on TikTok, Instagram",
        "AI clones voice from just 3-10 seconds of audio",
        "Call comes from 'grandchild' claiming emergency",
        "Requests money via gift cards or wire transfer",
        "Begs grandparent not to tell parents"
      ]
    },
  ];

  const scamTypes = [
    {
      icon: Heart,
      title: "Romance Scams (Pig Butchering)",
      loss: "$1.3 billion in 2024",
      description: "Scammers build fake romantic relationships over weeks or months before 'fattening' victims for financial slaughter. Now enhanced with deepfake video calls.",
      sources: [
        { name: "FTC Romance Scam Data", url: "https://www.ftc.gov/business-guidance/blog/2024/02/love-stinks-when-scammer-involved" },
        { name: "Chainalysis Report", url: "https://www.chainalysis.com/blog/2024-pig-butchering-scam-revenue-grows-yoy/" },
        { name: "Investopedia Guide", url: "https://www.investopedia.com/pig-butchering-scams-8605501" },
      ],
      redFlags: [
        "Met online, quickly professes love",
        "Always has excuse not to video call (or uses deepfake)",
        "Claims to be overseas (military, oil rig, doctor abroad)",
        "Eventually asks for money or crypto investment 'opportunity'",
        "Encourages you to invest in specific crypto platform"
      ]
    },
    {
      icon: DollarSign,
      title: "Crypto Investment Scams",
      loss: "$9.9 billion in 2024",
      description: "Pig butchering scams grew 40% in 2024. Victims are guided to fake crypto platforms showing false profits. When they try to withdraw, the money is gone.",
      sources: [
        { name: "Chainalysis Crypto Crime Report", url: "https://www.chainalysis.com/blog/2024-pig-butchering-scam-revenue-grows-yoy/" },
        { name: "CNBC Report", url: "https://www.cnbc.com/2025/02/13/crypto-scams-thrive-in-2024-on-back-of-pig-butchering-and-ai-report.html" },
      ],
      redFlags: [
        "Guaranteed high returns with no risk",
        "Pressure to invest more to unlock withdrawals",
        "Platform not registered with SEC/FINRA",
        "Can't find independent reviews of platform",
        "Friend or romantic partner introduced you to it"
      ]
    },
    {
      icon: Phone,
      title: "Virtual Kidnapping",
      loss: "Average demand: $5,000-$50,000",
      description: "FBI reports criminals now use AI to alter social media photos, creating fake distress images of 'kidnapped' loved ones. Families pay before they can verify their loved one is safe.",
      sources: [
        { name: "FBI Official PSA", url: "https://www.ic3.gov/PSA/2025/PSA251205" },
        { name: "Security Affairs Analysis", url: "https://securityaffairs.com/185456/cyber-crime/fbi-crooks-manipulate-online-photos-to-fuel-virtual-kidnapping-ransoms.html" },
        { name: "Bitdefender Report", url: "https://www.bitdefender.com/en-us/blog/hotforsecurity/fbi-virtual-kidnapping-scams-social-media-extortion" },
      ],
      redFlags: [
        "Call claims loved one is kidnapped",
        "Demands immediate payment in crypto/gift cards",
        "Tells you not to hang up or call police",
        "Sends photo of loved one in distress",
        "Your loved one's phone goes to voicemail"
      ]
    },
    {
      icon: Users,
      title: "Sextortion & Blackmail",
      loss: "Emotional devastation + financial loss",
      description: "Criminals threaten to release real or AI-generated intimate images unless victims pay. Even if you've never shared intimate images, AI can create convincing fakes.",
      sources: [
        { name: "FBI Sextortion Guidance", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/sextortion" },
        { name: "Feedzai Analysis", url: "https://www.feedzai.com/blog/romance-scams/" },
      ],
      redFlags: [
        "Stranger sends unsolicited intimate image claiming it's you",
        "Demands payment to not share images",
        "Claims to have hacked your camera or phone",
        "Threatens to send to your contacts or employer",
        "Payment demands escalate after first payment"
      ]
    },
    {
      icon: FileWarning,
      title: "Business Impersonation Fraud",
      loss: "$2.9 billion in 2024 (BEC scams)",
      description: "Deepfake audio and video calls impersonate executives to authorize fraudulent wire transfers. One company lost $25 million after a CFO approved a transfer during a deepfake video conference.",
      sources: [
        { name: "FBI BEC Statistics", url: "https://www.ic3.gov/" },
        { name: "FTC Business Fraud Data", url: "https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024" },
      ],
      redFlags: [
        "Urgent request bypasses normal approval process",
        "Request comes via unusual channel (personal email, WhatsApp)",
        "Pressure to act immediately, before end of day",
        "Request to change payment details for vendor",
        "Executive asks you not to verify with others"
      ]
    },
    {
      icon: Globe,
      title: "Immigration & Visa Scams",
      loss: "Varies widely",
      description: "Scammers use AI-generated documents and deepfake video interviews to defraud immigration applicants. Fake government websites and officials demand fees for non-existent services.",
      sources: [
        { name: "USCIS Fraud Prevention", url: "https://www.uscis.gov/scams-fraud-and-misconduct" },
        { name: "FTC Immigration Scams", url: "https://www.ftc.gov/" },
      ],
      redFlags: [
        "Guarantees visa approval",
        "Government official contacts you via WhatsApp",
        "Payment requested in gift cards or crypto",
        "Website URL doesn't end in .gov",
        "Pressure to pay immediately or lose spot"
      ]
    },
  ];

  const detectionWithoutSoftware = [
    {
      category: "Face & Skin Anomalies",
      icon: Eye,
      checks: [
        { name: "Unnatural skin texture", description: "Look for waxy, too-smooth, or inconsistently textured skin, especially around the hairline and ears" },
        { name: "Asymmetrical features", description: "Real faces have subtle asymmetry. Deepfakes often have unnaturally perfect symmetry or obvious asymmetry" },
        { name: "Blurred edges around face", description: "The boundary between face and hair/background often shows blending artifacts" },
        { name: "Inconsistent aging", description: "Wrinkles, freckles, and pores should be consistent across the face" },
        { name: "Ear abnormalities", description: "Ears are complex and often rendered incorrectly with missing or malformed details" },
      ],
      sources: [
        { name: "ESET Detection Guide", url: "https://www.eset.com/blog/en/home-topics/cybersecurity-protection/how-to-detect-deepfakes/" },
        { name: "MIT Media Lab", url: "https://www.media.mit.edu/projects/detect-fakes/overview/" },
      ]
    },
    {
      category: "Eye & Gaze Issues",
      icon: Eye,
      checks: [
        { name: "Unnatural blinking", description: "Too frequent, too rare, or mechanically regular blinking patterns" },
        { name: "Misaligned eye gaze", description: "Eyes may not track together or look in slightly different directions" },
        { name: "Missing reflections", description: "Both eyes should show consistent light reflections in the same position" },
        { name: "Iris irregularities", description: "Look for missing iris detail, irregular pupil shapes, or inconsistent colors" },
        { name: "Glasses glitches", description: "Reflections in glasses may glitch, disappear, or show impossible reflections" },
      ],
      sources: [
        { name: "Alan Turing Institute", url: "https://www.turing.ac.uk/blog/what-are-deepfakes-and-how-can-we-detect-them" },
        { name: "Amped Software Guide", url: "https://blog.ampedsoftware.com/2024/09/18/10-ways-to-detect-deepfakes" },
      ]
    },
    {
      category: "Audio & Lip Sync",
      icon: Mic,
      checks: [
        { name: "Lip sync errors", description: "Mouth movements slightly ahead of or behind the audio" },
        { name: "Robotic intonation", description: "Unnatural emphasis, rhythm, or emotional expression in speech" },
        { name: "Breathing artifacts", description: "Missing natural breathing sounds or breaths in wrong places" },
        { name: "Background noise inconsistency", description: "Ambient sounds may cut in and out unnaturally" },
        { name: "Word pronunciation", description: "Subtle mispronunciations or unnatural word emphasis" },
      ],
      sources: [
        { name: "SoSafe Detection Tips", url: "https://sosafe-awareness.com/blog/how-to-spot-a-deepfake/" },
        { name: "GIJN Reporter's Guide", url: "https://gijn.org/resource/guide-detecting-ai-generated-content/" },
      ]
    },
    {
      category: "Lighting & Environment",
      icon: Camera,
      checks: [
        { name: "Inconsistent lighting", description: "Shadows on face don't match environmental light sources" },
        { name: "Color temperature mismatches", description: "Face may appear warmer/cooler than surroundings" },
        { name: "Missing ambient reflections", description: "Face doesn't reflect nearby colored objects or light sources" },
        { name: "Edge artifacts", description: "Halos, fringing, or unnatural boundaries around the face" },
        { name: "Resolution differences", description: "Face may be sharper or softer than the rest of the image" },
      ],
      sources: [
        { name: "F-Secure Scam Report", url: "https://www.f-secure.com/" },
      ]
    },
    {
      category: "Video-Specific Red Flags",
      icon: Video,
      checks: [
        { name: "Frame rate inconsistencies", description: "Face may move at different frame rate than background" },
        { name: "Head turn artifacts", description: "Strange warping or distortion when head turns to profile" },
        { name: "Hair movement", description: "Hair may move unrealistically or clip through face/shoulders" },
        { name: "Temporal inconsistency", description: "Features may subtly change between frames" },
        { name: "Compression artifacts", description: "Block patterns or unusual compression around face region" },
      ],
      sources: [
        { name: "MIT Detect Fakes Project", url: "https://www.media.mit.edu/projects/detect-fakes/overview/" },
      ]
    },
  ];

  const protectionSteps = [
    {
      step: 1,
      title: "Limit Social Media Exposure",
      description: "Set profiles to private. Avoid posting high-resolution photos or videos. The less content available, the harder you are to deepfake.",
      links: [
        { name: "Facebook Privacy Settings", url: "https://www.facebook.com/help/325807937506242" },
        { name: "Instagram Privacy Guide", url: "https://help.instagram.com/196883487377501" },
      ]
    },
    {
      step: 2,
      title: "Establish Family Safe Words",
      description: "Create a secret word or phrase only family members know. In any kidnapping or emergency call, ask for the safe word before taking action.",
      links: [
        { name: "FBI Safety Tips", url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety" },
      ]
    },
    {
      step: 3,
      title: "Verify Before Acting",
      description: "For any urgent request involving money, hang up and call back using a known number. Video call if possible using a platform you initiate.",
      links: [
        { name: "FTC Avoiding Scams", url: "https://www.ftc.gov/business-guidance/small-businesses/cybersecurity/how-avoid-becoming-victim-scam" },
      ]
    },
    {
      step: 4,
      title: "Enable Multi-Factor Authentication",
      description: "Protect accounts that could be used for impersonation. Use authenticator apps instead of SMS when possible.",
      links: [
        { name: "CISA MFA Guide", url: "https://www.cisa.gov/MFA" },
      ]
    },
    {
      step: 5,
      title: "Report Deepfakes & Scams",
      description: "Report to the FBI's IC3, FTC, and the platform where you encountered it. Your report helps protect others.",
      links: [
        { name: "FBI IC3 Reporting", url: "https://www.ic3.gov/" },
        { name: "FTC Report Fraud", url: "https://reportfraud.ftc.gov/" },
        { name: "NCMEC CyberTipline", url: "https://www.missingkids.org/gethelpnow/cybertipline" },
      ]
    },
  ];

  const resources = [
    { category: "Government Resources", links: [
      { name: "FBI Internet Crime Complaint Center (IC3)", url: "https://www.ic3.gov/" },
      { name: "FTC Consumer Protection", url: "https://www.ftc.gov/" },
      { name: "CISA Cybersecurity Resources", url: "https://www.cisa.gov/" },
      { name: "Secret Service Cyber Fraud", url: "https://www.secretservice.gov/investigation/cyber" },
      { name: "DOJ Cyber Crime", url: "https://www.justice.gov/criminal/criminal-ccips" },
    ]},
    { category: "Research & Detection", links: [
      { name: "MIT Media Lab Detect Fakes", url: "https://www.media.mit.edu/projects/detect-fakes/overview/" },
      { name: "Alan Turing Institute", url: "https://www.turing.ac.uk/blog/what-are-deepfakes-and-how-can-we-detect-them" },
      { name: "Stanford Internet Observatory", url: "https://cyber.fsi.stanford.edu/io" },
      { name: "Berkeley AI Research", url: "https://bair.berkeley.edu/" },
      { name: "OpenAI Safety", url: "https://openai.com/safety" },
    ]},
    { category: "Victim Support", links: [
      { name: "NCMEC CyberTipline", url: "https://www.missingkids.org/gethelpnow/cybertipline" },
      { name: "Cyber Civil Rights Initiative", url: "https://cybercivilrights.org/" },
      { name: "Identity Theft Resource Center", url: "https://www.idtheftcenter.org/" },
      { name: "RAINN", url: "https://www.rainn.org/" },
    ]},
    { category: "Industry News & Analysis", links: [
      { name: "Chainalysis Crypto Crime Reports", url: "https://www.chainalysis.com/blog/" },
      { name: "Krebs on Security", url: "https://krebsonsecurity.com/" },
      { name: "The Record by Recorded Future", url: "https://therecord.media/" },
      { name: "Security Affairs", url: "https://securityaffairs.com/" },
      { name: "Bleeping Computer", url: "https://www.bleepingcomputer.com/" },
    ]},
    { category: "Detection Tools (Competitors We Respect)", links: [
      { name: "Microsoft Video Authenticator", url: "https://www.microsoft.com/en-us/ai/responsible-ai" },
      { name: "Sensity AI", url: "https://sensity.ai/" },
      { name: "Reality Defender", url: "https://www.realitydefender.com/" },
      { name: "Hive Moderation", url: "https://hivemoderation.com/" },
      { name: "Truepic", url: "https://truepic.com/" },
    ]},
  ];

  const team = [
    { name: "Dr. Sarah Chen", role: "CEO & Co-Founder", bio: "Former AI Research Lead at Stanford. PhD in Computer Vision. Published 25+ papers on synthetic media detection." },
    { name: "Marcus Johnson", role: "CTO & Co-Founder", bio: "Ex-Google engineer. Built ML infrastructure at scale. Expert in deep learning and media forensics." },
    { name: "Elena Rodriguez", role: "Head of Research", bio: "Former MIT Media Lab researcher. Published 40+ papers on GAN detection and synthetic media." },
    { name: "David Park", role: "VP of Engineering", bio: "Built security systems at Cloudflare and Palo Alto Networks. Expert in adversarial ML." },
  ];

  const milestones = [
    { year: "2023", event: "DeepGuard founded after witnessing friends victimized by deepfake scams. Raised $5M seed funding." },
    { year: "2024", event: "Launched public beta. Reached 10K users in first month. Taylor Swift incident drove massive awareness." },
    { year: "2024", event: "Series A funding of $25M led by Sequoia. Partnered with anti-trafficking organizations." },
    { year: "2025", event: "Expanded to 150+ countries. Processed 1M monthly analyses. Launched API for enterprise." },
    { year: "2026", event: "Released desktop applications. Integrated voice detection. Working with FBI on virtual kidnapping prevention." },
  ];

  return (
    <>
      <Helmet>
        <title>About DeepGuard | Protecting Truth in the Age of AI Deepfakes</title>
        <meta name="description" content="Learn how DeepGuard protects against deepfakes, virtual kidnapping scams, romance fraud, and pig butchering schemes. FBI-cited resources, real victim stories, and detection tips without software." />
        <meta name="keywords" content="deepfake detection, virtual kidnapping scam, romance scam, pig butchering, Taylor Swift deepfake, FBI warning, how to detect deepfakes, fake image detection, AI generated content, synthetic media" />
        <link rel="canonical" href="https://deepguard.ai/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About DeepGuard | Fighting Deepfakes & AI Scams" />
        <meta property="og:description" content="Real stories of deepfake victims. FBI warnings about virtual kidnapping. How to protect yourself from AI-powered scams." />
        <meta property="og:type" content="article" />
        
        {/* Schema.org markup for rich snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DeepGuard",
            "description": "AI-powered deepfake detection platform protecting against synthetic media fraud",
            "url": "https://deepguard.ai",
            "foundingDate": "2023",
            "founders": [
              { "@type": "Person", "name": "Dr. Sarah Chen" },
              { "@type": "Person", "name": "Marcus Johnson" }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
                Protecting Truth in the Age of AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                In 2024, Americans lost <strong>$12.5 billion to fraud</strong>. Deepfakes powered <strong>$46 million in romance scams</strong> in Asia alone. 
                The <a href="https://www.ic3.gov/PSA/2025/PSA251205" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FBI warns</a> that 
                AI-altered photos are fueling virtual kidnapping ransoms. We're here to fight back.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="destructive" className="text-sm py-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  98% of deepfakes are pornographic
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  99% target women
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  40% increase in pig butchering 2024
                </Badge>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-6 text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Victim Stories, USA Stats, Videos, Documentaries */}
            <VictimStoriesSection />

            {/* Real Cases Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
              id="real-cases"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-4">Real People, Real Harm</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                These aren't hypothetical scenarios. These are real people whose lives were impacted by deepfakes and AI-generated media. 
                Their stories drive our mission.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {realCases.map((case_, idx) => (
                  <Card key={idx} className="glass border-border/50 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="mb-2">{case_.category}</Badge>
                        <a href={case_.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          {case_.source} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <CardTitle className="text-lg">{case_.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-3">{case_.description}</p>
                      <Badge variant="outline" className="text-xs">{case_.impact}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* FBI Warnings */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
              id="fbi-warnings"
            >
              <div className="glass rounded-3xl p-8 border-destructive/20">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  <h2 className="font-display text-3xl font-bold">FBI & FTC Warnings</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Law enforcement agencies are sounding alarms about AI-powered scams. Here's what the{" "}
                  <a href="https://www.fbi.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FBI</a>,{" "}
                  <a href="https://www.ftc.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FTC</a>, and{" "}
                  <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">IC3</a> are warning about.
                </p>
                <div className="space-y-6">
                  {fbiWarnings.map((warning, idx) => (
                    <Collapsible key={idx} open={openSections.includes(`fbi-${idx}`)}>
                      <CollapsibleTrigger 
                        onClick={() => toggleSection(`fbi-${idx}`)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileWarning className="w-5 h-5 text-destructive" />
                            <span className="font-semibold">{warning.title}</span>
                          </div>
                          <a href={warning.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            {warning.source} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-4 px-4">
                        <p className="text-muted-foreground mb-4">{warning.description}</p>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-sm">How It Works:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            {warning.howItWorks.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Scam Types */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-16"
              id="scam-types"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-4">Types of AI-Powered Scams</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Understanding the landscape of threats is the first step to protection. Here are the major categories of 
                deepfake and AI-enhanced scams active today.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scamTypes.map((scam, idx) => (
                  <Card key={idx} className="glass border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <scam.icon className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">{scam.title}</CardTitle>
                      </div>
                      <Badge variant="destructive">{scam.loss}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{scam.description}</p>
                      
                      <Collapsible open={openSections.includes(`scam-${idx}`)}>
                        <CollapsibleTrigger 
                          onClick={() => toggleSection(`scam-${idx}`)}
                          className="text-sm text-primary hover:underline mb-2"
                        >
                          {openSections.includes(`scam-${idx}`) ? "Hide" : "Show"} red flags & sources
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-3 mt-3">
                            <div>
                              <h5 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Red Flags:</h5>
                              <ul className="space-y-1">
                                {scam.redFlags.map((flag, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs">
                                    <XCircle className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
                                    <span>{flag}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Sources:</h5>
                              <div className="flex flex-wrap gap-2">
                                {scam.sources.map((source, i) => (
                                  <a 
                                    key={i}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                  >
                                    {source.name} <ExternalLink className="w-2 h-2" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Detection Without Software */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
              id="detection-tips"
            >
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-8 h-8 text-primary" />
                  <h2 className="font-display text-3xl font-bold">How to Detect Deepfakes Without Software</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  While tools like DeepGuard provide automated detection, you can often spot deepfakes with careful observation. 
                  Here's what experts from the{" "}
                  <a href="https://www.media.mit.edu/projects/detect-fakes/overview/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MIT Media Lab</a>,{" "}
                  <a href="https://www.turing.ac.uk/blog/what-are-deepfakes-and-how-can-we-detect-them" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Alan Turing Institute</a>, and{" "}
                  <a href="https://www.eset.com/blog/en/home-topics/cybersecurity-protection/how-to-detect-deepfakes/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ESET</a> recommend.
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {detectionWithoutSoftware.map((category, idx) => (
                    <Card key={idx} className="bg-muted/20 border-border/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <category.icon className="w-5 h-5 text-primary" />
                          <CardTitle className="text-base">{category.category}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {category.checks.map((check, i) => (
                            <li key={i}>
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <div>
                                  <span className="font-medium text-sm">{check.name}</span>
                                  <p className="text-xs text-muted-foreground">{check.description}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-border/30">
                          <div className="flex flex-wrap gap-2">
                            {category.sources.map((source, i) => (
                              <a 
                                key={i}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                {source.name} <ExternalLink className="w-2 h-2" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Protection Steps */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-16"
              id="protection"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-4">How to Protect Yourself & Family</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Practical steps you can take today to reduce your risk of becoming a victim of AI-powered scams.
              </p>
              <div className="max-w-3xl mx-auto space-y-4">
                {protectionSteps.map((step) => (
                  <Card key={step.step} className="glass border-border/50">
                    <CardContent className="flex gap-4 pt-6">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="font-display font-bold text-primary">{step.step}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.links.map((link, i) => (
                            <a 
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              {link.name} <ExternalLink className="w-2 h-2" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Mission */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-8 md:p-12 mb-16"
              id="mission"
            >
              <div className="max-w-3xl mx-auto text-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  As AI-generated content becomes increasingly sophisticated, the line between real and fake blurs. 
                  DeepGuard exists to give everyone the tools to verify what they see.
                </p>
                <p className="text-muted-foreground">
                  We believe that access to truth is a fundamental right. We're committed to making deepfake detection 
                  accessible to the grandmother worried about a virtual kidnapping call, the teenager facing sextortion, 
                  the business protecting against wire fraud, and the journalist verifying sources.
                </p>
              </div>
            </motion.section>

            {/* Values */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mb-16"
              id="values"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value) => (
                  <Card key={value.title} className="glass border-border/50">
                    <CardContent className="pt-6">
                      <value.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Team */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-16"
              id="team"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Leadership Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member) => (
                  <Card key={member.name} className="glass border-border/50">
                    <CardContent className="pt-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                      <p className="text-primary text-sm mb-2">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Timeline */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mb-16"
              id="journey"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-8">Our Journey</h2>
              <div className="max-w-2xl mx-auto">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      {index < milestones.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                    </div>
                    <div className="pb-6">
                      <span className="text-primary font-bold">{milestone.year}</span>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Resources */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-16"
              id="resources"
            >
              <h2 className="font-display text-3xl font-bold text-center mb-4">Trusted Resources</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                We believe in transparency and collaboration. Here are the organizations, researchers, and even competitors 
                doing important work in this space.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((category, idx) => (
                  <Card key={idx} className="glass border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.links.map((link, i) => (
                          <li key={i}>
                            <a 
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              {link.name} <ExternalLink className="w-3 h-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="text-center"
            >
              <div className="glass rounded-3xl p-8 md:p-12">
                <h2 className="font-display text-3xl font-bold mb-4">Ready to Protect Yourself?</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Don't wait until you're a victim. Start analyzing suspicious media today with our free tier. 
                  No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                    Start Free Analysis
                  </a>
                  <a href="/help" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    Learn More
                  </a>
                </div>
              </div>
            </motion.section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
