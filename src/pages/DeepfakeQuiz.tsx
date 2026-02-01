import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, 
  Trophy, Target, Eye, Ear, Video, Image, Shield, AlertTriangle,
  Clock, Award, Share2, Download, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { fireConfetti } from "@/hooks/use-confetti";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface QuizQuestion {
  id: string;
  category: "visual" | "audio" | "video" | "behavioral" | "technical";
  difficulty: "beginner" | "intermediate" | "advanced";
  question: string;
  context?: string;
  image?: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  source: string;
  sourceUrl: string;
  tips: string[];
}

const quizQuestions: QuizQuestion[] = [
  // VISUAL DETECTION - Face Analysis
  {
    id: "v1",
    category: "visual",
    difficulty: "beginner",
    question: "Which facial feature is MOST difficult for AI to generate consistently in deepfakes?",
    options: [
      { id: "a", text: "Nose shape and size", isCorrect: false },
      { id: "b", text: "Eye reflections and iris details", isCorrect: true },
      { id: "c", text: "Lip color and shape", isCorrect: false },
      { id: "d", text: "Cheekbone structure", isCorrect: false },
    ],
    explanation: "Eye reflections are one of the hardest things for AI to replicate. Real eyes show consistent reflections of the environment in both eyes, while deepfakes often have mismatched or missing reflections. The iris patterns and pupil shapes are also frequently inconsistent in AI-generated faces.",
    source: "MIT Media Lab",
    sourceUrl: "https://www.media.mit.edu/",
    tips: [
      "Zoom in on both eyes - reflections should match",
      "Check if light sources appear in both irises identically",
      "Look for unnatural pupil shapes or sizes between eyes",
    ],
  },
  {
    id: "v2",
    category: "visual",
    difficulty: "beginner",
    question: "What is a common telltale sign of AI-generated skin in deepfake images?",
    options: [
      { id: "a", text: "Too many freckles", isCorrect: false },
      { id: "b", text: "Visible wrinkles", isCorrect: false },
      { id: "c", text: "Plastic, overly smooth texture", isCorrect: true },
      { id: "d", text: "Natural skin blemishes", isCorrect: false },
    ],
    explanation: "AI often produces skin that looks unnaturally smooth, almost plastic-like. Real skin has pores, subtle imperfections, fine lines, and texture variations. The 'uncanny valley' effect from too-perfect skin is a major indicator of synthetic generation.",
    source: "Alan Turing Institute",
    sourceUrl: "https://www.turing.ac.uk/",
    tips: [
      "Real skin has visible pores, especially on the nose and cheeks",
      "Look for natural asymmetry in facial features",
      "Check for consistent skin texture across the entire face",
    ],
  },
  {
    id: "v3",
    category: "visual",
    difficulty: "intermediate",
    question: "In a suspected deepfake image, what should you examine around the hairline?",
    options: [
      { id: "a", text: "Hair color consistency", isCorrect: false },
      { id: "b", text: "Blurring, artifacts, or unnatural transitions", isCorrect: true },
      { id: "c", text: "Number of hair strands", isCorrect: false },
      { id: "d", text: "Hair style appropriateness", isCorrect: false },
    ],
    explanation: "The hairline is extremely challenging for AI to generate convincingly. Look for blurring where hair meets skin, floating or disconnected strands, unnatural transitions, and artifacts. Real hair has individual strands with natural variation.",
    source: "ESET Cybersecurity",
    sourceUrl: "https://www.eset.com/",
    tips: [
      "Zoom to 200%+ and examine the hairline boundary",
      "Check for 'swimming' or blurred edges where hair meets forehead",
      "Look for hair that seems painted on rather than individual strands",
    ],
  },
  {
    id: "v4",
    category: "visual",
    difficulty: "intermediate",
    question: "What ear-related detail is commonly wrong in deepfake faces?",
    options: [
      { id: "a", text: "Ears are too small", isCorrect: false },
      { id: "b", text: "Ears are different shapes from each other", isCorrect: true },
      { id: "c", text: "Ears have too many curves", isCorrect: false },
      { id: "d", text: "Earlobes are attached", isCorrect: false },
    ],
    explanation: "AI often generates asymmetrical ears that don't match the same person. While real ears have natural slight differences, deepfakes can show dramatically different ear shapes, sizes, or even different attachment styles between left and right ears.",
    source: "Stanford HAI",
    sourceUrl: "https://hai.stanford.edu/",
    tips: [
      "Compare both ears for structural consistency",
      "Check earlobe attachment style matches on both sides",
      "Look for missing ear details like cartilage folds",
    ],
  },
  {
    id: "v5",
    category: "visual",
    difficulty: "advanced",
    question: "What is 'frequency analysis' used for in deepfake detection?",
    options: [
      { id: "a", text: "Measuring how often someone blinks", isCorrect: false },
      { id: "b", text: "Detecting unnatural patterns in image compression artifacts", isCorrect: true },
      { id: "c", text: "Counting the number of pixels", isCorrect: false },
      { id: "d", text: "Measuring audio frequencies", isCorrect: false },
    ],
    explanation: "Frequency analysis examines the underlying patterns in how an image is constructed at a data level. AI-generated images leave distinctive 'fingerprints' in their frequency patterns that differ from real camera-captured images, even when invisible to the naked eye.",
    source: "Berkeley AI Research",
    sourceUrl: "https://bair.berkeley.edu/",
    tips: [
      "This requires specialized software tools",
      "GAN-generated images have distinctive high-frequency patterns",
      "JPEG compression artifacts differ between real and fake",
    ],
  },

  // AUDIO DETECTION
  {
    id: "a1",
    category: "audio",
    difficulty: "beginner",
    question: "What is a key indicator of AI-cloned voice in audio?",
    options: [
      { id: "a", text: "Too loud volume", isCorrect: false },
      { id: "b", text: "Unnatural breathing patterns or complete absence of breathing", isCorrect: true },
      { id: "c", text: "High pitch voice", isCorrect: false },
      { id: "d", text: "Speaking too fast", isCorrect: false },
    ],
    explanation: "Real human speech includes natural breathing sounds, pauses for breath, and subtle variations. AI-cloned voices often lack these organic elements or have them placed at unnatural intervals. Pay attention to whether breathing sounds authentic or mechanical.",
    source: "FBI IC3",
    sourceUrl: "https://www.ic3.gov/",
    tips: [
      "Listen for natural inhales before sentences",
      "Real speech has micro-pauses and filler sounds",
      "Cloned voices often sound too 'clean' without background ambient noise",
    ],
  },
  {
    id: "a2",
    category: "audio",
    difficulty: "intermediate",
    question: "In a suspected scam call using voice cloning, what question can help verify identity?",
    options: [
      { id: "a", text: "Ask their name", isCorrect: false },
      { id: "b", text: "Ask about a shared memory only they would know", isCorrect: true },
      { id: "c", text: "Ask them to speak louder", isCorrect: false },
      { id: "d", text: "Ask where they are calling from", isCorrect: false },
    ],
    explanation: "Scammers using voice cloning technology can mimic someone's voice but cannot access their memories or personal knowledge. Asking about specific shared experiences, inside jokes, or family secrets can expose an impersonator immediately.",
    source: "FTC Consumer Protection",
    sourceUrl: "https://www.ftc.gov/",
    tips: [
      "Establish a family 'safe word' for emergencies",
      "Ask questions only the real person could answer",
      "If they claim to be in trouble, hang up and call them back directly",
    ],
  },
  {
    id: "a3",
    category: "audio",
    difficulty: "intermediate",
    question: "What audio quality issue is common in deepfake voice recordings?",
    options: [
      { id: "a", text: "Too much bass", isCorrect: false },
      { id: "b", text: "Static noise", isCorrect: false },
      { id: "c", text: "Robotic tone or unnatural emotional inflection", isCorrect: true },
      { id: "d", text: "Echo effects", isCorrect: false },
    ],
    explanation: "AI voice cloning struggles with emotional authenticity. Listen for voices that sound flat, robotic, or have emotions that don't match the context. Real human speech naturally varies in tone, pitch, and emotion throughout a conversation.",
    source: "CISA",
    sourceUrl: "https://www.cisa.gov/",
    tips: [
      "Emotional stress should affect voice naturally",
      "Listen for unnaturally consistent tone throughout",
      "Real voices crack, waver, or change with emotion",
    ],
  },
  {
    id: "a4",
    category: "audio",
    difficulty: "advanced",
    question: "What is 'spectral analysis' in audio deepfake detection?",
    options: [
      { id: "a", text: "Looking at the color spectrum of video", isCorrect: false },
      { id: "b", text: "Analyzing frequency patterns that reveal synthetic audio signatures", isCorrect: true },
      { id: "c", text: "Measuring how loud the audio is", isCorrect: false },
      { id: "d", text: "Counting the number of words spoken", isCorrect: false },
    ],
    explanation: "Spectral analysis visualizes audio as a spectrogram showing frequency patterns over time. AI-generated audio leaves distinctive patterns in these visualizations that differ from naturally recorded human speech, including unusual harmonic structures.",
    source: "MIT CSAIL",
    sourceUrl: "https://www.csail.mit.edu/",
    tips: [
      "Requires specialized audio analysis software",
      "AI voices often lack certain harmonic frequencies",
      "Look for unnatural patterns in voice formants",
    ],
  },

  // VIDEO DETECTION
  {
    id: "vd1",
    category: "video",
    difficulty: "beginner",
    question: "What should you watch for when examining a suspected deepfake video?",
    options: [
      { id: "a", text: "The video resolution", isCorrect: false },
      { id: "b", text: "Lip sync mismatches with audio", isCorrect: true },
      { id: "c", text: "The length of the video", isCorrect: false },
      { id: "d", text: "Background music", isCorrect: false },
    ],
    explanation: "One of the most reliable ways to spot a deepfake video is watching for lip sync issues. The lips should perfectly match the audio in real videos. Deepfakes often have subtle delays or mismatches between lip movements and spoken words.",
    source: "Reuters Fact Check",
    sourceUrl: "https://www.reuters.com/fact-check/",
    tips: [
      "Watch at 0.5x speed to catch subtle mismatches",
      "Focus on consonants like 'B', 'M', 'P' that require lip closure",
      "Listen with eyes closed, then watch without sound to compare",
    ],
  },
  {
    id: "vd2",
    category: "video",
    difficulty: "beginner",
    question: "What unnatural blinking pattern is common in older deepfake videos?",
    options: [
      { id: "a", text: "Blinking too fast", isCorrect: false },
      { id: "b", text: "Blinking too slowly or not at all", isCorrect: true },
      { id: "c", text: "Blinking only one eye", isCorrect: false },
      { id: "d", text: "Blinking while speaking", isCorrect: false },
    ],
    explanation: "Early deepfakes often showed subjects with significantly reduced blinking or no blinking at all. While newer deepfakes have improved, unnatural blink rates remain a red flag. Humans typically blink 15-20 times per minute.",
    source: "University at Albany AI Research",
    sourceUrl: "https://www.albany.edu/",
    tips: [
      "Count blinks over 30 seconds - should be 7-10 blinks minimum",
      "Watch for unnaturally simultaneous or mechanical blinking",
      "Extended staring without blinking is a red flag",
    ],
  },
  {
    id: "vd3",
    category: "video",
    difficulty: "intermediate",
    question: "What happens to the face boundary in many deepfake videos?",
    options: [
      { id: "a", text: "It becomes sharper", isCorrect: false },
      { id: "b", text: "It flickers, blurs, or shifts during movement", isCorrect: true },
      { id: "c", text: "It changes color", isCorrect: false },
      { id: "d", text: "It disappears completely", isCorrect: false },
    ],
    explanation: "The edges where the swapped face meets the original video often show artifacts. Watch for flickering around the jawline, blurring when the head moves, or the face appearing to 'swim' on the head during rapid movements.",
    source: "Sensity AI",
    sourceUrl: "https://sensity.ai/",
    tips: [
      "Watch frame-by-frame during head turns",
      "Look for color mismatches at face edges",
      "The chin and jawline are particularly problematic areas",
    ],
  },
  {
    id: "vd4",
    category: "video",
    difficulty: "intermediate",
    question: "What lighting inconsistency reveals many deepfakes?",
    options: [
      { id: "a", text: "The room is too dark", isCorrect: false },
      { id: "b", text: "Shadows on the face don't match the environment lighting", isCorrect: true },
      { id: "c", text: "The video is overexposed", isCorrect: false },
      { id: "d", text: "There are lens flares", isCorrect: false },
    ],
    explanation: "Deepfakes often fail to properly match the lighting conditions of the source video. Look for shadows that fall in the wrong direction, inconsistent highlights, or faces that seem lit differently than the surrounding environment.",
    source: "GIJN Verification Guide",
    sourceUrl: "https://gijn.org/",
    tips: [
      "Check if facial shadows match shadows of other objects",
      "Light source direction should be consistent across the frame",
      "Watch for unnaturally flat or inconsistent lighting on the face",
    ],
  },
  {
    id: "vd5",
    category: "video",
    difficulty: "advanced",
    question: "What is 'temporal consistency' in deepfake detection?",
    options: [
      { id: "a", text: "The video plays at the correct speed", isCorrect: false },
      { id: "b", text: "Facial features maintain coherent appearance across frames over time", isCorrect: true },
      { id: "c", text: "The timestamp on the video is accurate", isCorrect: false },
      { id: "d", text: "The video was uploaded recently", isCorrect: false },
    ],
    explanation: "Temporal consistency refers to how well facial features maintain their appearance from frame to frame. In deepfakes, features may subtly shift, distort, or change appearance between frames in ways that wouldn't occur in real video.",
    source: "IEEE Computer Vision",
    sourceUrl: "https://www.ieee.org/",
    tips: [
      "Step through video frame-by-frame to spot inconsistencies",
      "Watch for features that briefly distort during movement",
      "Pay attention to earrings, glasses, or other accessories that may glitch",
    ],
  },

  // BEHAVIORAL INDICATORS
  {
    id: "b1",
    category: "behavioral",
    difficulty: "beginner",
    question: "What behavioral red flag indicates a potential romance scam using fake photos/videos?",
    options: [
      { id: "a", text: "They want to meet in person right away", isCorrect: false },
      { id: "b", text: "They always have excuses to avoid video calls", isCorrect: true },
      { id: "c", text: "They share too many photos", isCorrect: false },
      { id: "d", text: "They respond too quickly", isCorrect: false },
    ],
    explanation: "Romance scammers using fake identities (often with stolen or AI-generated photos) will consistently avoid live video calls where they'd be exposed. They create elaborate excuses: broken camera, bad internet, military restrictions, etc.",
    source: "FTC Romance Scam Report",
    sourceUrl: "https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2023/02/romance-scammers-favorite-lies-exposed",
    tips: [
      "Insist on a live video call before developing feelings",
      "Be wary of anyone whose camera is 'always broken'",
      "Reverse image search their photos on Google Images",
    ],
  },
  {
    id: "b2",
    category: "behavioral",
    difficulty: "beginner",
    question: "In a 'virtual kidnapping' scam call, what should you do first?",
    options: [
      { id: "a", text: "Pay the ransom immediately", isCorrect: false },
      { id: "b", text: "Hang up and directly contact the alleged victim", isCorrect: true },
      { id: "c", text: "Ask the caller for proof", isCorrect: false },
      { id: "d", text: "Call the police while on the phone", isCorrect: false },
    ],
    explanation: "Virtual kidnapping scams use AI-cloned voices to impersonate family members. The FBI advises hanging up and calling the 'victim' directly on their known number. Scammers create urgency to prevent verification - don't let them control the situation.",
    source: "FBI IC3 Public Service Announcement",
    sourceUrl: "https://www.ic3.gov/",
    tips: [
      "Scammers want to keep you on the line to prevent verification",
      "Establish a family code word for emergencies",
      "Real emergencies can be verified with a 30-second call",
    ],
  },
  {
    id: "b3",
    category: "behavioral",
    difficulty: "intermediate",
    question: "What is a 'pig butchering' scam and how do deepfakes enhance it?",
    options: [
      { id: "a", text: "A farming fraud scheme", isCorrect: false },
      { id: "b", text: "A romance scam that uses fake personas to build trust before investment fraud", isCorrect: true },
      { id: "c", text: "A meat industry scam", isCorrect: false },
      { id: "d", text: "A social media phishing scheme", isCorrect: false },
    ],
    explanation: "Pig butchering (sha zhu pan) involves 'fattening up' victims with fake romance/friendship using AI-generated photos and deepfake videos, then 'slaughtering' them through fake cryptocurrency investments. Losses exceeded $3.3 billion in 2024.",
    source: "Chainalysis Crypto Crime Report",
    sourceUrl: "https://www.chainalysis.com/",
    tips: [
      "Be suspicious of online romances that quickly turn to investment advice",
      "Never invest based on recommendations from people you haven't met in person",
      "Legitimate investments don't require crypto transactions to strangers",
    ],
  },
  {
    id: "b4",
    category: "behavioral",
    difficulty: "intermediate",
    question: "What pressure tactic do scammers commonly use with deepfake evidence?",
    options: [
      { id: "a", text: "Offering rewards", isCorrect: false },
      { id: "b", text: "Creating extreme urgency with time limits", isCorrect: true },
      { id: "c", text: "Sending gifts first", isCorrect: false },
      { id: "d", text: "Being very patient", isCorrect: false },
    ],
    explanation: "Scammers create artificial urgency ('your son needs bail in 2 hours', 'your account will be frozen in 30 minutes') to prevent victims from thinking clearly or verifying the situation. This is a universal red flag across all scam types.",
    source: "AARP Fraud Watch Network",
    sourceUrl: "https://www.aarp.org/money/scams-fraud/",
    tips: [
      "Legitimate organizations never demand immediate payment",
      "Step back and take 10 minutes before any urgent money request",
      "Scammers hate when you say 'let me verify this first'",
    ],
  },

  // TECHNICAL KNOWLEDGE
  {
    id: "t1",
    category: "technical",
    difficulty: "beginner",
    question: "What does 'GAN' stand for in deepfake technology?",
    options: [
      { id: "a", text: "General Artificial Network", isCorrect: false },
      { id: "b", text: "Generative Adversarial Network", isCorrect: true },
      { id: "c", text: "Global Analysis Node", isCorrect: false },
      { id: "d", text: "Graphical Animation Network", isCorrect: false },
    ],
    explanation: "GANs are the core technology behind most deepfakes. They consist of two neural networks competing against each other - one generates fake content while the other tries to detect it. This 'adversarial' process improves the fake's quality over time.",
    source: "OpenAI Research",
    sourceUrl: "https://openai.com/",
    tips: [
      "Understanding the technology helps you spot its limitations",
      "GANs struggle with rare scenarios not in training data",
      "Each GAN model leaves distinctive 'fingerprints'",
    ],
  },
  {
    id: "t2",
    category: "technical",
    difficulty: "intermediate",
    question: "Why are 'face swap' deepfakes harder to detect than fully generated faces?",
    options: [
      { id: "a", text: "They use more computing power", isCorrect: false },
      { id: "b", text: "They retain real background and context from source video", isCorrect: true },
      { id: "c", text: "They are always higher resolution", isCorrect: false },
      { id: "d", text: "They are made by experts only", isCorrect: false },
    ],
    explanation: "Face swap deepfakes are challenging because everything except the face is real - the lighting, background, body language, and context. Only the face is synthetic, making it harder to spot anomalies compared to fully AI-generated content.",
    source: "Microsoft AI Research",
    sourceUrl: "https://www.microsoft.com/en-us/research/",
    tips: [
      "Focus on the boundary between swapped face and neck",
      "Check if lighting on face matches rest of scene",
      "Watch for micro-expressions that seem inconsistent",
    ],
  },
  {
    id: "t3",
    category: "technical",
    difficulty: "advanced",
    question: "What is 'adversarial perturbation' in the context of deepfakes?",
    options: [
      { id: "a", text: "A type of video editing", isCorrect: false },
      { id: "b", text: "Invisible changes to images that disrupt AI generation", isCorrect: true },
      { id: "c", text: "A deepfake creation technique", isCorrect: false },
      { id: "d", text: "A video compression method", isCorrect: false },
    ],
    explanation: "Adversarial perturbations are subtle, often invisible modifications to images that prevent AI from accurately processing them. This technology is being developed for proactive deepfake prevention - 'poisoning' photos so they can't be used in deepfakes.",
    source: "University of Chicago SAND Lab",
    sourceUrl: "https://sandlab.cs.uchicago.edu/",
    tips: [
      "Tools like 'Fawkes' and 'PhotoGuard' add these perturbations",
      "Works by confusing the AI's facial recognition",
      "Represents the future of proactive deepfake defense",
    ],
  },
  {
    id: "t4",
    category: "technical",
    difficulty: "advanced",
    question: "What emerging standard aims to prove media authenticity at the source?",
    options: [
      { id: "a", text: "JPEG 2000", isCorrect: false },
      { id: "b", text: "C2PA (Coalition for Content Provenance and Authenticity)", isCorrect: true },
      { id: "c", text: "MP4 verification", isCorrect: false },
      { id: "d", text: "Deep Verify 3.0", isCorrect: false },
    ],
    explanation: "C2PA is an industry standard being adopted by Adobe, Microsoft, Intel, and major camera manufacturers. It cryptographically signs media at creation time, creating an unbreakable chain of custody that proves when, where, and how content was created.",
    source: "C2PA Coalition",
    sourceUrl: "https://c2pa.org/",
    tips: [
      "Look for C2PA 'Content Credentials' badges on images",
      "Major platforms are implementing verification",
      "Camera manufacturers are building this into hardware",
    ],
  },
];

