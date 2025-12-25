'use client';

import { useState } from 'react';
import { ChevronLeft, Pencil, Camera, Info, Scale } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { Button } from '@/components/ui/button';

interface FastingSummaryProps {
    startTime: Date;
    endTime: Date;
    onSave: (data: { startTime: Date; endTime: Date; weight: number }) => void;
    onDiscard: () => void;
    onBack: () => void;
}

export default function FastingSummary({ startTime, endTime, onSave, onDiscard, onBack }: FastingSummaryProps) {
    const [currentStartTime, setCurrentStartTime] = useState(startTime);
    const [currentEndTime, setCurrentEndTime] = useState(endTime);
    const [weight, setWeight] = useState(93.1);

    const totalSeconds = differenceInSeconds(currentEndTime, currentStartTime);
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-[#f8fbff] z-50 overflow-y-auto min-h-screen flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <header className="flex items-center mb-10">
                <button onClick={onBack} className="p-2 -ml-2 text-slate-800">
                    <ChevronLeft size={28} strokeWidth={3} />
                </button>
            </header>

            <div className="flex flex-col items-center mb-12">
                <h2 className="text-[#002855] font-black text-xl mb-4">Total fasting time</h2>
                <span className="text-[56px] font-black text-[#002855] tracking-tight leading-none">
                    {formatDuration(totalSeconds)}
                </span>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 space-y-8 mb-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[#002855]/60 font-black text-sm uppercase tracking-widest leading-none">Start time</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#002855] font-black text-lg">Today, {format(currentStartTime, 'hh:mm a')}</span>
                        <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center text-emerald-500 shadow-sm border border-white cursor-pointer hover:scale-110 transition-transform">
                            <Pencil size={14} fill="currentColor" />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-50 w-full" />

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="text-[#002855]/60 font-black text-sm uppercase tracking-widest leading-none">End time</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-black text-lg">Today, {format(currentEndTime, 'hh:mm a')}</span>
                        <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center text-emerald-500 shadow-sm border border-white cursor-pointer hover:scale-110 transition-transform">
                            <Pencil size={14} fill="currentColor" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#eefcf8] rounded-3xl p-5 border border-emerald-100 flex items-center justify-center gap-8">
                    <span className="text-[#002855] font-black text-2xl">Today</span>
                    <span className="text-[#002855] font-black text-2xl tracking-widest">
                        {format(currentEndTime, 'hh : mm a').toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 mb-12">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[#002855] font-black text-xl">Weight</h3>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-[40px] font-black text-emerald-400 leading-none">{weight}</span>
                        <span className="text-xl font-black text-emerald-400/60 font-mono">kg</span>
                    </div>

                    {/* Weight Ruler Mockup */}
                    <div className="relative w-full overflow-hidden h-24 flex items-end">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-emerald-400">
                            <div className="w-3 h-3 bg-emerald-400" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
                        </div>
                        <div className="flex gap-4 items-end px-1/2 w-max animate-ruler transition-transform">
                            {[91, 92, 93, 94, 95].map((w) => (
                                <div key={w} className="flex flex-col items-center gap-4">
                                    <span className="text-slate-300 font-black text-lg">{w}</span>
                                    <div className="flex gap-1 items-end">
                                        <div className="w-1 h-12 bg-slate-100 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                        <div className="w-1 h-8 bg-slate-100 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                        <div className="w-1 h-6 bg-slate-50 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="mt-8 flex items-center gap-2 text-emerald-500 font-black text-sm bg-emerald-50 px-5 py-2.5 rounded-full hover:bg-emerald-100 transition-colors">
                        <Camera size={18} fill="currentColor" />
                        Track body changes
                    </button>
                </div>
            </div>

            <div className="mt-auto space-y-4">
                <button
                    onClick={() => onSave({ startTime: currentStartTime, endTime: currentEndTime, weight })}
                    className="w-full py-5 bg-[#00ca86] text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Save the Fast
                </button>
                <button
                    onClick={onDiscard}
                    className="w-full py-4 text-slate-400 font-black text-lg hover:text-slate-600 transition-colors"
                >
                    Discard the Fast
                </button>
            </div>
        </div>
    );
}
