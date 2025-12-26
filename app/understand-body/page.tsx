'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Brain,
    Activity,
    Smile,
    Meh,
    Frown,
    Battery,
    BatteryMedium,
    BatteryLow,
    Zap,
    BookOpen,
    Calendar,
    Save,
    CheckCircle,
    AlertTriangle,
    Info,
    PenTool,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// --- Types & Interfaces ---

type EnergyLevel = 'very_low' | 'low' | 'ok' | 'high';
type MoodLevel = 'low' | 'neutral' | 'good';
type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal' | 'not_sure' | 'not_cycling';
type BodySensation = 'cramps' | 'breast_tenderness' | 'headache' | 'bloating' | 'back_pain' | 'none';

interface DailyCheckIn {
    energy: EnergyLevel | null;
    mood: MoodLevel | null;
    sensations: BodySensation[];
    phase: CyclePhase | null;
}

interface DayLog {
    date: string;
    energy: EnergyLevel;
    mood: MoodLevel;
    hasSymptoms: boolean;
}

interface JournalEntry {
    id: string;
    date: string;
    text: string;
}

// --- Mock Data & Helpers ---

const MOCK_HISTORY: DayLog[] = [
    { date: 'Mon', energy: 'high', mood: 'good', hasSymptoms: false },
    { date: 'Tue', energy: 'high', mood: 'neutral', hasSymptoms: false },
    { date: 'Wed', energy: 'ok', mood: 'neutral', hasSymptoms: true },
    { date: 'Thu', energy: 'ok', mood: 'neutral', hasSymptoms: true },
    { date: 'Fri', energy: 'low', mood: 'low', hasSymptoms: true },
    { date: 'Sat', energy: 'low', mood: 'low', hasSymptoms: true }, // Today placeholder
];

const getRecentInsights = (history: DayLog[]) => {
    const insights = [];
    const lowDays = history.filter(d => d.mood === 'low' || d.energy === 'low' || d.energy === 'very_low');
    if (lowDays.length >= 2) {
        insights.push("You've had lower energy or mood in the last few days. Be gentle with yourself.");
    }
    const symptomDays = history.filter(d => d.hasSymptoms);
    if (symptomDays.length >= 3) {
        insights.push(`You noticed body sensations on ${symptomDays.length} of the last 6 days.`);
    }
    if (insights.length === 0) {
        insights.push("Your patterns look steady this week.");
    }
    return insights;
};

// --- Components ---

