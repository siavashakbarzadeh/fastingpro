'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Minus, Plus, Settings, Pencil } from 'lucide-react';

// Simple icons for the cups
const CupIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2z" />
        <path d="M9 10a1 1 0 0 0 1 1h4a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-4a1 1 0 0 0 -1 1v1z" />
    </svg>
);

const GlassIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8a2 2 0 0 0 2 -2l1 -15h-14l1 15a2 2 0 0 0 2 2z" />
        <path d="M6 8h12" />
    </svg>
);

const BottleIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 6v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2z" />
        <path d="M9 4v-2h6v2" />
        <path d="M7 10h10" />
    </svg>
);

const MugIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8v6a3 3 0 0 0 3 3h4a3 3 0 0 0 3 -3v-6" />
        <path d="M16 8h2a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-2" />
        <path d="M6 8h10" />
    </svg>
);

export default function WaterTrackerPage() {
    const router = useRouter();
    const [intake, setIntake] = useState(0);
    const [goal, setGoal] = useState(2500);
    const [selectedCapacity, setSelectedCapacity] = useState(250);
    const [isLoaded, setIsLoaded] = useState(false);

    const getTodayKey = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // Load data
    useEffect(() => {
        const saved = localStorage.getItem('waterIntake');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const today = getTodayKey();
                if (typeof data[today] === 'number') {
                    setIntake(data[today]);
                }
                // If no entry for today, it remains 0 (default state)
            } catch (e) {
                console.error("Failed to parse water intake data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save data
    useEffect(() => {
        if (!isLoaded) return;

        const today = getTodayKey();
        const saved = localStorage.getItem('waterIntake');
        let data: Record<string, number> = {};

        if (saved) {
            try {
                data = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse existing data", e);
            }
        }

        data[today] = intake;
        localStorage.setItem('waterIntake', JSON.stringify(data));

        // Dispatch storage event to notify other components/tabs
        window.dispatchEvent(new Event('storage'));
    }, [intake, isLoaded]);

    const percentage = Math.min((intake / goal) * 100, 100);

    const capacities = [
        { amount: 100, icon: CupIcon, label: '100 ml' },
        { amount: 250, icon: GlassIcon, label: '250 ml' },
        { amount: 300, icon: MugIcon, label: '300 ml' },
        { amount: 500, icon: BottleIcon, label: '500 ml' },
    ];

    const addWater = () => {
        setIntake(prev => Math.min(prev + selectedCapacity, 10000));
    };

    const removeWater = () => {
        setIntake(prev => Math.max(prev - selectedCapacity, 0));
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-8 font-sans flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 pt-6 pb-2">
                <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-slate-800" />
                </button>
                <h1 className="font-bold text-lg text-slate-900">Water Tracker</h1>
                <button onClick={() => { }} className="p-2 -mr-2 rounded-full hover:bg-slate-200 transition-colors">
                    <Settings className="w-6 h-6 text-slate-800" />
                </button>
            </header>

            <div className="flex-1 flex flex-col items-center px-6 max-w-md mx-auto w-full">

                {/* Stats Text */}
                <div className="text-center mt-6 mb-8">
                    <h2 className="text-5xl font-bold text-slate-900 mb-2">
                        {intake}<span className="text-2xl font-semibold text-slate-500 ml-1">ml</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <span className="font-medium">Goal: {goal} ml</span>
                        <button className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Progress Circle Visual */}
                <div className="relative w-72 h-72 mb-10 text-nowrap">
                    <div className="absolute inset-0 rounded-full bg-blue-50/50 border-[6px] border-white shadow-sm overflow-hidden transform translate-z-0">
                        {/* Water Fill */}
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-blue-300/80 transition-all duration-700 ease-out"
                            style={{ height: `${percentage}%` }}
                        >
                            {/* Wave decorative top */}
                            <div className="absolute top-0 left-0 right-0 -mt-2 h-4 bg-blue-300/80 rounded-[100%]" style={{ filter: 'blur(1px)' }}></div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 w-full mb-12">
                    <button
                        onClick={removeWater}
                        className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-50 text-blue-500 hover:bg-blue-100 active:scale-95 transition-all"
                    >
                        <Minus className="w-8 h-8" />
                    </button>

                    <button
                        onClick={addWater}
                        className="flex-1 h-16 rounded-full bg-blue-400 text-white font-bold text-xl hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-6 h-6" />
                        {selectedCapacity} ml
                    </button>
                </div>

                {/* Cup Capacity Selection */}
                <div className="w-full mb-12">
                    <h3 className="font-bold text-slate-900 text-lg mb-4">Cup Capacity</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                        {capacities.map((cap) => {
                            const Icon = cap.icon;
                            const isSelected = selectedCapacity === cap.amount;
                            return (
                                <button
                                    key={cap.amount}
                                    onClick={() => setSelectedCapacity(cap.amount)}
                                    className={`
                                        flex flex-col items-center justify-center gap-3 min-w-[100px] h-[110px] rounded-3xl transition-all border-2
                                        ${isSelected
                                            ? 'bg-emerald-50 border-emerald-400 text-emerald-600'
                                            : 'bg-white border-transparent text-slate-400 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-500' : 'text-blue-300'}`} />
                                    <span className={`font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {cap.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Statistics Card */}
                <div className="w-full bg-white rounded-[32px] p-6 shadow-sm mb-12 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-slate-900">Water intake</h3>
                        <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180" />
                    </div>

                    <div className="flex justify-between items-end mb-6">
                        <p className="text-slate-500 font-medium text-sm">Average: <span className="text-slate-900 font-bold text-lg">375ml</span></p>
                        <p className="text-slate-500 font-medium text-sm">19/12 - 25/12</p>
                    </div>

                    <div className="bg-slate-50 p-1 rounded-full flex mb-8">
                        <button className="flex-1 py-1.5 rounded-full bg-white shadow-sm text-slate-900 font-bold text-sm">Day</button>
                        <button className="flex-1 py-1.5 rounded-full text-slate-400 font-medium text-sm hover:text-slate-600">Week</button>
                        <button className="flex-1 py-1.5 rounded-full text-slate-400 font-medium text-sm hover:text-slate-600">Month</button>
                    </div>

                    <div className="relative h-64 w-full">
                        {/* Y Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-slate-400 font-medium text-right pr-3">
                            <span>3,000</span>
                            <span>2,250</span>
                            <span>1,500</span>
                            <span>750</span>
                            <span>0</span>
                        </div>

                        {/* Chart Area */}
                        <div className="absolute left-14 right-0 top-0 bottom-0">
                            {/* Goal Line (approx 2500/3000 = 83% from bottom, so 17% from top) */}
                            <div className="absolute left-0 right-0 top-[17%] border-t border-dashed border-red-300 z-10"></div>

                            {/* Bars */}
                            <div className="flex justify-between items-end h-full pb-8">
                                {[
                                    { day: '19', value: 0 },
                                    { day: '20', value: 0 },
                                    { day: '21', value: 0 },
                                    { day: '22', value: 0 },
                                    { day: '23', value: 750 },
                                    { day: '24', value: 0 },
                                    { day: '25', value: 0, isToday: true, labelVal: '0ml' },
                                ].map((d, i) => (
                                    <div key={i} className="flex flex-col items-center justify-end h-full w-full gap-2 relative group">
                                        {/* Bar container */}
                                        <div className="relative w-3 rounded-full bg-blue-50 h-full overflow-hidden">
                                            {d.value > 0 && (
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-full w-full transition-all group-hover:bg-blue-500"
                                                    style={{ height: `${(d.value / 3000) * 100}%` }}
                                                />
                                            )}
                                        </div>
                                        {/* X Label */}
                                        <span className={`text-xs font-medium absolute -bottom-0 ${d.isToday ? 'text-slate-900' : 'text-slate-400'}`}>{d.day}</span>

                                        {/* Today Marker / Tooltip */}
                                        {d.isToday && (
                                            <div className="absolute bottom-[20px] flex flex-col items-center animate-bounce">
                                                <span className="text-[10px] font-bold text-blue-400 mb-0.5 whitespace-nowrap">{d.labelVal}</span>
                                                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-blue-400"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute right-0 bottom-0 text-xs text-slate-400 font-medium">Goal: 2500ml</div>
                    </div>
                </div>

            </div>
        </main>
    );
}
