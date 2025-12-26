'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Baby,
    CheckCircle,
    Heart,
    Activity,
    ChevronRight,
    AlertOctagon,
    Clock,
    Info,
    CalendarCheck,
    Save,
    Smile,
    Frown,
    Meh,
    Battery,
    BatteryMedium,
    BatteryLow
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// --- Types & Interfaces ---

type PregnancySetupMode = 'due_date' | 'lmp';
type EnergyLevel = 'low' | 'medium' | 'high';
type NauseaLevel = 'none' | 'mild' | 'strong';
type MoodLevel = 'low' | 'ok' | 'good';

interface PregnancySetup {
    mode: PregnancySetupMode;
    date: string; // YYYY-MM-DD
    isSetup: boolean;
}

interface GestationalAge {
    weeks: number;
    days: number;
    dueDate: Date;
    trimester: 1 | 2 | 3;
}

interface WeeklyChecklistItem {
    id: string;
    text: string;
    done: boolean;
}

interface DailyLog {
    energy: EnergyLevel | null;
    nausea: NauseaLevel | null;
    mood: MoodLevel | null;
    notes: string;
}

// --- Helpers ---

const getGestationalAge = (setup: PregnancySetup): GestationalAge | null => {
    if (!setup.date) return null;

    const today = new Date();
    // Reset time for accurate day calc
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(setup.date);
    if (isNaN(inputDate.getTime())) return null;

    let lmpDate = new Date(inputDate);
    let dueDate = new Date(inputDate);

    if (setup.mode === 'due_date') {
        // LMP is approx 280 days before due date
        lmpDate.setDate(dueDate.getDate() - 280);
    } else {
        // Due date is LMP + 280 days
        dueDate.setDate(lmpDate.getDate() + 280);
    }

    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    let trimester: 1 | 2 | 3 = 1;
    if (weeks >= 14) trimester = 2;
    if (weeks >= 28) trimester = 3;

    return { weeks, days, dueDate, trimester };
};

// --- Mock Data ---

const WEEKLY_INFO: Record<number, { description: string; tips: string[] }> = {
    // Basic reliable fallback for all weeks if specific week not found
    0: { description: "Congratulations on starting your journey!", tips: ["Take prenatal vitamins", "Hydrate well"] },
};

// Populate some mock data for weeks 4-42
for (let i = 1; i <= 42; i++) {
    WEEKLY_INFO[i] = {
        description: `Your baby is growing! Week ${i} brings new developments.`,
        tips: [
            "Stay hydrated",
            "Listen to your body",
            "Take your vitamins"
        ]
    };
}
// Specific mocks for demo
WEEKLY_INFO[12] = {
    description: "The end of the first trimester is near. Baby's fingernails are developing!",
    tips: ["Schedule your 12-week scan", "Share the news if you're ready", "Eat frequent small meals"]
};
WEEKLY_INFO[20] = {
    description: "You're halfway there! Baby can hear sounds from outside the womb.",
    tips: ["Anatomy scan usually happens now", "Sing to your baby", "Moisturize your belly"]
};
WEEKLY_INFO[30] = {
    description: "Baby is practicing breathing movements. You might feel more tired.",
    tips: ["Rest when you can", "Pack your hospital bag soon", "Do kick counts"]
};

// --- Components ---

