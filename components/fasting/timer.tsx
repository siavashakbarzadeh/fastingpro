'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds, addMinutes, format } from 'date-fns';
import { ChevronRight, Pencil, Droplet, Flame, Activity, Zap } from 'lucide-react';
import api from '@/lib/api';

interface FastingTimerProps {
    initialFast: any;
    fastingData: any;
    onRefresh: () => void;
}

export default function FastingTimer({ initialFast, fastingData, onRefresh }: FastingTimerProps) {
    const [remaining, setRemaining] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!initialFast) return;

        const interval = setInterval(() => {
            const start = new Date(initialFast.start_time);
            const plannedDuration = initialFast.planned_duration_minutes;
            const end = addMinutes(start, plannedDuration);
            const now = new Date();

            const diffRemaining = differenceInSeconds(end, now);
            const totalSeconds = plannedDuration * 60;
            const elapsed = totalSeconds - diffRemaining;
            const currentProgress = Math.min((elapsed / totalSeconds) * 100, 100);

            setRemaining(Math.max(diffRemaining, 0));
            setProgress(currentProgress);
        }, 1000);

        return () => clearInterval(interval);
    }, [initialFast]);

    const handleStop = async () => {
        try {
            await api.post('/fasts/end');
        } catch (error: any) {
            console.error('API Error ending fast:', error);
        } finally {
            localStorage.removeItem('activeFast');
            onRefresh();
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startTimeFormatted = initialFast ? format(new Date(initialFast.start_time), 'dd/MM, hh:mm a') : '--';
    const endTimeFormatted = initialFast ? format(addMinutes(new Date(initialFast.start_time), initialFast.planned_duration_minutes), 'hh:mm a') : '--';

    // Calculate protocol
    const protocol = fastingData?.answers?.meal_start_time ? "14:10" : "16:8"; // Example

    // SVG Circular Progress Constants
    const radius = 110;
    const activeOffset = 518 - (518 * (progress / 100));

    return (
        <div className="flex flex-col items-center p-8 w-full bg-white">
            <h2 className="text-[28px] font-black text-[#002855] mb-8">You're fasting now</h2>

            <div className="relative w-80 h-80 flex items-center justify-center mb-4">
                {/* SVG Gauge */}
                <svg className="absolute w-full h-full transform -rotate-[135deg]" viewBox="0 0 288 288">
                    {/* Background Track */}
                    <circle
                        cx="144" cy="144" r={radius}
                        stroke="#eff6ff" strokeWidth="16" strokeLinecap="round"
                        strokeDasharray="518 691"
                        fill="none"
                    />
                    {/* Active Progress */}
                    <circle
                        cx="144" cy="144" r={radius}
                        stroke="#8e97fe" strokeWidth="16" strokeLinecap="round"
                        strokeDasharray="518 691"
                        strokeDashoffset={activeOffset}
                        fill="none"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>

                {/* Stage Indicators */}
                <div className="absolute top-[18%] right-[12%] w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-100 z-10 border border-slate-50">
                    <Droplet size={16} fill="currentColor" />
                </div>
                <div className="absolute top-[50%] -left-1 w-12 h-12 rounded-full bg-white border-4 border-white shadow-xl flex flex-col items-center justify-center z-20">
                    <Activity size={20} className="text-red-500" />
                    <div className="flex gap-0.5 mt-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                        <div className="w-1 h-1 bg-blue-100 rounded-full" />
                        <div className="w-1 h-1 bg-blue-100 rounded-full" />
                    </div>
                </div>
                <div className="absolute bottom-[2%] right-[12%] w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-orange-100 z-10 border border-slate-50">
                    <Flame size={16} fill="currentColor" />
                </div>

                <div className="flex flex-col items-center z-10 text-center">
                    <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-black text-xs mb-6 flex items-center gap-1 shadow-sm border border-indigo-100/50 hover:scale-105 transition-transform cursor-pointer">
                        {protocol} <ChevronRight size={12} strokeWidth={4} />
                    </div>

                    <p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-tight">Remaining time</p>
                    <span className="text-[48px] font-black text-[#002855] tracking-tighter leading-none">
                        {formatTime(remaining)}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 mb-10">
                <p className="text-[#002855] font-black text-lg">You're in the Fat Burning zone</p>
                <div className="w-16 h-1.5 bg-indigo-50 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-[#8e97fe] rounded-full" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-4 w-full mb-12">
                <button
                    onClick={handleStop}
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-indigo-400 transition-all border border-transparent group-hover:border-indigo-100">
                        <Zap size={24} fill="currentColor" className="text-slate-300 group-hover:text-indigo-300" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight text-center">End Fast</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                    <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-indigo-400 transition-all border border-transparent group-hover:border-indigo-100">
                        <ChevronRight size={24} className="text-slate-300 group-hover:text-indigo-300" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight text-center">Share</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                    <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-indigo-400 transition-all border border-transparent group-hover:border-indigo-100">
                        <Droplet size={24} className="text-slate-300 group-hover:text-indigo-300" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight text-center">Log</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                    <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-indigo-400 transition-all border border-transparent group-hover:border-indigo-100">
                        <Activity size={24} className="text-slate-300 group-hover:text-indigo-300" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight text-center">Skip</span>
                </button>
            </div>

            <div className="flex justify-between w-full mt-auto bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100/50">
                <div className="space-y-1">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Start time</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[#002855] font-black text-sm">{startTimeFormatted}</span>
                        <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100 hover:scale-110 transition-transform cursor-pointer">
                            <Pencil size={11} className="text-indigo-400" />
                        </div>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">End time</p>
                    <span className="text-[#002855] font-black text-sm">Today, {endTimeFormatted}</span>
                </div>
            </div>
        </div>
    );
}
