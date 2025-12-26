'use client';

import React, { useState } from 'react';
import {
    Plus,
    Target,
    Zap,
    BarChart2,
    CheckCircle,
    AlertOctagon,
    Trees,
    Timer,
    Footprints
} from 'lucide-react';
import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState, ErrorState } from '@/components/ui/StatusStates';
import { useActivity } from '@/hooks/useActivity';
import { DailyActivityLog, ActivityHabit } from '@/lib/api-client';

export default function ActivityPage() {
    const {
        history,
        habits,
        goal,
        isLoading,
        isSaving,
        error,
        stats,
        saveGoal,
        addActivity,
        toggleHabit,
        retry
    } = useActivity();

    const [tempMinutes, setTempMinutes] = useState<number>(0);
    const [tempGoal, setTempGoal] = useState(goal.value.toString());
    const [goalError, setGoalError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isEditingGoal, setIsEditingGoal] = useState(false);

    // Sync tempGoal when it loads
    React.useEffect(() => {
        if (!isEditingGoal) {
            setTempGoal(goal.value.toString());
        }
    }, [goal.value, isEditingGoal]);

    const handleQuickAdd = async (mins: number) => {
        const success = await addActivity(mins);
        if (success) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };

    const handleSaveToday = async () => {
        if (tempMinutes <= 0) return;
        const success = await addActivity(tempMinutes);
        if (success) {
            setTempMinutes(0);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };

    const handleUpdateGoal = async () => {
        setGoalError(null);
        const val = parseInt(tempGoal);
        if (isNaN(val) || val <= 0) {
            setGoalError('Please enter a valid goal (positive number)');
            return;
        }
        await saveGoal({ type: goal.type, value: val });
        setIsEditingGoal(false);
    };

    if (isLoading && history.length === 0) return <LoadingState />;
    if (error && history.length === 0) return <ErrorState message={error} onRetry={retry} />;

    const todayLog = history.find((l: DailyActivityLog) => l.date === new Date().toISOString().split('T')[0]);
    const todayMinutes = todayLog?.minutes || 0;
    const progressPercent = Math.min(100, (todayMinutes / goal.value) * 100);

    return (
        <AppShell
            title="Move More"
            subtitle="Daily Activity Tracker"
            showBackButton
            backUrl="/"
            activeTab="plan"
        >
            <main className="px-6 py-8 space-y-10">

                {/* Daily Goal Section */}
                <section>
                    <SectionHeader title="Daily Goal" description="Set your targets" />
                    <Card variant="white" padding="md" className="shadow-xl">
                        <div className="space-y-6">
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                                <button
                                    onClick={async () => await saveGoal({ ...goal, type: 'minutes' })}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${goal.type === 'minutes' ? 'bg-white text-primary shadow-md' : 'text-slate-400'}`}
                                >
                                    Minutes
                                </button>
                                <button
                                    onClick={async () => await saveGoal({ ...goal, type: 'steps' })}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${goal.type === 'steps' ? 'bg-white text-primary shadow-md' : 'text-slate-400'}`}
                                >
                                    Steps
                                </button>
                            </div>

                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                                        Target {goal.type === 'minutes' ? 'Minutes' : 'Step Count'}
                                    </label>
                                    <input
                                        type="number"
                                        value={tempGoal}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempGoal(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xl font-black text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                    {goalError && <p className="text-[10px] font-black text-rose-500 mt-2 uppercase">{goalError}</p>}
                                </div>
                                <Button
                                    onClick={handleUpdateGoal}
                                    isLoading={isSaving}
                                    className="h-[60px] w-[60px] rounded-2xl shrink-0"
                                >
                                    OK
                                </Button>
                            </div>
                            <div className="bg-primary/5 py-3 rounded-2xl text-center">
                                <p className="text-xs font-black text-primary uppercase tracking-tight">
                                    Current Goal: {goal.value} {goal.type}
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Today's Progress */}
                <section>
                    <SectionHeader title="Today's Progress" description="Your movement today" />
                    <Card variant="white" padding="md">
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="flex justify-center items-baseline gap-1 mb-2">
                                    <span className="text-5xl font-black text-primary">{todayMinutes}</span>
                                    <span className="text-sm font-black text-slate-400 uppercase">/ {goal.value} mins</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <p className="text-xs font-black text-slate-400 mt-4 uppercase tracking-widest">
                                    {progressPercent >= 100 ? '🎉 Goal Reached!' : 'Keep pushing forward'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Quick Log</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: '10 min', sub: 'Walk', color: 'bg-emerald-50 text-emerald-600', val: 10 },
                                        { label: '5 min', sub: 'Stretch', color: 'bg-orange-50 text-orange-600', val: 5 },
                                        { label: '20 min', sub: 'Active', color: 'bg-blue-50 text-blue-600', val: 20 },
                                    ].map((btn: { label: string; sub: string; color: string; val: number }) => (
                                        <button
                                            key={btn.label}
                                            onClick={() => handleQuickAdd(btn.val)}
                                            className={`${btn.color} p-4 rounded-2xl flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-sm`}
                                        >
                                            <span className="text-sm font-black">{btn.label}</span>
                                            <span className="text-[10px] font-black uppercase opacity-60">{btn.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                                    <input
                                        type="number"
                                        value={tempMinutes || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempMinutes(parseInt(e.target.value) || 0)}
                                        className="flex-1 bg-transparent text-center font-black text-slate-700 outline-none text-xl placeholder:text-slate-300"
                                        placeholder="Enter minutes"
                                    />
                                    <Button
                                        onClick={handleSaveToday}
                                        isLoading={isSaving}
                                        className="py-4 px-6 rounded-xl"
                                        disabled={tempMinutes <= 0}
                                    >
                                        Log
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* History Analytics */}
                <section>
                    <SectionHeader
                        title="Overview"
                        description="Last 7 days"
                        action={<Chip label={`Avg: ${stats.avgMinutes}m`} variant="primary" active />}
                    />
                    <Card variant="white" padding="md">
                        <div className="flex justify-between items-end h-[120px] mb-8 px-1 gap-3">
                            {history.slice(-7).map((log: DailyActivityLog, i: number) => {
                                const height = Math.min(100, (log.minutes / Math.max(60, goal.value)) * 100);
                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 flex-1 group">
                                        <div className="relative w-full flex justify-center h-full items-end bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className={`w-full rounded-full transition-all duration-1000 ${log.goalMet ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-slate-200'}`}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">{log.displayDate.slice(0, 3)}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-3">
                            {stats.insights.map((insight: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                    <p className="text-xs font-black text-slate-600 leading-relaxed uppercase tracking-tight">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* Habits */}
                <section>
                    <SectionHeader title="Micro Habits" description="Small wins add up" />
                    <div className="grid grid-cols-1 gap-3">
                        {habits.map((habit: ActivityHabit) => (
                            <button
                                key={habit.id}
                                onClick={async () => await toggleHabit(habit.id)}
                                className={`p-5 rounded-3xl flex items-center justify-between transition-all border-2 ${habit.completed
                                    ? 'bg-primary/5 border-primary shadow-sm'
                                    : 'bg-white border-slate-50 hover:border-primary/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${habit.completed ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-300'}`}>
                                        <CheckCircle size={20} fill={habit.completed ? "white" : "none"} stroke={habit.completed ? "none" : "currentColor"} />
                                    </div>
                                    <span className={`text-sm font-black uppercase tracking-tight ${habit.completed ? 'text-primary' : 'text-slate-500'}`}>
                                        {habit.text}
                                    </span>
                                </div>
                                {habit.completed && <Zap size={16} className="text-primary animate-pulse" />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Safety Protocol */}
                <section className="text-center py-10 bg-slate-900 rounded-[3rem] border border-slate-800 px-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
                    <AlertOctagon className="mx-auto text-secondary w-10 h-10 mb-6" />
                    <h3 className="text-white font-black text-lg mb-4 uppercase tracking-tighter">Medical Protocol</h3>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-loose mb-8 opacity-70">
                        Listen to your body • Consult professionals • Stop immediately if experiencing distress
                    </p>
                    <div className="flex justify-center gap-4 border-t border-slate-800 pt-8">
                        <Chip label="Pulse Check" variant="secondary" />
                        <Chip label="Hydration Aware" variant="secondary" />
                    </div>
                </section>

            </main>
        </AppShell>
    );
}
