'use client';

import React, { useState } from 'react';
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
  User,
  Calendar,
  Zap,
  Settings,
  Bell,
  ChevronRight,
  Plus,
  HeartPulse,
  Search,
  Flame
} from 'lucide-react';

// --- Types ---

interface Module {
  id: string;
  title: string;
  description: string;
  status?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
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
  { id: 'fasting', title: 'Fasting', description: 'Track your fasting status', status: 'In Progress', icon: Timer, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/fasting' },
  { id: 'sleep', title: 'Sleep', description: 'Logs last night’s sleep', status: 'Logged', icon: Moon, color: 'text-blue-600', bg: 'bg-blue-50', link: '/sleep' },
  { id: 'activity', title: 'Activity', description: 'Movement & steps', status: 'Not logged', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/activity' },
  { id: 'meds', title: 'Medications', description: 'Schedule & tracking', status: '2/3 taken', icon: Pill, color: 'text-rose-600', bg: 'bg-rose-50', link: '/medications' },
  { id: 'dental', title: 'Dental', description: 'Routine & oral health', status: 'Logged', icon: HeartPulse, color: 'text-cyan-600', bg: 'bg-cyan-50', link: '/dental' },
  { id: 'mental', title: 'Mental Health', description: 'AI Companion & check-ins', status: 'Not logged', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50', link: '/mental-health' },
  { id: 'period', title: 'Women’s Health', description: 'Cycle & pregnancy', status: 'Phase 2', icon: Flower2, color: 'text-pink-600', bg: 'bg-pink-50', link: '/period-tracker' },
  { id: 'recipes', title: 'Recipes', description: 'Healthy meal ideas', status: 'Explore', icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50', link: '/dashboard/recipes' },
  { id: 'calories', title: 'Calories', description: 'Fuel & activity log', status: 'Log now', icon: Flame, color: 'text-amber-600', bg: 'bg-amber-50', link: '/calories' },
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Desktop Wrapper Centering */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-slate-100">

        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs">GH</div>
            <span className="text-sm font-black tracking-tight text-slate-900">GoHealthing</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-slate-50 rounded-full text-slate-400">
              <Bell size={18} />
            </button>
            <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="Profile" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        {/* Main Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">

          {/* Hero Section */}
          <section className="px-6 pt-6 pb-2">
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Timer size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fast in Progress</span>
                </div>
                <h2 className="text-3xl font-black mb-1">14:22:08</h2>
                <p className="text-xs font-bold text-slate-400 mb-6">Started today at 8:00 AM</p>

                <div className="grid grid-cols-4 gap-2 mb-6">
                  <StatusPill icon={Activity} value="2.4k" label="Steps" />
                  <StatusPill icon={Moon} value="7h" label="Sleep" />
                  <StatusPill icon={Plus} value="1.2L" label="Water" />
                  <StatusPill icon={Pill} value="2/3" label="Meds" />
                </div>

                <Link
                  href="/fasting"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/40"
                >
                  <Zap size={16} fill="currentColor" />
                  Manage Fasting
                </Link>
              </div>
            </div>
          </section>

          {/* Continue Strip */}
          <section className="mt-8">
            <h3 className="px-6 text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Continue Journey</h3>
            <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar pb-2">
              {CONTINUE_ACTIONS.map((action) => (
                <Link
                  key={action.id}
                  href={action.link}
                  className="min-w-[160px] bg-indigo-50 p-5 rounded-3xl border border-indigo-100/50 group hover:scale-[1.02] transition-transform"
                >
                  <h4 className="text-[13px] font-black text-indigo-900 leading-tight mb-1">{action.title}</h4>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{action.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Module Grid */}
          <section className="mt-10 px-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Health Modules</h3>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">See All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MODULES.map((module) => (
                <Link
                  key={module.id}
                  href={module.link}
                  className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-95 group flex flex-col items-start"
                >
                  <div className={`p-3 rounded-2xl ${module.bg} ${module.color} mb-4 transition-transform group-hover:scale-110`}>
                    <module.icon size={22} />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 mb-1">{module.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 leading-tight mb-3">{module.description}</p>
                  <div className="mt-auto px-2 py-1 bg-slate-50 rounded-full">
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">{module.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Learn Preview */}
          <section className="mt-10 px-6 mb-8">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Daily Education</h3>
            <div className="space-y-3">
              {LEARN_ARTICLES.map((article) => (
                <Link
                  key={article.id}
                  href={article.link}
                  className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-50 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">{article.category}</span>
                      <span className="text-[9px] font-bold text-slate-300">• {article.time} read</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-slate-800 leading-tight">{article.title}</h4>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>

        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 pt-3 pb-8 flex items-center justify-between z-30">
          <NavItem href="/fasting" icon={Timer} label="Fasting" active />
          <NavItem href="/dashboard/plans" icon={Calendar} label="Plan" />
          <NavItem href="/dashboard/learn" icon={BookOpen} label="Learn" />
          <NavItem href="/dashboard/recipes" icon={Utensils} label="Recipes" />
          <NavItem href="/dashboard/profile" icon={User} label="Me" />
        </nav>

      </div>
    </div>
  );
}

// --- Subcomponents ---

function StatusPill({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10">
      <Icon size={14} className="text-indigo-400" />
      <div className="text-[10px] font-black">{value}</div>
      <div className="text-[7px] font-black uppercase text-slate-500 tracking-tighter">{label}</div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false }: { href: string; icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1.5 group">
      <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' : 'text-slate-300 group-hover:text-indigo-400'}`}>
        <Icon size={20} fill={active ? "currentColor" : "none"} />
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </Link>
  );
}
