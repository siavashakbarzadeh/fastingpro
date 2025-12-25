'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ConceptionGauge() {
    // Progress gauge constants
    const radius = 120;
    const stroke = 24;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
        <div className="w-full bg-white rounded-[3rem] p-10 flex flex-col items-center shadow-2xl shadow-slate-200/50 relative overflow-hidden">
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
                        stroke="#b91c1c" strokeWidth={stroke} fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * 0.85}
                        strokeLinecap="round"
                        transform="rotate(0 120 120)"
                        className="opacity-80"
                    />
                    <circle
                        cx="120" cy="120" r={normalizedRadius}
                        stroke="#ef4444" strokeWidth={stroke} fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * 0.9}
                        strokeLinecap="round"
                        transform="rotate(30 120 120)"
                    />

                    {/* Fertile Window (Light Blue) */}
                    <circle
                        cx="120" cy="120" r={normalizedRadius}
                        stroke="#93c5fd" strokeWidth={stroke} fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * 0.8}
                        strokeLinecap="round"
                        transform="rotate(120 120 120)"
                    />

                    {/* Peak Window (Dark Blue) */}
                    <circle
                        cx="120" cy="120" r={normalizedRadius}
                        stroke="#1e293b" strokeWidth={stroke} fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * 0.9}
                        strokeLinecap="round"
                        transform="rotate(190 120 120)"
                    />
                </svg>

                {/* Day indicator dot */}
                <div className="absolute w-12 h-12 bg-white rounded-full shadow-xl border-4 border-slate-800 flex flex-col items-center justify-center z-20" style={{ transform: 'translate(45px, 95px)' }}>
                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Day</span>
                    <span className="text-xl font-black text-slate-800 leading-none">13</span>
                </div>

                {/* Drop icon at the top */}
                <div className="absolute top-0 flex justify-center w-full">
                    <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center -mt-2">
                        <div className="w-4 h-6 bg-red-600 rounded-full" style={{ borderRadius: '50% 50% 50% 50% / 10% 10% 90% 90%' }} />
                    </div>
                </div>

                <div className="flex flex-col items-center z-10 text-center px-8">
                    <p className="text-slate-900 font-bold mb-4">
                        Today, <span className="text-slate-400">19. Jul</span>
                    </p>
                    <h3 className="text-[28px] font-black text-slate-800 leading-tight mb-6">
                        It's ideal timing to try to conceive
                    </h3>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group">
                        <span className="text-blue-500 font-bold text-sm">Here's what you can do</span>
                        <ChevronDown size={14} className="text-blue-400 group-hover:translate-y-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}
