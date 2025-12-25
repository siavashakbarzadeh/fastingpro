'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Settings, Droplets, Info, ChevronRight, Save } from 'lucide-react';
import Link from 'next/link';

export default function PeriodTrackerPage() {
    const [cycleData, setCycleData] = useState({
        lastPeriodStart: new Date().toISOString().split('T')[0],
        cycleLength: 28,
        periodDuration: 5,
        symptoms: []
    });

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('cycleData');
        if (saved) {
            setCycleData(JSON.parse(saved));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('cycleData', JSON.stringify(cycleData));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    // Calculate current cycle day
    const lastDate = new Date(cycleData.lastPeriodStart);
    const today = new Date();
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = ((diffDays - 1) % cycleData.cycleLength) + 1;

    return (
        <div className="min-h-screen bg-[#fdfcf9] pb-32">
            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-slate-50">
                <Link href="/dashboard" className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-800">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-xl font-black text-slate-800">Period Tracker</h1>
                <button
                    onClick={handleSave}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-500'}`}
                >
                    {isSaved ? <Save size={24} /> : <Save size={24} />}
                </button>
            </header>

            <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
                {/* Status Hero */}
                <div className="bg-indigo-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Droplets size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-indigo-200 font-bold mb-2 uppercase tracking-widest text-xs">Today</p>
                        <h2 className="text-5xl font-black mb-4 tracking-tighter">Day {currentDay}</h2>
                        <div className="flex items-center gap-2 text-indigo-100 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Cycle Day {currentDay} of {cycleData.cycleLength}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Log */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800">Last Period</h3>
                            <p className="text-slate-400 font-bold text-sm">Started on {cycleData.lastPeriodStart}</p>
                        </div>
                    </div>

                    <input
                        type="date"
                        value={cycleData.lastPeriodStart}
                        onChange={(e) => setCycleData({ ...cycleData, lastPeriodStart: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cycle Length</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={cycleData.cycleLength}
                                onChange={(e) => setCycleData({ ...cycleData, cycleLength: parseInt(e.target.value) || 0 })}
                                className="w-16 bg-transparent text-3xl font-black text-slate-800 focus:outline-none"
                            />
                            <span className="text-slate-400 font-bold">days</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Period Duration</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={cycleData.periodDuration}
                                onChange={(e) => setCycleData({ ...cycleData, periodDuration: parseInt(e.target.value) || 0 })}
                                className="w-16 bg-transparent text-3xl font-black text-slate-800 focus:outline-none"
                            />
                            <span className="text-slate-400 font-bold">days</span>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-emerald-50 rounded-[2.5rem] p-8 flex items-center gap-6 border border-emerald-100 group cursor-pointer hover:bg-emerald-100 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                        <Info size={28} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-emerald-900 font-black text-lg leading-tight">Cycle Science</h4>
                        <p className="text-emerald-600 font-bold text-sm">How your cycle affects energy.</p>
                    </div>
                    <ChevronRight className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Save Note */}
                <p className="text-center text-slate-400 text-sm font-bold">
                    Changes will sync automatically with your dashboard.
                </p>
            </div>
        </div>
    );
}
