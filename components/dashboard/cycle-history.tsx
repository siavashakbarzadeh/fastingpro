'use client';

import { useState } from 'react';
import { MoreHorizontal, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CycleHistoryWidget({ cycleData }: { cycleData?: any }) {
    const [showData, setShowData] = useState(true);

    // Calculate current cycle metrics
    const lastDate = cycleData?.lastPeriodStart ? new Date(cycleData.lastPeriodStart) : new Date();
    const todayDate = new Date();
    const diffTime = Math.max(0, todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const cycleLen = cycleData?.cycleLength || 28;
    const periodLen = cycleData?.periodDuration || 5;
    const currentDay = ((diffDays - 1) % cycleLen) + 1;

    // Generate days for the full cycle
    const ovulationDay = Math.floor(cycleLen / 2);
    const daysVisible = Math.max(cycleLen, 15);
    const dayNumbers = Array.from({ length: Math.ceil(daysVisible / 2) }, (_, i) => i * 2 + 1);

    const symptoms = [
        { label: 'Period cramps', color: 'bg-blue-600', activeDays: Array.from({ length: periodLen }, (_, i) => i + 1) },
        { label: 'Trouble falling asleep', color: 'bg-orange-500', activeDays: [ovulationDay - 1, ovulationDay, ovulationDay + 1] },
        { label: 'Running', color: 'bg-teal-500', activeDays: [6, 8, 12, 18, 22] },
        { label: 'Moderate Hot flashes', color: 'bg-blue-400', activeDays: [ovulationDay + 2] },
        { label: 'Sweet Cravings', color: 'bg-orange-400', activeDays: [cycleLen - 2, cycleLen - 1] },
    ];

    return (
        <div className="w-full bg-[#fdfcf9] rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Your cycle history</h2>
                <Link href="/period-tracker" className="text-sm font-black text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                    Edit <ChevronRight size={14} />
                </Link>
            </div>

            {/* Legend Box */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-slate-200" />
                        <span className="text-sm font-bold text-slate-500">Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm font-bold text-slate-500">Period</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-100" />
                        <span className="text-sm font-bold text-slate-500">PMS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Fertile window</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-400/30 flex items-center justify-center border border-blue-400">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-slate-500">Ovulation</span>
                    </div>
                </div>
            </div>

            {/* Year and Toggle */}
            <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-black text-slate-800">{new Date().getFullYear()}</span>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-800">Show data</span>
                    <button
                        onClick={() => setShowData(!showData)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${showData ? 'bg-teal-600' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showData ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* Current Cycle Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-800">Current cycle</span>
                    <span className="text-sm font-bold text-slate-400">
                        {cycleData?.lastPeriodStart ? new Date(cycleData.lastPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Aug 3'}
                    </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    < MoreHorizontal size={20} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-4 w-full rounded-full bg-slate-100 mb-6 overflow-hidden flex">
                <div
                    className="h-full bg-red-800/80 rounded-l-full"
                    style={{ width: `${(periodLen / cycleLen) * 100}%` }}
                />
                <div className="h-full bg-red-400" style={{ width: '4%' }} />
                <div className="flex-1" />
                <div
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-200 rounded-r-full"
                    style={{ width: '25%' }}
                />
            </div>

            {/* Symptom Grid */}
            <div className="flex flex-col gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-none">
                <div className="min-w-[400px]">
                    {/* Numbers Row */}
                    <div className="flex mb-4">
                        <div className="flex flex-1 justify-between pr-4">
                            {dayNumbers.map(num => (
                                <span
                                    key={num}
                                    className={`text-[10px] font-black w-4 text-center transition-colors ${num === currentDay ? 'text-indigo-600 underline' :
                                        num <= periodLen ? 'text-red-500' :
                                            num >= ovulationDay - 5 && num <= ovulationDay + 1 ? 'text-teal-500' :
                                                'text-slate-300'
                                        }`}
                                >
                                    {num}
                                </span>
                            ))}
                        </div>
                        <div className="w-32" />
                    </div>

                    {/* Symptom Rows */}
                    {symptoms.map((symptom) => (
                        <div key={symptom.label} className="flex items-center mb-3">
                            <div className="flex flex-1 justify-between pr-4">
                                {dayNumbers.map(day => (
                                    <div key={day} className="w-4 flex justify-center relative">
                                        {day === currentDay && <div className="absolute inset-x-0 -top-1 -bottom-1 border border-indigo-200 bg-indigo-50/30 rounded-full -z-10" />}
                                        {symptom.activeDays.includes(day) || (day - 1 === currentDay - 1 && symptom.activeDays.includes(day - 1)) ? (
                                            <div className={`w-2 h-2 rounded-full ${symptom.color} shadow-sm`} />
                                        ) : (
                                            <div className="w-1 h-1 rounded-full bg-slate-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <span className="w-32 text-[10px] font-bold text-slate-400 whitespace-nowrap pl-2">
                                {symptom.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
