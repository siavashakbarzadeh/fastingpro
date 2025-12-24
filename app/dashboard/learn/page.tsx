'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronRight, Search, History, GraduationCap, Pill, Apple, Activity, Users, Lightbulb } from 'lucide-react';

interface Article {
    id: string;
    title: string;
    image: string;
    isPro: boolean;
}

interface Section {
    title: string;
    articles: Article[];
}

const sections: Section[] = [
    {
        title: "Beginner's Guide",
        articles: [
            { id: 'bg1', title: "What's intermittent fasting?", image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', isPro: false },
            { id: 'bg2', title: "How does intermittent fasting work?", image: 'https://images.unsplash.com/photo-1512058560366-cd242d4532be?w=400&q=80', isPro: false },
        ]
    },
    {
        title: "Benefits of Fasting",
        articles: [
            { id: 'bf1', title: "The metabolic advantage", image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', isPro: false },
            { id: 'bf2', title: "Benefits of Fasting", image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=80', isPro: true },
        ]
    },
    {
        title: "Weight Loss for Women",
        articles: [
            { id: 'wlw1', title: "How much weight should I lose in a mon...", image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80', isPro: true },
            { id: 'wlw2', title: "Intermittent fasting suggestions for wom...", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', isPro: false },
        ]
    },
    {
        title: "Common Issues of Fasting",
        articles: [
            { id: 'cif1', title: "What if you \"accidentally\" eat so...", image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&q=80', isPro: false },
            { id: 'cif2', title: "Balancing fasting with work", image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80', isPro: false },
        ]
    },
    {
        title: "Eating and Fasting",
        articles: [
            { id: 'eaf1', title: "What can I eat while intermittent fasting?", image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80', isPro: false },
            { id: 'eaf2', title: "What is the best time to eat for you?", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', isPro: true },
        ]
    },
    {
        title: "Fasting for Wellness",
        articles: [
            { id: 'ffw1', title: "Does exercise burn more calories?", image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80', isPro: false },
            { id: 'ffw2', title: "How effective is the exercise?", image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', isPro: false },
        ]
    }
];

const filters = [
    { label: 'Diet', icon: '🍳' },
    { label: 'Beginner', icon: '🌱' },
    { label: 'Weight Loss', icon: '⚖️' },
    { label: 'Satisfaction', icon: '😊' },
];

export default function LearnPage() {
    return (
        <div className="min-h-screen bg-[#fcfdfe] pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-50">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Learn</h1>
                <button className="p-2 text-slate-800 hover:text-emerald-500 transition-colors">
                    <Star size={26} strokeWidth={2.5} />
                </button>
            </header>

            <div className="px-6 py-8 space-y-10">
                {/* Hero Slider / Banner */}
                <div className="relative aspect-[16/9] rounded-[2.5rem] bg-[#ffba8c] overflow-hidden shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent z-10" />
                    <div className="relative z-20 p-8 flex flex-col justify-center h-full max-w-[60%]">
                        <h2 className="text-white text-3xl font-black leading-tight drop-shadow-sm">
                            Things that <br /> Beginner Must <br /> Know
                        </h2>
                    </div>
                    {/* Floating elements from screenshot */}
                    <div className="absolute right-[-10%] top-[-10%] w-[70%] h-[120%] z-15">
                        <div className="relative w-full h-full">
                            <Image
                                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
                                alt="Beginner Guide"
                                fill
                                className="object-cover rounded-l-full rotate-2"
                            />
                        </div>
                    </div>
                    {/* Dots indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                        <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                        <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                        <div className="w-6 h-2 rounded-full bg-white" />
                        <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-6 px-6">
                    {filters.map((filter) => (
                        <button
                            key={filter.label}
                            className="flex items-center gap-2 bg-[#f0f9ff] border border-transparent px-5 py-3 rounded-2xl whitespace-nowrap hover:bg-[#e0f2fe] transition-all font-bold text-sm text-[#0c4a6e] shadow-sm"
                        >
                            <span className="text-base">{filter.icon}</span>
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Article Sections */}
                {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-2xl font-black text-slate-800">{section.title}</h3>
                            <button className="flex items-center text-[#00ca86] font-black text-sm hover:translate-x-1 transition-transform">
                                See all <ChevronRight size={18} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide no-scrollbar">
                            {section.articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="flex-shrink-0 w-64 group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] bg-slate-100">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        />
                                        {article.isPro && (
                                            <div className="absolute top-4 right-4 bg-[#ffecd1]/95 backdrop-blur-sm text-[#ffba8c] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                                                PRO
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-extrabold text-[#0f172a] leading-tight px-1 group-hover:text-emerald-600 transition-colors line-clamp-2 text-lg">
                                        {article.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Feedback Section */}
                <div className="bg-[#f0f9ff] rounded-[3rem] p-10 text-center space-y-8 mt-12 mb-10 border border-[#e0f2fe]">
                    <p className="text-[#0c4a6e] font-bold text-xl px-4 leading-relaxed">
                        Tell us the articles you are interested in.
                    </p>
                    <button className="bg-[#00ca86] text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3 mx-auto">
                        <span className="text-2xl">✍️</span> Feedback
                    </button>
                </div>
            </div>

            {/* Amazon Ad Mockup from screenshot */}
            <div className="fixed bottom-[96px] left-0 right-0 z-40 px-4">
                <div className="bg-gradient-to-r from-[#ff8a65] to-[#ff5722] rounded-2xl p-4 shadow-xl flex items-center justify-between group overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-inner flex items-center justify-center text-2xl">
                            🎄
                        </div>
                        <div className="text-white">
                            <p className="font-black text-lg leading-none">Natale con decori speciali</p>
                            <p className="text-white/80 font-bold text-xs mt-1">Sponsorizzato da Amazon</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                            alt="Amazon"
                            width={80}
                            height={25}
                            className="brightness-0 invert opacity-80"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
