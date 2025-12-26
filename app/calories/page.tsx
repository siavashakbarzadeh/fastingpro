'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Utensils,
    Flame,
    Plus,
    Target,
    ChevronRight,
    Coffee,
    Apple,
    Zap,
    History,
    TrendingUp,
    TrendingDown,
    Activity,
    Trash2,
    Check
} from 'lucide-react';

// --- Types ---

type MealCategory =
    | "breakfast"
    | "lunch"
    | "dinner"
    | "snack"
    | "tea"
    | "coffee"
    | "juice"
    | "soda"
    | "other";

interface FoodEntry {
    id: string;
    type: "meal" | "drink";
    category: MealCategory;
    name: string;
    calories: number;
}

interface ActivityEntry {
    id: string;
    name: string;
    durationMinutes: number;
    caloriesBurned: number;
}

interface DaySummary {
    date: string; // ISO
    intake: number;
    burned: number;
    net: number;
    goal: number;
}

// --- Mock Data ---

const MOCK_HISTORY: DaySummary[] = [
    { date: '2023-12-20', intake: 2100, burned: 400, net: 1700, goal: 2000 },
    { date: '2023-12-21', intake: 2300, burned: 200, net: 2100, goal: 2000 },
    { date: '2023-12-22', intake: 1900, burned: 300, net: 1600, goal: 2000 },
    { date: '2023-12-23', intake: 2500, burned: 600, net: 1900, goal: 2000 },
    { date: '2023-12-24', intake: 2000, burned: 100, net: 1900, goal: 2000 },
    { date: '2023-12-25', intake: 2800, burned: 200, net: 2600, goal: 2000 },
];

const QUICK_FOODS = [
    { name: 'Tea (no sugar)', cal: 30, cat: 'tea' as MealCategory, type: 'drink' as const },
    { name: 'Tea (with sugar)', cal: 60, cat: 'tea' as MealCategory, type: 'drink' as const },
    { name: 'Healthy Snack', cal: 150, cat: 'snack' as MealCategory, type: 'meal' as const },
    { name: 'Light Meal', cal: 400, cat: 'lunch' as MealCategory, type: 'meal' as const },
];

const QUICK_ACTIVITIES = [
    { name: 'Casual Walk', dur: 15, burn: 60 },
    { name: 'Brisk Walk', dur: 30, burn: 150 },
    { name: 'Yoga Session', dur: 45, burn: 180 },
];

// --- Main Page ---

