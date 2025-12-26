'use client';

import { useState, useEffect } from 'react';

export type BrushingStatus = "brushed" | "not_brushed";

export interface BrushingSummary {
    date: string; // YYYY-MM-DD
    status: BrushingStatus;
    streakDays: number;
    lastBrushed?: string;
}

interface BrushingHistoryEntry {
    date: string; // YYYY-MM-DD
    brushed: boolean;
}

const STORAGE_KEY = 'brushingHistory';
const WARNING_HOUR = 21; // 9 PM

function getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function calculateStreak(history: BrushingHistoryEntry[]): number {
    if (history.length === 0) return 0;

    // Sort by date descending
    const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    let expectedDate = new Date();

    for (const entry of sorted) {
        const entryDate = new Date(entry.date + 'T00:00:00');
        const expectedDateStr = expectedDate.toISOString().split('T')[0];

        if (entry.date === expectedDateStr && entry.brushed) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (entry.date < expectedDateStr) {
            // Gap found, streak ends
            break;
        }
    }

    return streak;
}

function loadHistory(): BrushingHistoryEntry[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to load brushing history:', e);
        return [];
    }
}

function saveHistory(history: BrushingHistoryEntry[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save brushing history:', e);
    }
}

export function useBrushingTracker() {
    const [summary, setSummary] = useState<BrushingSummary>(() => {
        const today = getTodayDate();
        const history = loadHistory();
        const todayEntry = history.find(e => e.date === today);
        const streak = calculateStreak(history);
        const lastBrushedEntry = history
            .filter(e => e.brushed)
            .sort((a, b) => b.date.localeCompare(a.date))[0];

        return {
            date: today,
            status: todayEntry?.brushed ? 'brushed' : 'not_brushed',
            streakDays: streak,
            lastBrushed: lastBrushedEntry?.date,
        };
    });

    const [isTodayLateWarning, setIsTodayLateWarning] = useState(false);

    // Check for late warning
    useEffect(() => {
        const checkWarning = () => {
            const now = new Date();
            const isLate = now.getHours() >= WARNING_HOUR;
            const notBrushed = summary.status === 'not_brushed';
            setIsTodayLateWarning(isLate && notBrushed);
        };

        checkWarning();
        const interval = setInterval(checkWarning, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [summary.status]);

    // Listen for storage changes (cross-tab sync)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                const today = getTodayDate();
                const history = loadHistory();
                const todayEntry = history.find(entry => entry.date === today);
                const streak = calculateStreak(history);
                const lastBrushedEntry = history
                    .filter(e => e.brushed)
                    .sort((a, b) => b.date.localeCompare(a.date))[0];

                setSummary({
                    date: today,
                    status: todayEntry?.brushed ? 'brushed' : 'not_brushed',
                    streakDays: streak,
                    lastBrushed: lastBrushedEntry?.date,
                });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const logTodayBrushed = () => {
        const today = getTodayDate();
        const history = loadHistory();

        // Update or add today's entry
        const existingIndex = history.findIndex(e => e.date === today);
        if (existingIndex >= 0) {
            history[existingIndex].brushed = true;
        } else {
            history.push({ date: today, brushed: true });
        }

        saveHistory(history);

        // Recalculate summary
        const streak = calculateStreak(history);
        const lastBrushedEntry = history
            .filter(e => e.brushed)
            .sort((a, b) => b.date.localeCompare(a.date))[0];

        setSummary({
            date: today,
            status: 'brushed',
            streakDays: streak,
            lastBrushed: lastBrushedEntry?.date,
        });

        // Trigger storage event for same-page updates
        window.dispatchEvent(new Event('storage'));
    };

    return {
        summary,
        logTodayBrushed,
        isTodayLateWarning,
    };
}
