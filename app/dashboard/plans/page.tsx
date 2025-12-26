'use client';

import { Button } from '@/components/ui/Button';
import { ChevronRight, Zap, Target, Star } from 'lucide-react';

const PLANS = [
    { id: 1, name: '14:10', desc: '14h fasting, 10h eating. Great for beginners.', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: Target },
    { id: 2, name: '16:8', desc: '16h fasting, 8h eating. The most popular method.', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', icon: Star },
    { id: 3, name: '18:6', desc: '18h fasting, 6h eating. For experienced fasters.', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', icon: Zap },
    { id: 4, name: '20:4', desc: 'Warrior Diet. 20h fasting, small window.', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: Zap },
];

export default function PlansPage() {
    return (
        <div className="max-w-md mx-auto space-y-8 p-6 animate-fade-in">
            <header>
                <h1 className="text-3xl font-black text-slate-800">Fasting Plans</h1>
                <p className="text-slate-400 font-bold mt-1">Choose a rhythm that fits your life.</p>
            </header>

            <div className="grid gap-5">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`${plan.bg} ${plan.border} border-2 rounded-[2rem] p-6 hover:scale-[1.02] transition-all cursor-pointer group shadow-sm hover:shadow-md`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl bg-white shadow-sm ${plan.color}`}>
                                    <plan.icon size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className={`text-2xl font-black ${plan.color}`}>{plan.name}</h3>
                            </div>
                            <ChevronRight size={24} className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-slate-600 font-bold leading-relaxed">{plan.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 mt-10 hover:border-emerald-200 transition-colors group cursor-pointer">
                <div className="text-center">
                    <h4 className="text-slate-900 text-xl font-black mb-2">Custom Plan</h4>
                    <p className="text-slate-500 font-bold mb-6">Want something unique? Set your own fasting and eating windows.</p>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black text-lg hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm">
                        Create Custom Plan
                    </Button>
                </div>
            </div>
        </div>
    );
}
