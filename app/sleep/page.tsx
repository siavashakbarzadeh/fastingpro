'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Moon,
    Sun,
    CloudRain,
    Cloud,
    Star,
    Clock,
    CheckCircle,
    AlertTriangle,
    Save,
    ChevronRight,
    BarChart2,
    ListChecks,
    BedDouble,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Types ---

type SleepQuality = 1 | 2 | 3 | 4 | 5;

interface SleepLog {
    date: string; // YYYY-MM-DD
    displayDate: string; // "Mon", "Tue"
    bedTime: string; // HH:MM
    wakeTime: string; // HH:MM
    timeToFallAsleep: string; // '0-15', '15-30', etc
    awakenings: number;
    quality: SleepQuality;
    durationMinutes: number;
    nomte?: string;
}

interface Habit {
    id: string;
    text: string;
    completed: boolean;
}

// --- Mock Data ---

const MOCK_LOGS: SleepLog[] = [
    { date: '2023-10-24', displayDate: 'Tue', bedTime: '23:00', wakeTime: '07:00', durationMinutes: 480, quality: 4, awakenings: 1, timeToFallAsleep: '15-30' },
    { date: '2023-10-25', displayDate: 'Wed', bedTime: '23:30', wakeTime: '06:30', durationMinutes: 420, quality: 3, awakenings: 2, timeToFallAsleep: '30-60' },
    { date: '2023-10-26', displayDate: 'Thu', bedTime: '00:15', wakeTime: '07:15', durationMinutes: 420, quality: 2, awakenings: 3, timeToFallAsleep: '>60' },
    { date: '2023-10-27', displayDate: 'Fri', bedTime: '22:45', wakeTime: '07:00', durationMinutes: 495, quality: 5, awakenings: 0, timeToFallAsleep: '0-15' },
    { date: '2023-10-28', displayDate: 'Sat', bedTime: '01:00', wakeTime: '09:00', durationMinutes: 480, quality: 4, awakenings: 1, timeToFallAsleep: '15-30' },
    { date: '2023-10-29', displayDate: 'Sun', bedTime: '23:00', wakeTime: '07:30', durationMinutes: 510, quality: 5, awakenings: 0, timeToFallAsleep: '0-15' },
    // Today is empty
];

const INITIAL_HABITS: Habit[] = [
    { id: '1', text: 'No caffeine 6h before bed', completed: false },
    { id: '2', text: 'Limited screens 1h before bed', completed: false },
    { id: '3', text: 'Consistent bedtime', completed: false },
    { id: '4', text: 'Bedroom dark & cool', completed: false },
    { id: '5', text: 'Relaxation routine (read, breathe)', completed: false },
];

// --- Helpers ---

const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;

    // Handle crossover midnight (e.g. 23:00 to 07:00)
    if (endMin < startMin) {
        endMin += 24 * 60;
    }

    return endMin - startMin; // in minutes
};

const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
};

const getInsights = (logs: SleepLog[]) => {
    const insights = [];
    const avgDuration = logs.reduce((acc, l) => acc + l.durationMinutes, 0) / logs.length;

    if (avgDuration < 420) { // < 7 hours
        insights.push(`You slept less than 7 hours on average this week (${formatDuration(Math.round(avgDuration))}).`);
    } else {
        insights.push(`Great job! You're averaging ${formatDuration(Math.round(avgDuration))} of sleep.`);
    }

    const goodSleep = logs.filter(l => l.quality >= 4);
    if (goodSleep.length >= 4) {
        insights.push("You're maintaining good sleep quality on most nights.");
    }

    return insights;
};

// --- Components ---

