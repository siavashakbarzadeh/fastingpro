'use client';

import { Button } from '@/components/ui/button';

const PLANS = [
    { id: 1, name: '16:8', desc: '16h fasting, 8h eating. The most popular method.', color: 'text-orange-400' },
    { id: 2, name: '18:6', desc: '18h fasting, 6h eating. For experienced fasters.', color: 'text-blue-400' },
    { id: 3, name: '20:4', desc: 'Warrior Diet. 20h fasting, small window.', color: 'text-purple-400' },
    { id: 4, name: 'OMAD', desc: 'One Meal A Day. 23h fasting.', color: 'text-red-400' },
];

export default function PlansPage() {
    return (
        <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">Fasting Plans</h1>

            <div className="grid gap-4">
                {PLANS.map((plan) => (
                    <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-xl font-bold ${plan.color}`}>{plan.name}</h3>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" className="h-8">Select</Button>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">{plan.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 mt-8">
                <h4 className="text-white font-medium mb-2">Custom Plan</h4>
                <p className="text-sm text-slate-500 mb-4">Set your own fasting and eating window duration.</p>
                <Button variant="outline" className="w-full">Create Custom Plan</Button>
            </div>
        </div>
    );
}
