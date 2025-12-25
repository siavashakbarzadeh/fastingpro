'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FastingTimer from '@/components/fasting/timer';
import FastingSummary from '@/components/fasting/summary';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import Link from 'next/link';
import { Flame, Info, Bell, Settings, Droplet, Activity, Scale, Target, Brain, Pencil, ChevronRight as LucideChevronRight, Smile, Heart, ShieldAlert, Baby, Pill, Stethoscope, Moon, Trees } from 'lucide-react';
import CycleHistoryWidget from '@/components/dashboard/cycle-history';
import ConceptionGauge from '@/components/dashboard/conception-gauge';
import ConceptionLikelihoodChart from '@/components/dashboard/conception-likelihood-chart';

interface FastingPlan {
    id: number;
    name: string;
    fasting_hours: number;
    eating_hours: number;
    description?: string;
}

interface Fast {
    id: number;
    plan_id?: number;
    start_time: string;
    end_time?: string;
    status: 'active' | 'completed' | 'aborted';
    planned_duration_minutes: number;
    actual_duration_minutes?: number;
}

interface UserFastingData {
    bmiValue?: string;
    weightUnit: string;
    answers?: {
        goal_weight?: string;
        experience?: string;
        meal_end_time?: string;
        meal_start_time?: string;
    };
}

interface CycleData {
    last_period_start: string;
    cycle_length: number;
    period_duration: number;
}

