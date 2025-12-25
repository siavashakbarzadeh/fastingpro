'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Stethoscope,
    Activity,
    CalendarDays,
    Clipboard,
    Copy,
    CheckCircle,
    AlertTriangle,
    Frown,
    Meh,
    Smile,
    Thermometer,
    Zap,
    Save,
    ChevronRight,
    TrendingUp,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Types ---

type DayRating = 'very_bad' | 'bad' | 'okay' | 'good' | 'great';
type Symptom = 'headache' | 'fatigue' | 'nausea' | 'shortness_of_breath' | 'fever_chills' | 'stomach_issues' | 'joint_muscle_pain' | 'none';

interface DailyLog {
    date: string; // YYYY-MM-DD
    displayDate: string; // e.g. "Mon" or "Yesterday"
    rating: DayRating;
    painLevel: number; // 0-10
    symptoms: Symptom[];
    note: string;
}

// --- Mock Data ---

const INITIAL_HISTORY: DailyLog[] = [
    { date: '2023-10-24', displayDate: 'Tue', rating: 'good', painLevel: 2, symptoms: [], note: '' },
    { date: '2023-10-25', displayDate: 'Wed', rating: 'okay', painLevel: 4, symptoms: ['headache'], note: 'Stressful work day' },
    { date: '2023-10-26', displayDate: 'Thu', rating: 'bad', painLevel: 6, symptoms: ['headache', 'fatigue'], note: 'Had to lie down' },
    { date: '2023-10-27', displayDate: 'Fri', rating: 'okay', painLevel: 3, symptoms: ['fatigue'], note: '' },
    { date: '2023-10-28', displayDate: 'Sat', rating: 'good', painLevel: 1, symptoms: [], note: 'Walked 5km' },
    { date: '2023-10-29', displayDate: 'Sun', rating: 'good', painLevel: 0, symptoms: [], note: '' },
    { date: '2023-10-30', displayDate: 'Yesterday', rating: 'okay', painLevel: 3, symptoms: ['joint_muscle_pain'], note: 'Gym soreness' },
];

const SYMPTOM_LABELS: Record<Symptom, string> = {
    headache: 'Headache',
    fatigue: 'Fatigue',
    nausea: 'Nausea',
    shortness_of_breath: 'Shortness of Breath',
    fever_chills: 'Fever / Chills',
    stomach_issues: 'Stomach Issues',
    joint_muscle_pain: 'Joint / Muscle Pain',
    none: 'None of the above'
};

const RATING_SCORE: Record<DayRating, number> = {
    very_bad: 1,
    bad: 2,
    okay: 3,
    good: 4,
    great: 5
};

// --- Helper Functions ---

const getFrequentSymptoms = (logs: DailyLog[]) => {
    const counts: Record<string, number> = {};
    logs.forEach(log => {
        log.symptoms.forEach(s => {
            if (s !== 'none') {
                counts[s] = (counts[s] || 0) + 1;
            }
        });
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key, count]) => ({ symptom: key as Symptom, count }));
};

const generateDoctorSummary = (logs: DailyLog[]) => {
    if (logs.length === 0) return "No logs available for the last 7 days.";

    const badDays = logs.filter(l => l.rating === 'bad' || l.rating === 'very_bad').length;
    const frequent = getFrequentSymptoms(logs);
    const symptomsText = frequent.length > 0
        ? `Most frequent symptoms were ${frequent.map(f => SYMPTOM_LABELS[f.symptom].toLowerCase()).join(', ')}.`
        : "No significant symptoms reported.";

    return `In the last 7 days, user reported ${badDays} days rated as 'bad' or 'very bad'. ${symptomsText} Average pain level was ${(logs.reduce((acc, curr) => acc + curr.painLevel, 0) / logs.length).toFixed(1)}/10.`;
};

const getInsights = (logs: DailyLog[]) => {
    const insights = [];
    const fatigueCount = logs.filter(l => l.symptoms.includes('fatigue')).length;
    if (fatigueCount > 2) insights.push(`You reported fatigue on ${fatigueCount} of the last ${logs.length} days.`);

    const avgRating = (logs.reduce((acc, l) => acc + RATING_SCORE[l.rating], 0) / logs.length);
    insights.push(`Average day rating this week: ${avgRating.toFixed(1)} / 5.`);

    const headacheDays = logs.filter(l => l.symptoms.includes('headache'));
    if (headacheDays.length > 0) {
        insights.push("Headaches were present on " + headacheDays.map(d => d.displayDate).join(' and ') + ".");
    }

    return insights.slice(0, 3);
};

// --- Components ---

