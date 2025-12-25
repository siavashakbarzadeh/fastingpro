'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Heart,
    Moon,
    MessageCircle,
    Activity,
    Sun,
    Smile,
    Frown,
    Meh,
    Check,
    ChevronRight,
    BookOpen,
    Info,
    RefreshCw,
    ArrowLeft,
    Flame,
    Zap,
    Coffee,
    Battery
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Types & Interfaces ---

interface DailyCheckIn {
    date: string;
    mood: number; // 1-5
    libido: number; // 1-5
    stress: number; // 1-5
}

interface Habit {
    id: string;
    label: string;
    icon: React.ReactNode;
    focused: boolean;
    completedDays: number; // e.g. 3 out of 7
    isCompletedToday: boolean;
}

interface ConversationPrompt {
    id: string;
    text: string;
    category: 'connection' | 'fun' | 'depth';
}

interface Resource {
    id: string;
    title: string;
    description: string;
    type: string;
}

// --- Mock Data & Helpers ---

const INITIAL_HABITS: Habit[] = [
    {
        id: 'h1',
        label: 'Prioritize 7-8 hours of sleep',
        icon: <Moon className="w-5 h-5 text-indigo-500" />,
        focused: true,
        completedDays: 4,
        isCompletedToday: false
    },
    {
        id: 'h2',
        label: 'Move your body (light exercise)',
        icon: <Activity className="w-5 h-5 text-emerald-500" />,
        focused: true,
        completedDays: 2,
        isCompletedToday: false
    },
    {
        id: 'h3',
        label: 'Schedule quality time with partner',
        icon: <Heart className="w-5 h-5 text-rose-500" />,
        focused: false,
        completedDays: 1,
        isCompletedToday: false
    },
    {
        id: 'h4',
        label: 'Practice relaxation / breathing',
        icon: <Sun className="w-5 h-5 text-amber-500" />,
        focused: true,
        completedDays: 5,
        isCompletedToday: true
    }
];

const PROMPTS: ConversationPrompt[] = [
    { id: 'p1', text: 'One thing that helps me feel more connected to you is...', category: 'connection' },
    { id: 'p2', text: 'Something I’d like to try for more intimacy (non-sexual or sexual) is...', category: 'depth' },
    { id: 'p3', text: 'When I’m stressed, the best way you can support me is...', category: 'connection' },
    { id: 'p4', text: 'What is a favorite memory of us from the past year?', category: 'fun' },
    { id: 'p5', text: 'How can we make our evenings more relaxing together?', category: 'connection' },
    { id: 'p6', text: 'What is one thing I do that makes you feel appreciated?', category: 'depth' },
];

const RESOURCES: Resource[] = [
    { id: 'r1', title: 'Stress & Desire', description: 'Understanding the cortisol connection.', type: 'Article' },
    { id: 'r2', title: 'Sleep & Hormones', description: 'Why rest is critical for well-being.', type: 'Guide' },
    { id: 'r3', title: 'Communicating Needs', description: 'Scripts for healthy conversations.', type: 'Tool' },
];

const generateHistory = (): DailyCheckIn[] => {
    const history: DailyCheckIn[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        // Random mock data
        history.push({
            date: d.toISOString().split('T')[0],
            mood: Math.floor(Math.random() * 3) + 3, // 3-5 mostly
            libido: Math.floor(Math.random() * 5) + 1,
            stress: Math.floor(Math.random() * 4) + 1,
        });
    }
    return history;
};

// --- Components ---

const RangeInput = ({
    label,
    value,
    onChange,
    minLabel,
    maxLabel,
    icon
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    minLabel: string;
    maxLabel: string;
    icon: React.ReactNode;
}) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
                {icon}
                <span>{label}</span>
            </div>
            <span className="text-xl font-black text-rose-500 bg-rose-50 w-8 h-8 flex items-center justify-center rounded-full">
                {value}
            </span>
        </div>
        <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-600 transition-all"
        />
        <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wide">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
        </div>
    </div>
);

