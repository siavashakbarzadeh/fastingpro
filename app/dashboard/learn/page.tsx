'use client';

import React from 'react';
import { BookOpen, GraduationCap, Play, ChevronRight, Search } from 'lucide-react';

export default function LearnPage() {
    return (
        <div className="p-6 space-y-8 animate-fade-in bg-white min-h-screen">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-800">Learn</h1>
                <button className="p-2 text-slate-400">
                    <Search size={24} />
                </button>
            </header>

            <div className="space-y-6">
                <div className="bg-[#eef2ff] rounded-3xl p-6 relative overflow-hidden group">
                    <div className="relative z-10 space-y-2">
                        <span className="bg-white/50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">New Course</span>
                        <h2 className="text-2xl font-black text-slate-800">Intermittent Fasting 101</h2>
                        <p className="text-slate-500 font-bold">Master the basics of fasting in just 5 days.</p>
                        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 mt-4 hover:scale-105 transition-transform">
                            <Play size={18} fill="currentColor" /> Start Now
                        </button>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
                </div>

                <section className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800">Articles for you</h3>
                    {[
                        { title: 'The Science of Autophagy', category: 'Health', time: '5 min read' },
                        { title: 'What to eat during your window', category: 'Nutrition', time: '8 min read' },
                        { title: 'How to manage hunger pangs', category: 'Mindset', time: '4 min read' },
                    ].map((article, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                                {i === 0 ? '🧬' : i === 1 ? '🥗' : '🧘'}
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{article.category}</span>
                                <h4 className="font-bold text-slate-800 leading-tight mb-1">{article.title}</h4>
                                <span className="text-xs text-slate-400 font-bold">{article.time}</span>
                            </div>
                            <div className="flex items-center">
                                <ChevronRight size={20} className="text-slate-300" />
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
