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

// Medications types
type MedStatus = "scheduled" | "taken" | "skipped";

interface TodayDose {
    import BottomNav from '@/components/ui/BottomNav';

    export default function DashboardPage() {
        // ...existing code...

        return (
            <div className="max-w-md mx-auto px-4 py-4 space-y-6 bg-slate-50 min-h-screen pb-24">
                {/* ...existing dashboard content... */}
                <BottomNav />
            </div>
        );
    }
                                    <p className="text-xs text-slate-500">Fasting days</p>
                                    <p className="text-lg font-bold text-slate-800">{fastingDays}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-500">Longest fast</p>
                                    <p className="text-lg font-bold text-slate-800">{longestFastHours} hours</p>
                                </div>
                            </div>
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

                {/* Medications summary card */}
                <div className="mt-3">
                    <MedicationsTodayCard summary={medSummary} />
                </div>
            </section>

            {/* Section 3: Body */}
            <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Body
                </h2>

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

// Medications Today Card Component
function MedicationsTodayCard({ summary }: { summary: MedicationsTodaySummary }) {
    const router = useRouter();
    const { totalDoses, takenDoses, nextDose } = summary;
    const remainingDoses = totalDoses - takenDoses;

    return (
        <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                    Medications today
                </h3>
                {totalDoses > 0 && (
                    <span className="text-xs font-medium rounded-full bg-teal-50 text-teal-700 px-2.5 py-0.5 border border-teal-100">
                        {takenDoses}/{totalDoses} taken
                    </span>
                )}
            </div>

            {totalDoses === 0 ? (
                <p className="text-xs text-slate-500">
                    No doses scheduled for today.
                </p>
            ) : (
                <>
                    <p className="text-xs text-slate-600">
                        {totalDoses} {totalDoses === 1 ? 'dose' : 'doses'} scheduled • {takenDoses} taken • {remainingDoses} remaining
                    </p>
                    {nextDose && (
                        <div className="pt-1 border-t border-slate-100">
                            <p className="text-xs text-slate-600">
                                <span className="font-semibold text-slate-700">Next:</span>{" "}
                                {nextDose.time} – {nextDose.name} {nextDose.dose}
                            </p>
                        </div>
                    )}
                </>
            )}

            <button
                type="button"
                onClick={() => router.push("/medications")}
                className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1"
            >
                Open meds <ChevronRight size={14} />
            </button>
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