export default function SexLifePage() {
    // State
    const [history, setHistory] = useState<DailyCheckIn[]>([]);
    const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn>({
        date: new Date().toISOString().split('T')[0],
        mood: 3,
        libido: 3,
        stress: 3
    });
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
    const [currentPrompt, setCurrentPrompt] = useState<ConversationPrompt>(PROMPTS[0]);

    // Loading States
    const [isSavingCheckIn, setIsSavingCheckIn] = useState(false);
    const [isSavingHabits, setIsSavingHabits] = useState(false);
    const [showCheckInSuccess, setShowCheckInSuccess] = useState(false);

    // Init Data
    useEffect(() => {
        setHistory(generateHistory());
        // Random prompt on load
        setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    }, []);

    // Handlers
    const handleCheckInSave = async () => {
        setIsSavingCheckIn(true);
        // Fake API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update history locally (replace today or add)
        const newHistory = [...history];
        const todayStr = new Date().toISOString().split('T')[0];
        const existingIndex = newHistory.findIndex(h => h.date === todayStr);

        if (existingIndex >= 0) {
            newHistory[existingIndex] = { ...todayCheckIn, date: todayStr };
        } else {
            newHistory.push({ ...todayCheckIn, date: todayStr });
        }

        setHistory(newHistory);
        setIsSavingCheckIn(false);
        setShowCheckInSuccess(true);
        setTimeout(() => setShowCheckInSuccess(false), 3000);
    };

    const toggleHabitToday = async (id: string) => {
        // Optimistic update
        const updatedHabits = habits.map(h => {
            if (h.id === id) {
                const isCompleted = !h.isCompletedToday;
                return {
                    ...h,
                    isCompletedToday: isCompleted,
                    completedDays: isCompleted ? h.completedDays + 1 : Math.max(0, h.completedDays - 1)
                };
            }
            return h;
        });
        setHabits(updatedHabits);

        setIsSavingHabits(true);
        // Fake API
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsSavingHabits(false);
    };

    const getNewPrompt = () => {
        let next = currentPrompt;
        while (next.id === currentPrompt.id) {
            next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
        }
        setCurrentPrompt(next);
    };

    // Insights Logic
    const averageDesire = (history.reduce((acc, curr) => acc + curr.libido, 0) / (history.length || 1)).toFixed(1);
    const highStressDays = history.filter(d => d.stress >= 4).length;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-rose-950 flex items-center gap-2">
                            <Heart className="fill-rose-500 text-rose-500 w-6 h-6" />
                            Enhance Sex Life
                        </h1>
                        <p className="text-xs text-rose-900/60 font-bold uppercase tracking-wide">
                            Well-being & Intimacy Tracker
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">

                {/* Intro Banner */}
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
                    <div className="relative z-10 max-w-xl">
                        <h2 className="text-3xl font-black mb-3 text-white">Track your desire, mood & habits.</h2>
                        <p className="text-rose-100 font-medium text-lg leading-relaxed">
                            Build a healthier intimate life by understanding your body and connecting with your partner.
                        </p>
                    </div>
                    <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-rose-400/30 rotate-12" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Today's Check-in Card */}
                    <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-800">Today's Check-in</h3>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide rounded-full">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        <div className="space-y-8 flex-1">
                            <RangeInput
                                label="Overall Mood"
                                value={todayCheckIn.mood}
                                onChange={(v) => setTodayCheckIn({ ...todayCheckIn, mood: v })}
                                minLabel="Low"
                                maxLabel="Great"
                                icon={<Smile className="w-5 h-5 text-amber-500" />}
                            />
                            <RangeInput
                                label="Desire / Libido"
                                value={todayCheckIn.libido}
                                onChange={(v) => setTodayCheckIn({ ...todayCheckIn, libido: v })}
                                minLabel="Low"
                                maxLabel="High"
                                icon={<Flame className="w-5 h-5 text-orange-500" />}
                            />
                            <RangeInput
                                label="Stress Level"
                                value={todayCheckIn.stress}
                                onChange={(v) => setTodayCheckIn({ ...todayCheckIn, stress: v })}
                                minLabel="Calm"
                                maxLabel="High Stress"
                                icon={<Zap className="w-5 h-5 text-purple-500" />}
                            />
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <Button
                                onClick={handleCheckInSave}
                                disabled={isSavingCheckIn}
                                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {isSavingCheckIn ? (
                                    'Saving...'
                                ) : showCheckInSuccess ? (
                                    <>
                                        <Check className="w-5 h-5" /> Saved
                                    </>
                                ) : (
                                    'Save Log'
                                )}
                            </Button>
                        </div>
                    </section>

                    {/* History & Insights Card */}
                    <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-800">7-Day History</h3>
                            <Activity className="w-5 h-5 text-slate-400" />
                        </div>

                        {/* Visualization */}
                        <div className="bg-slate-50 rounded-3xl p-6 mb-6">
                            <div className="flex justify-between items-end h-32 gap-2">
                                {history.map((day, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                                        <div className="w-full flex-1 flex items-end justify-center gap-1 group relative">
                                            {/* Libido Bar */}
                                            <div
                                                style={{ height: `${(day.libido / 5) * 100}%` }}
                                                className="w-2 rounded-full bg-rose-400 group-hover:bg-rose-500 transition-all"
                                            />
                                            {/* Mood Bar */}
                                            <div
                                                style={{ height: `${(day.mood / 5) * 100}%` }}
                                                className="w-2 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-all"
                                            />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">
                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                    <div className="w-2 h-2 rounded-full bg-rose-400" /> Desire
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                    <div className="w-2 h-2 rounded-full bg-amber-400" /> Mood
                                </div>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <Info size={16} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm mb-1">Weekly Insight</h4>
                                    <p className="text-indigo-800/80 text-sm font-medium leading-relaxed">
                                        {highStressDays > 2
                                            ? "It looks like stress has been high this week. Consider prioritizing relaxation techniques to help reconnect with your body."
                                            : "Your stress levels are well-managed this week, creating a great foundation for intimacy."
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Avg. Desire</p>
                                    <p className="text-2xl font-black text-rose-500">{averageDesire}<span className="text-sm text-slate-400 font-bold"> /5</span></p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">High Stress Days</p>
                                    <p className="text-2xl font-black text-purple-500">{highStressDays}<span className="text-sm text-slate-400 font-bold"> days</span></p>
                                </div>
                            </div>
                        </div>

                    </section>

                    {/* Healthy Habits Card */}
                    <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Healthy Habits</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase mt-1">Focus for this week</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <Battery size={20} />
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {habits.filter(h => h.focused).map(habit => (
                                <div
                                    key={habit.id}
                                    onClick={() => toggleHabitToday(habit.id)}
                                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 group ${habit.isCompletedToday
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${habit.isCompletedToday
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'bg-white border-slate-200 text-transparent group-hover:border-emerald-300'
                                        }`}>
                                        <Check size={14} strokeWidth={4} />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm ${habit.isCompletedToday ? 'text-emerald-900' : 'text-slate-700'}`}>
                                            {habit.label}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-1.5 flex-1 bg-white/50 rounded-full overflow-hidden max-w-[100px]">
                                                <div
                                                    className={`h-full rounded-full ${habit.isCompletedToday ? 'bg-emerald-400' : 'bg-slate-200'}`}
                                                    style={{ width: `${(habit.completedDays / 7) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {habit.completedDays}/7 days
                                            </span>
                                        </div>
                                    </div>

                                    <div className="opacity-50">
                                        {habit.icon}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Conversations & Prompt */}
                    <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col h-full bg-gradient-to-b from-white to-rose-50/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-800">Connection Prompt</h3>
                            <MessageCircle className="w-5 h-5 text-rose-400" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-3xl mx-auto shadow-sm">
                                {currentPrompt.category === 'fun' ? '🎉' : currentPrompt.category === 'depth' ? '🧠' : '💖'}
                            </div>

                            <p className="text-xl font-bold text-slate-800 italic leading-relaxed px-4">
                                "{currentPrompt.text}"
                            </p>

                            <div className="flex justify-center">
                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    Category: {currentPrompt.category}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={getNewPrompt}
                            className="mt-8 w-full py-4 rounded-xl text-rose-600 font-bold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Show another prompt
                        </button>
                    </section>

                </div>

                {/* Education Mini-Section */}
                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="text-rose-400" />
                        <h3 className="text-xl font-black">Learn & Grow</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {RESOURCES.map(resource => (
                            <button
                                key={resource.id}
                                className="text-left bg-white/5 hover:bg-white/10 p-5 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400">
                                        {resource.type}
                                    </span>
                                    <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="font-bold text-lg mb-1">{resource.title}</h4>
                                <p className="text-sm text-slate-400 font-medium">{resource.description}</p>
                            </button>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
