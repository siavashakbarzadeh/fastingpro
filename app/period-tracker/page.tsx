'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Droplets, Info, ChevronRight, Save, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Types
type FertilityLevel = "low" | "medium" | "high";
type Goal = "conceive" | "avoid" | "track";
type FlowLevel = "light" | "medium" | "heavy";

interface TodayCycleInfo {
    dateLabel: string;
    cycleDay: number;
    cycleLength: number;
    fertilityLevel: FertilityLevel;
    message: string;
    tips: string[];
}

interface CycleHistory {
    cycleNumber: number;
    startDate: string;
    endDate: string;
    lengthDays: number;
    flow: FlowLevel;
}

export default function PeriodTrackerPage() {
    const [cycleData, setCycleData] = useState({
        lastPeriodStart: '2025-12-11',
        lastPeriodEnd: '2025-12-16',
        cycleLength: 28,
        periodDuration: 5,
        goal: 'track' as Goal
    });

    const [isSaved, setIsSaved] = useState(false);
    const [showTips, setShowTips] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('cycleData');
        if (saved) {
            setCycleData(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        // Validation
        if (cycleData.cycleLength < 21 || cycleData.cycleLength > 35) {
            alert('Cycle length should be between 21 and 35 days');
            return;
        }
        if (cycleData.periodDuration < 1 || cycleData.periodDuration > 10) {
            alert('Period duration should be between 1 and 10 days');
            return;
        }

        localStorage.setItem('cycleData', JSON.stringify(cycleData));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handlePeriodStartedToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setCycleData({ ...cycleData, lastPeriodStart: today });
    };

    const handlePeriodEndedToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setCycleData({ ...cycleData, lastPeriodEnd: today });
    };

    // Calculate current cycle day
    const lastDate = new Date(cycleData.lastPeriodStart);
    const today = new Date();
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = ((diffDays - 1) % cycleData.cycleLength) + 1;

    // Calculate fertility level based on cycle day
    const getFertilityLevel = (day: number): FertilityLevel => {
        const ovulationDay = Math.floor(cycleData.cycleLength / 2);
        if (day >= ovulationDay - 2 && day <= ovulationDay + 2) return "high";
        if (day >= ovulationDay - 5 && day <= ovulationDay + 5) return "medium";
        return "low";
    };

    const fertilityLevel = getFertilityLevel(currentDay);

    // Today cycle info
    const todayInfo: TodayCycleInfo = {
        dateLabel: `Today, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        cycleDay: currentDay,
        cycleLength: cycleData.cycleLength,
        fertilityLevel,
        message: fertilityLevel === "high"
            ? "High chance to conceive"
            : fertilityLevel === "medium"
                ? "Good timing to conceive"
                : "It's currently a lower chance to conceive",
        tips: fertilityLevel === "high"
            ? ["This is your fertile window", "Consider tracking basal body temperature", "Stay hydrated and rest well"]
            : fertilityLevel === "medium"
                ? ["Approaching your fertile window", "Focus on balanced nutrition", "Monitor cervical mucus changes"]
                : ["Focus on rest and self-care", "Track your symptoms", "Maintain a healthy routine"]
    };

    // Mock cycle history
    const cycleHistory: CycleHistory[] = [
        { cycleNumber: 5, startDate: '2025-12-11', endDate: '2026-01-07', lengthDays: 28, flow: 'medium' },
        { cycleNumber: 4, startDate: '2025-11-13', endDate: '2025-12-10', lengthDays: 28, flow: 'heavy' },
        { cycleNumber: 3, startDate: '2025-10-16', endDate: '2025-11-12', lengthDays: 28, flow: 'medium' },
        { cycleNumber: 2, startDate: '2025-09-18', endDate: '2025-10-15', lengthDays: 28, flow: 'light' },
    ];

    // Fertility level colors
    const fertilityColors = {
        low: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', pill: 'bg-sky-100 text-sky-700 border-sky-200' },
        medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', pill: 'bg-amber-100 text-amber-700 border-amber-200' },
        high: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', pill: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    };

    const flowColors = {
        light: 'bg-blue-100 text-blue-700',
        medium: 'bg-purple-100 text-purple-700',
        heavy: 'bg-red-100 text-red-700'
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <header className="p-4 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-slate-100">
                <Link href="/dashboard" className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-lg font-bold text-slate-800">Period Tracker</h1>
                <button
                    onClick={handleSave}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-500'}`}
                >
                    <Save size={20} />
                </button>
            </header>

            <div className="max-w-md mx-auto px-4 py-4 space-y-6">
                {/* Section 1: Today Overview */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Today
                    </h2>

                    <div className="rounded-2xl border bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg p-6 text-white space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-indigo-200 text-xs font-medium mb-1">{todayInfo.dateLabel}</p>
                                <h3 className="text-4xl font-black mb-2">Day {todayInfo.cycleDay}</h3>
                                <p className="text-sm text-indigo-100">Cycle Day {todayInfo.cycleDay} of {todayInfo.cycleLength}</p>
                            </div>
                            <Droplets className="text-indigo-300" size={32} />
                        </div>

                        <div className="pt-3 border-t border-indigo-400/30">
                            <p className="text-sm font-semibold mb-2">{todayInfo.message}</p>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${fertilityColors[todayInfo.fertilityLevel].pill}`}>
                                {todayInfo.fertilityLevel === "high" ? "High chance" : todayInfo.fertilityLevel === "medium" ? "Good timing" : "Lower chance"}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowTips(!showTips)}
                            className="w-full flex items-center justify-between text-sm font-semibold text-indigo-100 hover:text-white transition-colors"
                        >
                            <span>Here's what you can do</span>
                            {showTips ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {showTips && (
                            <div className="bg-white/10 rounded-xl p-4 space-y-2">
                                {todayInfo.tips.map((tip, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="text-indigo-300 mt-0.5">•</span>
                                        <p className="text-sm text-indigo-50">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Section 2: Cycle Inputs & Settings */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Cycle Settings
                    </h2>

                    {/* Last Period */}
                    <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Last Period</h3>
                                <p className="text-xs text-slate-500">Started on {cycleData.lastPeriodStart}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs text-slate-500 font-medium block mb-1">Start date</label>
                                <input
                                    type="date"
                                    value={cycleData.lastPeriodStart}
                                    onChange={(e) => setCycleData({ ...cycleData, lastPeriodStart: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 font-medium block mb-1">End date (optional)</label>
                                <input
                                    type="date"
                                    value={cycleData.lastPeriodEnd}
                                    onChange={(e) => setCycleData({ ...cycleData, lastPeriodEnd: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cycle Basics */}
                    <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-4 mb-3">
                        <h3 className="text-sm font-semibold text-slate-900">Cycle Basics</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Cycle Length</p>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={cycleData.cycleLength}
                                        onChange={(e) => setCycleData({ ...cycleData, cycleLength: parseInt(e.target.value) || 0 })}
                                        className="w-12 bg-transparent text-2xl font-bold text-slate-800 focus:outline-none"
                                        min="21"
                                        max="35"
                                    />
                                    <span className="text-sm text-slate-500 font-medium">days</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Period Duration</p>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={cycleData.periodDuration}
                                        onChange={(e) => setCycleData({ ...cycleData, periodDuration: parseInt(e.target.value) || 0 })}
                                        className="w-12 bg-transparent text-2xl font-bold text-slate-800 focus:outline-none"
                                        min="1"
                                        max="10"
                                    />
                                    <span className="text-sm text-slate-500 font-medium">days</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500">Most people's cycles are between 21 and 35 days.</p>
                    </div>

                    {/* Goal Selector */}
                    <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3 mb-3">
                        <h3 className="text-sm font-semibold text-slate-900">Your Goal</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setCycleData({ ...cycleData, goal: 'conceive' })}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${cycleData.goal === 'conceive'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Trying to conceive
                            </button>
                            <button
                                onClick={() => setCycleData({ ...cycleData, goal: 'avoid' })}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${cycleData.goal === 'avoid'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Avoid pregnancy
                            </button>
                            <button
                                onClick={() => setCycleData({ ...cycleData, goal: 'track' })}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${cycleData.goal === 'track'
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Just tracking
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3 mb-3">
                        <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handlePeriodStartedToday}
                                className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm transition-colors"
                            >
                                Period started today
                            </button>
                            <button
                                onClick={handlePeriodEndedToday}
                                className="px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-colors"
                            >
                                Period ended today
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isSaved
                                ? 'bg-emerald-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                    >
                        {isSaved ? '✓ Saved' : 'Save period settings'}
                    </button>
                </section>

                {/* Section 3: Cycle History */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Your Cycle History
                    </h2>

                    <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
                        {cycleHistory.length > 0 ? (
                            cycleHistory.map((cycle) => (
                                <div key={cycle.cycleNumber} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-slate-800">Cycle #{cycle.cycleNumber}</h4>
                                            <span className="text-xs text-slate-500">• {cycle.lengthDays} days</span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(cycle.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${flowColors[cycle.flow]}`}>
                                        {cycle.flow}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Droplets className="mx-auto text-slate-300 mb-3" size={40} />
                                <p className="text-sm text-slate-500 font-medium">No cycles logged yet</p>
                                <p className="text-xs text-slate-400 mt-1">Start by adding your last period date to see your history here.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Info Card */}
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                        <Info size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-emerald-900 font-bold text-sm">Cycle Science</h4>
                        <p className="text-emerald-600 text-xs">How your cycle affects energy.</p>
                    </div>
                    <ChevronRight className="text-emerald-300" size={20} />
                </div>

                {/* Disclaimer */}
                <p className="text-center text-slate-400 text-xs px-4">
                    This Period Tracker is for informational use only and does not provide medical or contraceptive advice. Talk to your doctor for medical guidance.
                </p>
            </div>
        </div>
    );
}
