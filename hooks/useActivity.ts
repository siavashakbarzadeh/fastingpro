'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { DailyActivityLog, ActivityHabit } from '@/lib/api-client';

const HISTORY_KEY = 'go_healthing_activity_history';
const HABITS_KEY = 'go_healthing_activity_habits';
const GOAL_KEY = 'go_healthing_activity_goal';

const MOCK_HISTORY: DailyActivityLog[] = [
    { id: '1', date: '2023-10-24', displayDate: 'Tue', minutes: 25, goalMet: false },
    { id: '2', date: '2023-10-25', displayDate: 'Wed', minutes: 45, goalMet: true },
    { id: '3', date: '2023-10-26', displayDate: 'Thu', minutes: 30, goalMet: true },
    { id: '4', date: '2023-10-27', displayDate: 'Fri', minutes: 15, goalMet: false },
    { id: '5', date: '2023-10-28', displayDate: 'Sat', minutes: 60, goalMet: true },
    { id: '6', date: '2023-10-29', displayDate: 'Sun', minutes: 40, goalMet: true },
];

const INITIAL_HABITS: ActivityHabit[] = [
    { id: '1', text: 'Take a 10-minute walk', completed: false },
    { id: '2', text: 'Use stairs once today', completed: false },
    { id: '3', text: 'Stretch for 5 mins', completed: false },
    { id: '4', text: 'Stand up every hour', completed: false },
    { id: '5', text: 'Short home workout', completed: false },
];

export function useActivity() {
    const [history, setHistory] = useState<DailyActivityLog[]>([]);
    const [habits, setHabits] = useState<ActivityHabit[]>([]);
    const [goal, setGoal] = useState({ type: 'minutes', value: 30 });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        const loadData = () => {
            try {
                const storedHistory = localStorage.getItem(HISTORY_KEY);
                const storedHabits = localStorage.getItem(HABITS_KEY);
                const storedGoal = localStorage.getItem(GOAL_KEY);

                if (storedHistory) setHistory(JSON.parse(storedHistory));
                else setHistory(MOCK_HISTORY);

                if (storedHabits) setHabits(JSON.parse(storedHabits));
                else setHabits(INITIAL_HABITS);

                if (storedGoal) setGoal(JSON.parse(storedGoal));
            } catch (err) {
                console.error('Failed to load activity data', err);
                setError('Failed to load activity history');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const saveHistory = (newHistory: DailyActivityLog[]) => {
        setHistory(newHistory);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    };

    const saveHabits = (newHabits: ActivityHabit[]) => {
        setHabits(newHabits);
        localStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
    };

    const saveGoal = async (newGoal: { type: string, value: number }) => {
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 800)); // Simulate API
            setGoal(newGoal);
            localStorage.setItem(GOAL_KEY, JSON.stringify(newGoal));
            return true;
        } catch (err) {
            setError('Failed to save goal');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const addActivity = async (minutes: number, steps?: number) => {
        setIsSaving(true);
        try {
            await new Promise(r => setTimeout(r, 600)); // Simulate API
            const today = new Date().toISOString().split('T')[0];
            const displayDate = 'Today';

            const updatedHistory = [...history];
            const existingIndex = updatedHistory.findIndex(l => l.date === today);

            const newMinutes = (existingIndex > -1 ? updatedHistory[existingIndex].minutes : 0) + minutes;
            const newSteps = (existingIndex > -1 ? (updatedHistory[existingIndex].steps || 0) : 0) + (steps || 0);

            const newLog: DailyActivityLog = {
                id: (existingIndex > -1 ? updatedHistory[existingIndex].id : Date.now().toString()),
                date: today,
                displayDate,
                minutes: newMinutes,
                steps: newSteps,
                goalMet: newMinutes >= goal.value // Simple check
            };

            if (existingIndex > -1) {
                updatedHistory[existingIndex] = newLog;
            } else {
                updatedHistory.push(newLog);
            }

            saveHistory(updatedHistory);
            return true;
        } catch (err) {
            setError('Failed to save activity');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const toggleHabit = (id: string) => {
        const newHabits = habits.map((h: ActivityHabit) => h.id === id ? { ...h, completed: !h.completed } : h);
        saveHabits(newHabits);
    };

    const stats = useMemo(() => {
        if (history.length === 0) return { avgMinutes: 0, metGoalCount: 0, insights: [] as string[] };

        const totalMinutes = history.reduce((acc: number, l: DailyActivityLog) => acc + l.minutes, 0);
        const metGoalCount = history.filter((l: DailyActivityLog) => l.goalMet).length;
        const avgMinutes = Math.round(totalMinutes / history.length);

        const insights = [];
        if (metGoalCount >= 3) {
            insights.push(`You hit your goal on ${metGoalCount} of the last ${history.length} days!`);
        } else {
            insights.push(`You met your goal ${metGoalCount} times this week. Keep going!`);
        }

        const maxDay = history.reduce((prev: DailyActivityLog, curr: DailyActivityLog) => (prev.minutes > curr.minutes) ? prev : curr);
        if (maxDay.minutes > 0) {
            insights.push(`Your most active day was ${maxDay.displayDate} with ${maxDay.minutes} mins.`);
        }

        return {
            avgMinutes,
            metGoalCount,
            insights
        };
    }, [history, goal.value]);

    const retry = () => {
        setError(null);
        setIsLoading(true);
        // Trigger reload
    };

    return {
        history,
        habits,
        goal,
        isLoading,
        isSaving,
        error,
        stats,
        saveGoal,
        addActivity,
        toggleHabit,
        retry
    };
}