export default function UnderstandBodyPage() {
    const [checkIn, setCheckIn] = useState<DailyCheckIn>({
        energy: null,
        mood: null,
        sensations: [],
        phase: null
    });
    const [isSavingCheckIn, setIsSavingCheckIn] = useState(false);
    const [checkInSaved, setCheckInSaved] = useState(false);

    const [journalText, setJournalText] = useState('');
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
        { id: '1', date: 'Yesterday', text: 'Felt a bit foggy in the morning, better after a walk.' },
        { id: '2', date: '2 days ago', text: 'High energy today! Great workout.' }
    ]);
    const [isSavingNote, setIsSavingNote] = useState(false);

    const handleSensationToggle = (s: BodySensation) => {
        setCheckIn(prev => {
            if (s === 'none') return { ...prev, sensations: ['none'] };
            const current = prev.sensations.filter(x => x !== 'none');
            if (current.includes(s)) return { ...prev, sensations: current.filter(x => x !== s) };
            return { ...prev, sensations: [...current, s] };
        });
    };

    const handleSaveCheckIn = async () => {
        if (!checkIn.energy && !checkIn.mood) return; // minimal validation
        setIsSavingCheckIn(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsSavingCheckIn(false);
        setCheckInSaved(true);
        setTimeout(() => setCheckInSaved(false), 3000);
    };

    const handleSaveNote = async () => {
        if (!journalText.trim()) return;
        setIsSavingNote(true);
        await new Promise(r => setTimeout(r, 800));
        const newEntry = {
            id: Date.now().toString(),
            date: 'Today',
            text: journalText
        };
        setJournalEntries([newEntry, ...journalEntries].slice(0, 3));
        setJournalText('');
        setIsSavingNote(false);
    };

    const insights = getRecentInsights(MOCK_HISTORY);

    return (
        <div className="min-h-screen bg-violet-50 pb-24 font-sans text-slate-800">

            {/* Header */}
            <header className="bg-white border-b border-violet-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-violet-950 flex items-center gap-2">
                            <Brain className="w-6 h-6 text-violet-500" />
                            Understand My Body
                        </h1>
                        <p className="text-xs text-violet-900/60 font-bold uppercase tracking-wide px-0.5">
                            Body Literacy & Patterns
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">

                {/* Daily Check-in */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-violet-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Daily Check-in</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Energy */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Energy Level</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { val: 'very_low', label: 'Low', icon: BatteryLow },
                                    { val: 'low', label: 'Mid-Low', icon: BatteryMedium },
                                    { val: 'ok', label: 'Okay', icon: Battery },
                                    { val: 'high', label: 'High', icon: Zap }
                                ].map((opt) => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setCheckIn({ ...checkIn, energy: opt.val as EnergyLevel })}
                                        className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${checkIn.energy === opt.val
                                                ? 'bg-violet-50 border-violet-500 text-violet-700'
                                                : 'bg-white border-slate-50 text-slate-400 hover:border-violet-100'
                                            }`}
                                    >
                                        <opt.icon size={20} />
                                        <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Mood</label>
                            <div className="flex bg-slate-50 p-1 rounded-xl">
                                {[
                                    { val: 'low', label: 'Low', icon: Frown },
                                    { val: 'neutral', label: 'Neutral', icon: Meh },
                                    { val: 'good', label: 'Good', icon: Smile }
                                ].map((opt) => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setCheckIn({ ...checkIn, mood: opt.val as MoodLevel })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${checkIn.mood === opt.val
                                                ? 'bg-white shadow text-slate-800'
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        <opt.icon size={18} />
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sensations */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Sensations</label>
                            <div className="flex flex-wrap gap-2">
                                {['cramps', 'breast_tenderness', 'headache', 'bloating', 'back_pain', 'none'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleSensationToggle(s as BodySensation)}
                                        className={`px-3 py-2 rounded-full text-xs font-bold border transition-all capitalized ${checkIn.sensations.includes(s as BodySensation)
                                                ? 'bg-violet-500 text-white border-violet-500'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'
                                            }`}
                                    >
                                        {s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Phase */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Cycle Phase</label>
                            <select
                                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:border-violet-400"
                                value={checkIn.phase || ''}
                                onChange={(e) => setCheckIn({ ...checkIn, phase: e.target.value as CyclePhase })}
                            >
                                <option value="" disabled>Select phase if known...</option>
                                <option value="menstruation">Menstruation</option>
                                <option value="follicular">Follicular (Before ovulation)</option>
                                <option value="ovulation">Ovulation</option>
                                <option value="luteal">Luteal (Before period)</option>
                                <option value="not_sure">Not sure</option>
                                <option value="not_cycling">Not cycling</option>
                            </select>
                        </div>

                        <Button
                            onClick={handleSaveCheckIn}
                            disabled={isSavingCheckIn}
                            className="w-full py-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-lg shadow-slate-900/10"
                        >
                            {isSavingCheckIn ? 'Saving...' : checkInSaved ? 'Saved to Log!' : 'Save Body Log'}
                        </Button>
                    </div>
                </section>

                {/* 7-Day Patterns */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Recent Patterns</h2>
                    </div>

                    <div className="flex justify-between items-end h-24 mb-6 px-2">
                        {MOCK_HISTORY.map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="text-[10px] font-bold text-slate-300 uppercase">{day.date}</div>
                                {day.mood === 'good' && <Smile size={16} className="text-emerald-400" />}
                                {day.mood === 'neutral' && <Meh size={16} className="text-blue-400" />}
                                {day.mood === 'low' && <Frown size={16} className="text-rose-400" />}
                                <div className={`w-3 rounded-full transition-all ${day.energy === 'high' ? 'h-12 bg-emerald-400' :
                                        day.energy === 'ok' ? 'h-8 bg-blue-400' :
                                            'h-4 bg-slate-300'
                                    }`} />
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-600">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                {insight}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Body Map (Educational) */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                        <h4 className="font-black text-slate-700 mb-3 flex items-center gap-2">
                            <Brain size={18} className="text-violet-500" /> Head & Mind
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-2">
                            Headaches or 'brain fog' can happen before your period due to hormonal drops, or from stress/dehydration.
                        </p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                        <h4 className="font-black text-slate-700 mb-3 flex items-center gap-2">
                            <Activity size={18} className="text-rose-500" /> Belly & Pelvis
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-2">
                            Cramping is common during menstruation. Bloating often happens in the luteal phase (before period).
                        </p>
                    </div>
                    <div className="bg-violet-50 rounded-[2rem] p-6 col-span-1 sm:col-span-2 border border-violet-100">
                        <p className="text-violet-800 text-xs font-bold text-center">
                            If any symptom feels new, severe, or keeps getting worse, talking to a doctor is the best step.
                        </p>
                    </div>
                </section>

                {/* Know Your Cycles */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Did you know?</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 font-black text-sm">
                                24-38
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">The "Normal" Range</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    A typical menstrual cycle is anywhere from 24 to 38 days. Regularity matters more than the exact number.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center flex-shrink-0 font-black text-sm">
                                <Zap size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700">Energy Shifts</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Many people feel higher energy around ovulation (mid-cycle) and lower energy just before their period.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Journal */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                            <PenTool size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Body Journal</h2>
                    </div>

                    <textarea
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-amber-300 resize-none h-32 mb-4"
                        placeholder="What did you notice about your body today?"
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                    ></textarea>

                    <div className="flex justify-end mb-8">
                        <Button
                            onClick={handleSaveNote}
                            disabled={isSavingNote || !journalText.trim()}
                            className="bg-slate-900 text-white px-6 rounded-xl hover:bg-slate-800 font-bold"
                        >
                            {isSavingNote ? 'Saving...' : 'Save Note'}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recent Entries</h4>
                        {journalEntries.map(entry => (
                            <div key={entry.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="text-xs font-bold text-amber-600 block mb-1">{entry.date}</span>
                                <p className="text-slate-600 text-sm font-medium">{entry.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Safety Footer */}
                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-center">
                    <AlertTriangle className="mx-auto text-amber-400 w-8 h-8 mb-4" />
                    <h3 className="text-white font-black text-lg mb-2">Self-Awareness Only</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-2">
                        This page helps you build body literacy. It does not replace medical advice.
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        If you have severe pain, fever, heavy bleeding, or persistent new symptoms, please see a healthcare provider.
                    </p>
                </section>

            </main>
        </div>
    );
}
