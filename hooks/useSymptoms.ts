import { useState, useEffect, useMemo } from 'react';
import { apiClient, DailyLog, SymptomType, DayRating } from '@/lib/api-client';

export const SYMPTOM_LABELS: Record<SymptomType, string> = {
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

export function useSymptoms() {
    const [history, setHistory] = useState<DailyLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const HISTORY_KEY = 'go_healthing_symptom_history';

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const savedHistory = localStorage.getItem(HISTORY_KEY);
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            } else {
                // Initial mock data
                const mockHistory: DailyLog[] = [
                    { id: '1', date: '2023-10-24', displayDate: 'Tue', rating: 'good', painLevel: 2, symptoms: [], note: '' },
                    { id: '2', date: '2023-10-25', displayDate: 'Wed', rating: 'okay', painLevel: 4, symptoms: ['headache'], note: 'Stressful work day' },
                    { id: '3', date: '2023-10-26', displayDate: 'Thu', rating: 'bad', painLevel: 6, symptoms: ['headache', 'fatigue'], note: 'Had to lie down' },
                    { id: '4', date: '2023-10-27', displayDate: 'Fri', rating: 'okay', painLevel: 3, symptoms: ['fatigue'], note: '' },
                    { id: '5', date: '2023-10-28', displayDate: 'Sat', rating: 'good', painLevel: 1, symptoms: [], note: 'Walked 5km' },
                    { id: '6', date: '2023-10-29', displayDate: 'Sun', rating: 'good', painLevel: 0, symptoms: [], note: '' },
                    { id: '7', date: '2023-10-30', displayDate: 'Yesterday', rating: 'okay', painLevel: 3, symptoms: ['joint_muscle_pain'], note: 'Gym soreness' },
                ];
                setHistory(mockHistory);
            }
        } catch (err) {
            setError('Failed to load history');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const saveLog = async (log: Omit<DailyLog, 'id' | 'displayDate'>) => {
        setIsSaving(true);
        setError(null);
        try {
            await new Promise(r => setTimeout(r, 1200));

            const newLog: DailyLog = {
                ...log,
                id: Math.random().toString(36).substr(2, 9),
                displayDate: 'Today'
            };

            const updatedHistory = [...history];
            const existingIndex = updatedHistory.findIndex(l => l.date === log.date);

            if (existingIndex > -1) {
                updatedHistory[existingIndex] = newLog;
            } else {
                updatedHistory.push(newLog);
            }

            // Keep last 14 days for history
            const sorted = updatedHistory
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(-14);

            setHistory(sorted);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(sorted));
            return true;
        } catch (err) {
            setError('Failed to save log');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const stats = useMemo(() => {
        if (history.length === 0) return {
            avgPain: '0.0',
            avgRating: '0.0',
            frequentSymptoms: [] as { symptom: SymptomType, count: number }[],
            doctorSummary: '',
            insights: [] as string[]
        };

        const totalPain = history.reduce((acc: number, l: DailyLog) => acc + l.painLevel, 0);
        const totalRating = history.reduce((acc: number, l: DailyLog) => acc + (RATING_SCORE[l.rating] || 0), 0);

        // Frequent Symptoms
        const counts: Record<string, number> = {};
        history.forEach((log: DailyLog) => {
            log.symptoms.forEach((s: SymptomType) => {
                if (s !== 'none') {
                    counts[s] = (counts[s] || 0) + 1;
                }
            });
        });
        const frequentSymptoms = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([symptom, count]) => ({ symptom: symptom as SymptomType, count }));

        // Doctor Summary
        const badDays = history.filter((l: DailyLog) => l.rating === 'bad' || l.rating === 'very_bad').length;
        const symptomsText = frequentSymptoms.length > 0
            ? `Most frequent symptoms were ${frequentSymptoms.map(f => SYMPTOM_LABELS[f.symptom].toLowerCase()).join(', ')}.`
            : "No significant symptoms reported.";
        const doctorSummary = `In the last ${history.length} days, user reported ${badDays} days rated as 'bad' or 'very bad'. ${symptomsText} Average pain level was ${(totalPain / history.length).toFixed(1)}/10.`;

        // Insights
        const insights: string[] = [];
        const fatigueCount = history.filter((l: DailyLog) => l.symptoms.includes('fatigue')).length;
        if (fatigueCount > 2) insights.push(`You reported fatigue on ${fatigueCount} of the last ${history.length} days.`);
        insights.push(`Average day rating this week: ${(totalRating / history.length).toFixed(1)} / 5.`);
        const headacheDays = history.filter((l: DailyLog) => l.symptoms.includes('headache'));
        if (headacheDays.length > 0) {
            insights.push("Headaches were present on " + headacheDays.map((d: DailyLog) => d.displayDate).join(' and ') + ".");
        }

        return {
            avgPain: (totalPain / history.length).toFixed(1),
            avgRating: (totalRating / history.length).toFixed(1),
            frequentSymptoms,
            doctorSummary,
            insights: insights.slice(0, 3)
        };
    }, [history]);

    return {
        history,
        isLoading,
        isSaving,
        error,
        stats,
        saveLog,
        retry: loadData
    };
}
