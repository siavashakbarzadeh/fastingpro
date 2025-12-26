'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import Link from 'next/link';
import { Flame, Info, Bell, Settings, Droplet, Activity, Scale, Target, Brain, Pencil, ChevronRight as LucideChevronRight, Smile, Heart, ShieldAlert, Baby, Pill, Stethoscope, Moon, Trees } from 'lucide-react';
import CycleHistoryWidget from '@/components/dashboard/cycle-history';
import ConceptionGauge from '@/components/dashboard/conception-gauge';
import ConceptionLikelihoodChart from '@/components/dashboard/conception-likelihood-chart';

interface CycleData {
    last_period_start: string;
    cycle_length: number;
    period_duration: number;
}

interface CycleData {
    last_period_start: string;
    cycle_length: number;
    period_duration: number;
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [waterIntake, setWaterIntake] = useState(0);
    const [cycleData, setCycleData] = useState<CycleData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadWaterIntake = async () => {
            try {
                const res = await api.get('/water/logs');
                const logs = res.data;
                const d = new Date();
                const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                const todayTotal = logs
                    .filter((log: any) => log.logged_at.startsWith(today))
                    .reduce((sum: number, log: any) => sum + log.amount_ml, 0);

                setWaterIntake(todayTotal);
                localStorage.setItem('waterIntake_total_today', todayTotal.toString());
            } catch (e) {
                console.error('Failed to fetch water logs', e);
                // Fallback to local
                const saved = localStorage.getItem('waterIntake');
                if (saved) {
                    try {
                        const data = JSON.parse(saved);
                        const d = new Date();
                        const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        if (typeof data[today] === 'number') {
                            setWaterIntake(data[today]);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        };

        const loadCycleData = async () => {
            try {
                const res = await api.get('/cycle-data');
                setCycleData(res.data);
                localStorage.setItem('cycleData', JSON.stringify(res.data));
            } catch (e) {
                console.error('Failed to fetch cycle data', e);
                const saved = localStorage.getItem('cycleData');
                if (saved) {
                    try {
                        setCycleData(JSON.parse(saved));
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        };

        loadWaterIntake();
        loadCycleData();
        setLoading(false);

        // Optional: listen for storage changes
        const handleStorage = () => {
            loadWaterIntake();
            loadCycleData();
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Calculate water progress
    const waterGoal = 2500;
    const waterPercentage = Math.min(waterIntake / waterGoal, 1);
    const circumference = 339.29;
    const offset = circumference * (1 - waterPercentage);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="max-w-md mx-auto space-y-8 p-6 animate-fade-in pb-32">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Dashboard</h1>
                    <p className="text-slate-400 font-bold">Your daily health overview</p>
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

            {/* Water Tracker Widget */}
            <Link href="/water-tracker" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Droplet size={120} fill="currentColor" className="text-blue-500" />
                    </div>
                    <div className="w-full flex justify-between items-center z-10">
                        <h4 className="text-slate-800 font-black text-xl">Water</h4>
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <ChevronRight size={16} strokeWidth={4} />
                        </div>
                    </div>

                    <div className="relative w-32 h-32 z-10">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="54" stroke="#eff6ff" strokeWidth="12" fill="none" />
                            <circle cx="64" cy="64" r="54" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                            <Droplet fill="currentColor" size={32} />
                        </div>
                    </div>

                    <div className="text-center z-10">
                        <span className="text-4xl font-black text-slate-800 block mb-1">{waterIntake}</span>
                        <span className="text-slate-400 font-bold text-lg">/ {waterGoal} ml</span>
                    </div>
                </div>
            </Link>

            {/* Dental Health Widget */}
            <Link href="/dental" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Smile size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Dental Health</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Daily Tracker</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Sex Life / Intimacy Widget */}
            <Link href="/sex-life" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Heart size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Enhance Sex Life</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Mood & Intimacy</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Discharge Decoder Widget */}
            <Link href="/discharge" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-500 shadow-sm group-hover:scale-110 transition-transform">
                            <ShieldAlert size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Decode My Discharge</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Self-Check Tool</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-violet-500 group-hover:bg-violet-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Pregnancy Tracker Widget */}
            <Link href="/pregnancy" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Baby size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Track My Pregnancy</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Weekly Journey</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:bg-sky-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Understand Body Widget */}
            <Link href="/understand-body" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Brain size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Understand My Body</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Literacy & Patterns</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-violet-500 group-hover:bg-violet-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Medications Widget */}
            <Link href="/medications" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Pill size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Manage Medications</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Tracker & Reminders</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Symptoms Widget */}
            <Link href="/symptoms" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-blue-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Stethoscope size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Track Symptoms</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Diary & Patterns</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Sleep Widget */}
            <Link href="/sleep" className="block">
                <div className="bg-slate-900 border-2 border-slate-800 shadow-xl shadow-indigo-900/20 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 shadow-sm group-hover:scale-110 transition-transform">
                            <Moon size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-lg">Improve Sleep</h4>
                            <p className="text-indigo-300 font-bold text-xs uppercase tracking-wider">Diary & Habits</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-slate-700 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            {/* Mental Health Widget */}
            <Link href="/mental-health" className="block">
                <div className="bg-white border-2 border-slate-50 shadow-xl shadow-indigo-500/5 rounded-[2.5rem] p-6 flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                            <Heart size={28} strokeWidth={2.5} fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="text-slate-800 font-black text-lg">Support My Mind</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Mood & Self-Care</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </Link>

            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer hover:bg-indigo-100 transition-colors">
                <div className="space-y-1">
                    <h4 className="text-indigo-900 font-black text-lg">Daily Insight</h4>
                    <p className="text-indigo-600/70 font-bold text-sm">How hydration affects fat loss.</p>
                </div>
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                    <ChevronRight size={24} strokeWidth={3} />
                </div>
            </div>

            <CycleHistoryWidget cycleData={cycleData} />

            <div className="space-y-4">
                <ConceptionGauge cycleData={cycleData} />
                <ConceptionLikelihoodChart cycleData={cycleData} />
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