export default function CaloriesPage() {
    // --- State ---
    const [dailyGoal, setDailyGoal] = useState(2000);
    const [tempGoal, setTempGoal] = useState(dailyGoal.toString());
    const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
    const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);

    // Forms
    const [foodForm, setFoodForm] = useState({ name: '', calories: '', category: 'breakfast' as MealCategory });
    const [activityForm, setActivityForm] = useState({ name: '', duration: '', burned: '' });

    // Filter
    const [foodFilter, setFoodFilter] = useState<'All' | 'Meals' | 'Drinks'>('All');

    // --- Derived ---
    const intakeToday = useMemo(() => foodEntries.reduce((acc, curr) => acc + curr.calories, 0), [foodEntries]);
    const burnedToday = useMemo(() => activityEntries.reduce((acc, curr) => acc + curr.caloriesBurned, 0), [activityEntries]);
    const netToday = intakeToday - burnedToday;
    const progress = Math.min((netToday / dailyGoal) * 100, 100);

    const goalStatus = useMemo(() => {
        const diff = dailyGoal - netToday;
        if (Math.abs(diff) <= dailyGoal * 0.1) return "You’re close to your goal today.";
        return diff > 0
            ? `You are ${Math.round(diff)} kcal below your goal.`
            : `You are ${Math.round(Math.abs(diff))} kcal above your goal.`;
    }, [dailyGoal, netToday]);

    const statsHistory = useMemo(() => {
        const todaySummary: DaySummary = {
            date: new Date().toISOString().split('T')[0],
            intake: intakeToday,
            burned: burnedToday,
            net: netToday,
            goal: dailyGoal
        };
        const all = [...MOCK_HISTORY, todaySummary];
        const avgNet = Math.round(all.reduce((acc, curr) => acc + curr.net, 0) / all.length);
        const daysInGoal = all.filter(d => d.net <= d.goal * 1.1).length;
        return { all, avgNet, daysInGoal };
    }, [intakeToday, burnedToday, netToday, dailyGoal]);

    // --- Actions ---
    const addFood = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!foodForm.name || !foodForm.calories) return;

        const isDrink = ['tea', 'coffee', 'juice', 'soda'].includes(foodForm.category);
        const newEntry: FoodEntry = {
            id: Date.now().toString(),
            type: isDrink ? 'drink' : 'meal',
            category: foodForm.category,
            name: foodForm.name,
            calories: parseInt(foodForm.calories)
        };
        setFoodEntries([...foodEntries, newEntry]);
        setFoodForm({ name: '', calories: '', category: foodForm.category });
    };

    const addQuickFood = (name: string, cal: number, cat: MealCategory, type: 'drink' | 'meal') => {
        const newEntry: FoodEntry = {
            id: Date.now().toString(),
            type,
            category: cat,
            name,
            calories: cal
        };
        setFoodEntries([...foodEntries, newEntry]);
    };

    const addActivity = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!activityForm.name || !activityForm.burned) return;

        const newEntry: ActivityEntry = {
            id: Date.now().toString(),
            name: activityForm.name,
            durationMinutes: parseInt(activityForm.duration) || 0,
            caloriesBurned: parseInt(activityForm.burned)
        };
        setActivityEntries([...activityEntries, newEntry]);
        setActivityForm({ name: '', duration: '', burned: '' });
    };

    const addQuickActivity = (name: string, dur: number, burn: number) => {
        const newEntry: ActivityEntry = {
            id: Date.now().toString(),
            name,
            durationMinutes: dur,
            caloriesBurned: burn
        };
        setActivityEntries([...activityEntries, newEntry]);
    };

    const removeFood = (id: string) => setFoodEntries(foodEntries.filter(f => f.id !== id));
    const removeActivity = (id: string) => setActivityEntries(activityEntries.filter(a => a.id !== id));

    const saveGoal = () => {
        const val = parseInt(tempGoal);
        if (!isNaN(val) && val > 0) {
            setDailyGoal(val);
        }
    };

    // --- Filtering Logic ---
    const filteredFood = foodEntries.filter(f => {
        if (foodFilter === 'All') return true;
        if (foodFilter === 'Meals') return f.type === 'meal';
        if (foodFilter === 'Drinks') return f.type === 'drink';
        return true;
    });

    const foodByCat = (cat: string) => filteredFood.filter(f => f.category === cat);
    const catTotal = (cat: string) => foodByCat(cat).reduce((a, b) => a + b.calories, 0);

    return (
        <div className="min-h-screen bg-slate-50 pt-4 pb-20 font-sans text-slate-800">
            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* Header */}
                <header className="flex items-center gap-4 mb-2">
                    <Link href="/" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Calories & activity</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fuel & Recovery</p>
                    </div>
                </header>

                {/* Daily Goal Card */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
                            <Target size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Set Daily Goal</h2>
                            <p className="text-xs font-bold text-slate-400">Target: {dailyGoal} kcal</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={tempGoal}
                            onChange={(e) => setTempGoal(e.target.value)}
                            className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                            placeholder="Goal kcal"
                        />
                        <button
                            onClick={saveGoal}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-indigo-100"
                        >
                            Save
                        </button>
                    </div>
                </section>

                {/* Today Summary */}
                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Zap size={100} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Today's Net</h3>
                                <div className="text-4xl font-black tracking-tighter">{netToday} <span className="text-lg text-slate-500 font-bold">kcal</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Status</div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${netToday > dailyGoal ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    {netToday > dailyGoal ? 'Over Goal' : 'On Track'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Intake</span>
                                <div className="text-xl font-black text-orange-400">{intakeToday}</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-4">
                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Burned</span>
                                <div className="text-xl font-black text-blue-400">{burnedToday}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className={`h-full transition-all duration-1000 ${netToday > dailyGoal ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs font-bold text-slate-300 italic text-center">
                                "{goalStatus}"
                            </p>
                        </div>
                    </div>
                </section>

                {/* Food & Drinks Log */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                <Utensils size={20} />
                            </div>
                            <h2 className="text-xl font-black">Food & drinks</h2>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-8">
                        {['All', 'Meals', 'Drinks'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFoodFilter(f as any)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${foodFilter === f ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-slate-50 text-slate-400'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Entries List */}
                    <div className="space-y-6 mb-10">
                        {['breakfast', 'lunch', 'dinner', 'snack', 'tea', 'coffee', 'juice', 'soda', 'other'].map(cat => {
                            const entries = foodByCat(cat);
                            if (entries.length === 0) return null;
                            return (
                                <div key={cat} className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                                        <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">{cat}</h4>
                                        <span className="text-[10px] font-black text-orange-500">{catTotal(cat)} kcal</span>
                                    </div>
                                    {entries.map(entry => (
                                        <div key={entry.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                                <span className="text-sm font-bold text-slate-700">{entry.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black text-slate-400">{entry.calories} kcal</span>
                                                <button
                                                    onClick={() => removeFood(entry.id)}
                                                    className="p-1 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        {filteredFood.length === 0 && (
                            <div className="text-center py-10">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-3">
                                    <Utensils size={24} />
                                </div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nothing logged yet</p>
                            </div>
                        )}
                    </div>

                    {/* Add Form */}
                    <form onSubmit={addFood} className="space-y-3 pt-6 border-t border-slate-50">
                        <select
                            value={foodForm.category}
                            onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value as MealCategory })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-100 transition-all outline-none"
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                            <option value="tea">Tea</option>
                            <option value="coffee">Coffee</option>
                            <option value="juice">Juice</option>
                            <option value="soda">Soda</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Food/Drink Name"
                                value={foodForm.name}
                                onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
                            />
                            <input
                                type="number"
                                placeholder="kcal"
                                value={foodForm.calories}
                                onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                                className="w-24 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-orange-100 transition-all outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-orange-100"
                        >
                            Add Entry
                        </button>
                    </form>

                    {/* Quick Add Foods */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {QUICK_FOODS.map(f => (
                            <button
                                key={f.name}
                                onClick={() => addQuickFood(f.name, f.cal, f.cat, f.type)}
                                className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-orange-100 transition-colors"
                            >
                                +{f.cal} kcal {f.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Activity Log */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-xl font-black">Activity & exercise</h2>
                    </div>

                    <div className="space-y-4 mb-10">
                        {activityEntries.map(a => (
                            <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-slate-100">
                                        <Flame size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800">{a.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 capitalize">{a.durationMinutes > 0 ? `${a.durationMinutes} minutes` : ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-black text-blue-600">-{a.caloriesBurned} kcal</span>
                                    <button
                                        onClick={() => removeActivity(a.id)}
                                        className="text-slate-200 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {activityEntries.length === 0 && (
                            <div className="text-center py-10 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No activities logged</p>
                            </div>
                        )}
                    </div>

                    {/* Add Activity Form */}
                    <form onSubmit={addActivity} className="space-y-3 pt-6 border-t border-slate-50">
                        <input
                            type="text"
                            placeholder="Activity (e.g. Walking)"
                            value={activityForm.name}
                            onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Minutes"
                                value={activityForm.duration}
                                onChange={(e) => setActivityForm({ ...activityForm, duration: e.target.value })}
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Burned kcal"
                                value={activityForm.burned}
                                onChange={(e) => setActivityForm({ ...activityForm, burned: e.target.value })}
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-blue-100"
                        >
                            Log Activity
                        </button>
                    </form>

                    {/* Quick Add Activities */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {QUICK_ACTIVITIES.map(a => (
                            <button
                                key={a.name}
                                onClick={() => addQuickActivity(a.name, a.dur, a.burn)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-tighter hover:bg-blue-100 transition-colors"
                            >
                                +{a.dur}m {a.name} (-{a.burn} kcal)
                            </button>
                        ))}
                    </div>
                </section>

                {/* 7-Day History */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center">
                            <History size={20} />
                        </div>
                        <h2 className="text-xl font-black">Last 7 days</h2>
                    </div>

                    <div className="flex items-end justify-between gap-1 h-32 mb-10 overflow-x-auto no-scrollbar pb-2">
                        {statsHistory.all.map((day, idx) => {
                            const maxVal = Math.max(...statsHistory.all.map(d => d.net), dailyGoal);
                            const barHeight = (day.net / maxVal) * 100;
                            const isOver = day.net > day.goal * 1.1;
                            return (
                                <div key={idx} className="flex flex-col items-center gap-3 shrink-0 group">
                                    <div className="relative w-8 h-full bg-slate-50 rounded-full overflow-hidden flex flex-col justify-end border border-slate-100">
                                        <div
                                            className={`w-full transition-all duration-1000 group-hover:opacity-80 ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                            style={{ height: `${barHeight}%` }}
                                        />
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Avg. Net</span>
                            <div className="text-lg font-black text-slate-700">{statsHistory.avgNet} <span className="text-[10px]">kcal</span></div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">Success rate</span>
                            <div className="text-lg font-black text-slate-700">{statsHistory.daysInGoal} of 7 <span className="text-[10px]">days</span></div>
                        </div>
                    </div>
                </section>

                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest py-4">
                    Self-tracking for educational purposes • Not medical advice
                </p>
            </main>
        </div>
    );
}
