'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    ChevronLeft,
    Settings,
    Flame,
    Timer,
    Trophy,
    Target,
    ChevronRight,
    User,
    ArrowRight
} from 'lucide-react';

interface Stats {
    weight: number;
    fastingDays: number;
    totalFastingHours: number;
    longestFast: number;
    streak: number;
}

export default function ProfileDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats>({
        weight: 0,
        fastingDays: 0,
        totalFastingHours: 0,
        longestFast: 0,
        streak: 0
    });

    useEffect(() => {
        // Load stats from localStorage
        const savedHistory = localStorage.getItem('fastingHistory');
        const userProfile = localStorage.getItem('user_profile');

        let fastingDays = 0;
        let totalMinutes = 0;
        let longestMin = 0;

        if (savedHistory) {
            try {
                const history = JSON.parse(savedHistory);
                const completed = history.filter((f: any) => f.end_time);
                fastingDays = new Set(completed.map((f: any) => f.start_time.split('T')[0])).size;
                totalMinutes = completed.reduce((acc: number, f: any) => {
                    const duration = new Date(f.end_time).getTime() - new Date(f.start_time).getTime();
                    return acc + Math.floor(duration / 60000);
                }, 0);
                longestMin = completed.reduce((max: number, f: any) => {
                    const duration = new Date(f.end_time).getTime() - new Date(f.start_time).getTime();
                    return Math.max(max, Math.floor(duration / 60000));
                }, 0);
            } catch (e) {
                console.error(e);
            }
        }

        let currentWeight = 0;
        if (userProfile) {
            try {
                const profile = JSON.parse(userProfile);
                currentWeight = profile.weight || 0;
            } catch (e) {
                console.error(e);
            }
        } else {
            const legacy = localStorage.getItem('fastingData');
            if (legacy) {
                try {
                    const data = JSON.parse(legacy);
                    currentWeight = data.currentWeight || 0;
                } catch (e) { console.error(e); }
            }
        }

        setStats({
            weight: currentWeight,
            fastingDays,
            totalFastingHours: Math.floor(totalMinutes / 60),
            longestFast: parseFloat((longestMin / 60).toFixed(1)),
            streak: fastingDays > 0 ? 1 : 0 // Dummy streak for now
        });
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pb-24">
            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-10">
                <button onClick={() => router.back()} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-black text-slate-800">Me</h1>
                <button
                    onClick={() => router.push('/me')}
                    className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"
                >
                    <Settings size={20} />
                </button>
            </header>

            <div className="p-6 space-y-6">
                {/* User Info Card */}
                <div className="flex items-center gap-4 py-2">
                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-500 border-4 border-white shadow-xl flex items-center justify-center text-white">
                        <User size={40} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Health Profile</h2>
                        <button
                            onClick={() => router.push('/me')}
                            className="text-indigo-500 font-bold text-sm flex items-center gap-1 group"
                        >
                            View & Edit Stats
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-white border-none shadow-sm flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <Scale size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</p>
                        <p className="text-xl font-black text-slate-800">{stats.weight || '--'} <span className="text-xs text-slate-400">kg</span></p>
                    </Card>
                    <Card className="p-4 bg-white border-none shadow-sm flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <Timer size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fasting Days</p>
                        <p className="text-xl font-black text-slate-800">{stats.fastingDays}</p>
                    </Card>
                    <Card className="p-4 bg-white border-none shadow-sm flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Flame size={20} fill="currentColor" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</p>
                        <p className="text-xl font-black text-slate-800">{stats.streak} <span className="text-xs text-slate-400">days</span></p>
                    </Card>
                    <Card className="p-4 bg-white border-none shadow-sm flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                            <Target size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longest</p>
                        <p className="text-xl font-black text-slate-800">{stats.longestFast} <span className="text-xs text-slate-400">hrs</span></p>
                    </Card>
                </div>

                {/* Achievements Card */}
                <Card className="p-6 bg-[#002855] text-white">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-lg">Achievements</h3>
                        <Trophy size={20} className="text-amber-400" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 grayscale opacity-40">
                                <Trophy size={24} />
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-4">Complete fasts to unlock</p>
                </Card>

                {/* Call to action */}
                <Card className="p-6 bg-indigo-500 text-white relative overflow-hidden group">
                    <div className="relative z-10 space-y-2">
                        <h3 className="text-xl font-black">Complete Your Profile</h3>
                        <p className="text-indigo-100 text-sm font-bold max-w-[200px]">
                            Add your height and goals to get personal BMI recommendations.
                        </p>
                        <Button
                            variant="primary"
                            className="bg-white text-indigo-500 border-none mt-2 px-8"
                            onClick={() => router.push('/me')}
                        >
                            Open Profile Hub
                        </Button>
                    </div>
                    <User
                        size={120}
                        className="absolute -right-8 -bottom-8 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500"
                        fill="currentColor"
                    />
                </Card>
            </div>
        </main>
    );
}

import { Scale } from 'lucide-react';
