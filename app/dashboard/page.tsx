'use client';

import { useEffect, useState } from 'react';
import FastingTimer from '@/components/fasting/timer';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Flame, Info, Bell, Settings } from 'lucide-react';

export default function DashboardPage() {
    const [activeFast, setActiveFast] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchFast = async () => {
        try {
            const res = await api.get('/fasts/current');
            setActiveFast(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFast();
    }, []);

    const handleStart = async (planId: number = 1) => {
        // Default to 16:8 plan for demo (ID 1)
        try {
            await api.post('/fasts/start', {
                plan_id: planId,
                start_time: new Date().toISOString(),
                planned_duration_minutes: 16 * 60,
            });
            fetchFast();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="max-w-md mx-auto space-y-8 p-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Today</h1>
                    <p className="text-slate-400 font-bold">Keep up the streak!</p>
                </div>
                <div className="flex gap-2">
                    <button className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                        <Bell size={24} />
                    </button>
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm border border-orange-100/50">
                        <Flame className="text-orange-500" size={24} fill="currentColor" />
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] p-1 shadow-2xl shadow-emerald-500/10 border border-slate-50">
                <FastingTimer initialFast={activeFast} onRefresh={fetchFast} />
            </div>

            {!activeFast && (
                <div className="space-y-6">
                    <div className="flex justify-between items-end px-2">
                        <h3 className="text-xl font-black text-slate-800">Ready to start?</h3>
                        <Button variant="ghost" className="text-emerald-500 font-black p-0 h-auto hover:bg-transparent">
                            Plan details <Info size={16} className="ml-1" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => handleStart(1)}
                            className="bg-orange-50 border-2 border-orange-100 rounded-[2rem] p-6 hover:scale-[1.05] transition-all cursor-pointer group shadow-sm"
                        >
                            <span className="text-orange-600 font-black text-2xl block mb-1">16:8</span>
                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Popular</span>
                        </div>
                        <div
                            onClick={() => handleStart(2)}
                            className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-6 hover:scale-[1.05] transition-all cursor-pointer group shadow-sm"
                        >
                            <span className="text-emerald-600 font-black text-2xl block mb-1">18:6</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Advanced</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-indigo-100 transition-colors">
                <div className="space-y-1">
                    <h4 className="text-indigo-900 font-black text-lg">Daily Insight</h4>
                    <p className="text-indigo-600/70 font-bold text-sm">How hydration affects fat loss.</p>
                </div>
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                    <ChevronRight size={24} strokeWidth={3} />
                </div>
            </div>
        </div>
    );
}

function ChevronRight({ size, strokeWidth, className }: { size: number, strokeWidth: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
