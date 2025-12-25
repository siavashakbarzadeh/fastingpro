'use client';

import React from 'react';

export default function ConceptionLikelihoodChart() {
    const bars = [
        { height: 'h-8', color: 'bg-rose-50' },
        { height: 'h-10', color: 'bg-rose-50' },
        { height: 'h-12', color: 'bg-rose-50' },
        { height: 'h-14', color: 'bg-rose-50' },
        { height: 'h-16', color: 'bg-blue-100' },
        { height: 'h-20', color: 'bg-blue-200' },
        { height: 'h-24', color: 'bg-blue-300' },
        { height: 'h-28', color: 'bg-blue-800' },
        { height: 'h-32', color: 'bg-blue-900' },
        { height: 'h-36', color: 'bg-blue-900' },
        { height: 'h-32', color: 'bg-blue-900', hasOvulation: true },
        { height: 'h-28', color: 'bg-blue-800' },
        { height: 'h-24', color: 'bg-blue-300' },
        { height: 'h-20', color: 'bg-blue-200' },
        { height: 'h-16', color: 'bg-rose-50' },
        { height: 'h-12', color: 'bg-rose-50' },
        { height: 'h-8', color: 'bg-rose-50' },
    ];

    return (
        <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 mt-8">
            <h4 className="text-center font-black text-slate-800 mb-10">Likelihood of Conceiving Calculation</h4>

            <div className="flex justify-center items-end gap-1 mb-8 h-48 relative">
                {/* Labels */}
                <div className="absolute top-0 left-0 w-full flex justify-between px-8">
                    <div className="bg-blue-50 text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">Good timing</div>
                    <div className="bg-blue-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">Ideal timing</div>
                    <div className="bg-blue-50 text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm">Good timing</div>
                </div>

                {bars.map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div className="relative w-full flex justify-center items-end h-36">
                            <div className={`${bar.height} w-full rounded-full ${bar.color} transition-all duration-700`} />
                            {bar.hasOvulation && (
                                <div className="absolute -top-8 flex flex-col items-center">
                                    <span className="text-[10px] font-black text-slate-800 mb-1">Ovulation</span>
                                    <div className="w-5 h-5 bg-white rounded-full shadow-lg border-4 border-slate-800 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-800/10 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle days</span>
            </div>
        </div>
    );
}
