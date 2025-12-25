'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronRight,
  Timer,
  Moon,
  Pill,
  Activity,
  Heart,
  Brain,
  Stethoscope,
  Smile,
  Utensils,
  Smartphone,
  ShieldCheck,
  Check,
  Plus,
  ArrowRight,
  ExternalLink,
  Flame,
  Wind,
  Zap,
  Star,
  Sparkles,
  Droplets,
  Flower2,
  Users,
  Info
} from 'lucide-react';
import Link from 'next/link';

// --- Sub-components for better organization ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
            <Timer className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">ProFasting<span className="text-indigo-600">Health</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="#modules" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Modules</Link>
          <Link href="#pricing" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link href="#faq" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">FAQ</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-indigo-600 px-4">Log in</Link>
          <Link href="/dashboard" className="bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-0.5">
            Start for free
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="#features" className="font-bold text-slate-600" onClick={() => setIsMenuOpen(false)}>Features</Link>
          <Link href="#modules" className="font-bold text-slate-600" onClick={() => setIsMenuOpen(false)}>Modules</Link>
          <Link href="#pricing" className="font-bold text-slate-600" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
          <Link href="/dashboard" className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-center font-black">Start for free</Link>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">New: Support My Mind added</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            One app for your <span className="text-indigo-600">fasting</span> and everyday health.
          </h1>

          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
            Track fasting, sleep, medications, dental health, women&apos;s health, and more in one simple, science-backed dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-full text-lg font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-2 group">
              Start for free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-full text-lg font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              View live demo
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-[10px] font-black">{i}k+</div>
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-400">Join <span className="text-slate-900 underline decoration-indigo-300 decoration-2">12,000+</span> proactive adults</p>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 bg-white rounded-[3rem] p-4 shadow-[0_32px_64px_-16px_rgba(30,41,59,0.15)] border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* Mockup Content */}
            <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden">
              <div className="p-6 bg-white border-b border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Good Morning</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Friday, Dec 26</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                    <Users size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-600 rounded-3xl p-5 text-white">
                    <Timer size={24} className="mb-4" />
                    <p className="text-[10px] font-black uppercase opacity-60">Fasting</p>
                    <p className="text-2xl font-black tracking-tighter">14:22:05</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-5">
                    <Moon size={24} className="mb-4 text-blue-500" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Sleep Score</p>
                    <p className="text-2xl font-black text-slate-800">84/100</p>
                  </div>
                  <div className="bg-rose-50 rounded-3xl p-5 border border-rose-100">
                    <Heart size={24} className="mb-4 text-rose-500" />
                    <p className="text-[10px] font-black uppercase text-rose-400 tracking-tight">My Mind</p>
                    <p className="text-2xl font-black text-rose-900">Great</p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-5">
                    <Activity size={24} className="mb-4 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Steps</p>
                    <p className="text-2xl font-black text-slate-800">6,420</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-bounce transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">Status</p>
                <p className="text-sm font-black text-slate-900">Science-Backed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsStrip = () => {
  return (
    <div className="bg-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-8">
          <p className="text-white font-black tracking-tight text-xl w-full lg:w-auto text-center lg:text-left">
            Built for busy adults who want <span className="text-indigo-400 underline underline-offset-4">simple health tracking</span>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16 flex-1 max-w-3xl border-l border-white/10 lg:pl-16">
            <div className="text-center lg:text-left">
              <p className="text-indigo-400 text-3xl font-black mb-1">12+</p>
              <p className="text-white/50 text-xs font-black uppercase tracking-widest">Health Areas</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-indigo-400 text-3xl font-black mb-1">0%</p>
              <p className="text-white/50 text-xs font-black uppercase tracking-widest">Ads / Data Selling</p>
            </div>
            <div className="text-center lg:text-left hidden md:block">
              <p className="text-emerald-400 text-3xl font-black mb-1">24/7</p>
              <p className="text-white/50 text-xs font-black uppercase tracking-widest">Health Partner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Stay on track with fasting",
      icon: Timer,
      color: "bg-blue-50 text-blue-600",
      points: ["Smart fasting timer", "Mood & weight logs", "Fasting history & streaks"]
    },
    {
      title: "Look after your daily health",
      icon: Activity,
      color: "bg-indigo-50 text-indigo-600",
      points: ["Sleep diary & quality tracking", "Medication manager", "Activity & symptom tracking"]
    },
    {
      title: "Support women's health",
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
      points: ["Period & ovulation tracker", "Pregnancy tracking", "Body literacy guides"]
    },
    {
      title: "Learn as you go",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-600",
      points: ["Short daily insights", "Evidence-based health tips", "Simplified medical reports"]
    }
  ];

  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Why ProFasting Health?</h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Your entire health context in one single place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="group bg-slate-50 p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 border border-transparent hover:border-slate-100">
              <div className={`w-14 h-14 ${b.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                <b.icon size={28} />
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">{b.title}</h3>
              <ul className="space-y-4">
                {b.points.map((p, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-500 font-bold group-hover:text-slate-600">
                    <Check size={18} className="text-emerald-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ModulesSection = () => {
  const categories = [
    {
      name: "Fasting & Food",
      items: [
        { label: "Fasting", icon: "⚖️", sub: "Timer & logs" },
        { label: "Recipes", icon: "🥗", sub: "Healthy meals" },
        { label: "Diet plans", icon: "📋", sub: "Structured eating" }
      ]
    },
    {
      name: "Daily Health",
      items: [
        { label: "Sleep", icon: "😴", sub: "Diary & score" },
        { label: "Activity", icon: "🏃", sub: "Daily movement" },
        { label: "Medications", icon: "💊", sub: "Reminder & logs" },
        { label: "Symptoms", icon: "🤒", sub: "Track patterns" },
        { label: "Dental Health", icon: "🦷", sub: "Checkup logs" }
      ]
    },
    {
      name: "Women's Health",
      items: [
        { label: "Track my period", icon: "📅", sub: "Cycle insights" },
        { label: "Track my pregnancy", icon: "👶", sub: "Baby growth" },
        { label: "Get pregnant", icon: "🤰", sub: "Fertility support" },
        { label: "Decode discharge", icon: "🧪", sub: "Cervical mucus" },
        { label: "Understand my body", icon: "🧠", sub: "Hormone literacy" }
      ]
    },
    {
      name: "Mind & Relationships",
      items: [
        { label: "Mental Health", icon: "🧘", sub: "Mood & self-care" },
        { label: "Enhance my sex life", icon: "🔥", sub: "Intimacy tracking" }
      ]
    }
  ];

  return (
    <section id="modules" className="py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="space-y-6">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">The Modules</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">All your health modules<br />in one place.</p>
          </div>
          <p className="text-lg font-bold text-slate-400 max-w-md">Enable only the modules you need and hide the rest. Your dashboard, your rules.</p>
        </div>

        <div className="space-y-16">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
                {cat.name}
                <div className="h-px bg-slate-200 flex-1" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {cat.items.map((item, j) => (
                  <div key={j} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-default">
                    <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <p className="font-black text-slate-900 text-sm mb-1 leading-tight tracking-tight">{item.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ScreenshotsSection = () => {
  const screenshots = [
    {
      title: "Fasting & Streaks",
      tag: "Fasting",
      color: "from-blue-500 to-indigo-600",
      content: (
        <div className="flex flex-col items-center justify-center gap-6 p-8">
          <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center relative">
            <Timer size={48} className="text-white" />
            <div className="absolute inset-0 rounded-full border-t-8 border-white animate-spin" />
          </div>
          <p className="text-3xl font-black text-white">16 : 08 : 42</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-black">🔥</div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Sleep Diary",
      tag: "Sleep",
      color: "from-indigo-600 to-purple-700",
      content: (
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center text-white">
            <p className="font-black text-sm uppercase opacity-60">Last Night</p>
            <Moon size={20} />
          </div>
          <div className="space-y-4 text-white">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-white rounded-full" />
            </div>
            <p className="text-4xl font-black">7h 45m</p>
            <div className="p-4 bg-white/10 rounded-2xl flex items-center gap-3">
              <Star size={16} className="text-amber-400" />
              <p className="text-xs font-bold leading-relaxed">Deep sleep was 20% higher than your average.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Meds Manager",
      tag: "Health",
      color: "from-emerald-500 to-teal-600",
      content: (
        <div className="p-8 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`p-4 rounded-2xl bg-white flex items-center justify-between shadow-lg`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-teal-600">
                  <Pill size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Vitamin D3</p>
                  <p className="text-[10px] font-black text-slate-400 tracking-tight">08:00 AM • Daily</p>
                </div>
              </div>
              {i === 1 ? <Check size={20} className="text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-100" />}
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <section className="py-32 bg-white px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Sneak Peek</h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900">Simple UI, Powerful Tracking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screenshots.map((s, i) => (
            <div key={i} className="group">
              <div className={`aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br ${s.color} mb-6 overflow-hidden shadow-2xl shadow-slate-200 flex flex-col group-hover:-translate-y-2 transition-transform duration-500`}>
                <div className="p-6 flex justify-between items-center text-white/50">
                  <Smartphone size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{s.tag}</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  {s.content}
                </div>
              </div>
              <h4 className="text-lg font-black text-slate-900 px-2">{s.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em]">Simple Pricing</h2>
          <p className="text-4xl md:text-6xl font-black text-white leading-tight">Start free, upgrade for mastery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-4">Core Tracker</p>
              <p className="text-5xl font-black mb-10">$0</p>
              <ul className="space-y-6 mb-12">
                {["Fasting tracking", "Sleep & Activity diary", "Basic Women's health", "Medication logs"].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 font-bold">
                    <Check size={20} className="text-emerald-500" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/dashboard" className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl py-4 flex items-center justify-center font-black transition-all">
              Start now
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 rotate-12 opacity-10">
              <Briefcase size={120} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-white/60 tracking-widest mb-4">The Complete Experience</p>
              <div className="flex items-baseline gap-2 mb-10">
                <p className="text-5xl font-black">$5</p>
                <p className="text-white/60 font-bold text-sm">/ month billed annually</p>
              </div>
              <ul className="space-y-6 mb-12">
                {[
                  "All modules included",
                  "Personalized diet plans",
                  "Advanced health insights",
                  "Custom reminders & symptoms",
                  "Support our small team ❤️"
                ].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-bold">
                    <Check size={20} className="text-white bg-white/20 p-0.5 rounded-full" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/dashboard" className="w-full bg-white text-indigo-600 rounded-2xl py-4 flex items-center justify-center font-black hover:shadow-xl transition-all">
              Go Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      q: "Is this a medical app?",
      a: "No. ProFasting Health is a self-tracking and educational tool. We help you organize your data, but we don't provide diagnosis or clinical treatment."
    },
    {
      q: "Does it replace my doctor?",
      a: "Absolutely not. This app is designed to compliment your medical care by providing better data for your next appointment."
    },
    {
      q: "How is my data stored?",
      a: "We prioritize privacy. Your data is encrypted and stored securely. We never sell your personal health data to third parties."
    },
    {
      q: "Can I use it offline?",
      a: "Core tracking features like the fasting timer work offline, but syncing logs and receiving insights require an internet connection."
    }
  ];

  return (
    <section id="faq" className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-black text-slate-900 mb-16 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <p className="text-lg font-black text-slate-900 mb-4">{faq.q}</p>
              <p className="font-medium text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Timer className="text-white" size={18} />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">ProFasting<span className="text-indigo-600">Health</span></span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              Supporting your journey towards holistic health tracking, from intermittent fasting to mental wellbeing.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 tracking-tight uppercase text-xs">Product</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><Link href="#features" className="hover:text-indigo-600">Features</Link></li>
              <li><Link href="#modules" className="hover:text-indigo-600">Modules</Link></li>
              <li><Link href="#pricing" className="hover:text-indigo-600">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 tracking-tight uppercase text-xs">Legal</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li className="hover:text-indigo-600 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-indigo-600 cursor-pointer">Terms of Service</li>
              <li className="hover:text-indigo-600 cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 mb-12 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400 shrink-0">
              <Info size={32} />
            </div>
            <p className="text-sm md:text-base font-bold text-slate-300 leading-relaxed text-center md:text-left">
              <span className="text-white font-black uppercase text-xs tracking-widest block mb-1">Medical Disclaimer:</span>
              This app is for self-tracking and education only. It does not diagnose, treat, or provide medical advice.
              Always talk to your healthcare provider about your health, especially before starting any fasting regimen
              or making significant changes to your medical care or medications.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-xs font-bold font-mono tracking-widest uppercase">
          <p>© 2025 ProFasting Health. All rights reserved.</p>
          <p>Handcrafted for Holistic Health</p>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen selection:bg-indigo-100 selection:text-indigo-600">
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <BenefitsSection />
      <ModulesSection />
      <ScreenshotsSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