export default function PregnancyPage() {
    const [setup, setSetup] = useState<PregnancySetup>({ mode: 'due_date', date: '', isSetup: false });
    const [age, setAge] = useState<GestationalAge | null>(null);
    const [checklist, setChecklist] = useState<WeeklyChecklistItem[]>([
        { id: '1', text: 'Drink 8 glasses of water', done: false },
        { id: '2', text: 'Take prenatal vitamins', done: true },
        { id: '3', text: 'Walk for 20 minutes', done: false },
        { id: '4', text: 'Do pelvic floor exercises', done: false },
    ]);
    const [dailyLog, setDailyLog] = useState<DailyLog>({ energy: null, nausea: null, mood: null, notes: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Initial calculation on load if setup exists (mock persistence)
    useEffect(() => {
        // Calculate age whenever setup changes (and is valid)
        if (setup.date) {
            const calculated = getGestationalAge(setup);
            setAge(calculated);
        }
    }, [setup]);

    const handleSetupSave = () => {
        if (!setup.date) return;
        setSetup({ ...setup, isSetup: true });
    };

    const toggleChecklist = (id: string) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
        // Fake auto-save
        // setTimeout(() => console.log('Saved checklist'), 500);
    };

    const handleLogSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        // Notes would be saved here
    };

    const currentWeekInfo = age ? (WEEKLY_INFO[age.weeks] || WEEKLY_INFO[0]) : WEEKLY_INFO[0];

    return (
        <div className="min-h-screen bg-sky-50 pb-24 font-sans text-slate-800">

            {/* Header */}
            <header className="bg-white border-b border-sky-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-sky-50 text-slate-400 hover:text-sky-600 transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-sky-950 flex items-center gap-2">
                            <Baby className="w-6 h-6 text-sky-500" />
                            Track My Pregnancy
                        </h1>
                        <p className="text-xs text-sky-900/60 font-bold uppercase tracking-wide">
                            Weekly Journey
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">

                {/* Setup Card (Shown if not setup or wanting to edit) */}
                <section className={`bg-white rounded-[2.5rem] p-8 shadow-xl shadow-sky-500/5 transition-all duration-500 ${setup.isSetup ? 'hidden' : 'block'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                            <CalendarCheck size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Pregnancy Setup</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                            <button
                                onClick={() => setSetup({ ...setup, mode: 'due_date' })}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${setup.mode === 'due_date' ? 'bg-white shadow text-sky-600' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Due Date
                            </button>
                            <button
                                onClick={() => setSetup({ ...setup, mode: 'lmp' })}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${setup.mode === 'lmp' ? 'bg-white shadow text-sky-600' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Last Period (LMP)
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">
                                {setup.mode === 'due_date' ? 'Your Due Date' : 'First Day of Last Period'}
                            </label>
                            <input
                                type="date"
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg text-slate-800 focus:outline-none focus:border-sky-500 transition-colors"
                                value={setup.date}
                                onChange={(e) => setSetup({ ...setup, date: e.target.value })}
                            />
                        </div>

                        <Button
                            onClick={handleSetupSave}
                            disabled={!setup.date}
                            className="w-full py-6 text-lg font-black rounded-2xl bg-sky-500 text-white hover:bg-sky-600 shadow-xl shadow-sky-500/20"
                        >
                            Start Tracking
                        </Button>
                    </div>
                </section>

                {/* Dashboard View */}
                {age && setup.isSetup && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Summary Card */}
                        <section className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-sky-500/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="inline-block py-1 px-3 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 backdrop-blur-md">
                                    Trimester {age.trimester}
                                </span>
                                <h2 className="text-4xl font-black mb-1">
                                    Week {age.weeks}
                                    <span className="text-xl font-bold opacity-80">+ {age.days} days</span>
                                </h2>
                                <p className="text-sky-100 font-medium text-sm flex items-center gap-2 mt-2">
                                    <Clock size={14} />
                                    Due: {age.dueDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <Baby className="absolute -bottom-8 -right-8 w-48 h-48 text-white/10 rotate-12" />

                            <button
                                onClick={() => setSetup({ ...setup, isSetup: false })}
                                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <Info size={16} />
                            </button>
                        </section>

                        {/* Weekly Overview */}
                        <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-50 text-purple-500 rounded-xl">
                                    <Activity size={20} />
                                </div>
                                <h3 className="font-black text-slate-800 text-lg">This Week's Highlights</h3>
                            </div>

                            <p className="text-slate-600 font-medium leading-relaxed mb-6">
                                {currentWeekInfo.description}
                            </p>

                            <ul className="space-y-3">
                                {currentWeekInfo.tips.map((tip, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Checklist */}
                        <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-slate-800 text-lg">Weekly Checklist</h3>
                                <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
                                    {checklist.filter(c => c.done).length}/{checklist.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {checklist.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleChecklist(item.id)}
                                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group ${item.done
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-slate-100 hover:border-emerald-200'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors flex-shrink-0 ${item.done
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'bg-white border-slate-200 text-transparent group-hover:border-emerald-400'
                                            }`}>
                                            <CheckCircle size={14} className={item.done ? "block" : "hidden"} />
                                        </div>
                                        <span className={`font-bold text-sm ${item.done ? 'text-emerald-900 line-through opacity-70' : 'text-slate-700'}`}>
                                            {item.text}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Daily Log */}
                        <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                                    <Heart size={20} />
                                </div>
                                <h3 className="font-black text-slate-800 text-lg">Today's Log</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Energy */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Energy Level</label>
                                    <div className="flex bg-slate-50 p-1 rounded-xl">
                                        {(['low', 'medium', 'high'] as EnergyLevel[]).map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setDailyLog({ ...dailyLog, energy: lvl })}
                                                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${dailyLog.energy === lvl
                                                        ? 'bg-white shadow text-slate-800'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {lvl === 'low' && <BatteryLow size={18} className="text-orange-400" />}
                                                {lvl === 'medium' && <BatteryMedium size={18} className="text-yellow-500" />}
                                                {lvl === 'high' && <Battery size={18} className="text-emerald-500" />}
                                                <span className="capitalize hidden sm:inline">{lvl}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Nausea */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Nausea</label>
                                    <div className="flex bg-slate-50 p-1 rounded-xl">
                                        {(['none', 'mild', 'strong'] as NauseaLevel[]).map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setDailyLog({ ...dailyLog, nausea: lvl })}
                                                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${dailyLog.nausea === lvl
                                                        ? 'bg-white shadow text-slate-800'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Mood */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Mood</label>
                                    <div className="flex gap-4 justify-center">
                                        {[
                                            { val: 'low', icon: Frown, color: 'text-slate-500' },
                                            { val: 'ok', icon: Meh, color: 'text-sky-500' },
                                            { val: 'good', icon: Smile, color: 'text-orange-500' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.val}
                                                onClick={() => setDailyLog({ ...dailyLog, mood: opt.val as MoodLevel })}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${dailyLog.mood === opt.val
                                                        ? 'bg-slate-800 border-slate-800 text-white scale-110 shadow-lg'
                                                        : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200'
                                                    }`}
                                            >
                                                <opt.icon size={28} className={dailyLog.mood === opt.val ? 'text-white' : opt.color} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Notes</label>
                                    <textarea
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-sky-300 resize-none h-24"
                                        placeholder="Any symptoms, cravings, or thoughts?"
                                        value={dailyLog.notes}
                                        onChange={(e) => setDailyLog({ ...dailyLog, notes: e.target.value })}
                                    ></textarea>
                                </div>

                                <Button
                                    onClick={handleLogSave}
                                    disabled={isSaving}
                                    className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                                >
                                    {isSaving ? 'Saving...' : 'Save Today\'s Log'}
                                </Button>
                            </div>
                        </section>

                        {/* Safety Box */}
                        <section className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-7">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertOctagon className="text-rose-500" />
                                <h3 className="font-black text-rose-900 text-lg">When to call your provider</h3>
                            </div>
                            <ul className="space-y-2 mb-4">
                                {[
                                    'Heavy bleeding or spotting.',
                                    'Severe abdominal pain or cramping.',
                                    'Persistent fever or severe headache.',
                                    'Sudden swelling of face or hands.',
                                    'Decreased baby movement (later weeks).'
                                ].map((warn, i) => (
                                    <li key={i} className="flex items-start gap-2 text-rose-800/80 text-sm font-bold">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                                        {warn}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-rose-900/60 font-bold leading-relaxed border-t border-rose-100 pt-4 mt-4">
                                If you feel worried or notice these signs, contact your midwife, doctor, or emergency services immediately. This app does not provide medical diagnoses.
                            </p>
                        </section>

                    </div>
                )}
            </main>
        </div>
    );
}
