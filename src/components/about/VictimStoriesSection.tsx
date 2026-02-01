import { motion } from "framer-motion";
import { Heart, Skull, Users, Video, ExternalLink, AlertTriangle, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const VictimStoriesSection = () => {
  const familyTragedies = [
    {
      title: "Father Takes His Life After Pig Butchering Scam",
      description: "Dennis Jones lost his entire life savings to a cryptocurrency romance scam. After realizing he'd been defrauded of everything he'd worked for, he took his own life. His children, Matt and Laura, now advocate for scam awareness.",
      source: "CNN Investigation",
      sourceUrl: "https://www.cnn.com/2024/06/17/asia/pig-butchering-scam-southeast-asia-dst-intl-hnk/index.html",
      impact: "Life savings lost, suicide",
      category: "Parent Lost"
    },
    {
      title: "'They Took His Life': Omaha Man's Father",
      description: "Monte Thompson was on a call with scammers just minutes before his body was found. His son Austin says the scammers 'took his life' after manipulating him into financial ruin through a romance scam.",
      source: "KETV Omaha",
      sourceUrl: "https://ketv.com/article/omaha-man-blames-scammers-for-fathers-suicide/62010291",
      impact: "Father's suicide, family devastated",
      category: "Parent Lost"
    },
    {
      title: "Elderly Man Believed He Was Dating a Celebrity",
      description: "An elderly man was convinced through an elaborate romance scam that he was in a long-distance relationship with a celebrity. After being extorted for over $100,000, he died by suicide. Two people were arrested.",
      source: "People Magazine",
      sourceUrl: "https://people.com/couple-accused-extorting-elderly-man-dating-celebrity-died-suicide-8415036",
      impact: "$100K+ extorted, death by suicide",
      category: "Grandparent Lost"
    },
    {
      title: "Woman's Mysterious Drowning: Romance Scam Epidemic",
      description: "CBS News investigation into a woman's mysterious drowning revealed she was a victim of a romance scam. Her death became a window into the nationwide epidemic affecting thousands of families.",
      source: "CBS News",
      sourceUrl: "https://www.cbsnews.com/news/romance-scam-epidemic-one-womans-mysterious-drowning/",
      impact: "Death under investigation",
      category: "Unexplained Death"
    },
    {
      title: "AARP: Suicide After a Scam - Family's Story",
      description: "The Perfect Scam podcast documents a family's heartbreaking journey after their father became obsessed with a romance scam, invested in fake opportunities, and ultimately took his own life when he realized the truth.",
      source: "AARP Perfect Scam Podcast",
      sourceUrl: "https://www.aarp.org/podcasts/the-perfect-scam/info-2024/suicide-after-scam.html",
      impact: "Documented in national podcast",
      category: "Parent Lost"
    },
  ];

  const teenSextortionDeaths = [
    {
      title: "38 Teen Boys Died by Suicide from Sextortion (2021-2025)",
      description: "A top FBI cybercrimes investigator revealed that 38 teenage boys in the US have died by suicide after falling victim to sextortion scammers. Two networks identified: Nigeria's Yahoo Boys (profit-motivated) and the US-Europe 764 gang (sexual sadists).",
      source: "New York Post",
      sourceUrl: "https://nypost.com/2025/12/10/us-news/38-us-teens-died-by-suicide-in-five-years-from-sextortion-scams/",
      stats: "38 confirmed deaths, 20% annual increase",
    },
    {
      title: "James Woods: 17-Year-Old Track Star",
      description: "James Woods, a college-bound 17-year-old track star, received 200 threatening messages in less than 20 hours after sharing an intimate image online. 'I own you' and 'you need to take your life' the scammer wrote. He died by suicide.",
      source: "CBS News",
      sourceUrl: "https://www.cbsnews.com/news/fbi-warning-financial-sextortion-minors-growing-threat-suicide/",
      stats: "200 messages in 20 hours",
    },
    {
      title: "Two Families Sue Meta Over Teen Deaths",
      description: "Two families filed lawsuits against Meta (Facebook/Instagram) after their teenage sons died by suicide following sextortion scams conducted through Instagram DMs. The families allege Meta failed to protect minors.",
      source: "NBC News",
      sourceUrl: "https://www.nbcnews.com/tech/social-media/two-families-sue-meta-teens-deaths-suicide-citing-sextortion-scams-rcna248136",
      stats: "Multiple lawsuits filed",
    },
    {
      title: "Bloomberg Investigation: Sextortion Driving Teen Suicides",
      description: "Bloomberg's in-depth investigation revealed how sextortion scams are systematically targeting teenage boys, using shame and fear to extract payments. When victims can't pay, scammers escalate threats, leading to tragic outcomes.",
      source: "Bloomberg",
      sourceUrl: "https://www.bloomberg.com/features/2024-sextortion-teen-suicides/",
      stats: "Nationwide epidemic documented",
    },
  ];

  const marketplaceViolence = [
    {
      title: "Facebook Marketplace: From Sale to Deadly Violence",
      description: "What began as an iPhone sale on Facebook Marketplace ended in a fatal shooting in Columbia, Missouri. Police linked multiple teens to a series of robberies arranged through the platform using phone data and surveillance.",
      source: "Criminally Obsessed / Police Reports",
      sourceUrl: "https://www.facebook.com/CrmnllyObsessed/posts/122212449812307297/",
      outcome: "Fatal shooting",
    },
    {
      title: "ProPublica: 1 Billion Users, Global Scam Target",
      description: "ProPublica investigation revealed how Facebook grew Marketplace to 1 billion users while scammers exploited the platform to target people worldwide. Meta removed 2 million accounts linked to pig-butchering scam networks.",
      source: "ProPublica",
      sourceUrl: "https://www.propublica.org/article/facebook-grew-marketplace-to-1-billion-users-now-scammers-are-using-it-to-target-people-around-the-world",
      outcome: "2M scam accounts removed",
    },
    {
      title: "Craigslist Couple Lured and Murdered",
      description: "Bud and June Runion were lured to buy a vintage car advertised on Craigslist. Ronnie Adrian Towns murdered them both. He was sentenced to two consecutive life sentences without parole.",
      source: "KBTX News",
      sourceUrl: "https://www.kbtx.com/2024/11/19/man-who-lured-couple-buy-vintage-car-craigslist-pleads-guilty-murder/",
      outcome: "Double homicide, life sentence",
    },
    {
      title: "Meta Removes 2 Million Pig-Butchering Accounts",
      description: "Meta announced removal of 2 million accounts connected to organized crime scam centers. These networks operate from compounds in Southeast Asia, often using trafficked workers forced to run romance and investment scams.",
      source: "NBC News / Meta",
      sourceUrl: "https://www.nbcnews.com/tech/security/meta-removes-2-million-accounts-related-pig-butchering-scams-rcna181025",
      outcome: "Ongoing enforcement",
    },
  ];

  const nationwideStats = [
    {
      stat: "$12.5 Billion",
      description: "Total fraud losses reported to FTC in 2024",
      source: "FTC",
      sourceUrl: "https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024",
    },
    {
      stat: "$81.5 Billion",
      description: "Estimated actual losses to seniors (many go unreported)",
      source: "FTC / CNBC",
      sourceUrl: "https://www.cnbc.com/2025/12/13/financial-fraud-seniors-ftc.html",
    },
    {
      stat: "$2.4 Billion",
      description: "Reported losses by adults 60+ in 2024",
      source: "FTC Congress Report",
      sourceUrl: "https://www.ftc.gov/system/files/ftc_gov/pdf/P144400-OlderAdultsReportDec2025.pdf",
    },
    {
      stat: "4x Increase",
      description: "Fraud losses among adults 60+ since 2020",
      source: "WRAL / FTC",
      sourceUrl: "https://www.wral.com/consumer/5onyourside/ftc-report-older-americans-lose-more-to-scams-dec-2025/",
    },
    {
      stat: "68%",
      description: "Of senior losses are $100,000+ per incident",
      source: "CNBC / FTC",
      sourceUrl: "https://www.cnbc.com/2025/12/13/financial-fraud-seniors-ftc.html",
    },
    {
      stat: "$9.9 Billion",
      description: "Cryptocurrency scam losses in 2024 (40% YoY growth)",
      source: "Chainalysis",
      sourceUrl: "https://www.chainalysis.com/blog/2024-pig-butchering-scam-revenue-grows-yoy/",
    },
    {
      stat: "38 Teen Deaths",
      description: "Confirmed sextortion-related suicides (2021-2025)",
      source: "FBI / NY Post",
      sourceUrl: "https://nypost.com/2025/12/10/us-news/38-us-teens-died-by-suicide-in-five-years-from-sextortion-scams/",
    },
    {
      stat: "20% Annual Increase",
      description: "In sextortion incidents targeting minors",
      source: "FBI",
      sourceUrl: "https://abc7amarillo.com/news/nation-world/fbi-warns-of-escalating-online-sextortion-targeting-minors-financially-motivated-explicit-material-teens-children-parents-educators-victims-males-outside-united-states-increases-incidents-20-percent-suicides-law-enforcemenr-reporting",
    },
  ];

  const documentaries = [
    {
      title: "What Jennifer Did (Netflix, 2024)",
      description: "True crime documentary about Jennifer Pan's murder-for-hire plot. Controversy erupted when viewers noticed AI-manipulated images were used to depict the convicted killer, raising ethical questions about authenticity in documentaries.",
      platform: "Netflix",
      controversy: "AI-manipulated images controversy",
      sources: [
        { name: "Ars Technica", url: "https://arstechnica.com/tech-policy/2024/04/netflix-doc-accused-of-using-ai-to-manipulate-true-crime-story/" },
        { name: "Collider Analysis", url: "https://collider.com/what-jennifer-did-ai-netflix/" },
        { name: "IMDb News", url: "https://www.imdb.com/news/ni64544137/" },
      ]
    },
    {
      title: "Dirty Pop: The Boy Band Scam (Netflix, 2024)",
      description: "Documentary about Lou Pearlman, the late talent manager who defrauded *NSYNC, Backstreet Boys, and others. Netflix used AI to 'bring him back from the dead' for interviews, sparking debate about deepfake ethics in filmmaking.",
      platform: "Netflix",
      controversy: "AI resurrection of deceased criminal",
      sources: [
        { name: "Dexerto", url: "https://www.dexerto.com/tv-movies/netflix-true-crime-dirty-pop-artificial-intelligence-lou-pearlman-2836260/" },
      ]
    },
    {
      title: "The Perfect Scam Podcast (AARP)",
      description: "Weekly podcast featuring real scam victims and their families, including episodes on suicide after scams, romance fraud, and tech support scams targeting seniors.",
      platform: "AARP Podcast",
      controversy: "Victim advocacy",
      sources: [
        { name: "AARP Official", url: "https://www.aarp.org/podcasts/the-perfect-scam/" },
      ]
    },
  ];

  const videoTestimonies = [
    {
      title: "CNN: Killed by a Scam",
      description: "Investigative report featuring families who lost loved ones to pig-butchering scams. Includes footage of scam compounds in Southeast Asia and interviews with survivors.",
      duration: "6:02",
      type: "News Investigation",
      url: "https://www.cnn.com/2024/06/17/asia/pig-butchering-scam-southeast-asia-dst-intl-hnk/index.html",
    },
    {
      title: "CBS: Family Warns of Sextortion Dangers",
      description: "The Woods family shares their son James's story after he died by suicide following a sextortion attack. Raw, emotional testimony about the 200 threatening messages he received.",
      duration: "2:03",
      type: "Family Testimony",
      url: "https://www.cbsnews.com/news/fbi-warning-financial-sextortion-minors-growing-threat-suicide/",
    },
    {
      title: "NBC: Families Sue Meta Over Teen Deaths",
      description: "Two mothers speak about losing their teenage sons to sextortion. Tricia Maciejewski explains how a stranger was able to message her 13-year-old on Instagram.",
      duration: "News Report",
      type: "Legal Action",
      url: "https://www.nbcnews.com/tech/social-media/two-families-sue-meta-teens-deaths-suicide-citing-sextortion-scams-rcna248136",
    },
    {
      title: "KETV: 'They Took His Life'",
      description: "Austin Thompson describes the moments before finding his father's body, and his belief that scammers bear responsibility for driving his father to suicide.",
      duration: "News Report",
      type: "Family Testimony",
      url: "https://ketv.com/article/omaha-man-blames-scammers-for-fathers-suicide/62010291",
    },
  ];

  return (
    <>
      {/* Nationwide Statistics */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-16"
        id="usa-stats"
      >
        <h2 className="font-display text-3xl font-bold text-center mb-4">
          The Human Cost: USA Statistics
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Official government statistics reveal the devastating scale of fraud in America. 
          Behind every number is a family destroyed.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nationwideStats.map((item, idx) => (
            <a
              key={idx}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-4 text-center hover:border-primary/50 transition-colors group"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">
                {item.stat}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
              <Badge variant="outline" className="text-xs group-hover:bg-primary/10">
                {item.source} <ExternalLink className="w-2 h-2 ml-1" />
              </Badge>
            </a>
          ))}
        </div>
      </motion.section>

      {/* Video Testimonies */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
        id="video-testimonies"
      >
        <div className="glass rounded-3xl p-8 border-destructive/20">
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-8 h-8 text-destructive" />
            <h2 className="font-display text-3xl font-bold">Video Testimonies & Reports</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Real families sharing their stories. These videos contain difficult content but provide crucial awareness about the human impact of scams.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {videoTestimonies.map((video, idx) => (
              <a
                key={idx}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{video.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{video.type}</Badge>
                      {video.duration && (
                        <Badge variant="outline" className="text-xs">{video.duration}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Family Tragedies */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-16"
        id="family-tragedies"
      >
        <h2 className="font-display text-3xl font-bold text-center mb-4">
          <Skull className="w-8 h-8 inline-block mr-2 text-destructive" />
          When Scams Turn Fatal: Family Stories
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          These are real families who lost parents, grandparents, and loved ones to scam-related deaths. 
          We share these stories with permission to honor their memory and prevent future tragedies.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyTragedies.map((story, idx) => (
            <Card key={idx} className="glass border-destructive/20 hover:border-destructive/40 transition-colors">
              <CardHeader className="pb-2">
                <Badge variant="destructive" className="w-fit mb-2">{story.category}</Badge>
                <CardTitle className="text-base">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{story.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{story.impact}</Badge>
                  <a 
                    href={story.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {story.source} <ExternalLink className="w-2 h-2" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Teen Sextortion Deaths */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
        id="sextortion-deaths"
      >
        <div className="glass rounded-3xl p-8 border-destructive/30">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <h2 className="font-display text-3xl font-bold">Teen Sextortion: A National Crisis</h2>
              <p className="text-sm text-muted-foreground">FBI reports 20% annual increase in incidents</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {teenSextortionDeaths.map((case_, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                <h3 className="font-semibold mb-2">{case_.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{case_.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="text-xs">{case_.stats}</Badge>
                  <a 
                    href={case_.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {case_.source} <ExternalLink className="w-2 h-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Marketplace Violence */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-16"
        id="marketplace-crime"
      >
        <h2 className="font-display text-3xl font-bold text-center mb-4">
          Craigslist & Facebook Marketplace: Violent Crimes
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Online marketplaces have become hunting grounds for criminals. These platforms connect 
          buyers and sellers—but also victims and predators.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {marketplaceViolence.map((case_, idx) => (
            <Card key={idx} className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{case_.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{case_.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="destructive">{case_.outcome}</Badge>
                  <a 
                    href={case_.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {case_.source} <ExternalLink className="w-2 h-2" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Documentaries */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
        id="documentaries"
      >
        <h2 className="font-display text-3xl font-bold text-center mb-4">
          Documentaries & True Crime Reports
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Major streaming platforms and news organizations have documented the deepfake and scam epidemic. 
          Some documentaries have themselves sparked controversy for their use of AI.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {documentaries.map((doc, idx) => (
            <Card key={idx} className="glass border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge>{doc.platform}</Badge>
                </div>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                <Badge variant="secondary" className="mb-3">{doc.controversy}</Badge>
                <div className="flex flex-wrap gap-2">
                  {doc.sources.map((source, i) => (
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
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
    </>
  );
};

export default VictimStoriesSection;
