'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import {
    User,
    Scale,
    Ruler,
    Calendar,
    Target,
    Info,
    Save,
    CheckCircle2,
    AlertCircle,
    Timer,
    Activity,
    Moon,
    Flame
} from 'lucide-react';

// Mock hook for fasting stats
function useFastingStats() {
    const [stats, setStats] = useState({
        fastingMinutes: 0,
        fastingDays: 0,
        longestFastMinutes: 0
    });

    useEffect(() => {
        // In a real app, this would read from a shared store/API
        // Pulling from localStorage for now to be consistent
        const savedHistory = localStorage.getItem('fastingHistory');
        if (savedHistory) {
            try {
                const history = JSON.parse(savedHistory);
                const completedFasts = history.filter((f: any) => f.end_time);

                const fastingDays = new Set(completedFasts.map((f: any) => f.start_time.split('T')[0])).size;
                const fastingMinutes = completedFasts.reduce((acc: number, f: any) => {
                    const duration = new Date(f.end_time).getTime() - new Date(f.start_time).getTime();
                    return acc + Math.floor(duration / 60000);
                }, 0);
                const longestFastMinutes = completedFasts.reduce((max: number, f: any) => {
                    const duration = new Date(f.end_time).getTime() - new Date(f.start_time).getTime();
                    return Math.max(max, Math.floor(duration / 60000));
                }, 0);

                setStats({ fastingMinutes, fastingDays, longestFastMinutes });
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    return stats;
}

export default function MePage() {
    // Form State
    const [gender, setGender] = useState('female');
    const [age, setAge] = useState<number | string>(28);
    const [height, setHeight] = useState<number | string>(170);
    const [weight, setWeight] = useState<number | string>(65);
    const [goalWeight, setGoalWeight] = useState<number | string>(60);
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [primaryGoal, setPrimaryGoal] = useState('lose weight');

    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fasting Stats
    const fastingStats = useFastingStats();

    // Load saved data
    useEffect(() => {
        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
            try {
                const data = JSON.parse(savedProfile);
                setGender(data.gender || 'female');
                setAge(data.age || 28);
                setHeight(data.height || 170);
                setWeight(data.weight || 65);
                setGoalWeight(data.goalWeight || 60);
                setUnits(data.units || 'metric');
                setPrimaryGoal(data.primaryGoal || 'lose weight');
            } catch (e) {
                console.error(e);
            }
        } else {
            // Fallback to legacy fastingData if profile doesn't exist
            const legacy = localStorage.getItem('fastingData');
            if (legacy) {
                try {
                    const data = JSON.parse(legacy);
                    if (data.currentWeight) setWeight(data.currentWeight);
                    if (data.answers?.goal_weight) setGoalWeight(data.answers.goal_weight);
                } catch (e) { console.error(e); }
            }
        }
    }, []);

    // BMI Calculation
    const calculateBMI = () => {
        const h = typeof height === 'string' ? parseFloat(height) : height;
        const w = typeof weight === 'string' ? parseFloat(weight) : weight;
        if (!h || !w || h <= 0) return 0;

        // Always calculate in metric
        const bmi = w / Math.pow(h / 100, 2);
        return parseFloat(bmi.toFixed(1));
    };

    const bmi = calculateBMI();

    const getBMIRecommendation = (bmiValue: number) => {
        if (bmiValue <= 0) return null;
        if (bmiValue < 18.5) {
            return {
                category: 'Underweight',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                text: 'Your BMI is below the normal range. Before changing your diet or starting fasting, talk to your doctor.'
            };
        } else if (bmiValue < 25) {
            return {
                category: 'Normal',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                text: 'Your BMI is in the normal range. You can use gentle fasting and regular activity to maintain your health.'
            };
        } else if (bmiValue < 30) {
            return {
                category: 'Overweight',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                border: 'border-amber-100',
                text: 'Your BMI is above the normal range. This app can help you with intermittent fasting and activity plans, but it does not replace medical advice.'
            };
        } else {
            return {
                category: 'Obesity',
                color: 'text-rose-600',
                bg: 'bg-rose-50',
                border: 'border-rose-100',
                text: 'Your BMI is in the obesity range. It’s helpful to use both fasting plans and activity plans in this app, and if possible talk to a doctor or dietitian.'
            };
        }
    };

    const recommendation = getBMIRecommendation(bmi);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        if (!height || Number(height) <= 0) newErrors.height = 'Please enter a valid height';
        if (!weight || Number(weight) <= 0) newErrors.weight = 'Please enter a valid weight';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSaving(true);

        // Mock async save
        setTimeout(() => {
            const profileData = { gender, age, height, weight, goalWeight, units, primaryGoal };
            localStorage.setItem('user_profile', JSON.stringify(profileData));

            // Sync current weight to other modules
            localStorage.setItem('currentWeight', weight.toString());

            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }, 1000);
    };

    return (
        <AppShell title="Profile" subtitle="Your health overview" activeTab="me" hideTopBar>
            <div className="max-w-md mx-auto p-4 space-y-6 pb-32">
                {/* Header Section */}
                <div className="pt-4 px-2">
                    <h1 className="text-3xl font-black text-slate-800">Profile</h1>
                    <p className="text-slate-400 font-bold">Your basic health information</p>
                </div>

                {/* Health Profile Card */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Activity size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Health Profile</h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Gender Select */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Gender</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['female', 'male', 'other'].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setGender(g)}
                                        className={`py-3 rounded-2xl font-black text-sm capitalize transition-all border-2 ${gender === g ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-50 border-slate-50 text-slate-400'}`}
                                    >
                                        {g === 'other' ? 'Other' : g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Age Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Age</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 font-black text-slate-800 outline-none transition-all"
                                    placeholder="Enter age"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Height Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Height (cm)</label>
                                <div className="relative">
                                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className={`w-full bg-slate-50 border-2 ${errors.height ? 'border-rose-200 bg-rose-50' : 'border-slate-50 focus:border-primary/20 focus:bg-white'} rounded-2xl py-3.5 pl-12 pr-4 font-black text-slate-800 outline-none transition-all`}
                                        placeholder="cm"
                                    />
                                </div>
                                {errors.height && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.height}</p>}
                            </div>

                            {/* Current Weight Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Weight (kg)</label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className={`w-full bg-slate-50 border-2 ${errors.weight ? 'border-rose-200 bg-rose-50' : 'border-slate-50 focus:border-primary/20 focus:bg-white'} rounded-2xl py-3.5 pl-12 pr-4 font-black text-slate-800 outline-none transition-all`}
                                        placeholder="kg"
                                    />
                                </div>
                                {errors.weight && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.weight}</p>}
                            </div>
                        </div>

                        {/* Goal Weight Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Goal Weight (kg)</label>
                            <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="number"
                                    value={goalWeight}
                                    onChange={(e) => setGoalWeight(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-primary/20 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 font-black text-slate-800 outline-none transition-all"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        {/* Units Control */}
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Units</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setUnits('metric')}
                                    className="flex items-center gap-2 group"
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${units === 'metric' ? 'border-primary' : 'border-slate-200'}`}>
                                        {units === 'metric' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
                                    <span className={`text-sm font-black ${units === 'metric' ? 'text-slate-800' : 'text-slate-400'}`}>Metric (cm, kg)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUnits('imperial')}
                                    className="flex items-center gap-2 group"
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${units === 'imperial' ? 'border-primary' : 'border-slate-200'}`}>
                                        {units === 'imperial' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
                                    <span className={`text-sm font-black ${units === 'imperial' ? 'text-slate-800' : 'text-slate-400'}`}>Imperial (in, lb)</span>
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`w-full py-4 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${isSaved
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            {isSaving ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            ) : isSaved ? (
                                <>
                                    <CheckCircle2 size={24} />
                                    Profile Saved
                                </>
                            ) : (
                                <>
                                    <Save size={24} />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </form>

                    {/* BMI Section inside Health Profile Card */}
                    {bmi > 0 && recommendation && (
                        <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Your BMI</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-slate-800 tracking-tighter">{bmi}</span>
                                        <span className={`text-sm font-black px-3 py-1 rounded-full ${recommendation.bg} ${recommendation.color}`}>
                                            {recommendation.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BMI Recommendation Box */}
                            <div className={`p-4 rounded-2xl border ${recommendation.bg} ${recommendation.border} flex gap-3`}>
                                <Info className={`flex-shrink-0 mt-0.5 ${recommendation.color}`} size={18} />
                                <p className={`text-sm font-bold leading-snug ${recommendation.color}`}>
                                    {recommendation.text}
                                </p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Fasting Summary Card */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Timer size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Fasting Summary</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Fasting</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-slate-800">{fastingStats.fastingMinutes}</span>
                                <span className="text-[10px] font-black text-slate-400">MINS</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Fasting Days</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-slate-800">{fastingStats.fastingDays}</span>
                                <span className="text-[10px] font-black text-slate-400">DAYS</span>
                            </div>
                        </div>
                        <div className="bg-slate-100/50 col-span-2 rounded-2xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Longest Fast</p>
                                <span className="text-2xl font-black text-[#002855]">
                                    {(fastingStats.longestFastMinutes / 60).toFixed(1)} <span className="text-sm font-black text-[#002855]/60 pr-1">hours</span>
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-400">
                                <Flame size={20} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Goals Card */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                            <Target size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Goals</h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            'lose weight',
                            'maintain weight',
                            'gain weight',
                            'improve sleep',
                            'move more'
                        ].map((goal) => (
                            <Chip
                                key={goal}
                                label={goal}
                                active={primaryGoal === goal}
                                onClick={() => setPrimaryGoal(goal)}
                                className="py-3 px-5 text-xs"
                            />
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-black text-slate-600">Weekly weight change goal</span>
                            <span className="text-lg font-black text-primary">-0.5 kg/week</span>
                        </div>
                    </div>
                </Card>

                {/* Connected Modules Card */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Activity size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Connected modules</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0 mt-1">
                                <Flame size={16} fill="currentColor" />
                            </div>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                Calories & activity use your height and weight to estimate daily goals.
                            </p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0 mt-1">
                                <Timer size={16} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                Fasting uses your goals to suggest plans.
                            </p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0 mt-1">
                                <Moon size={16} fill="currentColor" />
                            </div>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                Women’s health modules use your age and cycle data.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Safety Privacy Note */}
                <div className="px-4 py-8 space-y-4">
                    <div className="flex gap-2 text-slate-300">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold leading-relaxed uppercase tracking-widest text-center">
                            Safety & Privacy Note
                        </p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 text-center leading-relaxed px-4">
                        Your profile is used to personalize goals in this app. This app does not provide medical diagnosis, and your data should not replace advice from your doctor.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
