'use client';

import React from 'react';
import { User, Settings, Bell, Shield, HelpCircle, ChevronRight, LogOut, Flame, Target, Award, Calendar, Share2, Zap } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="bg-[#fcfdfe] min-h-screen animate-fade-in pb-20">
            {/* Profile Header */}
            <div className="bg-white px-6 pt-16 pb-10 rounded-b-[3rem] shadow-sm border-b border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                    <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors">
                        <Settings size={22} />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-32 h-32 rounded-[3rem] bg-gradient-to-tr from-[#00ca86] to-emerald-300 flex items-center justify-center text-white relative shadow-2xl shadow-emerald-500/20 group">
                        <User size={64} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg border-4 border-slate-50">
                            <div className="bg-orange-500 w-6 h-6 rounded-xl flex items-center justify-center">
                                <Zap size={14} className="text-white" fill="white" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Siavash Akbarzadeh</h1>
                        <p className="text-[#00ca86] font-black uppercase text-xs tracking-[0.2em] mt-1">Pro Member • Level 12</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-10">
                    <div className="bg-orange-50/50 p-5 rounded-[2rem] text-center space-y-1.5 border border-orange-100/50 group hover:bg-orange-50 transition-colors">
                        <Flame className="mx-auto text-orange-500 group-hover:scale-110 transition-transform" size={26} fill="currentColor" />
                        <div className="text-xl font-black text-slate-800">12d</div>
                        <div className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest">Streak</div>
                    </div>
                    <div className="bg-emerald-50/50 p-5 rounded-[2rem] text-center space-y-1.5 border border-emerald-100/50 group hover:bg-emerald-50 transition-colors">
                        <Target className="mx-auto text-emerald-500 group-hover:scale-110 transition-transform" size={26} />
                        <div className="text-xl font-black text-slate-800">85%</div>
                        <div className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Success</div>
                    </div>
                    <div className="bg-indigo-50/50 p-5 rounded-[2rem] text-center space-y-1.5 border border-indigo-100/50 group hover:bg-indigo-50 transition-colors">
                        <Award className="mx-auto text-indigo-500 group-hover:scale-110 transition-transform" size={26} />
                        <div className="text-xl font-black text-slate-800">18</div>
                        <div className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest">Awards</div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Stats Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em]">Summary</h3>
                        <button className="text-[#00ca86] font-black text-xs flex items-center">
                            Detail <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-lg">Weekly Report</h4>
                                <p className="text-slate-400 font-bold text-sm">Dec 18 - Dec 24, 2025</p>
                            </div>
                        </div>
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                            <ChevronRight size={20} strokeWidth={3} />
                        </div>
                    </div>
                </section>

                {/* Settings & Info */}
                <section className="space-y-4">
                    <h3 className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] px-2">Lifestyle</h3>
                    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-50">
                        {[
                            { icon: Bell, label: 'Reminders', color: 'text-orange-400', bg: 'bg-orange-50' },
                            { icon: Share2, label: 'Share with Friends', color: 'text-indigo-400', bg: 'bg-indigo-50' },
                            { icon: HelpCircle, label: 'Fasting Guide', color: 'text-emerald-400', bg: 'bg-emerald-50' },
                        ].map((item, i) => (
                            <button key={i} className={`w-full flex items-center gap-5 p-6 hover:bg-slate-50 transition-colors ${i !== 2 ? 'border-b border-slate-50' : ''}`}>
                                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                                    <item.icon size={20} strokeWidth={2.5} />
                                </div>
                                <span className="flex-1 text-left font-extrabold text-slate-700">{item.label}</span>
                                <ChevronRight className="text-slate-200" size={18} strokeWidth={3} />
                            </button>
                        ))}
                    </div>
                </section>

                <button className="w-full flex items-center justify-center gap-3 p-6 text-rose-500 font-black text-lg bg-white rounded-[2.5rem] shadow-sm border border-slate-50 hover:bg-rose-50 transition-colors mt-4">
                    <LogOut size={22} strokeWidth={3} />
                    Sign Out
                </button>
            </div>

            <div className="text-center py-10 opacity-30">
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">FastingPro Premium v1.0.0</p>
            </div>
        </div>
    );
}
