'use client';

import React from 'react';
import Link from 'next/link';
import {
  Timer,
  Moon,
  Activity,
  Pill,
  Brain,
  Flower2,
  Utensils,
  BookOpen,
  Zap,
  Plus,
  HeartPulse,
  Flame,
  ChevronRight
} from 'lucide-react';

import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';

// --- Types ---

interface Module {
  id: string;
  title: string;
  description: string;
  status?: string;
  icon: React.ElementType;
  variant: 'primary' | 'secondary' | 'accent' | 'danger' | 'slate';
  link: string;
}

interface ContinueAction {
  id: string;
  title: string;
  subtitle: string;
  link: string;
}

interface LearnArticle {
  id: string;
  title: string;
  category: string;
  time: string;
  link: string;
}

// --- Mock Data ---

const MODULES: Module[] = [
  { id: 'sleep', title: 'Sleep', description: 'Logs last night’s sleep', status: 'Logged', icon: Moon, variant: 'primary', link: '/sleep' },
  { id: 'activity', title: 'Activity', description: 'Movement & steps', status: 'Not logged', icon: Activity, variant: 'primary', link: '/activity' },
  { id: 'meds', title: 'Medications', description: 'Schedule & tracking', status: '2/3 taken', icon: Pill, variant: 'danger', link: '/medications' },
  { id: 'dental', title: 'Dental', description: 'Routine & oral health', status: 'Logged', icon: HeartPulse, variant: 'primary', link: '/dental' },
  { id: 'mental', title: 'Mental Health', description: 'AI Companion & check-ins', status: 'Not logged', icon: Brain, variant: 'secondary', link: '/mental-health' },
  { id: 'period', title: 'Women’s Health', description: 'Cycle & pregnancy', status: 'Phase 2', icon: Flower2, variant: 'danger', link: '/period-tracker' },
  { id: 'recipes', title: 'Recipes', description: 'Healthy meal ideas', status: 'Explore', icon: Utensils, variant: 'accent', link: '/dashboard/recipes' },
  { id: 'calories', title: 'Calories', description: 'Fuel & activity log', status: 'Log now', icon: Flame, variant: 'accent', link: '/calories' },
];

const CONTINUE_ACTIONS: ContinueAction[] = [
  { id: '1', title: 'Summer Weight Loss', subtitle: 'Continue plan', link: '/dashboard/plans' },
  { id: '2', title: 'Log Hydration', subtitle: '2L remaining', link: '/water-tracker' },
  { id: '3', title: 'Mental Health', subtitle: 'Check-in required', link: '/mental-health' },
];

const LEARN_ARTICLES: LearnArticle[] = [
  { id: 'l1', title: 'Beginner’s guide to fasting', category: 'Fasting 101', time: '5 min', link: '/dashboard/learn' },
  { id: 'l2', title: 'Sleep hygiene basics', category: 'Recovery', time: '3 min', link: '/dashboard/learn' },
  { id: 'l3', title: 'Understanding your cycle', category: 'Health', time: '7 min', link: '/dashboard/learn' },
];

// --- Main Page Component ---

export default function MobileDashboard() {
  return (
    <AppShell activeTab="me">
      {/* Greeting Section */}
      <section className="px-6 pt-10 pb-4">
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-1">Hello, Siavash</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your health summary for today</p>
      </section>

      {/* Continue Strip */}
      <section className="mt-8">
        <SectionHeader title="Continue Journey" />
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar pb-2">
          {CONTINUE_ACTIONS.map((action) => (
            <Link
              key={action.id}
              href={action.link}
              className="min-w-[160px] bg-secondary/5 p-5 rounded-3xl border border-secondary/10 group hover:scale-[1.02] transition-all"
            >
              <h4 className="text-[13px] font-black text-secondary-text leading-tight mb-1">{action.title}</h4>
              <p className="text-[10px] font-bold text-secondary/60 uppercase tracking-tighter">{action.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Module Grid */}
      <section className="mt-10 px-6">
        <SectionHeader
          title="Health Modules"
          action={
            <button className="text-[10px] font-black text-primary uppercase tracking-widest">See All</button>
          }
        />
        <div className="grid grid-cols-2 gap-4">
          {MODULES.map((module) => (
            <Link
              key={module.id}
              href={module.link}
              className="group"
            >
              <Card
                padding="sm"
                className="h-full hover:shadow-md active:scale-95 transition-all flex flex-col items-start"
              >
                <div className={`p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${module.variant === 'primary' ? 'bg-primary/10 text-primary' :
                  module.variant === 'secondary' ? 'bg-secondary/10 text-secondary' :
                    module.variant === 'accent' ? 'bg-accent/10 text-accent' :
                      module.variant === 'danger' ? 'bg-danger/10 text-danger' :
                        'bg-slate-50 text-slate-500'
                  }`}>
                  <module.icon size={22} />
                </div>
                <h4 className="text-sm font-black text-slate-800 mb-1">{module.title}</h4>
                <p className="text-[9px] font-bold text-slate-400 leading-tight mb-3">{module.description}</p>
                <div className="mt-auto">
                  <Chip label={module.status || ''} variant={module.variant} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Learn Preview */}
      <section className="mt-10 px-6 mb-8">
        <SectionHeader title="Daily Education" />
        <div className="space-y-3">
          {LEARN_ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={article.link}
              className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-border hover:bg-slate-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black text-primary uppercase tracking-tighter">{article.category}</span>
                  <span className="text-[9px] font-bold text-slate-300">• {article.time} read</span>
                </div>
                <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{article.title}</h4>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

// --- Subcomponents ---

function StatusPill({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10">
      <Icon size={14} className="text-secondary" />
      <div className="text-[10px] font-black">{value}</div>
      <div className="text-[7px] font-black uppercase text-slate-500 tracking-tighter">{label}</div>
    </div>
  );
}
