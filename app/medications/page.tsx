'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Pill,
    Clock,
    Bell,
    CheckCircle,
    XCircle,
    Plus,
    Edit2,
    Trash2,
    Save,
    AlertTriangle,
    ChevronDown,
    CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// --- Types ---

type MedicationForm = 'tablet' | 'capsule' | 'liquid' | 'injection' | 'other';
type Frequency = 'once_daily' | 'twice_daily' | 'three_times_daily' | 'as_needed';

interface Medication {
    id: string;
    name: string;
    reason: string;
    dose: string;
    form: MedicationForm;
    frequency: Frequency;
    times: string[]; // e.g. ["08:00"]
    remindersEnabled: boolean;
    reminderStyle: 'at_time' | '10_min_before' | '30_min_before';
}

interface DoseInstance {
    id: string; // unique: medicationId_date_time
    medicationId: string;
    medicationName: string;
    dose: string;
    time: string;
    status: 'pending' | 'taken' | 'skipped';
}

// --- Mock Initial Data ---

const INITIAL_MEDS: Medication[] = [
    {
        id: '1',
        name: 'Metformin',
        reason: 'Insulin resistance',
        dose: '500 mg',
        form: 'tablet',
        frequency: 'twice_daily',
        times: ['08:00', '20:00'],
        remindersEnabled: true,
        reminderStyle: 'at_time'
    },
    {
        id: '2',
        name: 'Vitamin D',
        reason: 'Supplement',
        dose: '1000 IU',
        form: 'capsule',
        frequency: 'once_daily',
        times: ['09:00'],
        remindersEnabled: false,
        reminderStyle: 'at_time'
    }
];

// --- Helpers ---

