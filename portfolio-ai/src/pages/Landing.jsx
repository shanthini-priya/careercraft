import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Layout, 
  Code2, 
  Zap, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { SAMPLE_PROFILE as sampleProfile, saveProfile } from '../storage.js';
import { navigate, ROUTES } from '../router.js';

export default function Landing({ onOpenSettings }) {
  const [sampleLoaded, setSampleLoaded] = useState(false);

  // 1-Click: Load Sample Data and jump straight to Templates view
  const handleLoadSampleAndExplore = () => {
    setSampleLoaded(true);
    saveProfile(sampleProfile);
    setTimeout(() => {
      navigate(ROUTES.TEMPLATES);
    }, 250);
  };

  // Jump to form to start fresh
  const handleStartFromScratch = () => {
    navigate(ROUTES.PROFILE);
  };

  const features = [
    {
      title: "Google XYZ Bullet Points",
      desc: "Automatically quantify career achievements using the proven formula: Accomplished [X], measured by [Y], by doing [Z].",
      icon: Zap
    },
    {
      title: "4 Curated Web Themes",
      desc: "Switch between Modern Minimalist, Tech Neo-Slate, Creative Indigo, and Executive Classic in real time.",
      icon: Layout
    },
    {
      title: "ATS-Grade Resume Engine",
      desc: "Deterministic recruiter parsing compliance checks with high-contrast typography and instant PDF export.",
      icon: FileText
    },
    {
      title: "100% Client-Side Privacy",
      desc: "Runs completely in your browser via LocalStorage. No databases, third-party trackers, or login barriers.",
      icon: ShieldCheck
    },
    {
      title: "Skills Matrix & Alignment",
      desc: "Categorize languages, frameworks, cloud tools, and core competencies with ATS role alignment.",
      icon: Code2
    },
    {
      title: "Zero-Cost Offline Mode",
      desc: "Built-in offline mock heuristic engine drafts rich bullet points and summaries without an API key or cost.",
      icon: Sparkles
    }
  ];

  const workflowSteps = [
    {
      num: "01",
      title: "Profile Input",
      desc: "Fill in contact info, education, skills, projects, and work history with clean inline validation."
    },
    {
      num: "02",
      title: "AI Metric Tuning",
      desc: "Transform plain job duties into high-impact, quantifiable bullets using offline or live LLM logic."
    },
    {
      num: "03",
      title: "Theme Customization",
      desc: "Preview 4 responsive layouts, fine-tune color accents, and toggle light/dark modes instantly."
    },
    {
      num: "04",
      title: "Instant Export",
      desc: "Download a standalone HTML website, print a clean ATS PDF resume, or export a JSON backup."
    }
  ];

  return (
    <div className="min-h-screen bg-token-bg text-token-text flex flex-col selection:bg-token-accent selection:text-white transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30 dark:opacity-100 transition-opacity">
        <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[25%] right-[15%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-token-border bg-token-card text-xs font-semibold tracking-wide mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-token-accent animate-pulse" />
          <span className="text-token-muted">AI-Assisted Career Asset Generator</span>
          <span className="text-token-muted">•</span>
          <span className="text-token-accent font-bold">100% Free & Client-Side</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-token-text">
          Turn Your Skills Into a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-token-accent via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Recruiter-Ready Portfolio & ATS Resume
          </span>
        </h1>

        {/* Crisp Subheading */}
        <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-token-muted leading-relaxed font-normal">
          Designed for developers, designers, and students. Craft quantifiable project bullet points, generate ATS-friendly resumes, and deploy polished web portfolios in minutes.
        </p>

        {/* Two Clear Well-Spaced CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={handleStartFromScratch}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-token-accent hover:opacity-90 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Create My Career Assets</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            onClick={handleLoadSampleAndExplore}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-text font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {sampleLoaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-token-accent" />
                <span>Loading Sample...</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-token-muted" />
                <span>Try 1-Click Sample Demo</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs uppercase tracking-widest font-bold text-token-accent">
            Core Modules
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-token-text">
            Built for early-career impact.
          </h3>
          <p className="text-token-muted text-xs sm:text-sm">
            Everything you need to pass ATS screening and impress engineering recruiters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl border border-token-border bg-token-card shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-token-accent/10 border border-token-border flex items-center justify-center mb-4 text-token-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-token-text mb-1.5 tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-token-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-token-border bg-token-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs uppercase tracking-widest font-bold text-token-accent">
              Workflow
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-token-text">
              How PortfolioAI Works
            </h3>
            <p className="text-token-muted text-xs sm:text-sm">
              Four straightforward steps from initial input to production deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl border border-token-border bg-token-card shadow-sm space-y-2.5"
              >
                <span className="text-2xl font-black text-token-accent font-mono block">
                  {step.num}
                </span>
                <h5 className="font-bold text-sm text-token-text">
                  {step.title}
                </h5>
                <p className="text-xs text-token-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="mt-auto py-8 border-t border-token-border text-xs text-token-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-token-accent flex items-center justify-center text-white font-bold text-[10px]">
              P
            </div>
            <span className="font-semibold text-token-text">PortfolioAI</span>
            <span>— AI-Assisted Career Asset Generator</span>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(ROUTES.PROFILE)} 
              className="hover:text-token-text transition"
            >
              Profile
            </button>
            <button 
              onClick={() => navigate(ROUTES.TEMPLATES)} 
              className="hover:text-token-text transition"
            >
              Templates
            </button>
            <button 
              onClick={() => navigate(ROUTES.RESUME, { tab: 'resume' })} 
              className="hover:text-token-text transition"
            >
              ATS Resume
            </button>
            <button 
              onClick={onOpenSettings} 
              className="hover:text-token-text transition"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}