import { useState, useEffect, useMemo } from 'react';
import { apiClient, SleepLog } from '@/lib/api-client';

export interface Habit {
    id: string;
    text: string;
    completed: boolean;
}

const INITIAL_HABITS: Habit[] = [
    { id: '1', text: 'No caffeine 6h before bed', completed: false },
    { id: '2', text: 'Limited screens 1h before bed', completed: false },
    { id: '3', text: 'Consistent bedtime', completed: false },
    { id: '4', text: 'Bedroom dark & cool', completed: false },
    { id: '5', text: 'Relaxation routine (read, breathe)', completed: false },
];

export function useSleep() {
    const [logs, setLogs] = useState<SleepLog[]>([]);
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Persistence Keys
    const LOGS_KEY = 'go_healthing_sleep_logs';
    const HABITS_KEY = 'go_healthing_sleep_habits';

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Priority: Try to fetch from API
            // For now, we fallback to localStorage for persistence
            const savedLogs = localStorage.getItem(LOGS_KEY);
            const savedHabits = localStorage.getItem(HABITS_KEY);

            if (savedLogs) {
                setLogs(JSON.parse(savedLogs));
            } else {
                // Initial mock data if nothing saved
                const mockLogs: SleepLog[] = [
                    { id: '1', date: '2023-10-24', displayDate: 'Tue', bedTime: '23:00', wakeTime: '07:00', durationMinutes: 480, quality: 4, awakenings: 1, timeToFallAsleep: '15-30' },
                    { id: '2', date: '2023-10-25', displayDate: 'Wed', bedTime: '23:30', wakeTime: '06:30', durationMinutes: 420, quality: 3, awakenings: 2, timeToFallAsleep: '30-60' },
                    { id: '3', date: '2023-10-26', displayDate: 'Thu', bedTime: '00:15', wakeTime: '07:15', durationMinutes: 420, quality: 2, awakenings: 3, timeToFallAsleep: '>60' },
                    { id: '4', date: '2023-10-27', displayDate: 'Fri', bedTime: '22:45', wakeTime: '07:00', durationMinutes: 495, quality: 5, awakenings: 0, timeToFallAsleep: '0-15' },
                    { id: '5', date: '2023-10-28', displayDate: 'Sat', bedTime: '01:00', wakeTime: '09:00', durationMinutes: 480, quality: 4, awakenings: 1, timeToFallAsleep: '15-30' },
                    { id: '6', date: '2023-10-29', displayDate: 'Sun', bedTime: '23:00', wakeTime: '07:30', durationMinutes: 510, quality: 5, awakenings: 0, timeToFallAsleep: '0-15' },
                ];
                setLogs(mockLogs);
            }

            if (savedHabits) {
                setHabits(JSON.parse(savedHabits));
            }
        } catch (err) {
            setError('Failed to load sleep data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Derived Stats
    const stats = useMemo(() => {
        if (logs.length === 0) return { avgDuration: 0, avgQuality: '0.0' };
        const totalDuration = logs.reduce((acc: number, l: SleepLog) => acc + l.durationMinutes, 0);
        const totalQuality = logs.reduce((acc: number, l: SleepLog) => acc + l.quality, 0);
        return {
            avgDuration: totalDuration / logs.length,
            avgQuality: (totalQuality / logs.length).toFixed(1)
        };
    }, [logs]);

    const saveLog = async (log: Omit<SleepLog, 'id' | 'displayDate'>) => {
        setIsSaving(true);
        setError(null);
        try {
            // Simulate API call
            await new Promise(r => setTimeout(r, 800));

            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const displayDate = days[new Date(log.date).getDay()];

            const newLog: SleepLog = {
                ...log,
                id: Math.random().toString(36).substr(2, 9),
                displayDate
            };

            // Check if log for this date exists, update if so, else add
            const updatedLogs = [...logs];
            const existingIndex = updatedLogs.findIndex(l => l.date === log.date);

            if (existingIndex > -1) {
                updatedLogs[existingIndex] = newLog;
            } else {
                updatedLogs.push(newLog);
            }

            // Sort by date
            updatedLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setLogs(updatedLogs);
            localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
            return true;
        } catch (err) {
            setError('Failed to save sleep log');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const toggleHabit = (id: string) => {
        const updatedHabits = habits.map(h =>
            h.id === id ? { ...h, completed: !h.completed } : h
        );
        setHabits(updatedHabits);
        localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    };

    return {
        logs,
        habits,
        isLoading,
        isSaving,
        error,
        stats,
        saveLog,
        toggleHabit,
        retry: loadData
    };
}
