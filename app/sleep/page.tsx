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
import { LoadingState, ErrorState } from '@/components/ui/StatusStates';
import { useSleep } from '@/hooks/useSleep';
import { SleepQuality } from '@/lib/api-client';

export default function SleepPage() {
    const {
        logs,
        habits,
        isLoading,
        isSaving,
        error,
        stats,
        saveLog,
        toggleHabit,
        retry
    } = useSleep();

    // Form State
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [fallAsleep, setFallAsleep] = useState('15-30');
    const [awakenings, setAwakenings] = useState(0);
    const [quality, setQuality] = useState<SleepQuality>(3);
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

    const [formError, setFormError] = useState<string | null>(null);

    const handleSaveLog = async () => {
        setFormError(null);
        if (awakenings < 0) {
            setFormError('Awakenings cannot be negative');
            return;
        }
        if (currentDuration <= 0) {
            setFormError('Wake time must be after bedtime');
            return;
        }

        const success = await saveLog({
            date: new Date().toISOString().split('T')[0],
            bedTime,
            wakeTime,
            timeToFallAsleep: fallAsleep,
            awakenings,
            quality,
            durationMinutes: currentDuration
        });

        if (success) {
            setLogSaved(true);
            setTimeout(() => setLogSaved(false), 3000);
        }
    };

    if (isLoading && logs.length === 0) return <LoadingState />;
    if (error && logs.length === 0) return <ErrorState message={error} onRetry={retry} />;

    return (
        <AppShell title="Sleep Tracker" subtitle="Rest & Recovery" showBackButton backUrl="/" activeTab="plan">
            <main className="px-6 py-6 space-y-10">

                {/* Daily Entry */}
                <section>
                    <SectionHeader title="Daily Entry" description="Log your sleep from last night" />
                    <Card variant="white" padding="md" className="shadow-xl">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Bedtime</label>
                                    <input
                                        type="time"
                                        value={bedTime}
                                        onChange={(e) => setBedTime(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Wake Up</label>
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
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">To fall asleep</label>
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
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Quality</label>
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

                            {/* Form Error */}
                            {formError && (
                                <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase text-center">
                                    {formError}
                                </div>
                            )}

                            <Button
                                onClick={handleSaveLog}
                                size="lg"
                                className="w-full"
                                isLoading={isSaving}
                            >
                                {logSaved ? 'Sleep Logged' : 'Log My Sleep'}
                            </Button>
                        </div>
                    </Card>
                </section>

                {/* Trends Overview */}
                <section>
                    <SectionHeader
                        title="Trends"
                        description="Last 7 nights performance"
                        action={<Chip label={`${stats.avgQuality}/5 Quality`} variant="primary" active />}
                    />
                    <Card variant="white" padding="md">
                        <div className="flex justify-between items-end h-32 mb-8 px-2 gap-2">
                            {logs.slice(-7).map((log, i) => {
                                const height = Math.min(100, (log.durationMinutes / 600) * 100); // max 10h
                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 flex-1">
                                        <div className="w-full bg-slate-50 rounded-full h-full flex items-end overflow-hidden">
                                            <div
                                                className={`w-full transition-all duration-1000 ${log.quality >= 4 ? 'bg-primary' : log.quality === 3 ? 'bg-secondary' : 'bg-danger'}`}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase truncate">{log.displayDate[0]}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <div className="text-xl font-black text-slate-800">{formatDuration(Math.round(stats.avgDuration))}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Duration</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <div className="text-xl font-black text-slate-800">{stats.avgQuality}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Quality</div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Hygiene Habits */}
                <section>
                    <SectionHeader title="Sleep Hygiene" description="Essential habits for good rest" />
                    <div className="space-y-3">
                        {habits.map(habit => (
                            <button
                                key={habit.id}
                                onClick={async () => await toggleHabit(habit.id)}
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

                {/* Medical Disclaimer */}
                <section className="text-center py-6 bg-slate-100/50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <AlertTriangle className="mx-auto text-slate-300 w-6 h-6 mb-3" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 leading-relaxed">
                        Educational only • Not medical advice • Consult a doctor for sleep disorders
                    </p>
                </section>

            </main>
        </AppShell >
    );
}
