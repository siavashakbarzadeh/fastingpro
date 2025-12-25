'use client';

import React from 'react';

export default function ConceptionLikelihoodChart({ cycleData }: { cycleData?: any }) {
    // Calculate current cycle metrics
    const lastDate = cycleData?.lastPeriodStart ? new Date(cycleData.lastPeriodStart) : new Date();
    const todayDate = new Date();
    const diffTime = Math.max(0, todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const cycleLen = cycleData?.cycleLength || 28;
    const currentDay = ((diffDays - 1) % cycleLen) + 1;

    // Center on ovulation
    const ovulationDay = Math.floor(cycleLen / 2);

    const bars = Array.from({ length: 17 }, (_, i) => {
        const dayOffset = i - 8;
        const barDay = ovulationDay + dayOffset;
        const isCurrent = barDay === currentDay;
        const isOvulation = barDay === ovulationDay;

        // Simple height distribution
        const dist = Math.abs(dayOffset);
        const heights = ['h-36', 'h-32', 'h-28', 'h-24', 'h-20', 'h-16', 'h-12', 'h-10', 'h-8'];
        const height = heights[Math.min(dist, 8)];

        let color = 'bg-rose-50';
        if (dist <= 2) color = 'bg-blue-900';
        else if (dist <= 4) color = 'bg-blue-300';
        else if (dist <= 6) color = 'bg-blue-100';

        return { height, color, isOvulation, isCurrent, day: barDay };
    });

    return (
        <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 mt-8">
            <h4 className="text-center font-black text-slate-800 mb-10">Likelihood of Conceiving Calculation</h4>

            <div className="flex justify-center items-end gap-1 mb-8 h-48 relative">
                {/* Labels */}
                <div className="absolute top-0 left-0 w-full flex justify-between px-2">
                    <div className="bg-blue-50 text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">Good timing</div>
                    <div className="bg-blue-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">Ideal timing</div>
                    <div className="bg-blue-50 text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">Good timing</div>
                </div>

                {bars.map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
                        <div className="relative w-full flex justify-center items-end h-36">
                            <div className={`${bar.height} w-full rounded-full ${bar.color} transition-all duration-700 ${bar.isCurrent ? 'ring-2 ring-slate-800 ring-offset-1' : ''}`} />
                            {bar.isOvulation && (
                                <div className="absolute -top-8 flex flex-col items-center z-10">
                                    <span className="text-[10px] font-black text-slate-800 mb-1">Ovulation</span>
                                    <div className="w-5 h-5 bg-white rounded-full shadow-lg border-4 border-slate-800 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                            )}
                            {bar.isCurrent && (
                                <div className="absolute -bottom-6 flex flex-col items-center">
                                    <div className="w-1 h-1 bg-slate-800 rounded-full mb-1" />
                                    <span className="text-[10px] font-black text-slate-800">Today</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-slate-800/10 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle days</span>
            </div>
        </div>
    );
}