const generateTodayDoses = (meds: Medication[]): DoseInstance[] => {
    // In a real app, we'd check the date, but here we just generate for "today"
    // based on the meds schedule.
    const doses: DoseInstance[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    meds.forEach(med => {
        if (med.frequency === 'as_needed') return;

        med.times.forEach(time => {
            doses.push({
                id: `${med.id}_${todayStr}_${time}`,
                medicationId: med.id,
                medicationName: med.name,
                dose: med.dose,
                time: time,
                status: 'pending'
            });
        });
    });

    // Sort by time
    return doses.sort((a, b) => a.time.localeCompare(b.time));
};

// --- Components ---

export default function MedicationsPage() {
    const [meds, setMeds] = useState<Medication[]>(INITIAL_MEDS);
    const [doses, setDoses] = useState<DoseInstance[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Medication>>({
        name: '', reason: '', dose: '', form: 'tablet', frequency: 'once_daily', times: ['09:00'], remindersEnabled: true, reminderStyle: 'at_time'
    });
    const [isSaving, setIsSaving] = useState(false);

    // Initialize doses on mount (mock setup)
    useEffect(() => {
        setDoses(generateTodayDoses(meds));
    }, []); // Run once on mount for demo purposes to establish "today's" state from initial meds

    // Re-generate doses if meds change (simplified for demo - in real app would preserve existing status)
    useEffect(() => {
        const freshDoses = generateTodayDoses(meds);
        // Merge with existing statuses if IDs match
        setDoses(prev => {
            return freshDoses.map(fd => {
                const existing = prev.find(p => p.id === fd.id);
                return existing ? existing : fd;
            });
        });
    }, [meds]);


    // --- Actions ---

    const handleEditClick = (med: Medication) => {
        setFormData({ ...med });
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateClick = () => {
        setFormData({
            id: '',
            name: '',
            reason: '',
            dose: '',
            form: 'tablet',
            frequency: 'once_daily',
            times: ['09:00'],
            remindersEnabled: true,
            reminderStyle: 'at_time'
        });
        setIsEditing(false);
        setShowForm(true);
    };

    const handleSaveMedication = async () => {
        if (!formData.name || !formData.dose) return;
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));

        if (isEditing && formData.id) {
            setMeds(prev => prev.map(m => m.id === formData.id ? { ...m, ...formData } as Medication : m));
        } else {
            const newMed = { ...formData, id: Date.now().toString() } as Medication;
            setMeds(prev => [...prev, newMed]);
        }

        setIsSaving(false);
        setShowForm(false);
    };

    const handleDeleteMedication = async (id: string) => {
        if (!confirm('Are you sure you want to delete this medication?')) return;
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 600));
        setMeds(prev => prev.filter(m => m.id !== id));
        setIsSaving(false);
        setShowForm(false);
    };

    const handleDoseAction = async (doseId: string, status: 'taken' | 'skipped') => {
        // Optimistic update
        setDoses(prev => prev.map(d => d.id === doseId ? { ...d, status } : d));
        // Fake API call could happen here
    };

    const handleFrequencyChange = (freq: Frequency) => {
        let newTimes = ['09:00'];
        if (freq === 'twice_daily') newTimes = ['09:00', '21:00'];
        if (freq === 'three_times_daily') newTimes = ['08:00', '14:00', '20:00'];
        if (freq === 'as_needed') newTimes = [];

        setFormData({ ...formData, frequency: freq, times: newTimes });
    };

    const updateTime = (index: number, val: string) => {
        const newTimes = [...(formData.times || [])];
        newTimes[index] = val;
        setFormData({ ...formData, times: newTimes });
    };

    const toggleReminder = (medId: string) => {
        setMeds(prev => prev.map(m => m.id === medId ? { ...m, remindersEnabled: !m.remindersEnabled } : m));
    };


    return (
        <div className="min-h-screen bg-teal-50 pb-24 font-sans text-slate-800">

            {/* Header */}
            <header className="bg-white border-b border-teal-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors">
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-teal-950 flex items-center gap-2">
                            <Pill className="w-6 h-6 text-teal-500" />
                            Manage Medications
                        </h1>
                        <p className="text-xs text-teal-900/60 font-bold uppercase tracking-wide px-0.5">
                            My Medicine Cabinet
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-8 space-y-8">

                {/* Today's Doses */}
                <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-teal-500/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Today's Doses</h2>
                    </div>

                    {doses.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <CheckCircle className="mx-auto text-slate-300 w-12 h-12 mb-2" />
                            <p className="text-slate-400 font-bold text-sm">No scheduled doses for today.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {doses.map(dose => (
                                <div key={dose.id} className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${dose.status === 'pending' ? 'bg-white border-slate-100' :
                                        dose.status === 'taken' ? 'bg-emerald-50 border-emerald-100' :
                                            'bg-slate-50 border-slate-100 opacity-60'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                                            {dose.time}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${dose.status === 'skipped' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                                {dose.medicationName}
                                            </h4>
                                            <p className="text-xs font-bold text-slate-400">{dose.dose}</p>
                                        </div>
                                    </div>

                                    {dose.status === 'pending' ? (
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleDoseAction(dose.id, 'taken')}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                            >
                                                Taken
                                            </button>
                                            <button
                                                onClick={() => handleDoseAction(dose.id, 'skipped')}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-200"
                                            >
                                                Skip
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg ${dose.status === 'taken' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {dose.status}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Add / Edit Form */}
                {showForm ? (
                    <section className="bg-white rounded-[2.5rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-50">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800">{isEditing ? 'Edit Medication' : 'Add Medication'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Medication Name</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-teal-400"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Ibuprofen"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Dose</label>
                                    <input
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-teal-400"
                                        value={formData.dose}
                                        onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                                        placeholder="e.g. 500mg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Form</label>
                                    <select
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-teal-400 h-[50px]"
                                        value={formData.form}
                                        onChange={(e) => setFormData({ ...formData, form: e.target.value as MedicationForm })}
                                    >
                                        <option value="tablet">Tablet</option>
                                        <option value="capsule">Capsule</option>
                                        <option value="liquid">Liquid</option>
                                        <option value="injection">Injection</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reason (Optional)</label>
                                <input
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-teal-400"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="e.g. For headache"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Frequency</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['once_daily', 'twice_daily', 'three_times_daily', 'as_needed'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => handleFrequencyChange(f as Frequency)}
                                            className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase transition-all ${formData.frequency === f
                                                    ? 'bg-teal-500 text-white shadow-md'
                                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                                }`}
                                        >
                                            {f.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.frequency !== 'as_needed' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Schedule Times</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.times?.map((t, idx) => (
                                            <input
                                                key={idx}
                                                type="time"
                                                value={t}
                                                onChange={(e) => updateTime(idx, e.target.value)}
                                                className="bg-slate-50 border-2 border-slate-100 rounded-xl p-2 font-mono font-bold text-slate-700"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                {isEditing && formData.id && (
                                    <button
                                        onClick={() => handleDeleteMedication(formData.id!)}
                                        className="p-4 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                                <Button
                                    onClick={handleSaveMedication}
                                    disabled={isSaving}
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 rounded-xl"
                                >
                                    {isSaving ? 'Saving...' : 'Save Medication'}
                                </Button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <button
                        onClick={handleCreateClick}
                        className="w-full py-4 rounded-2xl border-2 border-dashed border-teal-200 text-teal-600 font-bold flex items-center justify-center gap-2 hover:bg-teal-50 transition-all"
                    >
                        <Plus size={20} /> Add New Medication
                    </button>
                )}

                {/* Your Medications List */}
                <section className="space-y-4">
                    <h3 className="font-black text-slate-800 text-lg px-2">Your Medications</h3>
                    {meds.map(med => {
                        // Compute next dose time roughly for display
                        const times = [...med.times].sort();
                        const nowWithPad = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                        let nextDose = times.find(t => t > nowWithPad) || times[0];

                        return (
                            <div key={med.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{med.name}</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{med.dose}</span>
                                        <span className="text-xs font-bold bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md capitalize">{med.form}</span>
                                        {med.frequency === 'as_needed' && (
                                            <span className="text-xs font-bold bg-amber-50 text-amber-500 px-2 py-0.5 rounded-md">As Needed</span>
                                        )}
                                    </div>
                                    {med.frequency !== 'as_needed' && (
                                        <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1">
                                            <CalendarCheck size={12} /> Next: Today at {nextDose}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleEditClick(med)}
                                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleReminder(med.id)}
                                        className={`p-2 rounded-lg transition-colors ${med.remindersEnabled ? 'bg-teal-50 text-teal-500' : 'bg-slate-50 text-slate-300'}`}
                                    >
                                        <Bell size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Safety Disclaimer */}
                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-center mt-8">
                    <AlertTriangle className="mx-auto text-amber-400 w-8 h-8 mb-4" />
                    <h3 className="text-white font-black text-lg mb-2">Medical Disclaimer</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        This tool helps you organize medicines that you and your clinician have already chosen.
                        Always talk to your doctor or pharmacist about your plan.
                    </p>
                    <div className="text-xs text-slate-500 font-bold border-t border-slate-800 pt-4">
                        If you miss doses or feel unwell, always follow the advice of your healthcare provider.
                    </div>
                </section>

            </main>
        </div>
    );
}
