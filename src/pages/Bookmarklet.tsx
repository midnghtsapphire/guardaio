import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Bookmark, GripVertical, MousePointer, Image, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Bookmarklet = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Get the base URL for the app
  const baseUrl = window.location.origin;

  // Bookmarklet code that opens a popup with the selected image
  const bookmarkletCode = `javascript:(function(){
    var imgs=document.querySelectorAll('img');
    if(imgs.length===0){alert('No images found on this page.');return;}
    var overlay=document.createElement('div');
    overlay.id='deepguard-overlay';
    overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;';
    overlay.innerHTML='<div style="color:white;font-size:24px;margin-bottom:20px;font-weight:bold;">🛡️ DeepGuard</div><div style="color:white;font-size:16px;margin-bottom:20px;">Click on any image to analyze it for AI manipulation</div><div style="color:rgba(255,255,255,0.6);font-size:14px;">Press ESC to cancel</div>';
    document.body.appendChild(overlay);
    var style=document.createElement('style');
    style.textContent='#deepguard-overlay img{cursor:crosshair !important;outline:3px solid #22c55e !important;transition:outline 0.2s;}#deepguard-overlay img:hover{outline:3px solid #3b82f6 !important;}';
    document.head.appendChild(style);
    imgs.forEach(function(img){img.style.position='relative';img.style.zIndex='1000000';img.style.cursor='crosshair';});
    function cleanup(){overlay.remove();style.remove();imgs.forEach(function(img){img.style.position='';img.style.zIndex='';img.style.cursor='';});}
    overlay.onclick=function(e){if(e.target===overlay)cleanup();};
    document.onkeydown=function(e){if(e.key==='Escape')cleanup();};
    imgs.forEach(function(img){
      img.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        var src=img.src;
        cleanup();
        window.open('${baseUrl}/?analyze='+encodeURIComponent(src),'_blank','width=800,height=700');
      };
    });
  })();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Bookmarklet code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: GripVertical,
      title: "Drag to Bookmarks",
      description: "Drag the button below to your browser's bookmarks bar",
    },
    {
      icon: MousePointer,
      title: "Click on Any Page",
      description: "When viewing a page with images, click the bookmarklet",
    },
    {
      icon: Image,
      title: "Select an Image",
      description: "Click on any image to analyze it for AI manipulation",
    },
    {
      icon: CheckCircle,
      title: "View Results",
      description: "Get instant analysis showing if the image is AI-generated",
    },
  ];

  return (
    <>
      <Helmet>
        <title>DeepGuard Bookmarklet - Analyze Images Anywhere</title>
        <meta
          name="description"
          content="Install the DeepGuard bookmarklet to analyze any image on the web for AI manipulation with a single click."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Bookmark className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Browser Bookmarklet</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Analyze Images{" "}
              <span className="text-gradient">Anywhere on the Web</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Install our bookmarklet to instantly check if any image you encounter
              online is AI-generated or manipulated—no extension needed.
            </p>
          </motion.div>

          {/* Bookmarklet Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-6 mb-16"
          >
            <Card className="p-8 bg-card/50 backdrop-blur border-primary/20">
              <p className="text-muted-foreground mb-4 text-center">
                Drag this button to your bookmarks bar:
              </p>

              <div className="flex justify-center">
                <a
                  href={bookmarkletCode}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:shadow-glow-lg transition-all cursor-grab active:cursor-grabbing"
                  draggable="true"
                >
                  <Bookmark className="w-5 h-5" />
                  🛡️ DeepGuard Analyzer
                </a>
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Can't drag? Right-click and "Bookmark This Link"
              </p>
            </Card>

            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleCopy} className="gap-2">
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-2xl font-bold text-center mb-10">
              How It Works
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card
                  key={step.title}
                  className="p-6 bg-card/50 backdrop-blur border-border/50 relative"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <step.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Browser Compatibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mt-16"
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-primary" />
                Browser Compatibility
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This bookmarklet works with all major browsers:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Chrome", "Firefox", "Safari", "Edge", "Brave", "Opera"].map(
                  (browser) => (
                    <span
                      key={browser}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {browser}
                    </span>
                  )
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Bookmarklet;
