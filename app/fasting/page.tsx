"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Timer,
  Zap,
  ChevronRight,
  History,
  Settings,
  Info,
  BookOpen,
  Clock,
  Flame,
  TrendingDown,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/ui/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";

// --- Types ---

type FastingStatus = "idle" | "fasting" | "completed";

interface FastSession {
  id: string;
  date: string;
  plan: string;
  start: string;
  end: string;
  durationHours: number;
  goalHours: number;
  isGoalMet: boolean;
}

interface WeightPoint {
  date: string;
  weightKg: number;
}

// --- Mock Data ---

const MOCK_SESSIONS: FastSession[] = [
  {
    id: "1",
    date: "2025-12-20",
    plan: "16:8",
    start: "20:00",
    end: "12:00",
    durationHours: 16.2,
    goalHours: 16,
    isGoalMet: true,
  },
  {
    id: "2",
    date: "2025-12-21",
    plan: "16:8",
    start: "21:00",
    end: "13:00",
    durationHours: 15.5,
    goalHours: 16,
    isGoalMet: false,
  },
  {
    id: "3",
    date: "2025-12-22",
    plan: "18:6",
    start: "19:00",
    end: "13:00",
    durationHours: 18.0,
    goalHours: 18,
    isGoalMet: true,
  },
  {
    id: "4",
    date: "2025-12-23",
    plan: "18:6",
    start: "20:00",
    end: "14:00",
    durationHours: 18.2,
    goalHours: 18,
    isGoalMet: true,
  },
  {
    id: "5",
    date: "2025-12-24",
    plan: "16:8",
    start: "20:30",
    end: "12:30",
    durationHours: 16.5,
    goalHours: 16,
    isGoalMet: true,
  },
  {
    id: "6",
    date: "2025-12-25",
    plan: "16:8",
    start: "21:00",
    end: "13:00",
    durationHours: 16.1,
    goalHours: 16,
    isGoalMet: true,
  },
];

const MOCK_WEIGHTS: WeightPoint[] = [
  { date: "2025-11-26", weightKg: 74.8 },
  { date: "2025-12-03", weightKg: 74.2 },
  { date: "2025-12-10", weightKg: 73.5 },
  { date: "2025-12-17", weightKg: 73.0 },
  { date: "2025-12-24", weightKg: 72.5 },
];

const PLANS = [
  { name: "14:10", hours: 14, desc: "Introductory" },
  { name: "16:8", hours: 16, desc: "Lean Gain" },
  { name: "18:6", hours: 18, desc: "Fat Loss" },
  { name: "20:4", hours: 20, desc: "Warrior" },
  { name: "Custom", hours: 0, desc: "Your Pace" },
];

// --- Subcomponents ---

function HistoryBarChart({ sessions }: { sessions: FastSession[] }) {
  const maxVal = 24;
  return (
    <div className="flex items-end justify-between h-20 gap-1 mt-4">
      {sessions.map((s) => (
        <div key={s.id} className="flex-1 flex flex-col items-center group relative">
          <div
            className={`w-full rounded-t-lg transition-all duration-500 ${s.isGoalMet ? "bg-emerald-400" : "bg-slate-200"}`}
            style={{ height: `${(s.durationHours / maxVal) * 100}%` }}
          />
          <div className="text-[8px] font-black text-slate-300 mt-1 uppercase">
            {new Date(s.date).toLocaleDateString("en-US", { weekday: "narrow" })}
          </div>
        </div>
      ))}
    </div>
  );
}

