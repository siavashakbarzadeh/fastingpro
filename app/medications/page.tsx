'use client';

import React, { useState } from 'react';
import {
    Plus,
    X,
    CheckCircle,
    Bell,
    Trash2,
    Calendar,
    Briefcase,
    Stethoscope,
    Clock,
    Check,
    ChevronRight,
    Search,
    Pill
} from 'lucide-react';
import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState, ErrorState } from '@/components/ui/StatusStates';
import { useMedications } from '@/hooks/useMedications';
import { Medication, Frequency, DoseInstance } from '@/lib/api-client';

export default function MedicationsPage() {
    const {
        medications,
        doses,
        isLoading,
        isSaving,
        error,
        stats,
        addMedication,
        deleteMedication,
        logDose
    } = useMedications();

    // View State
    const [view, setView] = useState<'today' | 'cabinet'>('today');
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [newMed, setNewMed] = useState<Omit<Medication, 'id'>>({
        name: '',
        reason: '',
        dose: '',
        form: 'tablet',
        frequency: 'once_daily',
        times: ['08:00'],
        remindersEnabled: true,
        reminderStyle: 'at_time'
    });

    const [formError, setFormError] = useState<string | null>(null);

    const handleAddMed = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!newMed.name.trim() || !newMed.dose.trim()) {
            setFormError('Please fill in both name and dosage');
            return;
        }

        const success = await addMedication(newMed);
        if (success) {
            setShowAddForm(false);
            setNewMed({
                name: '',
                reason: '',
                dose: '',
                form: 'tablet',
                frequency: 'once_daily',
                times: ['08:00'],
                remindersEnabled: true,
                reminderStyle: 'at_time'
            });
        }
    };

    if (isLoading && medications.length === 0) return <LoadingState />;
    if (error && medications.length === 0) return <ErrorState message={error} />;

    return (
        <AppShell
            title="Medications"
            subtitle="Health & Wellness"
            showBackButton
            backUrl="/"
            activeTab="plan"
        >
            <main className="px-6 py-8 space-y-10">

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setView('today')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${view === 'today' ? 'bg-white text-primary shadow-md' : 'text-slate-400'}`}
                    >
                        Today's Doses
                    </button>
                    <button
                        onClick={() => setView('cabinet')}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${view === 'cabinet' ? 'bg-white text-primary shadow-md' : 'text-slate-400'}`}
                    >
                        Medicine Cabinet
                    </button>
                </div>

                {view === 'today' ? (
                    <>
                        <section>
                            <SectionHeader
                                title="Today's Schedule"
                                description="Don't miss a dose"
                                action={<Chip label={`${stats.takenCount}/${stats.totalCount} taken`} variant="primary" active />}
                            />
                            <div className="space-y-4">
                                {doses.length > 0 ? (
                                    doses.sort((a, b) => a.time.localeCompare(b.time)).map((dose: DoseInstance) => (
                                        <Card key={dose.id} variant="white" padding="md" className={`transition-all ${dose.status !== 'pending' ? 'opacity-50' : ''}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${dose.status === 'taken' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                        <Clock size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{dose.time}</div>
                                                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{dose.medicationName}</h3>
                                                        <p className="text-xs font-bold text-slate-400 uppercase">{dose.dose}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    {dose.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={async () => await logDose(dose.id, 'skipped')}
                                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                            <button
                                                                onClick={async () => await logDose(dose.id, 'taken')}
                                                                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                                                            {dose.status === 'taken' ? <Check size={12} className="text-emerald-500" /> : <X size={12} className="text-rose-500" />}
                                                            {dose.status}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <Calendar className="mx-auto text-slate-200 w-12 h-12 mb-4" />
                                        <p className="text-sm font-black text-slate-400 uppercase">No doses scheduled for today</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <Card variant="secondary" padding="md" className="relative overflow-hidden group">
                                <Bell className="absolute -right-4 -bottom-4 w-32 h-32 text-secondary-dark/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-1">Smart Reminders</h3>
                                        <p className="text-xs font-bold text-white/70 uppercase">Enabled for all critical meds</p>
                                    </div>
                                    <Chip label="ACTIVE" variant="secondary" active />
                                </div>
                            </Card>
                        </section>
                    </>
                ) : (
                    <>
                        <section>
                            <div className="flex justify-between items-end mb-6">
                                <SectionHeader title="Your Cabinet" description="Manage your medications" />
                                <Button
                                    onClick={() => setShowAddForm(true)}
                                    className="rounded-2xl px-5"
                                >
                                    <Plus size={18} />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {medications.map((med: Medication) => (
                                    <Card key={med.id} variant="white" padding="md" className="group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                                    <Pill size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{med.name}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase">{med.dose}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase">{med.frequency.replace('_', ' ')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={async () => await deleteMedication(med.id)}
                                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                                {medications.length === 0 && (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <Pill className="mx-auto text-slate-200 w-12 h-12 mb-4" />
                                        <p className="text-sm font-black text-slate-400 uppercase">Your cabinet is empty</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <Stethoscope className="text-primary mb-6 w-8 h-8" />
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Pharmacist Tip</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-bold">
                                Avoid taking your medication with grapefruit juice unless indicated, as it can affect how some drugs are absorbed.
                            </p>
                        </section>
                    </>
                )}

                {showAddForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
                        <Card variant="white" className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="bg-primary p-6 flex justify-between items-center text-white">
                                <h2 className="text-xl font-black uppercase tracking-tighter">Add Medication</h2>
                                <button onClick={() => setShowAddForm(false)} className="hover:rotate-90 transition-transform">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddMed} className="p-8 space-y-6">
                                {formError && (
                                    <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-xs font-black uppercase">
                                        {formError}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Medication Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="EX: METFORMIN"
                                        value={newMed.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMed({ ...newMed, name: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 placeholder:opacity-50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Dosage</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="EX: 500MG"
                                            value={newMed.dose}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMed({ ...newMed, dose: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black text-slate-700 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Frequency</label>
                                        <select
                                            value={newMed.frequency}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewMed({ ...newMed, frequency: e.target.value as Frequency })}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black text-slate-700 outline-none cursor-pointer"
                                        >
                                            <option value="once_daily">ONCE DAILY</option>
                                            <option value="twice_daily">TWICE DAILY</option>
                                            <option value="three_times_daily">3X DAILY</option>
                                            <option value="as_needed">AS NEEDED</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isSaving}
                                    className="w-full py-5 rounded-2xl font-black uppercase"
                                >
                                    Save Medication
                                </Button>
                            </form>
                        </Card>
                    </div>
                )}
            </main>
        </AppShell>
    );
}
