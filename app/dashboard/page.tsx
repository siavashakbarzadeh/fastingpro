'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Play,
    Pause,
    Droplet,
    Moon,
    Smile,
    Activity,
    Scale,
    TrendingDown,
    TrendingUp,
    Flame,
    ChevronRight,
    Heart,
    Brain,
    ShieldAlert,
    Baby,
    Pill,
    Stethoscope,
    Plus
} from 'lucide-react';
import { useBrushingTracker } from '@/lib/hooks/useBrushingTracker';

// Cycle types
type FertilityLevel = "low" | "medium" | "high";

interface CycleTodaySummary {
    dateLabel: string;
    cycleDay: number;
    fertilityLevel: FertilityLevel;
    message: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { summary: brushingSummary, logTodayBrushed } = useBrushingTracker();

    // Fasting state
    const [isFasting, setIsFasting] = useState(false);
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const [remainingMinutes, setRemainingMinutes] = useState(0);
    const [protocolName] = useState("16:8");

    // Today habits state
    const [waterMl, setWaterMl] = useState(0);
    const [waterGoalMl] = useState(2500);
    const [lastSleepMinutes] = useState(440); // 7h 20m
    const [sleepGoalMinutes] = useState(480); // 8h
    const [steps, setSteps] = useState(4300);
    const [stepsGoal] = useState(8000);

    // Body state
    const [weightKg, setWeightKg] = useState(68.4);
    const [prevWeekWeightKg] = useState(68.8);
    const [heightCm] = useState(170);
    const [fastingDays] = useState(12);
    const [longestFastHours] = useState(18);
    const [currentStreak] = useState(3);

    // Calories state
    const [caloriesInToday, setCaloriesInToday] = useState(1450);
    const [caloriesOutToday, setCaloriesOutToday] = useState(2050);
    const [calorieGoal] = useState(1800);

    // Cycle state (mock data)
    const cycleToday: CycleTodaySummary = {
        dateLabel: "Today, Dec 26",
        cycleDay: 16,
        fertilityLevel: "low",
        message: "It's currently a lower chance to conceive",
    };

    // Computed values
    const bmi = weightKg && heightCm ? weightKg / Math.pow(heightCm / 100, 2) : 0;
    const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obesity';
    const weeklyDiff = weightKg - prevWeekWeightKg;
    const waterProgress = (waterMl / waterGoalMl) * 100;
    const sleepHours = Math.floor(lastSleepMinutes / 60);
    const sleepMins = lastSleepMinutes % 60;
    const sleepStatus = lastSleepMinutes >= sleepGoalMinutes ? 'Good' : lastSleepMinutes >= sleepGoalMinutes * 0.9 ? 'OK' : 'Low';
    const stepsProgress = (steps / stepsGoal) * 100;

