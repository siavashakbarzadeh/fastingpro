'use client';

import React, { useState } from 'react';
import {
    Moon,
    Sun,
    Clock,
    CheckCircle,
    AlertTriangle,
    BarChart2,
    ListChecks,
    BedDouble,
    Bell,
    Star
} from 'lucide-react';

import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';

// --- Types ---

type SleepQuality = 1 | 2 | 3 | 4 | 5;

interface SleepLog {
    date: string;
    displayDate: string;
    bedTime: string;
    wakeTime: string;
    timeToFallAsleep: string;
    awakenings: number;
    quality: SleepQuality;
    durationMinutes: number;
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
];

const INITIAL_HABITS: Habit[] = [
    { id: '1', text: 'No caffeine 6h before bed', completed: false },
    { id: '2', text: 'Limited screens 1h before bed', completed: false },
    { id: '3', text: 'Consistent bedtime', completed: false },
    { id: '4', text: 'Bedroom dark & cool', completed: false },
    { id: '5', text: 'Relaxation routine (read, breathe)', completed: false },
];

// --- Page ---

export default function SleepPage() {
    const [logs, setLogs] = useState<SleepLog[]>(MOCK_LOGS);
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

    // Form State
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [fallAsleep, setFallAsleep] = useState('15-30');
    const [awakenings, setAwakenings] = useState(0);
    const [quality, setQuality] = useState<SleepQuality>(3);

    const [isSavingLog, setIsSavingLog] = useState(false);
    const [logSaved, setLogSaved] = useState(false);

    // Derived
    const calculateDuration = (start: string, end: string) => {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        let s = sh * 60 + sm;
        let e = eh * 60 + em;
        if (e < s) e += 24 * 60;
        return e - s;
    };

    const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
    };

    const currentDuration = calculateDuration(bedTime, wakeTime);

    const handleSaveLog = async () => {
        setIsSavingLog(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsSavingLog(false);
        setLogSaved(true);
        setTimeout(() => setLogSaved(false), 3000);
    };

    const toggleHabit = (id: string) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const averageDuration = logs.reduce((acc, l) => acc + l.durationMinutes, 0) / logs.length;
    const averageQuality = (logs.reduce((acc, l) => acc + l.quality, 0) / logs.length).toFixed(1);

    return (
        <AppShell title="Sleep Tracker" subtitle="Rest & Recovery" showBackButton backUrl="/" activeTab="plan">
            <main className="px-6 py-6 space-y-10">

                {/* Last Night's Log */}
                <section>
                    <SectionHeader title="Daily Entry" description="Log your sleep from last night" />
                    <Card variant="white" padding="md" className="shadow-xl">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2">Bedtime</label>
                                    <input
                                        type="time"
                                        value={bedTime}
                                        onChange={(e) => setBedTime(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2">Wake Up</label>
                                    <input
                                        type="time"
                                        value={wakeTime}
                                        onChange={(e) => setWakeTime(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="bg-primary/5 rounded-2xl p-4 flex items-center justify-center gap-3 border border-primary/10">
                                <Clock size={16} className="text-primary" />
                                <span className="text-sm font-black text-slate-700">
                                    Total Sleep: <span className="text-primary">{formatDuration(currentDuration)}</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2">Mins to sleep</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
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
                                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2">Quality</label>
                                    <div className="flex bg-slate-50 rounded-2xl p-1">
                                        {[1, 3, 5].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setQuality(n as SleepQuality)}
                                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${quality === n
                                                    ? 'bg-white text-primary shadow-sm'
                                                    : 'text-slate-300 hover:text-slate-500'
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveLog}
                                isLoading={isSavingLog}
                                variant={logSaved ? 'primary' : 'primary'}
                                className="w-full py-4 text-base"
                                icon={logSaved ? <CheckCircle size={18} /> : <Moon size={18} />}
                            >
                                {logSaved ? 'Logged Successfully' : 'Log My Sleep'}
                            </Button>
                        </div>
                    </Card>
                </section>

                {/* 7 Day Overview */}
                <section>
                    <SectionHeader
                        title="Trends"
                        description="Last 7 nights performance"
                        action={<Chip label={`${averageQuality}/5 Quality`} variant="primary" active />}
                    />
                    <Card variant="white" padding="md">
                        <div className="flex justify-between items-end h-32 mb-8 px-2 gap-2">
                            {logs.map((log, i) => {
                                const height = (log.durationMinutes / 600) * 100; // max 10h
                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 flex-1">
                                        <div className="w-full bg-slate-50 rounded-full h-full flex items-end overflow-hidden">
                                            <div
                                                className={`w-full transition-all duration-1000 ${log.quality >= 4 ? 'bg-primary' : log.quality === 3 ? 'bg-secondary' : 'bg-danger'}`}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-muted uppercase">{log.displayDate[0]}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <div className="text-xl font-black text-slate-800">{formatDuration(Math.round(averageDuration))}</div>
                                <div className="text-[10px] font-black text-muted uppercase tracking-widest">Avg Duration</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <div className="text-xl font-black text-slate-800">{averageQuality}</div>
                                <div className="text-[10px] font-black text-muted uppercase tracking-widest">Avg Quality</div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Habits */}
                <section>
                    <SectionHeader title="Sleep Hygiene" description="Essential habits for good rest" />
                    <div className="space-y-3">
                        {habits.map(habit => (
                            <button
                                key={habit.id}
                                onClick={() => toggleHabit(habit.id)}
                                className={`w-full p-5 rounded-3xl flex items-center gap-4 transition-all border-2 ${habit.completed
                                    ? 'bg-primary/5 border-primary/20'
                                    : 'bg-white border-slate-50 hover:border-slate-100'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${habit.completed
                                    ? 'bg-primary border-primary text-white'
                                    : 'border-slate-200 text-transparent'
                                    }`}>
                                    <CheckCircle size={14} fill="currentColor" />
                                </div>
                                <span className={`text-sm font-black ${habit.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                    {habit.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Not Medical Advice */}
                <section className="text-center py-6 bg-slate-100/50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <AlertTriangle className="mx-auto text-muted w-6 h-6 mb-3" />
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest px-8 leading-relaxed">
                        Educational only • Not medical advice • Consult a doctor for sleep disorders
                    </p>
                </section>

            </main>
        </AppShell>
    );
}
