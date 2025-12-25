'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Settings, Pencil, ChevronRight, Info, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Image from 'next/image';

const data = [
    { day: 'Mon', weight: 92.5 },
    { day: 'Tue', weight: 92.8 },
    { day: 'Wed', weight: 93.0 },
    { day: 'Thu', weight: 93.1 },
    { day: 'Fri', weight: 92.9 },
    { day: 'Sat', weight: 92.7 },
    { day: 'Sun', weight: 93.1 },
];

export default function BodyDataPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'weight' | 'body'>('weight');
    const [chartTab, setChartTab] = useState<'week' | 'month' | 'quarter'>('week');
    const [weight, setWeight] = useState(93.1);
    const [startWeight, setStartWeight] = useState(80.0);
    const [targetWeight, setTargetWeight] = useState(77.0);
    const [history, setHistory] = useState(data);

    useEffect(() => {
        const saved = localStorage.getItem('fastingData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.answers?.goal_weight) setTargetWeight(parseFloat(parsed.answers.goal_weight));
                if (parsed.currentWeight) setWeight(parseFloat(parsed.currentWeight));
            } catch (e) { console.error(e); }
        }

        const savedHistory = localStorage.getItem('weightHistory');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleLogWeight = () => {
        const newWeight = prompt('Enter your current weight (kg):', weight.toString());
        if (newWeight && !isNaN(parseFloat(newWeight))) {
            const val = parseFloat(newWeight);
            setWeight(val);
            const newEntry = { day: new Date().toLocaleDateString('en-US', { weekday: 'short' }), weight: val };
            const newHistory = [...history, newEntry].slice(-7);
            setHistory(newHistory);
            localStorage.setItem('weightHistory', JSON.stringify(newHistory));

            // Sync back to fastingData
            const saved = localStorage.getItem('fastingData');
            if (saved) {
                const parsed = JSON.parse(saved);
                parsed.currentWeight = val;
                localStorage.setItem('fastingData', JSON.stringify(parsed));
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#f8faff] text-slate-900 pb-20">
            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-transparent">
                <button onClick={() => router.back()} className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-800 border border-slate-50">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">Body Data</h1>
                <button className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-800 border border-slate-50">
                    <Settings size={22} className="text-slate-700" />
                </button>
            </header>

            <div className="px-6 space-y-6">
                {/* Weight/Body Tabs */}
                <div className="bg-slate-100/80 p-1.5 rounded-[2rem] flex gap-1">
                    <button
                        onClick={() => setActiveTab('weight')}
                        className={`flex-1 py-3.5 rounded-[1.8rem] font-black text-lg transition-all ${activeTab === 'weight' ? 'bg-white shadow-md text-slate-800' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                        Weight
                    </button>
                    <button
                        onClick={() => setActiveTab('body')}
                        className={`flex-1 py-3.5 rounded-[1.8rem] font-black text-lg transition-all ${activeTab === 'body' ? 'bg-white shadow-md text-slate-800' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                        Body
                    </button>
                </div>

                {/* Current Weight Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 space-y-6">
                    <div>
                        <p className="text-slate-800 font-black text-xl mb-3">Current</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-slate-900 tracking-tighter">{weight} <span className="text-2xl font-black text-slate-800 ml-1">kg</span></span>
                            <div className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full font-black text-sm flex items-center gap-1">
                                <Plus size={14} strokeWidth={4} /> 13.1
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogWeight}
                        className="w-full py-5 bg-[#00ca86] text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Log Weight
                    </button>

                    <div className="flex justify-between items-center px-2 pt-2">
                        <div className="space-y-1">
                            <p className="text-slate-300 font-bold text-sm">Start</p>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-800 font-black text-lg">{startWeight.toFixed(1)} kg</span>
                                <Pencil size={14} className="text-emerald-400" />
                            </div>
                        </div>
                        <div className="text-teal-400">
                            <ChevronRight size={24} className="opacity-20 translate-x-1" />
                            <ChevronRight size={24} className="opacity-40" />
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-slate-300 font-bold text-sm">Target</p>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-slate-800 font-black text-lg">{targetWeight.toFixed(1)} kg</span>
                                <Pencil size={14} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insight Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 relative overflow-hidden group">
                    <div className="flex-1 space-y-4 relative z-10">
                        <h3 className="text-slate-800 font-black text-xl leading-tight">
                            The Shocking Truth About Your Scale Habits
                        </h3>
                        <button className="bg-white border-2 border-orange-200 text-orange-400 px-6 py-2.5 rounded-full font-black text-sm hover:bg-orange-50 transition-all">
                            Learn more
                        </button>
                    </div>
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <div className="absolute inset-0 bg-blue-50 rounded-full blur-2xl opacity-50 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 w-full h-full flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                            <span className="text-7xl">⚖️</span>
                        </div>
                    </div>
                </div>

                {/* Weight Chart Section */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-800 font-black text-2xl">Weight</h3>
                        <ChevronRight size={24} className="text-slate-300" />
                    </div>

                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-slate-400 font-bold text-sm">Average:</span>
                        <span className="text-slate-800 font-black text-xl">93.1 kg</span>
                        <div className="flex-1" />
                        <div className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                            Target: 77.0 kg
                        </div>
                    </div>

                    {/* Chart Tabs */}
                    <div className="bg-slate-50 p-1 rounded-full flex gap-1 mb-10">
                        {['week', 'month', 'quarter'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setChartTab(t as any)}
                                className={`flex-1 py-2 rounded-full font-black text-sm transition-all capitalize ${chartTab === t ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <div className="h-64 w-full -ml-8">
                        <ResponsiveContainer width="110%" height="100%">
                            <LineChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontWeight: 800, fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={[90, 100]}
                                    axisLine={false}
                                    tickLine={false}
                                    hide
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#00ca86] text-white px-3 py-1.5 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 relative -top-8">
                                                    {payload[0].value}
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00ca86] rotate-45" />
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <ReferenceLine y={93.1} stroke="#00ca86" strokeDasharray="3 3" opacity={0.3} />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#00ca86"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#00ca86', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, fill: '#00ca86', strokeWidth: 2, stroke: '#fff' }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </main>
    );
}
