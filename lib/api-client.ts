import api from './api';

// --- Shared Types ---
export interface APIResponse<T> {
    data: T;
    message?: string;
}

// --- Calories Types ---
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodEntry {
    id: string;
    meal: MealType;
    name: string;
    calories: number;
    portion?: string;
}

export interface ExerciseEntry {
    id: string;
    name: string;
    durationMinutes: number;
    calories: number;
}

export interface DayData {
    date: string;
    goal: number;
    foods: FoodEntry[];
    exercises: ExerciseEntry[];
    isCompleted: boolean;
}

// --- Sleep Types ---
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export interface SleepLog {
    id: string;
    date: string;
    displayDate: string;
    bedTime: string;
    wakeTime: string;
    durationMinutes: number;
    quality: SleepQuality;
    timeToFallAsleep?: string;
    awakenings?: number;
    deepSleep?: number;
    remSleep?: number;
    notes?: string;
}

// --- Symptoms Types ---
export type DayRating = 'very_bad' | 'bad' | 'okay' | 'good' | 'great';
export type SymptomType = 'headache' | 'fatigue' | 'nausea' | 'shortness_of_breath' | 'fever_chills' | 'stomach_issues' | 'joint_muscle_pain' | 'none';

export interface DailyLog {
    id: string;
    date: string;
    displayDate: string;
    rating: DayRating;
    painLevel: number;
    symptoms: SymptomType[];
    note: string;
}

// --- Activity Types ---
export interface DailyActivityLog {
    id: string;
    date: string;
    displayDate: string;
    minutes: number;
    steps?: number;
    goalMet: boolean;
}

export interface ActivityHabit {
    id: string;
    text: string;
    completed: boolean;
}

// --- Medication Types ---
export type MedicationForm = 'tablet' | 'capsule' | 'liquid' | 'injection' | 'other';
export type Frequency = 'once_daily' | 'twice_daily' | 'three_times_daily' | 'as_needed';

export interface Medication {
    id: string;
    name: string;
    reason: string;
    dose: string;
    form: MedicationForm;
    frequency: Frequency;
    times: string[];
    remindersEnabled: boolean;
    reminderStyle: 'at_time' | '10_min_before' | '30_min_before';
}

export interface DoseInstance {
    id: string;
    medicationId: string;
    medicationName: string;
    dose: string;
    time: string;
    status: 'pending' | 'taken' | 'skipped';
}

// --- API Client Helpers ---
export const apiClient = {
    // Calories
    getCalories: async (date: string): Promise<DayData> => {
        const { data } = await api.get(`/calories?date=${date}`);
        return data;
    },
    saveFood: async (date: string, food: Omit<FoodEntry, 'id'>): Promise<FoodEntry> => {
        const { data } = await api.post(`/calories/food`, { date, ...food });
        return data;
    },
    deleteFood: async (id: string): Promise<void> => {
        await api.delete(`/calories/food/${id}`);
    },
    saveExercise: async (date: string, exercise: Omit<ExerciseEntry, 'id'>): Promise<ExerciseEntry> => {
        const { data } = await api.post(`/calories/exercise`, { date, ...exercise });
        return data;
    },
    deleteExercise: async (id: string): Promise<void> => {
        await api.delete(`/calories/exercise/${id}`);
    },

    // Sleep
    getSleepLogs: async (): Promise<SleepLog[]> => {
        const { data } = await api.get('/sleep');
        return data;
    },
    saveSleepLog: async (log: Omit<SleepLog, 'id'>): Promise<SleepLog> => {
        const { data } = await api.post('/sleep', log);
        return data;
    },
    deleteSleepLog: async (id: string): Promise<void> => {
        await api.delete(`/sleep/${id}`);
    },

    // Symptoms
    getSymptomLogs: async (): Promise<DailyLog[]> => {
        const { data } = await api.get('/symptoms');
        return data;
    },
    saveSymptomLog: async (log: Omit<DailyLog, 'id'>): Promise<DailyLog> => {
        const { data } = await api.post('/symptoms', log);
        return data;
    },

    // Activity
    getActivityLogs: async (): Promise<DailyActivityLog[]> => {
        const { data } = await api.get('/activity');
        return data;
    },
    saveActivityLog: async (log: Omit<DailyActivityLog, 'id'>): Promise<DailyActivityLog> => {
        const { data } = await api.post('/activity', log);
        return data;
    },

    // Medications
    getMedications: async (): Promise<Medication[]> => {
        const { data } = await api.get('/medications');
        return data;
    },
    saveMedication: async (med: Omit<Medication, 'id'>): Promise<Medication> => {
        const { data } = await api.post('/medications', med);
        return data;
    },
    deleteMedication: async (id: string): Promise<void> => {
        await api.delete(`/medications/${id}`);
    },
    logDose: async (doseId: string, status: 'taken' | 'skipped'): Promise<void> => {
        await api.post(`/medications/doses/${doseId}`, { status });
    },
};
