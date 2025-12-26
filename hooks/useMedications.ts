'use client';

import { useState, useEffect, useMemo } from 'react';
import { Medication, DoseInstance } from '@/lib/api-client';

const MEDS_KEY = 'go_healthing_medications';
const DOSES_KEY = 'go_healthing_doses';

const INITIAL_MEDS: Medication[] = [
    {
        id: '1',
        name: 'Metformin',
        reason: 'Blood Sugar',
        dose: '500mg',
        form: 'tablet',
        frequency: 'twice_daily',
        times: ['08:00', '20:00'],
        remindersEnabled: true,
        reminderStyle: 'at_time'
    },
    {
        id: '2',
        name: 'Lisinopril',
        reason: 'Blood Pressure',
        dose: '10mg',
        form: 'tablet',
        frequency: 'once_daily',
        times: ['09:00'],
        remindersEnabled: true,
        reminderStyle: 'at_time'
    }
];

export function useMedications() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [doses, setDoses] = useState<DoseInstance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        const loadData = () => {
            try {
                const storedMeds = localStorage.getItem(MEDS_KEY);
                const storedDoses = localStorage.getItem(DOSES_KEY);

                if (storedMeds) {
                    setMedications(JSON.parse(storedMeds));
                } else {
                    setMedications(INITIAL_MEDS);
                }

                if (storedDoses) {
                    setDoses(JSON.parse(storedDoses));
                } else {
                    // Generate initial doses for today if empty
                    const initialDoses = generateTodayDoses(storedMeds ? JSON.parse(storedMeds) : INITIAL_MEDS);
                    setDoses(initialDoses);
                }
            } catch (err) {
                console.error('Failed to load medications', err);
                setError('Failed to load medication data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const saveMeds = (newMeds: Medication[]) => {
        setMedications(newMeds);
        localStorage.setItem(MEDS_KEY, JSON.stringify(newMeds));
    };

    const saveDoses = (newDoses: DoseInstance[]) => {
        setDoses(newDoses);
        localStorage.setItem(DOSES_KEY, JSON.stringify(newDoses));
    };

    const generateTodayDoses = (meds: Medication[]) => {
        const todayDoses: DoseInstance[] = [];
        meds.forEach(med => {
            med.times.forEach(time => {
                todayDoses.push({
                    id: `${med.id}-${time}-${new Date().toISOString().split('T')[0]}`,
                    medicationId: med.id,
                    medicationName: med.name,
                    dose: med.dose,
                    time,
                    status: 'pending'
                });
            });
        });
        return todayDoses;
    };

    const addMedication = async (med: Omit<Medication, 'id'>) => {
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 800)); // Simulate API
            const newMed: Medication = { ...med, id: Date.now().toString() };
            const updatedMeds = [...medications, newMed];
            saveMeds(updatedMeds);

            // Add new doses for today for this med
            const newDoses = [...doses];
            newMed.times.forEach(time => {
                newDoses.push({
                    id: `${newMed.id}-${time}-${new Date().toISOString().split('T')[0]}`,
                    medicationId: newMed.id,
                    medicationName: newMed.name,
                    dose: newMed.dose,
                    time,
                    status: 'pending'
                });
            });
            saveDoses(newDoses);
            return true;
        } catch (err) {
            setError('Failed to add medication');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const deleteMedication = async (id: string) => {
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 600)); // Simulate API
            const updatedMeds = medications.filter(m => m.id !== id);
            saveMeds(updatedMeds);

            // Remove pending doses for this med
            const updatedDoses = doses.filter(d => d.medicationId !== id || d.status !== 'pending');
            saveDoses(updatedDoses);
            return true;
        } catch (err) {
            setError('Failed to delete medication');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const logDose = async (doseId: string, status: 'taken' | 'skipped') => {
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 400)); // Simulate API
            const updatedDoses = doses.map(d => d.id === doseId ? { ...d, status } : d);
            saveDoses(updatedDoses);
            return true;
        } catch (err) {
            setError('Failed to log dose');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayDosesList = doses.filter(d => d.id.includes(today));
        const takenCount = todayDosesList.filter(d => d.status === 'taken').length;
        const totalCount = todayDosesList.length;
        const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

        return {
            takenCount,
            totalCount,
            progress,
            todayDosesList
        };
    }, [doses]);

    return {
        medications,
        doses: stats.todayDosesList,
        isLoading,
        isSaving,
        error,
        stats,
        addMedication,
        deleteMedication,
        logDose
    };
}