export default function SymptomsPage() {
    const [history, setHistory] = useState<DailyLog[]>(INITIAL_HISTORY);

    // Today's Form State
    const [rating, setRating] = useState<DayRating | null>(null);
    const [painLevel, setPainLevel] = useState<number>(0);
    const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
    const [note, setNote] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSymptomToggle = (s: Symptom) => {
        if (s === 'none') {
            setSelectedSymptoms(['none']);
            return;
        }
        setSelectedSymptoms(prev => {
            const clean = prev.filter(x => x !== 'none');
            if (clean.includes(s)) return clean.filter(x => x !== s);
            return [...clean, s];
        });
    };

    const handleSaveLog = async () => {
        if (!rating) return;
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1200));

        const newLog: DailyLog = {
            date: new Date().toISOString().split('T')[0],
            displayDate: 'Today',
            rating,
            painLevel,
            symptoms: selectedSymptoms,
            note
        };

        setHistory(prev => [...prev.slice(1), newLog]); // Keep last 7 days roughly
        setIsSaving(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleCopySummary = () => {
        const text = generateDoctorSummary(history);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const insights = getInsights(history);
    const summaryText = generateDoctorSummary(history);
    const frequentSymptoms = getFrequentSymptoms(history);

    return (
        <div className="min-h-screen bg-rose-50 pb-24 font-sans text-slate-800">

            {/* Header */}
            <header className="bg-white border-b border-rose-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-rose-950 flex items-center gap-2">
                            <Stethoscope className="w-6 h-6 text-rose-500" />
                            Track My Symptoms
                        </h1>
                        <p className="text-xs text-rose-900/60 font-bold uppercase tracking-wide px-0.5">
                            Daily Health Diary
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">

                {/* Today's Log Card */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-rose-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                            <Clipboard size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Today's Check-in</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Rating */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">How do you feel overall?</label>
                            <div className="flex justify-between gap-1">
                                {(['very_bad', 'bad', 'okay', 'good', 'great'] as DayRating[]).map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRating(r)}
                                        className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${rating === r
                                                ? 'bg-rose-50 border-rose-400 text-rose-700 transform scale-105'
                                                : 'bg-white border-slate-50 text-slate-300 hover:border-rose-100'
                                            }`}
                                    >
                                        {r === 'excellent' ? <Smile size={24} /> :
                                            r === 'good' ? <Smile size={24} /> :
                                                r === 'okay' ? <Meh size={24} /> :
                                                    <Frown size={24} />
                                        }
                                        <span className="text-[10px] font-bold uppercase">{r.replace('_', ' ')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pain Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pain Level</label>
                                <span className="text-lg font-black text-rose-500">{painLevel}/10</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="10"
                                value={painLevel}
                                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                className="w-full h-3 bg-slate-100 rounded-full appearance-none accent-rose-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-300 mt-2 px-1">
                                <span>No Pain</span>
                                <span>Severe</span>
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Key Symptoms</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(SYMPTOM_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleSymptomToggle(key as Symptom)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${selectedSymptoms.includes(key as Symptom)
                                                ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                                                : 'bg-white text-slate-500 border-slate-100 hover:border-rose-200'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Note */}
                        <textarea
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-rose-300 resize-none h-24"
                            placeholder="Anything else you want to remember about today?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <Button
                            onClick={handleSaveLog}
                            disabled={isSaving || !rating}
                            className={`w-full py-6 rounded-2xl font-black shadow-lg transition-all ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800'
                                }`}
                        >
                            {isSaving ? 'Saving...' : isSaved ? 'Log Saved!' : 'Save Today\'s Log'}
                        </Button>
                    </div>
                </section>

                {/* Last 7 Days Summary */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Last 7 Days</h2>
                    </div>

                    <div className="flex justify-between items-end h-[100px] mb-6 px-1">
                        {history.map((day, i) => {
                            const height = (RATING_SCORE[day.rating] / 5) * 100;
                            const colorClass = day.rating === 'very_bad' || day.rating === 'bad' ? 'bg-rose-400' :
                                day.rating === 'okay' ? 'bg-amber-400' : 'bg-emerald-400';

                            return (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                    <div
                                        className={`w-full max-w-[12px] rounded-full bg-opacity-80 transition-all ${colorClass}`}
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-[10px] font-bold text-slate-300 uppercase truncate w-full text-center">{day.displayDate.slice(0, 3)}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-6">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-600">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                {insight}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Top Symptoms</h4>
                        {frequentSymptoms.length > 0 ? (
                            <div className="space-y-3">
                                {frequentSymptoms.map((fs, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="font-bold text-slate-700">{SYMPTOM_LABELS[fs.symptom]}</span>
                                        <span className="text-xs font-black bg-rose-100 text-rose-600 px-2 py-1 rounded-lg">
                                            {fs.count} days
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 font-medium">No symptoms reported this week.</p>
                        )}
                    </div>
                </section>

                {/* Doctor Summary Export */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">For Your Doctor</h2>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-4 relative group">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {summaryText}
                        </p>
                    </div>

                    <button
                        onClick={handleCopySummary}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-purple-100 text-purple-600 font-bold hover:bg-purple-50 transition-colors"
                    >
                        {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                        {copied ? 'Copied to Clipboard' : 'Copy Summary'}
                    </button>
                </section>

                {/* Safety Disclaimer */}
                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-center mt-8">
                    <AlertTriangle className="mx-auto text-amber-400 w-8 h-8 mb-4" />
                    <h3 className="text-white font-black text-lg mb-2">Not Medical Advice</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        This page is for tracking purposes only and does not diagnose conditions.
                    </p>
                    <p className="text-xs text-slate-500 font-bold border-t border-slate-800 pt-4 leading-relaxed">
                        If you experience severe pain, shortness of breath, confusion, or any other worrying symptoms, contact a healthcare professional immediately.
                    </p>
                </section>

            </main>
        </div>
    );
}