    // Fasting timer simulation
    useEffect(() => {
        if (isFasting) {
            const interval = setInterval(() => {
                setElapsedMinutes(prev => prev + 1);
                setRemainingMinutes(prev => Math.max(0, prev - 1));
            }, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [isFasting]);

    const handleStartFast = () => {
        setIsFasting(true);
        setElapsedMinutes(0);
        setRemainingMinutes(16 * 60); // 16 hours for 16:8
    };

    const handleEndFast = () => {
        setIsFasting(false);
        setElapsedMinutes(0);
        setRemainingMinutes(0);
    };

    const addWater = () => {
        setWaterMl(prev => Math.min(prev + 250, waterGoalMl + 1000));
    };

    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const modules = [
        { href: "/dental", icon: Smile, title: "Dental Health", subtitle: "Daily tracker" },
        { href: "/mental-health", icon: Heart, title: "Mental Health", subtitle: "Mood & self-care" },
        { href: "/cycle", icon: Heart, title: "Cycle / Pregnancy", subtitle: "Your cycle history" },
        { href: "/symptoms", icon: Stethoscope, title: "Symptoms", subtitle: "Diary & patterns" },
        { href: "/understand-body", icon: Brain, title: "My Body", subtitle: "Literacy & patterns" },
        { href: "/medications", icon: Pill, title: "Medications", subtitle: "Reminders & tracking" },
    ];

    return (
        <div className="max-w-md mx-auto px-4 py-4 space-y-6 bg-slate-50 min-h-screen pb-24">

            {/* Section 1: Fasting */}
            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Fasting
                </h2>
                <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
                    {isFasting ? (
                        <>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{protocolName} today</h3>
                                    <p className="text-sm text-slate-500">Active fast</p>
                                </div>
                                <Flame className="text-orange-500" size={24} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Elapsed</p>
                                    <p className="text-2xl font-bold text-slate-800">{formatTime(elapsedMinutes)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Remaining</p>
                                    <p className="text-2xl font-bold text-slate-800">{formatTime(remainingMinutes)}</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(elapsedMinutes / (16 * 60)) * 100}%` }}
                                />
                            </div>

                            <button
                                onClick={handleEndFast}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Pause size={18} />
                                End fast
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">No active fast</h3>
                                    <p className="text-sm text-slate-500">Protocol: {protocolName}</p>
                                </div>
                                <Flame className="text-slate-300" size={24} />
                            </div>

                            <button
                                onClick={handleStartFast}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Play size={18} />
                                Start fast
                            </button>
                        </>
                    )}
                </div>
            </section>

            {/* Section 2: Today habits */}
            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Today habits
                </h2>
                <div className="grid grid-cols-2 gap-3">

                    {/* Water card */}
                    <div className="rounded-2xl border bg-white p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <Droplet className="text-blue-500" size={20} />
                            <span className="text-xs font-bold text-slate-500">{Math.round(waterProgress)}%</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Water</h3>
                            <p className="text-xs text-slate-500">{waterMl} / {waterGoalMl} ml</p>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(waterProgress, 100)}%` }}
                            />
                        </div>
                        <button
                            onClick={addWater}
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs py-1.5 rounded-lg transition-colors"
                        >
                            +1 glass
                        </button>
                    </div>

                    {/* Sleep card */}
                    <div className="rounded-2xl border bg-white p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-purple-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <Moon className="text-purple-500" size={20} />
                            <span className={`text-xs font-bold ${sleepStatus === 'Good' ? 'text-green-500' : sleepStatus === 'OK' ? 'text-yellow-500' : 'text-red-500'}`}>
                                {sleepStatus}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Sleep</h3>
                            <p className="text-xs text-slate-500">{sleepHours}h {sleepMins}m</p>
                        </div>
                        <p className="text-xs text-slate-400">Avg. rest</p>
                    </div>

                    {/* Brushing card */}
                    <div className="rounded-2xl border bg-white p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-teal-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <Smile className="text-teal-500" size={20} />
                            {brushingSummary.status === 'brushed' && (
                                <span className="text-xs font-bold text-green-500">✓</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Dental</h3>
                            <p className="text-xs text-slate-500">
                                {brushingSummary.status === 'brushed' ? 'Brushed ✅' : 'Not brushed yet'}
                            </p>
                        </div>
                        {brushingSummary.status !== 'brushed' && (
                            <button
                                onClick={logTodayBrushed}
                                className="w-full bg-teal-50 hover:bg-teal-100 text-teal-600 font-semibold text-xs py-1.5 rounded-lg transition-colors"
                            >
                                Log brushing
                            </button>
                        )}
                    </div>

                    {/* Activity/Steps card */}
                    <div className="rounded-2xl border bg-white p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-green-200 transition-colors">
                        <div className="flex items-center justify-between">
                            <Activity className="text-green-500" size={20} />
                            <span className="text-xs font-bold text-slate-500">{Math.round(stepsProgress)}%</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Activity</h3>
                            <p className="text-xs text-slate-500">{steps.toLocaleString()} / {stepsGoal.toLocaleString()}</p>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                                className="bg-green-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(stepsProgress, 100)}%` }}
                            />
                        </div>
                    </div>

                </div>

                {/* Cycle summary card */}
                <div className="mt-3">
                    <CycleTodayCard summary={cycleToday} />
                </div>
            </section>

            {/* Section 3: Body */}
            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Body
                </h2>

                {/* Weight + BMI card */}
                <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3 mb-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-black text-slate-800">{weightKg}</h3>
                                <span className="text-lg text-slate-500">kg</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                {weeklyDiff < 0 ? (
                                    <TrendingDown className="text-green-500" size={16} />
                                ) : (
                                    <TrendingUp className="text-red-500" size={16} />
                                )}
                                <p className={`text-sm font-semibold ${weeklyDiff < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {weeklyDiff > 0 ? '+' : ''}{weeklyDiff.toFixed(1)} kg this week
                                </p>
                            </div>
                        </div>
                        <Scale className="text-slate-400" size={24} />
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-sm text-slate-600">
                            BMI <span className="font-bold text-slate-800">{bmi.toFixed(1)}</span> – {bmiCategory}
                        </p>
                    </div>

                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2 rounded-lg transition-colors">
                        Log weight
                    </button>
                </div>

                {/* Calories today card */}
                <CaloriesTodayCard
                    caloriesIn={caloriesInToday}
                    caloriesOut={caloriesOutToday}
                    calorieGoal={calorieGoal}
                />
            </section>

            {/* Section 4: Modules */}
            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Modules
                </h2>
                <div className="space-y-2">
                    {modules.map((module, idx) => (
                        <Link key={idx} href={module.href}>
                            <div className="flex items-center justify-between rounded-2xl bg-white border shadow-sm px-4 py-3 hover:border-slate-300 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                        <module.icon className="text-slate-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">{module.title}</h3>
                                        <p className="text-xs text-slate-500">{module.subtitle}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-400" size={18} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
}

// Calories Today Card Component
function CaloriesTodayCard(props: {
    caloriesIn: number;
    caloriesOut: number;
    calorieGoal: number;
}) {
    const { caloriesIn, caloriesOut, calorieGoal } = props;
    const net = caloriesIn - caloriesOut;
    const progress = calorieGoal > 0 ? Math.min(caloriesIn / calorieGoal, 1) : 0;

    const netLabel = net > 0 ? `+${net} kcal` : net < 0 ? `${net} kcal` : "0 kcal";
    const netColor = net < 0 ? "text-emerald-600" : net > 0 ? "text-amber-600" : "text-slate-600";

    return (
        <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                    Calories today
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-xs text-slate-500">Eaten</p>
                    <p className="text-base font-semibold text-slate-900">
                        {caloriesIn.toLocaleString()} kcal
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Burned</p>
                    <p className="text-base font-semibold text-slate-900">
                        {caloriesOut.toLocaleString()} kcal
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <p className="text-xs text-slate-500">
                    Goal: {calorieGoal.toLocaleString()} kcal
                </p>
                <p className={`text-sm font-semibold ${netColor}`}>
                    Net: {netLabel}
                </p>
            </div>

            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-300"
                    style={{ width: `${progress * 100}%` }}
                />
            </div>
        </div>
    );
}

// Cycle Today Card Component
function CycleTodayCard({ summary }: { summary: CycleTodaySummary }) {
    const router = useRouter();

    const levelColors: Record<FertilityLevel, string> = {
        low: "bg-sky-50 text-sky-700 border-sky-200",
        medium: "bg-amber-50 text-amber-700 border-amber-200",
        high: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    const levelLabels: Record<FertilityLevel, string> = {
        low: "Lower chance",
        medium: "Good timing",
        high: "High chance",
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
            <p className="text-xs text-slate-500 font-medium">{summary.dateLabel}</p>

            <p className="text-sm font-semibold text-slate-900">
                {summary.message}
            </p>

            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Day {summary.cycleDay} of cycle</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border ${levelColors[summary.fertilityLevel]}`}>
                    {levelLabels[summary.fertilityLevel]}
                </span>
            </div>

            <button
                type="button"
                onClick={() => router.push("/cycle")}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
            >
                Here's what you can do
                <ChevronRight size={14} />
            </button>
        </div>
    );
}
