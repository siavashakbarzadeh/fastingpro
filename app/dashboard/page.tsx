"use client";

import React from 'react';
import { AppShell } from '@/components/ui/AppShell';
import FastingStatusCard, { MOCK_FAST_STATUS } from '@/components/dashboard/FastingStatusCard';
import BottomNav from '@/components/ui/BottomNav';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
    <AppShell activeTab="me">
      <section className="px-6 pt-6">
        <h1 className="text-2xl font-black mb-3">Dashboard</h1>
        <div className="space-y-4">
          <FastingStatusCard status={MOCK_FAST_STATUS} />

          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Quick actions</h2>
              <Link href="/dashboard/plans" className="text-xs font-black text-primary">See all</Link>
            </div>
            <div className="space-y-2">
              <Link href="/water-tracker" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-sm font-bold">Hydration</div>
                  <div className="text-xs text-slate-400">Log water</div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
    <BottomNav />
    </>
  );
}

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
