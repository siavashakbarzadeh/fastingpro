'use client';

import React from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Calendar,
    Heart,
    Sparkles,
    Baby,
    Clock,
    Utensils,
    Brain,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

export default function GetPregnantPage() {
    return (
        <div className="min-h-screen bg-[#fffafa]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-50 px-4 py-4">
                <div className="max-w-md mx-auto flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-pink-50 rounded-full transition-colors text-pink-500">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">Conception Journey</h1>
                </div>
            </header>

            <div className="max-w-md mx-auto px-4 py-6 space-y-8 pb-32">
                {/* Hero Banner */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 to-rose-300 p-8 text-white shadow-xl shadow-pink-100">
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="bg-white/20 backdrop-blur-sm self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Goal: Get Pregnant
                        </div>
                        <h2 className="text-3xl font-black leading-tight">Your path to motherhood starts here.</h2>
                        <p className="text-pink-50/90 text-sm leading-relaxed">
                            Support your fertility with optimized fasting, nutrition, and cycle tracking.
                        </p>
                        <button className="bg-white text-rose-500 font-bold py-3 px-6 rounded-2xl shadow-lg shadow-rose-900/10 active:scale-95 transition-transform text-sm self-start">
                            View Today's Plan
                        </button>
                    </div>
                    <div className="absolute top-[-20%] right-[-10%] opacity-20">
                        <Baby size={200} />
                    </div>
                </section>

                {/* Fertility Window (Mock) */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-1">
                        <Calendar className="text-pink-500" size={20} />
                        Your Fertility Window
                    </h3>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase">Estimated Ovulation</p>
                                <p className="text-2xl font-black text-slate-800">Dec 28 - Jan 02</p>
                            </div>
                            <div className="bg-pink-50 text-pink-500 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                                High Probability
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {[24, 25, 26, 27, 28, 29, 30].map((day, i) => (
                                <div key={i} className={`flex-1 flex flex-col items-center gap-2 p-2 rounded-2xl ${i === 4 ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                    <span className="text-[10px] font-bold uppercase">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
                                    <span className="text-sm font-black">{day}</span>
                                    {i >= 4 && <div className="w-1 h-1 bg-white rounded-full" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Daily Conception Tasks */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-lg font-bold text-slate-800">Today's Tasks</h3>
                        <span className="text-pink-500 text-xs font-bold">2/4 Done</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { icon: Sparkles, label: 'Take prenatal vitamins', done: true, color: 'bg-purple-50 text-purple-500' },
                            { icon: Clock, label: 'Fasting window (14:10)', done: true, color: 'bg-emerald-50 text-emerald-500' },
                            { icon: Heart, label: 'Check basal temperature', done: false, color: 'bg-rose-50 text-rose-500' },
                            { icon: Utensils, label: 'Hydration 2.5L', done: false, color: 'bg-blue-50 text-blue-500' },
                        ].map((task, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-50 group active:scale-[0.98] transition-transform">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${task.color}`}>
                                        <task.icon size={20} />
                                    </div>
                                    <span className={`font-bold text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        {task.label}
                                    </span>
                                </div>
                                {task.done ? (
                                    <CheckCircle2 size={24} className="text-emerald-500" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-pink-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Educational Hub */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 px-1">Knowledge Hub</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { title: 'Fasting & Egg Quality', icon: Brain, color: 'from-blue-400 to-indigo-300' },
                            { title: 'Detox for Conception', icon: Sparkles, color: 'from-amber-400 to-orange-300' },
                            { title: 'Sleep & Hormones', icon: Clock, color: 'from-indigo-400 to-purple-300' },
                            { title: 'Fertility Superfoods', icon: Utensils, color: 'from-emerald-400 to-teal-300' },
                        ].map((item, i) => (
                            <div key={i} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.color} p-4 aspect-square flex flex-col justify-between text-white shadow-lg active:scale-95 transition-transform cursor-pointer`}>
                                <div className="bg-white/20 backdrop-blur-sm self-start p-2 rounded-xl">
                                    <item.icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm leading-tight">{item.title}</p>
                                    <ArrowRight size={16} className="opacity-70" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Expert Corner */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor" alt="Doctor" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-pink-500 uppercase tracking-tight">Expert Advice</p>
                        <p className="text-sm font-bold text-slate-800 leading-tight mb-1">Dr. Sara's Fertility Protocol</p>
                        <p className="text-[10px] text-slate-400">Personalized fasting plan for your cycle.</p>
                    </div>
                    <ArrowRight size={20} className="text-slate-300" />
                </section>
            </div>
        </div>
    );
}
