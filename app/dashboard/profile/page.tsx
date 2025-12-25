'use client';

import React, { useEffect, useState } from 'react';
import {
    User, Settings, ChevronRight, Flame, Target, Award,
    Calendar, Share2, Zap, Scale, Clock, TrendingUp, Camera, Pencil, Hexagon
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [stats, setStats] = useState({
        weight: '93.1',
        weightChange: '+13.1',
        fastingDays: '2',
        fastingHours: '14.6',
        longestFast: '14.1',
    });

    useEffect(() => {
        // Load stats from localStorage
        const weight = localStorage.getItem('currentWeight') || '93.1';
        const fastingDays = localStorage.getItem('fastingDays') || '2';
        const fastingHours = localStorage.getItem('fastingHours') || '14.6';

        setStats(prev => ({
            ...prev,
            weight,
            fastingDays,
            fastingHours
        }));
    }, []);

    const achievements = [
        { id: 1, label: '1', active: true },
        { id: 5, label: '5', active: false },
        { id: 10, label: '10', active: false },
        { id: 20, label: '20', active: false },
        { id: 50, label: '50', active: false },
    ];

    return (
        <div className="bg-[#f8fbff] min-h-screen pb-32">
            {/* Header */}
            <header className="flex justify-end p-6">
                <div className="relative">
                    <Settings className="text-slate-400" size={24} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#f8fbff]" />
                </div>
            </header>

            <div className="px-6 space-y-6">
                {/* Profile Info */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#f0f7ff] border-4 border-white shadow-sm flex items-center justify-center relative">
                        <User size={48} className="text-slate-200" />
                        <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                            <span className="text-slate-300 text-xl font-bold">+</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-black text-[#002855]">Beginner</h1>
                            <Share2 className="text-slate-300" size={20} />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">Share your thoughts here</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Fasting Days */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Calendar size={24} fill="currentColor" fillOpacity={0.2} />
                        </div>
                        <div>
                            <div className="text-[#002855]/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Fasting days</div>
                            <div className="text-xl font-black text-[#002855]">{stats.fastingDays}</div>
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-400">
                            <Scale size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="text-[#002855]/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Weight</div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-black text-[#002855]">{stats.weight}kg</span>
                                <span className="bg-orange-50 text-orange-500 text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center">
                                    ↑ {stats.weightChange.replace('+', '')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Fasting Hours */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100/50 flex items-center justify-center text-emerald-500">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-[#002855]/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Fasting hours</div>
                            <div className="text-xl font-black text-[#002855]">{stats.fastingHours} h</div>
                        </div>
                    </div>

                    {/* Longest Fast */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <div className="text-[#002855]/40 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Longest fasting</div>
                            <div className="text-xl font-black text-[#002855]">{stats.longestFast} h</div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-[#002855]">Achievements</h3>
                        <span className="text-slate-400 font-bold">1<span className="text-slate-200">/34</span></span>
                    </div>
                    <div className="flex justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {achievements.map((item) => (
                            <div key={item.id} className="flex flex-col items-center gap-2 flex-shrink-0">
                                <div className={`w-14 h-14 rounded-2xl border-4 ${item.active ? 'bg-indigo-50 border-indigo-100 text-indigo-500 shadow-lg shadow-indigo-100' : 'bg-slate-50 border-white text-slate-200'} flex items-center justify-center overflow-hidden relative`}>
                                    <Hexagon size={48} className="absolute inset-0 m-auto opacity-20" />
                                    <span className="relative z-10 font-black text-lg">{item.label}</span>
                                    {item.active && (
                                        <div className="absolute top-1 left-1.5">
                                            <Award size={10} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Fasts Chart */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-[#002855]">Recent fasts</h3>
                        <div className="flex gap-2">
                            <Share2 className="text-slate-300" size={20} />
                            <Pencil className="text-emerald-500" size={20} />
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                        <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 font-black text-sm uppercase">Average:</span>
                            <span className="text-[#002855] font-black text-xl">7.5 h</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ChevronRight size={18} className="text-slate-300 rotate-180" />
                            <span className="text-slate-400 font-black text-xs uppercase tracking-widest">19/12 - 25/12</span>
                            <ChevronRight size={18} className="text-slate-300" />
                        </div>
                    </div>

                    <div className="flex justify-between items-end h-40 gap-3">
                        {[0, 0, 0, 0, 0, 0, 15].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-emerald-50 rounded-full h-32 relative overflow-hidden">
                                    {h > 0 && (
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-[#00ca86] rounded-full transition-all duration-1000"
                                            style={{ height: `${(h / 16) * 100}%` }}
                                        />
                                    )}
                                </div>
                                {h > 0 && <span className="text-emerald-500 font-black text-[10px]">{h}h</span>}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
