'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Footprints,
    Timer,
    TrendingUp,
    Award,
    Zap,
    CheckCircle,
    Plus,
    Target,
    BarChart2,
    ChevronRight,
    AlertOctagon,
    Activity,
    Trees
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// --- Types ---

type GoalType = 'minutes' | 'steps';

interface DailyActivityLog {
    date: string; // YYYY-MM-DD
    displayDate: string; // "Mon"
    minutes: number;
    steps?: number;
    goalMet: boolean;
}

interface Habit {
    id: string;
    text: string;
    completed: boolean;
}

// --- Mock Data ---

const MOCK_HISTORY: DailyActivityLog[] = [
    { date: '2023-10-24', displayDate: 'Tue', minutes: 25, goalMet: false },
    { date: '2023-10-25', displayDate: 'Wed', minutes: 45, goalMet: true },
    { date: '2023-10-26', displayDate: 'Thu', minutes: 30, goalMet: true },
    { date: '2023-10-27', displayDate: 'Fri', minutes: 15, goalMet: false },
    { date: '2023-10-28', displayDate: 'Sat', minutes: 60, goalMet: true },
    { date: '2023-10-29', displayDate: 'Sun', minutes: 40, goalMet: true },
    // Today initialized as 0
];

const INITIAL_HABITS: Habit[] = [
    { id: '1', text: 'Take a 10-minute walk', completed: false },
    { id: '2', text: 'Use stairs once today', completed: false },
    { id: '3', text: 'Stretch for 5 mins', completed: false },
    { id: '4', text: 'Stand up every hour', completed: false },
    { id: '5', text: 'Short home workout', completed: false },
];

// --- Helpers ---

const getInsights = (history: DailyActivityLog[]) => {
    const insights = [];
    const metGoalCount = history.filter(d => d.goalMet).length;

    if (metGoalCount >= 3) {
        insights.push(`You hit your goal on ${metGoalCount} of the last ${history.length} days!`);
    } else {
        insights.push(`You met your goal ${metGoalCount} times this week. Keep going!`);
    }

    const maxDay = history.reduce((prev, current) => (prev.minutes > current.minutes) ? prev : current);
    if (maxDay.minutes > 0) {
        insights.push(`Your most active day was ${maxDay.displayDate} with ${maxDay.minutes} mins.`);
    }

    return insights;
};

// --- Components ---

