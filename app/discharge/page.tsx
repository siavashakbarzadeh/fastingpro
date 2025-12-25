'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Info,
    AlertTriangle,
    CheckCircle,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Activity,
    ShieldAlert,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Types & Interfaces ---

type DischargeColor = 'clear' | 'white' | 'yellow' | 'green' | 'grey' | 'brown' | 'bloody';
type DischargeConsistency = 'watery' | 'normal' | 'thick' | 'clumpy' | 'frothy';
type DischargeSmell = 'none' | 'mild' | 'strong';
type CycleContext = 'mid_cycle' | 'before_period' | 'during_period' | 'pregnant' | 'menopause_unknown';

interface FormState {
    color: DischargeColor | null;
    consistency: DischargeConsistency | null;
    smell: DischargeSmell | null;
    symptoms: string[];
    cycle: CycleContext | null;
}

interface EvaluationResult {
    riskLevel: 'likely_normal' | 'monitor' | 'see_doctor';
    messages: string[];
    title: string;
}

// --- Helper Data ---

const SYMPTOM_OPTIONS = [
    { id: 'itching', label: 'Itching' },
    { id: 'burning', label: 'Burning when peeing' },
    { id: 'pelvic_pain', label: 'Pelvic pain' },
    { id: 'sex_pain', label: 'Pain during sex' },
    { id: 'none', label: 'None of the above' },
];

// --- Logic ---

const evaluateDischarge = (form: FormState): EvaluationResult => {
    const { color, consistency, smell, symptoms, cycle } = form;
    const messages: string[] = [];
    let riskLevel: EvaluationResult['riskLevel'] = 'likely_normal';

    // 1. Check Color
    if (color === 'green' || color === 'grey') {
        riskLevel = 'see_doctor';
        messages.push('Green or grey discharge can indicate a bacterial infection or STI.');
    } else if (color === 'yellow') {
        if (riskLevel !== 'see_doctor') riskLevel = 'monitor';
        messages.push('Yellow discharge can sometimes be normal, but if accompanied by smell or itching it may suggest an infection.');
    } else if (color === 'bloody' || color === 'brown') {
        if (cycle !== 'during_period' && cycle !== 'before_period') {
            if (riskLevel !== 'see_doctor') riskLevel = 'monitor';
            messages.push('Spotting outside your period can happen (e.g., ovulation), but persistent bleeding should be checked.');
        }
    }

    // 2. Check Consistency
    if (consistency === 'clumpy') { // Cottage cheese like
        if (riskLevel !== 'see_doctor') riskLevel = 'monitor';
        messages.push('Thick, clumpy discharge is a common sign of a yeast infection.');
    } else if (consistency === 'frothy') {
        riskLevel = 'see_doctor';
        messages.push('Frothy texture is often associated with Trichomoniasis, an STI.');
    }

    // 3. Check Smell
    if (smell === 'strong') {
        riskLevel = 'see_doctor';
        messages.push('A strong, unpleasant, or "fishy" odor often indicates Bacterial Vaginosis or another infection.');
    }

    // 4. Check Symptoms
    const activeSymptoms = symptoms.filter(s => s !== 'none');
    if (activeSymptoms.length > 0) {
        riskLevel = 'see_doctor';
        messages.push('Symptoms like itching, burning, or pain are strong signs that you should see a healthcare provider.');
    }

    // 5. Normalcy Adjustments
    if (riskLevel === 'likely_normal') {
        if (color === 'clear' || color === 'white') {
            messages.push('Clear or white discharge is very common and usually healthy.');
        }
        if (cycle === 'mid_cycle' && (consistency === 'watery' || consistency === 'normal')) {
            messages.push('Around ovulation, discharge often becomes clearer and stretchier (like egg whites).');
        }
        if (cycle === 'before_period' && (color === 'white' || consistency === 'thick')) {
            messages.push('It is normal for discharge to become thicker or white before your period.');
        }
    } else if (riskLevel === 'monitor') {
        messages.push('This might be a temporary change, but keep an eye on it.');
    }

    // Titles
    let title = 'Likely Normal Pattern';
    if (riskLevel === 'monitor') title = 'Needs Monitoring';
    if (riskLevel === 'see_doctor') title = 'Recommendation: See a Doctor';

    return { riskLevel, messages, title };
};