export default function SleepPage() {
    const [logs, setLogs] = useState<SleepLog[]>(MOCK_LOGS);
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

    // Log Form State
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [fallAsleep, setFallAsleep] = useState('15-30');
    const [awakenings, setAwakenings] = useState(0);
    const [quality, setQuality] = useState<SleepQuality>(3);
    const [note, setNote] = useState('');

    // Wind Down State
    const [targetBedtime, setTargetBedtime] = useState('23:00');
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [isSavingPlan, setIsSavingPlan] = useState(false);

    const [isSavingLog, setIsSavingLog] = useState(false);
    const [logSaved, setLogSaved] = useState(false);

    const currentDuration = calculateDuration(bedTime, wakeTime);

    const handleSaveLog = async () => {
        setIsSavingLog(true);
        await new Promise(r => setTimeout(r, 1000));

        const newLog: SleepLog = {
            date: new Date().toISOString().split('T')[0],
            displayDate: 'Today',
            bedTime,
            wakeTime,
            timeToFallAsleep: fallAsleep,
            awakenings,
            quality,
            durationMinutes: currentDuration
        };

        setLogs(prev => [...prev.slice(1), newLog]);
        setIsSavingLog(false);
        setLogSaved(true);
        setTimeout(() => setLogSaved(false), 3000);
    };

    const toggleHabit = (id: string) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const handleSavePlan = async () => {
        setIsSavingPlan(true);
        await new Promise(r => setTimeout(r, 500));
        setIsSavingPlan(false);
    };

    const insights = getInsights(logs);
    const averageQuality = (logs.reduce((acc, l) => acc + l.quality, 0) / logs.length).toFixed(1);

    // Calculate wind down time (60 mins before target)
    const getWindDownTime = () => {
        const [h, m] = targetBedtime.split(':').map(Number);
        let wh = h - 1;
        if (wh < 0) wh += 24;
        return `${wh.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-24 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">

            {/* Header */}
            <header className="bg-slate-900/50 backdrop-blur-md border-b border-indigo-900/30 sticky top-0 z-30 shadow-sm">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-indigo-300 hover:text-white transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-white flex items-center gap-2">
                            <Moon className="w-6 h-6 text-indigo-400 fill-indigo-400" />
                            Improve My Sleep
                        </h1>
                        <p className="text-xs text-indigo-300 font-bold uppercase tracking-wide px-0.5">
                            Sleep Diary & Coach
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">

                {/* Last Night's Log */}
                <section className="bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-indigo-900/20 border border-indigo-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                            <BedDouble size={20} />
                        </div>
                        <h2 className="text-xl font-black text-white">Last Night's Log</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Times */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Bedtime</label>
                                <input
                                    type="time"
                                    value={bedTime}
                                    onChange={(e) => setBedTime(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold text-center focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Woke Up</label>
                                <input
                                    type="time"
                                    value={wakeTime}
                                    onChange={(e) => setWakeTime(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-bold text-center focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-indigo-950/50 rounded-xl p-4 flex items-center justify-center gap-2 border border-indigo-500/20">
                            <Clock size={16} className="text-indigo-400" />
                            <span className="text-sm font-bold text-indigo-200">
                                You slept about <span className="text-white">{formatDuration(currentDuration)}</span>
                            </span>
                        </div>

                        {/* Fall Asleep & Awakenings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Mins to sleep</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-sm font-bold outline-none focus:border-indigo-500"
                                    value={fallAsleep}
                                    onChange={(e) => setFallAsleep(e.target.value)}
                                >
                                    <option value="0-15">0-15m</option>
                                    <option value="15-30">15-30m</option>
                                    <option value="30-60">30-60m</option>
                                    <option value=">60">&gt; 60m</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Awakenings</label>
                                <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
                                    {[0, 1, 2, 3].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setAwakenings(n)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${awakenings === n
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {n}{n === 3 ? '+' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quality */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Sleep Quality</label>
                            <div className="flex justify-between gap-2">
                                {([1, 2, 3, 4, 5] as SleepQuality[]).map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setQuality(q)}
                                        className={`flex-1 h-12 rounded-xl border-2 transition-all flex items-center justify-center font-black ${quality === q
                                                ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 transform scale-105'
                                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400'
                                            }`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mt-2 px-1">
                                <span>Very Poor</span>
                                <span>Excellent</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleSaveLog}
                            disabled={isSavingLog}
                            className={`w-full py-6 rounded-2xl font-black shadow-lg transition-all ${logSaved ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-200'
                                }`}
                        >
                            {isSavingLog ? 'Saving...' : logSaved ? 'Logged!' : 'Save Sleep Log'}
                        </Button>
                    </div>
                </section>

                {/* 7 Day Overview */}
                <section className="bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-indigo-900/20 border border-indigo-500/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                            <BarChart2 size={20} />
                        </div>
                        <h2 className="text-xl font-black text-white">Last 7 Nights</h2>
                    </div>

                    <div className="flex justify-between items-end h-[120px] mb-6 px-1 gap-2">
                        {logs.map((log, i) => {
                            // Scale: 8 hours = 100% height
                            const height = Math.min(100, Math.max(20, (log.durationMinutes / 480) * 80));
                            const colorClass = log.quality >= 4 ? 'bg-emerald-400' :
                                log.quality === 3 ? 'bg-indigo-400' : 'bg-rose-400';

                            return (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div className="relative w-full flex justify-center h-full items-end">
                                        <div
                                            className={`w-full max-w-[14px] rounded-t-lg bg-opacity-90 transition-all ${colorClass}`}
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase truncate w-full text-center group-hover:text-white transition-colors">{log.displayDate.slice(0, 1)}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-800">
                            <div className="text-2xl font-black text-white mb-1">
                                {formatDuration(Math.round(logs.reduce((acc, l) => acc + l.durationMinutes, 0) / logs.length))}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Duration</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-slate-800">
                            <div className="text-2xl font-black text-white mb-1">{averageQuality}/5</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Quality</div>
                        </div>
                    </div>

                    <div className="bg-indigo-950/30 rounded-xl p-4 space-y-2 border border-indigo-900/30">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm font-medium text-indigo-200">
                                <Star size={12} className="mt-1 flex-shrink-0 text-indigo-400" />
                                {insight}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Habits */}
                <section className="bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-indigo-900/20 border border-indigo-500/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                            <ListChecks size={20} />
                        </div>
                        <h2 className="text-xl font-black text-white">Sleep Hygiene</h2>
                    </div>

                    <div className="space-y-3">
                        {habits.map(habit => (
                            <button
                                key={habit.id}
                                onClick={() => toggleHabit(habit.id)}
                                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border ${habit.completed
                                        ? 'bg-emerald-900/20 border-emerald-500/30'
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${habit.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-slate-500 text-transparent'
                                    }`}>
                                    <CheckCircle size={14} fill="currentColor" />
                                </div>
                                <span className={`text-sm font-bold ${habit.completed ? 'text-emerald-100 line-through decoration-emerald-500/50' : 'text-slate-300'}`}>
                                    {habit.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Bedtime Plan */}
                <section className="bg-indigo-900 rounded-[2.5rem] p-7 shadow-xl border border-indigo-400/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
                                <Moon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white">Wind Down</h2>
                        </div>
                        <button
                            onClick={() => setReminderEnabled(!reminderEnabled)}
                            className={`p-2 rounded-full transition-colors ${reminderEnabled ? 'bg-white text-indigo-900' : 'bg-indigo-950 text-indigo-400'}`}
                        >
                            <Bell size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wide mb-2">Target Bedtime</label>
                            <input
                                type="time"
                                value={targetBedtime}
                                onChange={(e) => setTargetBedtime(e.target.value)}
                                className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-xl p-3 text-white font-bold text-center focus:border-white outline-none"
                            />
                        </div>

                        <div className="bg-indigo-950/30 rounded-xl p-4 text-center border border-indigo-400/10">
                            <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Start winding down at</p>
                            <p className="text-2xl font-black text-white">{getWindDownTime()}</p>
                        </div>

                        <button
                            onClick={handleSavePlan}
                            disabled={isSavingPlan}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-colors"
                        >
                            {isSavingPlan ? 'Updating...' : 'Update Plan'}
                        </button>
                    </div>
                </section>

                {/* Disclaimer */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 text-center mt-8">
                    <AlertTriangle className="mx-auto text-slate-500 w-8 h-8 mb-4" />
                    <h3 className="text-slate-300 font-black text-lg mb-2">Not Medical Advice</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                        This diary helps you build better habits. It cannot diagnose sleep disorders like apnea or insomnia.
                    </p>
                    <p className="text-xs text-slate-600 font-bold border-t border-slate-800 pt-4 leading-relaxed">
                        If you have loud snoring, stop breathing during sleep, or feel excessively excessively sleepy, please see a sleep specialist.
                    </p>
                </section>

            </main>
        </div>
    );
}
