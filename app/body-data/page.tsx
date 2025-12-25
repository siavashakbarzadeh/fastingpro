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
    const [selectedPart, setSelectedPart] = useState<'waist' | 'chest' | 'thigh' | 'arm' | 'hips'>('waist');
    const [bodyHistory, setBodyHistory] = useState<Record<string, any[]>>({
        waist: [{ day: '12/21', value: 78 }, { day: '12/23', value: 77.5 }, { day: '12/27', value: 78 }],
        chest: [{ day: '12/21', value: 102 }, { day: '12/25', value: 101 }],
        thigh: [{ day: '12/21', value: 58 }],
        arm: [{ day: '12/21', value: 34 }],
        hips: [{ day: '12/21', value: 92 }]
    });

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

        const savedBodyHistory = localStorage.getItem('bodyHistory');
        if (savedBodyHistory) {
            try {
                setBodyHistory(JSON.parse(savedBodyHistory));
            } catch (e) { console.error(e); }
        }
    }, []);

    const handleLogWeight = () => {
        const newWeight = prompt('Enter your current weight (kg):', weight.toString());
        if (newWeight && !isNaN(parseFloat(newWeight))) {
            const val = parseFloat(newWeight);
            setWeight(val);
            const newEntry = { day: new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }), weight: val };
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

    const handleLogMeasurement = () => {
        const currentVal = bodyHistory[selectedPart][bodyHistory[selectedPart].length - 1]?.value || 0;
        const newVal = prompt(`Enter your current ${selectedPart} measurement (cm):`, currentVal.toString());
        if (newVal && !isNaN(parseFloat(newVal))) {
            const val = parseFloat(newVal);
            const newEntry = { day: new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }), value: val };
            const newHistory = {
                ...bodyHistory,
                [selectedPart]: [...bodyHistory[selectedPart], newEntry].slice(-7)
            };
            setBodyHistory(newHistory);
            localStorage.setItem('bodyHistory', JSON.stringify(newHistory));
        }
    };

    const bodyParts = [
        { id: 'waist', label: 'Waist', top: '55%', left: '30%' },
        { id: 'chest', label: 'Chest', top: '35%', left: '25%' },
        { id: 'thigh', label: 'Thigh', top: '75%', left: '70%', anchorRight: true },
        { id: 'arm', label: 'Arm', top: '30%', left: '80%', anchorRight: true },
        { id: 'hips', label: 'Hips', top: '58%', left: '85%', anchorRight: true },
    ];

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

                {activeTab === 'weight' ? (
                    <>
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
                    </>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Body Map Section */}
                        <div className="relative aspect-[4/5] w-full max-w-sm mx-auto">
                            {/* SVG Body representation */}
                            <svg className="w-full h-full opacity-10" viewBox="0 0 200 300">
                                <path d="M100 20 C110 20, 120 25, 120 40 L120 50 C135 60, 150 70, 155 100 L145 150 L135 200 L145 280 L130 290 L110 230 L90 230 L70 290 L55 280 L65 200 L55 150 L45 100 C50 70, 65 60, 80 50 L80 40 C80 25, 90 20, 100 20 Z" fill="#64748b" />
                            </svg>

                            {/* Stylized Body Image Placeholder (since we don't have the assets) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-[200px] opacity-20 filter grayscale">👤</div>
                            </div>

                            {/* Hotspots */}
                            {bodyParts.map((part) => (
                                <div
                                    key={part.id}
                                    style={{ top: part.top, left: part.left }}
                                    className={`absolute flex items-center gap-3 transition-all duration-300 z-20 ${selectedPart === part.id ? 'scale-110' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    {!part.anchorRight && (
                                        <button
                                            onClick={() => setSelectedPart(part.id as any)}
                                            className={`px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg tracking-tight transition-all
                                                ${selectedPart === part.id ? 'bg-white text-slate-800 border-2 border-emerald-400' : 'bg-white text-slate-500 border border-slate-100'}`}
                                        >
                                            {part.label}
                                        </button>
                                    )}

                                    <div className="relative">
                                        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${selectedPart === part.id ? 'bg-emerald-400 border-white scale-125 ring-4 ring-emerald-400/20' : 'bg-white border-slate-400'}`} />
                                        {selectedPart === part.id && (
                                            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
                                        )}
                                    </div>

                                    {part.anchorRight && (
                                        <button
                                            onClick={() => setSelectedPart(part.id as any)}
                                            className={`px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg tracking-tight transition-all
                                                ${selectedPart === part.id ? 'bg-white text-slate-800 border-2 border-emerald-400' : 'bg-white text-slate-500 border border-slate-100'}`}
                                        >
                                            {part.label}
                                        </button>
                                    )}

                                    {/* Connection lines (simplified) */}
                                    <div className={`absolute h-[1px] bg-slate-200 top-1/2 -z-10 transition-all duration-500 ${part.anchorRight ? 'right-full w-12' : 'left-full w-12'} opacity-50 ${selectedPart === part.id ? 'w-16 bg-emerald-200' : ''}`} />
                                </div>
                            ))}
                        </div>

                        {/* Measurement Chart Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
                            {/* Part Selector (Horizontal) */}
                            <div className="flex gap-6 overflow-x-auto pb-6 mb-4 border-b border-slate-50 no-scrollbar">
                                {bodyParts.map((part) => (
                                    <button
                                        key={part.id}
                                        onClick={() => setSelectedPart(part.id as any)}
                                        className={`font-black whitespace-nowrap text-lg transition-all relative pb-2
                                            ${selectedPart === part.id ? 'text-slate-800' : 'text-slate-300'}`}
                                    >
                                        {part.label}
                                        {selectedPart === part.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 rounded-full" />
                                        )}
                                    </button>
                                ))}
                                <button className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                                    <Pencil size={14} />
                                </button>
                            </div>

                            {/* Chart Area */}
                            <div className="h-64 w-full -ml-8 mt-4 relative">
                                <ResponsiveContainer width="115%" height="100%">
                                    <LineChart data={bodyHistory[selectedPart]} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#00ca86"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#00ca86', strokeWidth: 2, stroke: '#fff' }}
                                        />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }}
                                            dy={15}
                                        />
                                        <YAxis hide domain={['auto', 'auto']} />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-slate-800 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-xl">
                                                            {payload[0].value} cm
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <ReferenceLine y={bodyHistory[selectedPart][0]?.value} stroke="#cbd5e1" strokeDasharray="3 3" />
                                    </LineChart>
                                </ResponsiveContainer>

                                {/* Center Log Button (Overlaying chart slightly like screenshot) */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <button
                                        onClick={handleLogMeasurement}
                                        className="pointer-events-auto bg-[#00ca86] text-white px-8 py-3.5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Log {selectedPart.charAt(0).toUpperCase() + selectedPart.slice(1)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
