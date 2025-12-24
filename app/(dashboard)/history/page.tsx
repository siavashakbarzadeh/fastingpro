'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { differenceInMinutes, format } from 'date-fns';

export default function HistoryPage() {
    const [fasts, setFasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/fasts');
                setFasts(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading history...</div>;

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">History</h1>

            <div className="space-y-4">
                {fasts.length === 0 ? (
                    <div className="text-center p-8 bg-slate-900 rounded-xl border border-slate-800">
                        <p className="text-slate-500">No fasts recorded yet.</p>
                    </div>
                ) : (
                    fasts.map((fast: any) => {
                        const start = new Date(fast.start_time);
                        const end = fast.end_time ? new Date(fast.end_time) : null;
                        const duration = end ? differenceInMinutes(end, start) / 60 : 0;

                        return (
                            <div key={fast.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center transition-colors hover:border-slate-700">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">
                                        {format(start, 'MMM d, yyyy')}
                                    </div>
                                    <div className="text-white font-medium">
                                        {fast.plan?.name || 'Custom Fast'}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {format(start, 'HH:mm')} - {end ? format(end, 'HH:mm') : 'Ongoing'}
                                    </div>
                                </div>

                                <div className="text-right">
                                    {fast.status === 'completed' ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-bold text-orange-500">
                                                {duration.toFixed(1)}h
                                            </span>
                                            <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full mt-1">
                                                Completed
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm px-3 py-1 bg-green-900/30 text-green-400 rounded-full">
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