// --- Components ---

export default function DischargePage() {
    const [step, setStep] = useState<'form' | 'result'>('form');
    const [form, setForm] = useState<FormState>({
        color: null,
        consistency: null,
        smell: null,
        symptoms: [],
        cycle: null,
    });
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [showSTIDetails, setShowSTIDetails] = useState(false);

    const handleToggleSymptom = (id: string) => {
        setForm(prev => {
            if (id === 'none') return { ...prev, symptoms: ['none'] };
            const newSymptoms = prev.symptoms.filter(s => s !== 'none');
            if (newSymptoms.includes(id)) {
                return { ...prev, symptoms: newSymptoms.filter(s => s !== id) };
            } else {
                return { ...prev, symptoms: [...newSymptoms, id] };
            }
        });
    };

    const handleCalculate = () => {
        if (!form.color || !form.consistency || !form.smell || form.symptoms.length === 0 || !form.cycle) {
            alert('Please answer all questions to get a result.');
            return;
        }
        const res = evaluateDischarge(form);
        setResult(res);
        setStep('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setStep('form');
        setResult(null);
        setForm({ color: null, consistency: null, smell: null, symptoms: [], cycle: null });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">

            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-rose-950 flex items-center gap-2">
                            Decode My Discharge
                        </h1>
                        <p className="text-xs text-rose-900/60 font-bold uppercase tracking-wide">
                            Educational Self-Check
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">

                {step === 'form' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 text-rose-800 text-sm font-medium">
                            <Info className="flex-shrink-0 w-5 h-5 text-rose-500" />
                            <p>This tool is for educational purposes only. It does not provide medical advice or diagnoses. Always consult a doctor for concerns.</p>
                        </div>

                        {/* Question 1: Color */}
                        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg mb-4">1. What color is it?</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {['clear', 'white', 'yellow', 'green', 'grey', 'brown', 'bloody'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setForm({ ...form, color: opt as DischargeColor })}
                                        className={`p-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${form.color === opt
                                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-rose-200'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Question 2: Consistency */}
                        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg mb-4">2. Consistency / Texture?</h3>
                            <div className="flex flex-wrap gap-3">
                                {['watery', 'normal', 'thick', 'clumpy', 'frothy'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setForm({ ...form, consistency: opt as DischargeConsistency })}
                                        className={`px-4 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${form.consistency === opt
                                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-rose-200'
                                            }`}
                                    >
                                        {opt === 'clumpy' ? 'Clumpy (Cottage cheese)' : opt}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Question 3: Smell */}
                        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg mb-4">3. Check the smell</h3>
                            <div className="space-y-3">
                                {[
                                    { val: 'none', label: 'No strong smell / Neutral' },
                                    { val: 'mild', label: 'Mild / Musky (Normal)' },
                                    { val: 'strong', label: 'Strong / Fishy / Unpleasant' }
                                ].map(opt => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setForm({ ...form, smell: opt.val as DischargeSmell })}
                                        className={`w-full text-left p-4 rounded-xl border-2 text-sm font-bold transition-all ${form.smell === opt.val
                                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-rose-200'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Question 4: Symptoms */}
                        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg mb-4">4. Any other symptoms?</h3>
                            <div className="space-y-2">
                                {SYMPTOM_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleToggleSymptom(opt.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-sm font-bold transition-all ${form.symptoms.includes(opt.id)
                                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-rose-200'
                                            }`}
                                    >
                                        <span>{opt.label}</span>
                                        {form.symptoms.includes(opt.id) && <CheckCircle className="w-5 h-5 text-rose-500" />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Question 5: Cycle Context */}
                        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 text-lg mb-4">5. Where are you in your cycle?</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { val: 'mid_cycle', label: 'Mid-Cycle (Ovulation)' },
                                    { val: 'before_period', label: 'Just before period' },
                                    { val: 'during_period', label: 'During period' },
                                    { val: 'pregnant', label: 'Pregnant' },
                                    { val: 'menopause_unknown', label: 'Menopause / Unknown' }
                                ].map(opt => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setForm({ ...form, cycle: opt.val as CycleContext })}
                                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${form.cycle === opt.val
                                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-rose-200'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <Button
                            onClick={handleCalculate}
                            className="w-full py-6 text-lg font-black rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                        >
                            Decode My Discharge
                        </Button>

                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">

                        {/* Result Card */}
                        <section className={`rounded-[2.5rem] p-8 text-white shadow-xl ${result?.riskLevel === 'see_doctor' ? 'bg-rose-500 shadow-rose-500/20' :
                                result?.riskLevel === 'monitor' ? 'bg-amber-500 shadow-amber-500/20' :
                                    'bg-emerald-500 shadow-emerald-500/20'
                            }`}>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    {result?.riskLevel === 'see_doctor' ? <AlertTriangle size={28} /> :
                                        result?.riskLevel === 'monitor' ? <HelpCircle size={28} /> :
                                            <CheckCircle size={28} />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black mb-1">{result?.title}</h2>
                                    <p className="text-white/80 font-medium text-sm">Based on what you logged today.</p>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                                {result?.messages.map((msg, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                                        <p className="font-medium leading-relaxed text-base">{msg}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider bg-black/20 p-4 rounded-xl">
                                <ShieldAlert size={16} />
                                <span>The app cannot diagnose infections.</span>
                            </div>
                        </section>

                        <button onClick={resetForm} className="text-slate-500 font-bold text-sm underline hover:text-slate-800">
                            Start Over / Check Again
                        </button>

                        {/* When to see a doctor */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Activity className="text-rose-500" /> When to see a doctor
                            </h3>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Sudden change in color, smell, or consistency.',
                                    'Strong, unpleasant, or fishy odor.',
                                    'Itching, burning, or redness.',
                                    'Pain in your pelvis or stomach.',
                                    'Bleeding between periods or after sex.',
                                    'Fever or fatigue with discharge changes.'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
                                <p className="text-rose-900 text-sm font-bold leading-relaxed">
                                    If you notice any of these, contact a healthcare provider or clinic for examination and testing.
                                </p>
                            </div>
                        </section>

                        {/* Normal Patterns */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                                    <Calendar size={20} />
                                </div>
                                <h4 className="font-black text-indigo-900 text-lg mb-2">Cycle Changes</h4>
                                <p className="text-indigo-800/80 text-sm leading-relaxed">
                                    It's normal for discharge to change. It may be clear and stretchy during ovulation, and thicker or white at other times.
                                </p>
                            </div>
                            <div className="bg-sky-50 border border-sky-100 rounded-[2rem] p-6">
                                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-4">
                                    <Activity size={20} />
                                </div>
                                <h4 className="font-black text-sky-900 text-lg mb-2">Other Factors</h4>
                                <p className="text-sky-800/80 text-sm leading-relaxed">
                                    Stress, diet, pregnancy, and menopause can all affect your discharge naturally.
                                </p>
                            </div>
                        </section>

                        {/* STI Awareness Modal Trigger */}
                        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-center">
                            <h3 className="text-white text-xl font-black mb-2">Think it might be an infection?</h3>
                            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                                Infections like Bacterial Vaginosis (BV), Yeast, or STIs are very common and treatable.
                            </p>
                            <Button
                                variant="outline"
                                className="bg-transparent text-white border-slate-700 hover:bg-slate-800"
                                onClick={() => setShowSTIDetails(!showSTIDetails)}
                            >
                                {showSTIDetails ? 'Hide Info' : 'Learn about testing options'}
                            </Button>

                            {showSTIDetails && (
                                <div className="mt-6 text-left bg-slate-800 p-6 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                    <h4 className="text-rose-400 font-bold uppercase text-xs tracking-widest mb-3">Testing & Treatment</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        The only way to know for sure is to get a swab or urine test from a doctor or sexual health clinic.
                                        Home test kits are also available in many countries.
                                    </p>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Most infections are easily treated with antibiotics or antifungal medication.
                                        Avoiding douching and perfumed products can also help maintain a healthy balance.
                                    </p>
                                </div>
                            )}
                        </section>

                    </div>
                )}

            </main>
        </div>
    );
}
