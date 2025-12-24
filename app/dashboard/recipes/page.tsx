'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, History, ChevronRight, Play, Heart, Clock, Utensils, Zap } from 'lucide-react';

interface Recipe {
    id: string;
    title: string;
    image: string;
    isPro: boolean;
    duration?: string;
    kcal?: string;
}

interface Section {
    title: string;
    recipes: Recipe[];
}

const sections: Section[] = [
    {
        title: 'Salad',
        recipes: [
            { id: '1', title: 'Curry and Tuna Salad Roll', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', isPro: true },
            { id: '2', title: 'Grilled Chicken Caesar Salad', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80', isPro: true },
        ]
    },
    {
        title: 'Soup',
        recipes: [
            { id: '3', title: 'Tuscan Kale & Bean Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', isPro: true },
            { id: '4', title: 'Creamy Pumpkin Soup', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=80', isPro: true },
        ]
    },
    {
        title: 'Breakfast',
        recipes: [
            { id: '5', title: 'Soft-Scrambled Eggs', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', isPro: true },
            { id: '6', title: 'Spinach and Egg Sandwiches', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', isPro: true },
        ]
    },
    {
        title: 'Smoothie',
        recipes: [
            { id: '7', title: 'Cucumber Smoothie', image: 'https://images.unsplash.com/photo-1505252585441-df537f1e403d?w=400&q=80', isPro: true },
            { id: '8', title: 'Blueberry Matcha Shake', image: 'https://images.unsplash.com/photo-1502741221712-4299b4226d40?w=400&q=80', isPro: true },
        ]
    },
    {
        title: 'Main course',
        recipes: [
            { id: '9', title: 'Grilled Pork with Fresh Coconut Milk', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', isPro: true },
            { id: '10', title: 'Thai rice porridge with pork meatballs', image: 'https://images.unsplash.com/photo-1512058560366-cd242d4532be?w=400&q=80', isPro: true },
        ]
    }
];

const filters = [
    { label: 'Vegetarian', icon: '🥕' },
    { label: 'Vegan', icon: '🥦' },
    { label: 'Heart Healthy', icon: '🥗' },
    { label: 'Low Carb', icon: '🥩' },
];

export default function RecipesPage() {
    const [activeTab, setActiveTab] = useState<'recipes' | 'plans'>('recipes');

    return (
        <div className="min-h-screen bg-[#fcfdfe]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-50 px-6 py-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`text-2xl font-black transition-all ${activeTab === 'recipes' ? 'text-[#00ca86]' : 'text-slate-300'}`}
                        >
                            Recipes
                        </button>
                        <button
                            onClick={() => setActiveTab('plans')}
                            className={`text-2xl font-black transition-all ${activeTab === 'plans' ? 'text-[#00ca86]' : 'text-slate-300'}`}
                        >
                            Diet plans
                        </button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <History size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                    {filters.map((filter) => (
                        <button
                            key={filter.label}
                            className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2.5 rounded-full whitespace-nowrap shadow-sm hover:border-emerald-200 transition-all font-bold text-sm text-slate-700"
                        >
                            <span>{filter.icon}</span>
                            {filter.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="px-6 py-8 space-y-10">
                {/* Hero Banner */}
                <div className="relative h-48 rounded-[2.5rem] bg-[#ffba8c] overflow-hidden group shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent z-10" />
                    <div className="relative z-20 p-8 flex flex-col justify-center h-full max-w-[60%]">
                        <h2 className="text-white text-3xl font-black leading-tight drop-shadow-sm">
                            Tire of Cooking? <br /> Give This a Try!
                        </h2>
                    </div>
                    {/* Floating elements */}
                    <div className="absolute right-[-20px] bottom-[-20px] w-56 h-56 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center p-4">
                        <div className="relative w-full h-full">
                            <Image
                                src="https://images.unsplash.com/photo-1543353071-873f17a7a088?w=500&q=80"
                                alt="Featured"
                                fill
                                className="object-cover rounded-3xl rotate-3 scale-110 shadow-2xl border-4 border-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Sections */}
                {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-2xl font-black text-slate-800">{section.title}</h3>
                            <button className="flex items-center text-emerald-500 font-black text-sm hover:mr-1 transition-all">
                                See all <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide no-scrollbar">
                            {section.recipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="flex-shrink-0 w-64 group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                                        <Image
                                            src={recipe.image}
                                            alt={recipe.title}
                                            fill
                                            className="object-cover"
                                        />
                                        {recipe.isPro && (
                                            <div className="absolute top-4 right-4 bg-[#ffba83] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                                                PRO
                                            </div>
                                        )}
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <h4 className="font-extrabold text-slate-800 leading-tight px-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {recipe.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Feedback Section */}
                <div className="bg-emerald-50 rounded-[2.5rem] p-10 text-center space-y-6 mt-12 mb-10 border border-emerald-100">
                    <p className="text-slate-800 font-bold text-lg px-4">
                        Tell us the recipes you are interested in.
                    </p>
                    <button className="bg-[#00ca86] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 mx-auto">
                        <span className="text-xl">✍️</span> Feedback
                    </button>
                </div>
            </div>

            {/* Merry Christmas Banner (Mockup from screenshot) */}
            <div className="mx-6 mb-10 relative">
                <div className="bg-[#a81c07] rounded-3xl p-6 flex items-center justify-between text-white overflow-hidden shadow-2xl shadow-red-500/20">
                    <div className="absolute top-[-20%] left-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="space-y-1 relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-white/20 p-1.5 rounded-lg">🎄</span>
                            <h5 className="italic font-black text-lg tracking-tight">Merry Christmas</h5>
                        </div>
                        <p className="font-black text-2xl">Last sale in 2025</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="bg-white rounded-full p-3 shadow-lg group hover:bg-[#ffba8c] transition-colors">
                            <ChevronRight className="text-[#a81c07] stroke-[4]" />
                        </div>
                        <div className="bg-[#ffba8c] text-[#a81c07] font-black px-2 py-1 rounded-lg text-sm border-2 border-white shadow-xl">
                            75% OFF
                        </div>
                    </div>
                    {/* Snowflake decorations */}
                    <div className="absolute top-2 right-1/2 opacity-20 text-3xl">❄️</div>
                    <div className="absolute bottom-4 left-1/2 opacity-20 text-2xl">❄️</div>
                </div>
                <button className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 border-2 border-white shadow-lg">
                    <XCircle size={14} className="opacity-50" />
                </button>
            </div>
        </div>
    );
}

function XCircle({ size, className }: { size: number, className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    )
}