export default function DashboardPage() {
    const [activeFast, setActiveFast] = useState<Fast | null>(null);
    const [loading, setLoading] = useState(true);
    const [waterIntake, setWaterIntake] = useState(0);
    const [fastingData, setFastingData] = useState<UserFastingData | null>(null);
    const [cycleData, setCycleData] = useState<CycleData | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<Fast | null>(null);
    const router = useRouter();

    const fetchFast = async () => {
        try {
            const res = await api.get('/fasts/current');
            if (res.data) {
                setActiveFast(res.data);
            } else {
                setActiveFast(null);
            }
        } catch (error) {
            console.error('Error fetching fast:', error);
            // Fallback to local for dev if server is down, but let's be strict
            const localFast = localStorage.getItem('activeFast');
            if (localFast) {
                setActiveFast(JSON.parse(localFast));
            } else {
                setActiveFast(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFast();

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

        const loadFastingData = () => {
            const saved = localStorage.getItem('fastingData');
            if (saved) {
                try {
                    setFastingData(JSON.parse(saved));
                } catch (e: any) {
                    console.error(e);
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
        loadFastingData();
        loadCycleData();
        // Optional: listen for storage changes
        const handleStorage = () => {
            loadWaterIntake();
            loadFastingData();
            loadCycleData();
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleStart = async (planId: number = 1) => {
        const plannedDuration = planId === 1 ? 16 * 60 : 18 * 60;
        const startTime = new Date().toISOString();

        try {
            const res = await api.post('/fasts/start', {
                plan_id: planId,
                start_time: startTime,
                planned_duration_minutes: plannedDuration
            });
            setActiveFast(res.data);
            localStorage.setItem('activeFast', JSON.stringify(res.data));
        } catch (error) {
            console.error('Error starting fast:', error);
            // Fallback
            const newFast: Fast = {
                id: Date.now(),
                plan_id: planId,
                start_time: startTime,
                planned_duration_minutes: plannedDuration,
                status: 'active'
            };
            setActiveFast(newFast);
            localStorage.setItem('activeFast', JSON.stringify(newFast));
        }
    };

    const handleSaveFast = async (data: { startTime: Date; endTime: Date; weight: number }) => {
        try {
            // 1. Save weight to API
            await api.post('/weights', {
                weight: data.weight,
                date: new Date().toISOString().split('T')[0]
            });
            localStorage.setItem('currentWeight', data.weight.toString());

            // 2. End fast in API
            await api.post('/fasts/end', {
                start_time: data.startTime.toISOString(),
                end_time: data.endTime.toISOString()
            });

            // 3. Clear local state
            localStorage.removeItem('activeFast');
            setActiveFast(null);
            setShowSummary(false);

            // 4. Redirect
            router.push('/dashboard/profile');
        } catch (error) {
            console.error('Error saving fast:', error);
            // Fallback to local if API fails
            localStorage.setItem('currentWeight', data.weight.toString());
            const history = JSON.parse(localStorage.getItem('fastingHistory') || '[]');
            const newSession = {
                id: Date.now(),
                start_time: data.startTime.toISOString(),
                end_time: data.endTime.toISOString(),
                status: 'completed'
            };
            history.push(newSession);
            localStorage.setItem('fastingHistory', JSON.stringify(history));

            localStorage.removeItem('activeFast');
            setActiveFast(null);
            setShowSummary(false);
            router.push('/dashboard/profile');
        }
    };

    const handleDiscardFast = () => {
        localStorage.removeItem('activeFast');
        setShowSummary(false);
        setActiveFast(null);
    };

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

            {activeFast ? (
                <div className="bg-white rounded-[2.5rem] p-1 shadow-2xl shadow-emerald-500/10 border border-slate-50">
                    <FastingTimer
                        initialFast={activeFast}
                        fastingData={fastingData}
                        onRefresh={fetchFast}
                        onStop={(data) => {
                            setSummaryData(data);
                            setShowSummary(true);
                        }}
                    />
                </div>
            ) : (
                <FastingScheduleWidget fastingData={fastingData} onStart={handleStart} />
            )}

            {showSummary && summaryData && (
                <FastingSummary
                    startTime={new Date(summaryData.start_time)}
                    endTime={summaryData.end_time ? new Date(summaryData.end_time) : new Date()}
                    onSave={handleSaveFast}
                    onDiscard={handleDiscardFast}
                    onBack={() => setShowSummary(false)}
                />
            )}

            {!activeFast && !showSummary && (
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

            {fastingData && (
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 px-2">Your Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/body-data" className="bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform cursor-pointer block">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                    <Activity size={20} />
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">BMI</span>
                            </div>
                            <span className="text-2xl font-black text-slate-800">{fastingData.bmiValue || '--'}</span>
                        </Link>
                        <Link href="/body-data" className="bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-transform cursor-pointer block">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                    <Scale size={20} />
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Target</span>
                            </div>
                            <span className="text-2xl font-black text-slate-800">{fastingData.answers?.goal_weight || '--'} {fastingData.weightUnit}</span>
                        </Link>
                        <div className="col-span-2 bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                    <Brain size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Fasting Level</p>
                                    <p className="text-slate-800 font-black text-lg capitalize">{fastingData.answers?.experience || 'Beginner'}</p>
                                </div>
                            </div>
                            <Link href="/fasting" className="text-xs font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest">Update</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FastingScheduleWidget({ fastingData, onStart }: { fastingData: UserFastingData | null, onStart: (planId?: number) => void }) {
    if (!fastingData) return (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-emerald-500/10 border border-slate-50 flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-slate-400 font-bold mb-4">Complete your setup to see your plan</p>
            <Link href="/fasting">
                <Button className="bg-[#00ca86] hover:bg-[#00b075] text-white font-black rounded-2xl px-8 shadow-lg">Start Quiz</Button>
            </Link>
        </div>
    );

    const startTime = fastingData.answers?.meal_end_time || '08:00 PM';
    const endTime = fastingData.answers?.meal_start_time || '08:00 AM';

    // Simplified protocol calculation
    // In a real app we'd parse the hours
    const protocol = "16:8"; // Default or calculated

    return (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-emerald-500/10 border border-slate-50 flex flex-col items-center">
            <h2 className="text-2xl font-black text-[#002855] mb-12 flex items-center gap-2">
                Make a difference now <span className="text-3xl">💪</span>
            </h2>

            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Gauge Background */}
                <svg className="absolute w-full h-full transform -rotate-[135deg]">
                    <circle
                        cx="128" cy="128" r="110"
                        stroke="#eff6ff" strokeWidth="16" strokeLinecap="round" strokeDasharray="518 691"
                        fill="none"
                    />
                    <circle
                        cx="128" cy="128" r="110"
                        stroke="#dbeafe" strokeWidth="16" strokeLinecap="round" strokeDasharray="380 691"
                        fill="none"
                    />
                </svg>

                <div className="flex flex-col items-center z-10">
                    <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-black text-sm mb-4 flex items-center gap-1 shadow-sm">
                        {protocol} <LucideChevronRight size={14} strokeWidth={4} />
                    </div>
                    <p className="text-[#002855]/60 font-black mb-2 uppercase tracking-tight">Next fasting starts at</p>
                    <span className="text-5xl font-black text-[#002855] tracking-tighter">{startTime}</span>
                </div>
            </div>

            <button
                onClick={() => onStart()}
                className="w-full py-5 bg-[#8e97fe] text-white rounded-3xl font-black text-2xl mt-12 shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                Start Fasting
            </button>

            <div className="flex justify-between w-full mt-12 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50">
                <div className="space-y-1">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Start time</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[#002855] font-black text-sm">Today, {startTime}</span>
                        <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <Pencil size={12} className="text-indigo-400" />
                        </div>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">End time</p>
                    <span className="text-[#002855] font-black text-sm">Tomorrow, {endTime}</span>
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