const categoryConfig = {
  visual: { icon: Eye, color: "text-blue-500", bg: "bg-blue-500/20", label: "Visual Detection" },
  audio: { icon: Ear, color: "text-green-500", bg: "bg-green-500/20", label: "Audio Detection" },
  video: { icon: Video, color: "text-purple-500", bg: "bg-purple-500/20", label: "Video Analysis" },
  behavioral: { icon: Shield, color: "text-orange-500", bg: "bg-orange-500/20", label: "Behavioral Signs" },
  technical: { icon: Brain, color: "text-cyan-500", bg: "bg-cyan-500/20", label: "Technical Knowledge" },
};

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-600",
  intermediate: "bg-yellow-500/20 text-yellow-600",
  advanced: "bg-red-500/20 text-red-600",
};

const DeepfakeQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(quizQuestions.length).fill(null));
  const [quizComplete, setQuizComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  // Using fireConfetti directly from hooks

  useEffect(() => {
    if (!quizComplete) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizComplete, startTime]);

  const question = quizQuestions[currentQuestion];
  const CategoryIcon = categoryConfig[question.category].icon;

  const handleAnswer = (optionId: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(optionId);
    const isCorrect = question.options.find(o => o.id === optionId)?.isCorrect || false;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = isCorrect;
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      if (score / quizQuestions.length >= 0.8) {
        fireConfetti();
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(c => c - 1);
      setSelectedAnswer(answers[currentQuestion - 1] !== null ? "reviewed" : null);
      setShowExplanation(answers[currentQuestion - 1] !== null);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers(Array(quizQuestions.length).fill(null));
    setQuizComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGrade = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return { grade: "A+", title: "Deepfake Expert", color: "text-green-500" };
    if (percentage >= 80) return { grade: "A", title: "Detection Pro", color: "text-green-600" };
    if (percentage >= 70) return { grade: "B", title: "Skilled Spotter", color: "text-blue-500" };
    if (percentage >= 60) return { grade: "C", title: "Learning Detective", color: "text-yellow-500" };
    return { grade: "D", title: "Beginner", color: "text-orange-500" };
  };

  return (
    <>
      <Helmet>
        <title>Deepfake Detection Quiz | Test Your Skills | DeepGuard</title>
        <meta name="description" content="Take our comprehensive deepfake detection quiz to test your ability to spot AI-generated content. Learn visual, audio, and behavioral detection techniques with expert explanations." />
        <meta name="keywords" content="deepfake quiz, deepfake detection test, spot fake videos, AI image detection, synthetic media quiz" />
        <link rel="canonical" href="https://deepguard.ai/quiz" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Badge className="mb-4 bg-primary/20 text-primary">
                <Brain className="w-3 h-3 mr-1" />
                {quizQuestions.length} Questions
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Deepfake Detection Quiz
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Test your ability to spot AI-generated content. Learn expert techniques 
                for identifying deepfakes in images, videos, and audio.
              </p>
            </motion.div>

            {!quizComplete ? (
              <>
                {/* Progress */}
                <Card className="mb-6 glass border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </span>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(elapsedTime)}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Target className="w-3 h-3" />
                          {score} correct
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(currentQuestion / quizQuestions.length) * 100} className="h-2" />
                    
                    {/* Question dots */}
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {answers.map((answer, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            answer === true
                              ? "bg-green-500"
                              : answer === false
                              ? "bg-red-500"
                              : i === currentQuestion
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="glass border-border/50 mb-6">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-2 rounded-lg ${categoryConfig[question.category].bg}`}>
                            <CategoryIcon className={`w-4 h-4 ${categoryConfig[question.category].color}`} />
                          </div>
                          <Badge variant="outline">{categoryConfig[question.category].label}</Badge>
                          <Badge className={difficultyColors[question.difficulty]}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{question.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {question.options.map((option) => {
                          const isSelected = selectedAnswer === option.id;
                          const showResult = showExplanation;
                          const isCorrect = option.isCorrect;

                          return (
                            <motion.button
                              key={option.id}
                              whileHover={!selectedAnswer ? { scale: 1.01 } : {}}
                              whileTap={!selectedAnswer ? { scale: 0.99 } : {}}
                              onClick={() => handleAnswer(option.id)}
                              disabled={!!selectedAnswer}
                              className={`w-full p-4 rounded-lg border text-left transition-all ${
                                showResult && isCorrect
                                  ? "border-green-500 bg-green-500/10"
                                  : showResult && isSelected && !isCorrect
                                  ? "border-red-500 bg-red-500/10"
                                  : isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50 hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option.text}</span>
                                {showResult && (
                                  isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : isSelected ? (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                  ) : null
                                )}
                              </div>
                            </motion.button>
                          );
                        })}

                        {/* Explanation */}
                        <AnimatePresence>
                          {showExplanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6 space-y-4"
                            >
                              <Card className="bg-muted/50 border-border/50">
                                <CardContent className="pt-6">
                                  <div className="flex items-start gap-3">
                                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                    <div>
                                      <h4 className="font-semibold mb-2">Explanation</h4>
                                      <p className="text-muted-foreground">{question.explanation}</p>
                                      
                                      <div className="mt-4">
                                        <h5 className="font-semibold text-sm mb-2">Detection Tips:</h5>
                                        <ul className="space-y-1">
                                          {question.tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                              <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                              {tip}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      <a
                                        href={question.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                                      >
                                        Source: {question.source}
                                        <ArrowRight className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={nextQuestion}
                    disabled={!showExplanation}
                  >
                    {currentQuestion === quizQuestions.length - 1 ? "See Results" : "Next Question"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              /* Results */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass border-border/50 text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      <Trophy className={`w-16 h-16 ${getGrade().color}`} />
                    </div>
                    <CardTitle className="text-3xl">{getGrade().title}</CardTitle>
                    <CardDescription>
                      You scored {score} out of {quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className={`text-6xl font-bold ${getGrade().color}`}>
                      {getGrade().grade}
                    </div>

                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Time: {formatTime(elapsedTime)}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Award className="w-3 h-3" />
                        Accuracy: {Math.round((score / quizQuestions.length) * 100)}%
                      </Badge>
                    </div>

                    {/* Category breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-6">
                      {Object.entries(categoryConfig).map(([cat, config]) => {
                        const catQuestions = quizQuestions.filter(q => q.category === cat);
                        const catCorrect = catQuestions.filter((q, i) => {
                          const qIndex = quizQuestions.indexOf(q);
                          return answers[qIndex] === true;
                        }).length;
                        const Icon = config.icon;
                        return (
                          <Card key={cat} className="p-3 bg-muted/30">
                            <div className={`p-2 rounded-lg ${config.bg} w-fit mx-auto mb-2`}>
                              <Icon className={`w-4 h-4 ${config.color}`} />
                            </div>
                            <div className="text-xs text-muted-foreground">{config.label}</div>
                            <div className="font-bold">{catCorrect}/{catQuestions.length}</div>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="flex justify-center gap-3 mt-6">
                      <Button onClick={restartQuiz} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Results
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mt-6">
                      Want to learn more? Visit our{" "}
                      <a href="/about" className="text-primary hover:underline">comprehensive detection guide</a>{" "}
                      with 50+ expert tips and real-world case studies.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DeepfakeQuiz;
