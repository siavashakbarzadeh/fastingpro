import { useState, useEffect, useMemo } from 'react';
import { apiClient, DayData, FoodEntry, ExerciseEntry, MealType } from '@/lib/api-client';

export function useCalories(selectedDate: string) {
    const [data, setData] = useState<DayData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Load data
    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Attempt to fetch from API
            // const result = await apiClient.getCalories(selectedDate);
            // setData(result);

            // FALLBACK: Load from localStorage for demonstration/no-backend consistency
            const stored = localStorage.getItem(`calories_${selectedDate}`);
            if (stored) {
                setData(JSON.parse(stored));
            } else {
                // Initial Default State
                setData({
                    date: selectedDate,
                    goal: 2000,
                    foods: [],
                    exercises: [],
                    isCompleted: false
                });
            }
        } catch (err) {
            setError('Failed to load calories data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    // Save helper to persist changes
    const persistData = (newData: DayData) => {
        setData(newData);
        localStorage.setItem(`calories_${selectedDate}`, JSON.stringify(newData));
    };

    // Actions
    const addFood = async (meal: MealType, food: Omit<FoodEntry, 'id' | 'meal'>) => {
        if (!data) return;
        setIsSaving(true);
        try {
            // await apiClient.saveFood(selectedDate, { ...food, meal });

            const newEntry: FoodEntry = {
                id: Math.random().toString(36).substr(2, 9),
                meal,
                ...food
            };

            const updated = {
                ...data,
                foods: [...data.foods, newEntry]
            };
            persistData(updated);
            return true;
        } catch (err) {
            setError('Failed to add food');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const removeFood = async (id: string) => {
        if (!data) return;
        try {
            // await apiClient.deleteFood(id);
            const updated = {
                ...data,
                foods: data.foods.filter(f => f.id !== id)
            };
            persistData(updated);
        } catch (err) {
            setError('Failed to remove food');
        }
    };

    const addExercise = async (exercise: Omit<ExerciseEntry, 'id'>) => {
        if (!data) return;
        setIsSaving(true);
        try {
            const newEntry: ExerciseEntry = {
                id: Math.random().toString(36).substr(2, 9),
                ...exercise
            };
            const updated = {
                ...data,
                exercises: [...data.exercises, newEntry]
            };
            persistData(updated);
            return true;
        } catch (err) {
            setError('Failed to add exercise');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const removeExercise = async (id: string) => {
        if (!data) return;
        try {
            const updated = {
                ...data,
                exercises: data.exercises.filter(e => e.id !== id)
            };
            persistData(updated);
        } catch (err) {
            setError('Failed to remove exercise');
        }
    };

    const toggleComplete = () => {
        if (!data) return;
        const updated = { ...data, isCompleted: !data.isCompleted };
        persistData(updated);
    };

    // Derived Values
    const totals = useMemo(() => {
        if (!data) return { food: 0, exercise: 0, net: 0, remaining: 2000 };
        const food = data.foods.reduce((acc: number, f: FoodEntry) => acc + f.calories, 0);
        const exercise = data.exercises.reduce((acc: number, e: ExerciseEntry) => acc + e.calories, 0);
        const net = food - exercise;
        const remaining = data.goal - net;
        return { food, exercise, net, remaining };
    }, [data]);

    return {
        data,
        isLoading,
        error,
        isSaving,
        totals,
        addFood,
        removeFood,
        addExercise,
        removeExercise,
        toggleComplete,
        retry: loadData
    };
}