export default function ActivityPage() {
    // Goal State
    const [goalType, setGoalType] = useState<GoalType>('minutes');
    const [goalValue, setGoalValue] = useState<number>(30); // Default 30 mins
    const [isSavingGoal, setIsSavingGoal] = useState(false);

    // Today's Activity State
    const [todayMinutes, setTodayMinutes] = useState(0);
    const [todaySteps, setTodaySteps] = useState(0);
    const [isSavingActivity, setIsSavingActivity] = useState(false);

    // History & Habits
    const [history, setHistory] = useState<DailyActivityLog[]>(MOCK_HISTORY);
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

    // Initial mount logic
    useEffect(() => {
        // In a real app, fetch from local storage or API
    }, []);

    const handleSaveGoal = async () => {
        setIsSavingGoal(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSavingGoal(false);
    };

    const handleAddMinutes = (mins: number) => {
        setTodayMinutes(prev => prev + mins);
    };

    const handleSaveToday = async () => {
        setIsSavingActivity(true);
        await new Promise(r => setTimeout(r, 1000));

        const newLog: DailyActivityLog = {
            date: new Date().toISOString().split('T')[0],
            displayDate: 'Today',
            minutes: todayMinutes,
            steps: todaySteps,
            goalMet: todayMinutes >= goalValue // simplified check
        };

        setHistory(prev => [...prev.slice(1), newLog]);
        setIsSavingActivity(false);
    };

    const toggleHabit = (id: string) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const insights = getInsights(history);
    const avgMinutes = Math.round(history.reduce((acc, curr) => acc + curr.minutes, 0) / history.length);
    const progressPercent = Math.min(100, (todayMinutes / goalValue) * 100);

    return (
        <div className="min-h-screen bg-emerald-50 pb-24 font-sans text-slate-800">

            {/* Header */}
            <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                            <Trees className="w-6 h-6 text-emerald-500" />
                            Move More
                        </h1>
                        <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide px-0.5">
                            Daily Activity Tracker
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">

                {/* Daily Goal Card */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-emerald-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Daily Goal</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex bg-slate-50 p-1 rounded-xl">
                            <button
                                onClick={() => { setGoalType('minutes'); setGoalValue(30); }}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${goalType === 'minutes' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Minutes
                            </button>
                            <button
                                onClick={() => { setGoalType('steps'); setGoalValue(6000); }}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${goalType === 'steps' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                Steps
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Target {goalType === 'minutes' ? 'Minutes' : 'Step Count'}
                                </label>
                                <input
                                    type="number"
                                    value={goalValue}
                                    onChange={(e) => setGoalValue(parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-black text-slate-700 outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                />
                            </div>
                            <Button
                                onClick={handleSaveGoal}
                                disabled={isSavingGoal}
                                className="h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mt-6"
                            >
                                {isSavingGoal ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <div className="font-bold text-xs">OK</div>}
                            </Button>
                        </div>
                        <p className="text-xs font-bold text-emerald-600 text-center bg-emerald-50 py-2 rounded-lg">
                            Today's Goal: <span className="text-emerald-800">{goalValue} {goalType}</span>
                        </p>
                    </div>
                </section>

                {/* Today's Activity Log */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-emerald-500/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Zap size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Today's Movement</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-3xl font-black text-emerald-600">{todayMinutes}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase mb-1">/ {goalValue} mins</span>
                            </div>
                            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-2 text-center">
                                {progressPercent >= 100 ? '🎉 Goal Reached!' : 'Keep moving!'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Quick Add</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleAddMinutes(10)} className="bg-emerald-50 h-20 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-emerald-100 transition-colors group">
                                    <Plus size={18} className="text-emerald-400 group-hover:text-emerald-600" />
                                    <span className="text-xs font-black text-emerald-700">10 min</span>
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase">Walk</span>
                                </button>
                                <button onClick={() => handleAddMinutes(5)} className="bg-orange-50 h-20 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-orange-100 transition-colors group">
                                    <Plus size={18} className="text-orange-400 group-hover:text-orange-600" />
                                    <span className="text-xs font-black text-orange-700">5 min</span>
                                    <span className="text-[9px] font-bold text-orange-400 uppercase">Stretch</span>
                                </button>
                                <button onClick={() => handleAddMinutes(15)} className="bg-blue-50 h-20 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-blue-100 transition-colors group">
                                    <Plus size={18} className="text-blue-400 group-hover:text-blue-600" />
                                    <span className="text-xs font-black text-blue-700">15 min</span>
                                    <span className="text-[9px] font-bold text-blue-400 uppercase">Chores</span>
                                </button>
                            </div>
                        </div>

                        {/* Manual Input */}
                        <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl">
                            <input
                                type="number"
                                value={todayMinutes}
                                onChange={(e) => setTodayMinutes(parseInt(e.target.value) || 0)}
                                className="flex-1 bg-transparent text-center font-black text-slate-700 outline-none text-lg"
                                placeholder="0"
                            />
                            <span className="text-xs font-bold text-slate-400 uppercase pr-2">Total Mins</span>
                        </div>

                        <Button
                            onClick={handleSaveToday}
                            disabled={isSavingActivity}
                            className="w-full py-6 rounded-2xl font-black shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                        >
                            {isSavingActivity ? 'Saving...' : 'Save Today'}
                        </Button>
                    </div>
                </section>

                {/* 7 Days Overview */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <BarChart2 size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Last 7 Days</h2>
                    </div>

                    <div className="flex justify-between items-end h-[100px] mb-6 px-1 gap-2">
                        {history.map((log, i) => {
                            const height = Math.min(100, Math.max(10, (log.minutes / 60) * 100)); // 60 mins = 100%
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div className="relative w-full flex justify-center h-full items-end">
                                        <div
                                            className={`w-full max-w-[12px] rounded-t-lg transition-all ${log.goalMet ? 'bg-emerald-400' : 'bg-slate-200'}`}
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase truncate w-full text-center group-hover:text-emerald-500 transition-colors">{log.displayDate.slice(0, 3)}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-4">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase">Daily Average</span>
                            <span className="text-sm font-black text-slate-700">{avgMinutes} mins</span>
                        </div>
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-600">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                {insight}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Habits Checklist */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <CheckCircle size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Tiny Habits</h2>
                    </div>

                    <div className="space-y-3">
                        {habits.map(habit => (
                            <button
                                key={habit.id}
                                onClick={() => toggleHabit(habit.id)}
                                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all border ${habit.completed
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-white border-slate-100 hover:border-emerald-100'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${habit.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-slate-300 text-transparent'
                                    }`}>
                                    <CheckCircle size={14} fill="currentColor" />
                                </div>
                                <span className={`text-sm font-bold ${habit.completed ? 'text-emerald-700 line-through decoration-emerald-500' : 'text-slate-500'}`}>
                                    {habit.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Safety Note */}
                <section className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 text-center mt-8">
                    <AlertOctagon className="mx-auto text-rose-400 w-8 h-8 mb-4" />
                    <h3 className="text-rose-900 font-black text-lg mb-2">Listen To Your Body</h3>
                    <p className="text-rose-800/60 text-sm leading-relaxed mb-4">
                        Always consult your doctor before starting new activities, especially if you have health conditions.
                    </p>
                    <p className="text-xs text-rose-400 font-bold border-t border-rose-200 pt-4 leading-relaxed">
                        Stop and seek help immediately if you feel chest pain, severe breathlessness, or dizziness.
                    </p>
                </section>

            </main>
        </div>
    );
}
