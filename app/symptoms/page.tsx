'use client';

import React, { useState } from 'react';
import {
    Save,
    CheckCircle,
    Zap,
    Smile,
    Meh,
    Frown,
    Copy,
    AlertTriangle
} from 'lucide-react';
import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState, ErrorState } from '@/components/ui/StatusStates';
import { useSymptoms, SYMPTOM_LABELS } from '@/hooks/useSymptoms';
import { SymptomType, DayRating } from '@/lib/api-client';

export default function SymptomsPage() {
    const {
        history,
        isLoading,
        isSaving,
        error,
        stats,
        saveLog,
        retry
    } = useSymptoms();

    // Today's Form State
    const [rating, setRating] = useState<DayRating | null>(null);
    const [painLevel, setPainLevel] = useState<number>(0);
    const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([]);
    const [note, setNote] = useState('');

    const [isSaved, setIsSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSymptomToggle = (s: SymptomType) => {
        if (s === 'none') {
            setSelectedSymptoms(['none']);
            return;
        }
        setSelectedSymptoms((prev: SymptomType[]) => {
            const clean = prev.filter((x: SymptomType) => x !== 'none');
            if (clean.includes(s)) return clean.filter((x: SymptomType) => x !== s);
            return [...clean, s];
        });
    };

    const [formError, setFormError] = useState<string | null>(null);

    const handleSaveLog = async () => {
        setFormError(null);
        if (!rating) {
            setFormError('Please select how you feel today');
            return;
        }
        if (selectedSymptoms.length === 0) {
            setFormError('Please select at least one symptom or "None"');
            return;
        }

        const success = await saveLog({
            date: new Date().toISOString().split('T')[0],
            rating,
            painLevel,
            symptoms: selectedSymptoms,
            note
        });

        if (success) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }
    };

    const handleCopySummary = () => {
        navigator.clipboard.writeText(stats.doctorSummary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading && history.length === 0) return <LoadingState />;
    if (error && history.length === 0) return <ErrorState message={error} onRetry={retry} />;

    return (
        <AppShell title="Symptoms Logger" subtitle="Health Insights" showBackButton backUrl="/" activeTab="plan">
            <main className="px-6 py-8 space-y-10">

                {/* Today's Log Card */}
                <section>
                    <SectionHeader title="Today's Check-in" description="Record how you're feeling" />
                    <Card variant="white" padding="md" className="shadow-xl">
                        <div className="space-y-8">
                            {/* Rating */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">How do you feel overall?</label>
                                <div className="flex justify-between gap-2">
                                    {(['very_bad', 'bad', 'okay', 'good', 'great'] as DayRating[]).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRating(r)}
                                            className={`flex-1 flex flex-col items-center gap-3 py-4 rounded-2xl border-2 transition-all ${rating === r
                                                ? 'bg-primary/5 border-primary text-primary transform scale-105 shadow-sm'
                                                : 'bg-white border-slate-50 text-slate-300 hover:border-primary/20'
                                                }`}
                                        >
                                            {r === 'great' ? <Zap size={24} /> :
                                                r === 'good' ? <Smile size={24} /> :
                                                    r === 'okay' ? <Meh size={24} /> :
                                                        <Frown size={24} />
                                            }
                                            <span className="text-[10px] font-black uppercase tracking-tight">{r.replace('_', ' ')}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pain Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pain Level</label>
                                    <span className="text-xl font-black text-primary">{painLevel}/10</span>
                                </div>
                                <div className="px-2">
                                    <input
                                        type="range"
                                        min="0" max="10"
                                        value={painLevel}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPainLevel(parseInt(e.target.value))}
                                        className="w-full h-3 bg-slate-100 rounded-full appearance-none accent-primary cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-slate-300 mt-3 px-3 uppercase tracking-widest">
                                    <span>None</span>
                                    <span>Severe</span>
                                </div>
                            </div>

                            {/* Symptoms */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Key Symptoms</label>
                                <div className="flex flex-wrap gap-2">
                                    {(Object.entries(SYMPTOM_LABELS) as [SymptomType, string][]).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleSymptomToggle(key)}
                                            className={`px-4 py-3 rounded-xl text-xs font-black border-2 transition-all ${selectedSymptoms.includes(key)
                                                ? 'bg-primary text-white border-primary shadow-md'
                                                : 'bg-white text-slate-500 border-slate-50 hover:border-primary/30'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Daily Notes</label>
                                <textarea
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24"
                                    placeholder="Anything else to remember?"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleSaveLog}
                                isLoading={isSaving}
                                variant={isSaved ? 'ghost' : 'primary'}
                                className="w-full py-4 text-base"
                                icon={isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
                                disabled={isSaving || !rating}
                            >
                                {isSaved ? 'Health Log Added' : "Save Today's Log"}
                            </Button>
                        </div>
                    </Card>
                </section>

                {/* Trends & Insights */}
                <section>
                    <SectionHeader
                        title="Trends"
                        description="Your last 7 reported days"
                        action={<Chip label={`Avg Pain: ${stats.avgPain}`} variant="primary" active />}
                    />
                    <Card variant="white" padding="md">
                        <div className="flex justify-between items-end h-[100px] mb-8 px-1">
                            {history.slice(-7).map((day, i) => {
                                const ratingScore = {
                                    very_bad: 1, bad: 2, okay: 3, good: 4, great: 5
                                }[day.rating];
                                const height = (ratingScore / 5) * 100;
                                const colorClass = day.rating === 'very_bad' || day.rating === 'bad' ? 'bg-danger' :
                                    day.rating === 'okay' ? 'bg-secondary' : 'bg-primary';

                                return (
                                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                        <div className="w-full bg-slate-50 rounded-full h-full flex items-end overflow-hidden">
                                            <div
                                                className={`w-full transition-all duration-1000 ${colorClass}`}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase truncate w-full text-center">{day.displayDate.slice(0, 3)}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-3 mb-6">
                            {stats.insights.map((insight: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
                                    <p className="text-xs font-black text-slate-600 leading-relaxed">{insight}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Top Recurring Symptoms</h4>
                            {stats.frequentSymptoms.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.frequentSymptoms.map((fs: { symptom: SymptomType, count: number }, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between px-1">
                                            <span className="text-sm font-black text-slate-700">{SYMPTOM_LABELS[fs.symptom] || fs.symptom}</span>
                                            <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                                {fs.count} reports
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 font-black px-1">No symptoms reported this period.</p>
                            )}
                        </div>
                    </Card>
                </section>

                {/* Doctor's Summary */}
                <section>
                    <SectionHeader title="Clinical Summary" description="Export for your healthcare provider" />
                    <Card variant="white" padding="md" className="border-2 border-primary/5">
                        <div className="bg-slate-50 rounded-2xl p-5 mb-5">
                            <p className="text-xs font-black text-slate-600 leading-relaxed italic">
                                "{stats.doctorSummary}"
                            </p>
                        </div>

                        <Button
                            onClick={handleCopySummary}
                            variant="secondary"
                            className="w-full py-4 rounded-xl"
                            icon={copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                        >
                            {copied ? 'Copied to Clipboard' : 'Copy Summary'}
                        </Button>
                    </Card>
                </section>

                {/* Safety Disclaimer */}
                <section className="text-center py-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 px-10">
                    <AlertTriangle className="mx-auto text-secondary w-8 h-8 mb-4" />
                    <h3 className="text-white font-black text-base mb-2 uppercase tracking-tight">Important Notice</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-6 opacity-60">
                        Educational only • Not medical advice • If you have urgent symptoms, seek care immediately.
                    </p>
                    <div className="h-px bg-slate-800 w-1/3 mx-auto mb-6" />
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">GoHealthing Secure Platform</p>
                </section>
            </main>
        </AppShell>
    );
}
