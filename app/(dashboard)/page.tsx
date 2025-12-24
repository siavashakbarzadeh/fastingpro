'use client';

import { useEffect, useState } from 'react';
import FastingTimer from '@/components/fasting/timer';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function DashboardPage() {
    const [activeFast, setActiveFast] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchFast = async () => {
        try {
            const res = await api.get('/fasts/current');
            setActiveFast(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFast();
    }, []);

    const handleStart = async (planId: number = 1) => {
        // Default to 16:8 plan for demo (ID 1)
        try {
            await api.post('/fasts/start', {
                plan_id: planId,
                start_time: new Date().toISOString(),
                planned_duration_minutes: 16 * 60,
            });
            fetchFast();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="max-w-md mx-auto space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Today</h1>
                    <p className="text-slate-400 text-sm">Keep up the streak!</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <span className="text-orange-500 font-bold">🔥</span>
                </div>
            </header>

            <FastingTimer initialFast={activeFast} onRefresh={fetchFast} />

            {!activeFast && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-200">Start a Fast</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => handleStart(1)}
                            variant="outline"
                            className="h-auto py-4 flex flex-col gap-1 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-orange-500/50"
                        >
                            <span className="text-orange-400 font-bold text-lg">16:8</span>
                            <span className="text-xs text-slate-500">Popular</span>
                        </Button>
                        <Button
                            onClick={() => handleStart(2)}
                            variant="outline"
                            className="h-auto py-4 flex flex-col gap-1 border-slate-800 bg-slate-900/50 hover:bg-slate-800"
                        >
                            <span className="text-slate-200 font-bold text-lg">18:6</span>
                            <span className="text-xs text-slate-500">Advanced</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
