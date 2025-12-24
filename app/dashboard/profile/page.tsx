'use client';

import React from 'react';
import { User, Settings, Bell, Shield, HelpCircle, ChevronRight, LogOut, Flame, Target, Award } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="bg-[#fcfdfe] min-h-screen animate-fade-in">
            {/* Profile Header */}
            <div className="bg-white px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-sm border-b border-slate-50">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#00ca86] to-emerald-300 flex items-center justify-center text-white relative">
                        <User size={48} strokeWidth={2.5} />
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-xl shadow-md">
                            <div className="bg-orange-500 w-4 h-4 rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">Siavash</h1>
                        <p className="text-slate-400 font-bold">Pro Member • Level 5</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-orange-50 p-4 rounded-3xl text-center space-y-1 border border-orange-100/50">
                        <Flame className="mx-auto text-orange-500" size={24} />
                        <div className="text-lg font-black text-slate-800">12d</div>
                        <div className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest">Streak</div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-3xl text-center space-y-1 border border-emerald-100/50">
                        <Target className="mx-auto text-emerald-500" size={24} />
                        <div className="text-lg font-black text-slate-800">85%</div>
                        <div className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Goal</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-3xl text-center space-y-1 border border-indigo-100/50">
                        <Award className="mx-auto text-indigo-500" size={24} />
                        <div className="text-lg font-black text-slate-800">4</div>
                        <div className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest">Badges</div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <section className="space-y-3">
                    <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] px-2">Account</h3>
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-50">
                        {[
                            { icon: Settings, label: 'Settings', color: 'text-slate-400' },
                            { icon: Bell, label: 'Notifications', color: 'text-slate-400' },
                            { icon: Shield, label: 'Privacy & Security', color: 'text-slate-400' },
                        ].map((item, i) => (
                            <button key={i} className={`w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors ${i !== 2 ? 'border-b border-slate-50' : ''}`}>
                                <item.icon className={item.color} size={22} />
                                <span className="flex-1 text-left font-bold text-slate-700">{item.label}</span>
                                <ChevronRight className="text-slate-200" size={20} />
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] px-2">Support</h3>
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-50">
                        <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-50">
                            <HelpCircle className="text-slate-400" size={22} />
                            <span className="flex-1 text-left font-bold text-slate-700">Help Center</span>
                            <ChevronRight className="text-slate-200" size={20} />
                        </button>
                        <button className="w-full flex items-center gap-4 p-5 text-rose-500 hover:bg-rose-50/50 transition-colors">
                            <LogOut size={22} />
                            <span className="flex-1 text-left font-bold">Sign Out</span>
                        </button>
                    </div>
                </section>
            </div>

            <div className="text-center pb-10">
                <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">FastingPro v1.0.0</p>
            </div>
        </div>
    );
}
