'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ConceptionGauge({ cycleData }: { cycleData?: any }) {
    // Progress gauge constants
    const radius = 120;
    const stroke = 24;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    // Calculate current cycle metrics
    const lastDate = cycleData?.lastPeriodStart ? new Date(cycleData.lastPeriodStart) : new Date();
    const todayDate = new Date();
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const cycleLen = cycleData?.cycleLength || 28;
    const currentDay = ((diffDays - 1) % cycleLen) + 1;

    // Approximate fertile window (simplified)
    const ovulationDay = Math.floor(cycleLen / 2);
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;

    const isIdeal = currentDay >= fertileStart && currentDay <= fertileEnd;

    return (
        <div className="w-full bg-white rounded-[3rem] p-10 flex flex-col items-center shadow-2xl shadow-slate-200/50 relative overflow-hidden">
            <div className="flex flex-col items-center mb-8">
                <p className="text-slate-900 font-bold mb-1">
                    Today, <span className="text-slate-400">{todayDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                </p>
                <h3 className="text-xs font-black text-slate-800 leading-tight whitespace-nowrap">
                    {isIdeal ? "It's ideal timing to try to conceive" : "It's currently a lower chance to conceive"}
                </h3>
            </div>

            <div className="relative w-72 h-72 flex items-center justify-center">
                {/* SVG Gauge */}
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                    {/* Background Track */}
                    <circle
                        cx="120" cy="120" r={normalizedRadius}
                        stroke="#f1f5f9" strokeWidth={stroke} fill="none"
                    />

                    {/* Period Segment (Red) */}
                    <circle
                        cx="120" cy="120" r={normalizedRadius}
                        stroke="#ef4444" strokeWidth={stroke} fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - (cycleData?.periodDuration / cycleLen))}
                        strokeLinecap="round"
                        transform="rotate(0 120 120)"
                    />

                    {/* Fertile Window (Light Blue) - Approximate */}
                    <circle
                        cx="120" cy="120" r={normalizedRadius}
                        stroke="#93c5fd" strokeWidth={stroke} fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * 0.8}
                        strokeLinecap="round"
                        transform={`rotate(${(fertileStart / cycleLen) * 360} 120 120)`}
                    />
                </svg>

                {/* Day indicator dot */}
                <div
                    className={`absolute w-12 h-12 bg-white rounded-full shadow-xl border-4 ${isIdeal ? 'border-blue-500' : 'border-slate-800'} flex flex-col items-center justify-center z-20 transition-all duration-1000`}
                    style={{
                        transform: `rotate(${(currentDay / cycleLen) * 360 - 90}deg) translate(${normalizedRadius}px) rotate(${-((currentDay / cycleLen) * 360 - 90)}deg)`
                    }}
                >
                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Day</span>
                    <span className="text-xl font-black text-slate-800 leading-none">{currentDay}</span>
                </div>

                {/* Drop icon at the top */}
                <div className="absolute top-0 flex justify-center w-full">
                    <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center -mt-2">
                        <div className="w-4 h-6 bg-red-600 rounded-full" style={{ borderRadius: '50% 50% 50% / 10% 10% 90% 90%' }} />
                    </div>
                </div>

                <div className="flex flex-col items-center z-10 text-center px-8">
                    <div className="flex flex-col items-center gap-1 cursor-pointer group">
                        <span className="text-blue-500 font-bold text-sm">Here's what you can do</span>
                        <ChevronDown size={14} className="text-blue-400 group-hover:translate-y-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}
