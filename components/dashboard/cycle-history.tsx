'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function CycleHistoryWidget() {
    const [showData, setShowData] = useState(true);

    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    const symptoms = [
        { label: 'Period cramps', color: 'bg-blue-600', activeDays: [1, 2, 3, 4, 6] },
        { label: 'Trouble falling asleep', color: 'bg-orange-500', activeDays: [7, 9, 12] },
        { label: 'Running', color: 'bg-teal-500', activeDays: [6, 8, 12] },
        { label: 'Moderate Hot flashes', color: 'bg-blue-400', activeDays: [14] },
        { label: 'Sweet Cravings', color: 'bg-orange-400', activeDays: [2, 3] },
    ];

    return (
        <div className="w-full bg-[#fdfcf9] rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Your cycle history</h2>

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
                <span className="text-2xl font-black text-slate-800">2023</span>
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
                    <span className="text-sm font-bold text-slate-400">Aug 3</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-4 w-full rounded-full bg-slate-100 mb-6 overflow-hidden flex">
                <div className="h-full w-1/4 bg-red-800/80 rounded-l-full" />
                <div className="h-full w-1/6 bg-red-400" />
                <div className="flex-1" />
                <div className="h-full w-1/4 bg-gradient-to-r from-teal-500 to-blue-200 rounded-r-full" />
            </div>

            {/* Symptom Grid */}
            <div className="flex flex-col gap-4">
                {/* Numbers Row */}
                <div className="flex">
                    <div className="flex flex-1 justify-between pr-4">
                        {[1, 3, 5, 7, 9, 11, 13, 15].map(num => (
                            <span key={num} className={`text-[10px] font-black w-4 text-center ${num === 1 || num === 3 || num === 5 ? 'text-red-500' : num === 15 ? 'text-teal-500' : 'text-slate-300'}`}>
                                {num}
                            </span>
                        ))}
                    </div>
                    <div className="w-24" /> {/* Label alignment spacer */}
                </div>

                {/* Symptom Rows */}
                {symptoms.map((symptom) => (
                    <div key={symptom.label} className="flex items-center">
                        <div className="flex flex-1 justify-between pr-4">
                            {[1, 3, 5, 7, 9, 11, 13, 15].map(day => (
                                <div key={day} className="w-4 flex justify-center">
                                    {symptom.activeDays.includes(day) ? (
                                        <div className={`w-2 h-2 rounded-full ${symptom.color}`} />
                                    ) : (
                                        <div className="w-1 h-1 rounded-full bg-slate-100" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <span className="w-32 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                            {symptom.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
