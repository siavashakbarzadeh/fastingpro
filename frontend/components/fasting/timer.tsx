'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface FastingTimerProps {
    initialFast: any;
    onRefresh: () => void;
}

export default function FastingTimer({ initialFast, onRefresh }: FastingTimerProps) {
    const [elapsed, setElapsed] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!initialFast) {
            setElapsed(0);
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            const start = new Date(initialFast.start_time);
            const now = new Date();
            const diff = differenceInSeconds(now, start);

            const totalSeconds = initialFast.planned_duration_minutes * 60;
            const currentProgress = Math.min((diff / totalSeconds) * 100, 100);

            setElapsed(diff);
            setProgress(currentProgress);
        }, 1000);

        return () => clearInterval(interval);
    }, [initialFast]);

    const handleStop = async () => {
        try {
            await api.post('/fasts/end');
            onRefresh();
        } catch (error) {
            console.error(error);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!initialFast) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-8">
                <div className="w-64 h-64 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-900/50">
                    <div className="text-center">
                        <span className="text-slate-400 text-lg">Ready to fast?</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
            {/* Semi-Circle Progress Visualization (Simplified as CSS conic gradient) */}
            <div
                className="relative w-72 h-72 rounded-full flex items-center justify-center shadow-2xl shadow-orange-900/10"
                style={{
                    background: `conic-gradient(#ea580c ${progress}%, #1e293b 0)`
                }}
            >
                <div className="absolute inset-2 bg-slate-950 rounded-full flex flex-col items-center justify-center">
                    <span className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-1">Elapsed Time</span>
                    <span className="text-5xl font-bold font-mono tracking-tight text-white">
                        {formatTime(elapsed)}
                    </span>
                    <span className="text-slate-500 text-sm mt-2">
                        Goal: {initialFast.planned_duration_minutes / 60}h
                    </span>
                </div>
            </div>

            <Button onClick={handleStop} variant="destructive" size="lg" className="w-full max-w-xs animate-in fade-in slide-in-from-bottom-4">
                End Fast
            </Button>
        </div>
    );
}
