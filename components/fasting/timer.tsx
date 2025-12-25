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

    const startTimeFormatted = initialFast ? format(new Date(initialFast.start_time), 'hh:mm a') : '--';
    const endTimeFormatted = initialFast ? format(addMinutes(new Date(initialFast.start_time), initialFast.planned_duration_minutes), 'hh:mm a') : '--';
    const dayFormatted = initialFast ? format(new Date(initialFast.start_time), 'eeee') : 'Today';

    // Calculate protocol
    const protocol = fastingData?.answers?.meal_start_time ? "14:10" : "16:8";

    // SVG Circular Progress Constants
    const radius = 110;
    const activeOffset = 518 - (518 * (progress / 100));

    return (
        <div className="flex flex-col items-center p-8 w-full bg-[#f8fbff] min-h-[500px]">
            <h2 className="text-[32px] font-black text-[#002855] mb-12">You're fasting now</h2>

            <div className="relative w-80 h-80 flex items-center justify-center mb-16">
                {/* SVG Gauge */}
                <svg className="absolute w-full h-full transform -rotate-[135deg]" viewBox="0 0 288 288">
                    {/* Background Track */}
                    <circle
                        cx="144" cy="144" r={radius}
                        stroke="#e2eefe" strokeWidth="20" strokeLinecap="round"
                        strokeDasharray="518 691"
                        fill="none"
                    />
                    {/* Active Progress */}
                    <circle
                        cx="144" cy="144" r={radius}
                        stroke="#8e97fe" strokeWidth="20" strokeLinecap="round"
                        strokeDasharray="518 691"
                        strokeDashoffset={activeOffset}
                        fill="none"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>

                {/* Stage Indicators - Mocking icons from the image */}
                <div className="absolute top-[18%] right-[12%] w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-200 z-10">
                    <Droplet size={20} fill="currentColor" strokeWidth={1} />
                </div>
                <div className="absolute top-[50%] -left-2 w-14 h-14 rounded-full bg-[#ffccd5] border-4 border-white shadow-xl flex items-center justify-center z-20">
                    <div className="flex flex-col items-center">
                        <Droplet size={22} className="text-red-500" fill="currentColor" />
                        <div className="flex gap-0.5 mt-0.5">
                            <Zap size={10} className="text-blue-400 fill-current" />
                            <Zap size={10} className="text-blue-100 fill-current" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-[2%] right-[12%] w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-200 z-10">
                    <Flame size={20} fill="currentColor" strokeWidth={1} />
                </div>
                <div className="absolute top-[18%] left-[12%] w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-200 z-10">
                    <Droplet size={20} fill="currentColor" strokeWidth={1} />
                </div>
                <div className="absolute top-[50%] -right-2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-200 z-10">
                    <Flame size={20} fill="currentColor" strokeWidth={1} />
                </div>

                <div className="flex flex-col items-center z-10 text-center">
                    <div className="bg-[#eef4ff] text-[#4a69bd] px-6 py-1.5 rounded-full font-black text-sm mb-6 flex items-center gap-1 shadow-sm border border-white">
                        {protocol} <ChevronRight size={14} strokeWidth={4} />
                    </div>

                    <p className="text-[#002855] font-black text-xl mb-2">Remaining time</p>
                    <span className="text-[56px] font-black text-[#002855] tracking-tight leading-none mb-8">
                        {formatTime(remaining)}
                    </span>

                    <button
                        onClick={handleStop}
                        className="bg-[#eef4ff] text-[#4a69bd] px-12 py-3.5 rounded-full font-black text-lg shadow-sm border border-white hover:bg-white transition-all active:scale-95"
                    >
                        End Fasting
                    </button>
                </div>
            </div>

            <div className="flex justify-between w-full mt-auto">
                <div className="space-y-2">
                    <p className="text-[#002855]/40 font-black text-xs uppercase tracking-widest">Start time</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[#002855] font-black text-lg">Today, {startTimeFormatted}</span>
                        <div className="w-8 h-8 rounded-full bg-[#eef4ff] shadow-sm flex items-center justify-center border border-white hover:scale-110 transition-transform cursor-pointer">
                            <Pencil size={14} className="text-[#4a69bd]" fill="currentColor" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2 text-right">
                    <p className="text-[#002855]/40 font-black text-xs uppercase tracking-widest">End time</p>
                    <span className="text-[#002855] font-black text-lg">Tomorrow, {endTimeFormatted}</span>
                </div>
            </div>
        </div>
    );
}