function WeightMiniChart({ data }: { data: WeightPoint[] }) {
  if (data.length < 2) return null;
  const weights = data.map((d) => d.weightKg);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;
  const range = maxW - minW;

  // Simple SVG line
  const width = 100;
  const height = 40;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.weightKg - minW) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="100%" height="40" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path
        d={`M ${points}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-500"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d.weightKg - minW) / range) * height;
        return (
          <circle key={i} cx={x} cy={y} r="3" className="fill-white stroke-emerald-500 stroke-2" />
        );
      })}
    </svg>
  );
}

// --- Main Page ---

export default function FastingPage() {
  // --- State ---
  const [selectedPlan, setSelectedPlan] = useState("16:8");
  const [status, setStatus] = useState<FastingStatus>("idle");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessions, setSessions] = useState<FastSession[]>(MOCK_SESSIONS);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [weightHistory] = useState<WeightPoint[]>(MOCK_WEIGHTS);
  const [currentWeight] = useState(72.5);
  const [goalWeight] = useState(68.0);

  // --- Derived ---
  const activePlan = PLANS.find((p) => p.name === selectedPlan) || PLANS[1];
  const targetSeconds = activePlan.hours * 3600;

  // Body status info
  const bodyStatus = useMemo(() => {
    if (status === "idle") return { label: "Digestion", desc: "Blood sugar is rising", color: "text-orange-500", bg: "bg-orange-50" };

    const hours = elapsedSeconds / 3600;
    if (hours < 4) return { label: "Anabolic Stage", desc: "Blood sugar is dropping", color: "text-blue-500", bg: "bg-blue-50" };
    if (hours < 12) return { label: "Catabolic Stage", desc: "Glycogen depletion", color: "text-indigo-500", bg: "bg-indigo-50" };
    if (hours < 16) return { label: "Fat Burning", desc: "Ketosis starting", color: "text-emerald-500", bg: "bg-emerald-50" };
    return { label: "Autophagy", desc: "Cellular regeneration", color: "text-purple-500", bg: "bg-purple-50" };
  }, [status, elapsedSeconds]);

  // Format time
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Timer Effect ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "fasting" && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  // --- Persistence ---
  useEffect(() => {
    const savedHistory = localStorage.getItem("fastingHistory");
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        // Map the simple "FastSession" format if needed, but Profile expects:
        // { start_time: string, end_time: string }
        setSessions(
          history.map((h: any) => ({
            id: h.id || Math.random().toString(),
            date: h.start_time.split("T")[0],
            plan: h.plan || "16:8",
            start: new Date(h.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
            end: h.end_time ? new Date(h.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--",
            durationHours: h.end_time ? (new Date(h.end_time).getTime() - new Date(h.start_time).getTime()) / 3600000 : 0,
            goalHours: h.goalHours || 16,
            isGoalMet: h.isGoalMet ?? false,
          }))
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // --- Actions ---
  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setElapsedSeconds(0);
    setStatus("fasting");
  };

  const handleEnd = () => {
    if (!startTime) return;

    const now = new Date();
    const duration = elapsedSeconds / 3600;
    const activePlan = PLANS.find((p) => p.name === selectedPlan) || PLANS[1];

    // Format for Profile page consumption
    const storageSession = {
      id: Date.now().toString(),
      start_time: startTime.toISOString(),
      end_time: now.toISOString(),
      plan: selectedPlan,
      goalHours: activePlan.hours,
      isGoalMet: duration >= activePlan.hours,
    };

    const savedHistory = localStorage.getItem("fastingHistory");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    const newHistory = [storageSession, ...history];
    localStorage.setItem("fastingHistory", JSON.stringify(newHistory));

    // Trigger storage event for same-page listeners (if any)
    window.dispatchEvent(new Event("storage"));

    // Update local state UI
    const newUISession: FastSession = {
      id: storageSession.id,
      date: now.toISOString().split("T")[0],
      plan: selectedPlan,
      start: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      end: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      durationHours: duration,
      goalHours: activePlan.hours,
      isGoalMet: duration >= activePlan.hours,
    };

    setSessions([newUISession, ...sessions.slice(0, 6)]);
    setStatus("idle");
    setStartTime(null);
    setElapsedSeconds(0);
  };

  const fastingStats = {
    isActive: true,
    elapsed: formatTime(elapsedSeconds),
    remaining: formatTime(targetSeconds - elapsedSeconds),
    totalMinutes: 10000,
    fastingDays: 50,
    longestFast: "20h",
  };

  const recentFasts = sessions.slice(0, 3).map((s) => ({
    date: s.date,
    duration: s.plan,
    hours: s.durationHours,
  }));

  return (
    <AppShell title="Fasting" showBackButton backUrl="/dashboard" activeTab="plan">
      <main className="px-6 py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Timer Section (Hero) */}
        <Card variant="white" padding="none" className="overflow-hidden shadow-2xl shadow-emerald-900/5 border-none">
          <div className="p-8 bg-gradient-to-tr from-emerald-50 via-white to-sky-50 relative overflow-hidden">
            {/* Status Header */}
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${status === "fasting" ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {status === "fasting" ? "Current Fast" : "Body in Digestion"}
                </span>
              </div>
              <button className="p-2 rounded-xl bg-white/50 text-slate-400 hover:text-emerald-500 transition-colors">
                <Settings size={18} />
              </button>
            </div>

            {/* Middle Timer */}
            <div className="flex flex-col items-center justify-center relative py-10">
              {/* Circular Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <Timer size={300} strokeWidth={1} />
              </div>

              <div className="text-center relative z-10">
                <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-2 tabular-nums">
                  {status === "fasting" ? formatTime(elapsedSeconds) : "00:00:00"}
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {status === "fasting" ? "Elapsed Time" : "Ready to start?"}
                </p>
              </div>
            </div>

            {/* Window Info */}
            <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
              <div className="p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/50">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Fasting Window</div>
                <div className="text-sm font-black text-slate-700">
                  {status === "fasting"
                    ? startTime?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "--:--"}
                  <span className="text-slate-300 mx-1">→</span>
                  {status === "fasting"
                    ? new Date(startTime!.getTime() + targetSeconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "--:--"}
                </div>
              </div>
              <div className="p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/50">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Target Duration</div>
                <div className="text-sm font-black text-emerald-600">
                  {selectedPlan} Plan ({activePlan.hours}h)
                </div>
              </div>
            </div>

            <div className="mt-6">
              {status === "fasting" ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleEnd}
                    className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white"
                    variant="primary"
                  >
                    I'm Eating Now
                  </Button>
                  <Button
                    className="w-14 h-14 bg-white text-slate-400 border-2 border-slate-100"
                    variant="ghost"
                  >
                    <Clock size={20} />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleStart}
                  className="w-full h-16 text-lg bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20"
                  icon={<Zap size={20} fill="currentColor" />}
                >
                  Start Fasting
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Plan Selector */}
        <section className="space-y-4">
          <SectionHeader title="Fasting Plan" description="Choose your challenge" />
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {PLANS.map((plan) => (
              <button
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`shrink-0 p-4 rounded-3xl border-2 transition-all w-32 ${
                  selectedPlan === plan.name
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white border-slate-100 text-slate-400"
                }`}
              >
                <div className="text-lg font-black mb-1">{plan.name}</div>
                <div
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    selectedPlan === plan.name ? "text-emerald-50 opacity-80" : "text-slate-300"
                  }`}
                >
                  {plan.desc}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Today's Summary */}
        <section className="grid grid-cols-2 gap-4">
          <Card padding="sm" className="bg-white border-slate-50 flex flex-col justify-between h-32">
            <div className="text-[10px] font-black text-slate-400 uppercase">Current Streak</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-500">7</span>
              <span className="text-xs font-bold text-slate-400">DAYS</span>
            </div>
            <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
              BEST: 12 DAYS
            </div>
          </Card>
          <Card padding="sm" className={`${bodyStatus.bg} border-none flex flex-col justify-between h-32`}>
            <div className={`text-[10px] font-black ${bodyStatus.color} uppercase`}>Body status</div>
            <div className="space-y-0.5">
              <div className="text-lg font-black text-slate-800 leading-tight uppercase tracking-tighter">
                {bodyStatus.label}
              </div>
              <div className="text-[10px] font-bold text-slate-500 leading-tight">{bodyStatus.desc}</div>
            </div>
            <Info size={14} className={bodyStatus.color} />
          </Card>
        </section>

        {/* Weight Section */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Weight Tracking</h3>
              <p className="text-[10px] font-bold text-slate-400">Down 2.3 kg in 4 weeks</p>
            </div>
            <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all">
              <Plus size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800">{currentWeight}</span>
                <span className="text-xs font-black text-slate-300">KG</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Goal</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-500">{goalWeight}</span>
                <span className="text-xs font-black text-slate-300">KG</span>
              </div>
            </div>
          </div>

          <WeightMiniChart data={weightHistory} />
        </Card>

        {/* History */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Last 7 Fasts</h3>
            <Link href="/dashboard" className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
              More <ChevronRight size={14} />
            </Link>
          </div>
          <HistoryBarChart sessions={sessions} />

          <div className="mt-6 space-y-4">
            {sessions.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group active:scale-95 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      s.isGoalMet ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <History size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">{s.plan} Plan</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-700">{s.durationHours.toFixed(1)}h</div>
                  <div
                    className={`text-[9px] font-black uppercase ${
                      s.isGoalMet ? "text-emerald-500" : "text-slate-400"
                    }`}
                  >
                    {s.isGoalMet ? "Goal Met" : "Incomplete"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Learn Fasting */}
        <section className="space-y-4">
          <SectionHeader title="Learn Fasting" description="Expert tips for you" />
          <div className="grid grid-cols-1 gap-4">
            <Link href="/dashboard/learn?topic=fasting">
              <Card className="p-5 flex gap-4 hover:border-emerald-200 transition-colors group">
                <div className="w-16 h-16 shrink-0 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-500">
                  <BookOpen size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 mb-1 group-hover:text-emerald-500 transition-colors">
                    Intermittent Fasting 101
                  </h4>
                  <p className="text-xs font-bold text-slate-400 line-clamp-2 leading-relaxed">
                    Everything you need to know to start your journey today safely.
                  </p>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/learn?topic=fasting">
              <Card className="p-5 flex gap-4 hover:border-orange-200 transition-colors group">
                <div className="w-16 h-16 shrink-0 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-orange-500">
                  <Flame size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Fat Burning Secrets
                  </h4>
                  <p className="text-xs font-bold text-slate-400 line-clamp-2 leading-relaxed">
                    How to optimize your metabolic window for maximum results.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        <div className="h-10" /> {/* Spacer */}
      </main>
    </AppShell>
  );
}
