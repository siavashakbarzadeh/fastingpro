'use client';

import React, { useEffect, useState } from 'react';
import {
    User, Settings, ChevronRight, Flame, Target, Award,
    Calendar, Share2, Zap, Scale, Clock, TrendingUp, Camera, Pencil, Hexagon
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { format, subDays, isSameDay } from 'date-fns';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        weight: '93.1',
        weightChange: '+13.1',
        fastingDays: '0',
        fastingHours: '0',
        longestFast: '0',
    });
    const [chartData, setChartData] = useState<number[]>([]);
    const [history, setHistory] = useState<any[]>([]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/fasts/history');
            const historyData = res.data || [];
            setHistory(historyData);

            // Calculate stats
            const completedFasts = historyData.filter((f: any) => f.end_time);

            // Fasting Days (Unique days with completed fasts)
            const uniqueDays = new Set(completedFasts.map((f: any) =>
                format(new Date(f.start_time), 'yyyy-MM-dd')
            ));

            // Total Hours
            const totalMs = completedFasts.reduce((acc: number, f: any) => {
                const duration = new Date(f.end_time).getTime() - new Date(f.start_time).getTime();
                return acc + duration;
            }, 0);
            const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(1);

            // Longest Fast
            const longestMs = completedFasts.reduce((max: number, f: any) => {
                const duration = new Date(f.end_time).getTime() - new Date(f.start_time).getTime();
                return Math.max(max, duration);
            }, 0);
            const longestHours = (longestMs / (1000 * 60 * 60)).toFixed(1);

            // Chart Data (Last 7 days)
            const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
            const dailyHours = last7Days.map(date => {
                const dayFasts = completedFasts.filter((f: any) => isSameDay(new Date(f.start_time), date));
                const dayMs = dayFasts.reduce((acc: number, f: any) => {
                    return acc + (new Date(f.end_time).getTime() - new Date(f.start_time).getTime());
                }, 0);
                return Number((dayMs / (1000 * 60 * 60)).toFixed(1));
            });

            // Weight from localStorage (as it's logged in summary)
            const weight = localStorage.getItem('currentWeight') || '93.1';

            setStats({
                weight,
                weightChange: '+13.1',
                fastingDays: uniqueDays.size.toString(),
                fastingHours: totalHours,
                longestFast: longestHours,
            });
            setChartData(dailyHours);

        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const achievements = [
        { id: 1, label: '1', active: true },
        { id: 5, label: '5', active: false },
        { id: 10, label: '10', active: false },
        { id: 20, label: '20', active: false },
        { id: 50, label: '50', active: false },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fbff] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500"></div>
            </div>
        );
    }

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
                        <span className="text-slate-400 font-bold">{stats.fastingDays.length > 0 && Number(stats.fastingDays) >= 1 ? '1' : '0'}<span className="text-slate-200">/34</span></span>
                    </div>
                    <div className="flex justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {achievements.map((item) => (
                            <div key={item.id} className="flex flex-col items-center gap-2 flex-shrink-0">
                                <div className={`w-14 h-14 rounded-2xl border-4 ${Number(stats.fastingDays) >= item.id ? 'bg-indigo-50 border-indigo-100 text-indigo-500 shadow-lg shadow-indigo-100' : 'bg-slate-50 border-white text-slate-200'} flex items-center justify-center overflow-hidden relative`}>
                                    <Hexagon size={48} className="absolute inset-0 m-auto opacity-20" />
                                    <span className="relative z-10 font-black text-lg">{item.label}</span>
                                    {Number(stats.fastingDays) >= item.id && (
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
                            <span className="text-[#002855] font-black text-xl">
                                {(chartData.reduce((a, b) => a + b, 0) / (chartData.filter(h => h > 0).length || 1)).toFixed(1)} h
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ChevronRight size={18} className="text-slate-300 rotate-180" />
                            <span className="text-slate-400 font-black text-xs uppercase tracking-widest">
                                {format(subDays(new Date(), 6), 'dd/MM')} - {format(new Date(), 'dd/MM')}
                            </span>
                            <ChevronRight size={18} className="text-slate-300" />
                        </div>
                    </div>

                    <div className="flex justify-between items-end h-40 gap-3">
                        {chartData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-emerald-50 rounded-full h-32 relative overflow-hidden">
                                    {h > 0 && (
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-[#00ca86] rounded-full transition-all duration-1000"
                                            style={{ height: `${Math.min((h / 16) * 100, 100)}%` }}
                                        />
                                    )}
                                </div>
                                <span className={`font-black text-[10px] ${h > 0 ? 'text-emerald-500' : 'text-slate-200'}`}>{h}h</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
