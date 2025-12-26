'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    BookOpen,
    Clock,
    Bookmark,
    X,
    ChevronRight,
    Filter,
    Sparkles,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// --- Types ---

type Topic =
    | "all"
    | "sleep"
    | "activity"
    | "dental"
    | "medications"
    | "symptoms"
    | "period_pregnancy"
    | "sexual_health"
    | "body_literacy";

interface LearnArticle {
    id: string;
    title: string;
    topic: Topic;
    summary: string;
    readMinutes: number;
    recommended?: boolean;
    sections: { heading: string; body: string }[];
}

// --- Mock Data ---

const ARTICLES: LearnArticle[] = [
    {
        id: '1',
        title: 'Why Sleep Hygiene Matters',
        topic: 'sleep',
        summary: 'Discover how small changes to your bedtime routine can drastically improve your sleep quality.',
        readMinutes: 4,
        recommended: true,
        sections: [
            { heading: 'The Sleep Cycle', body: 'Understanding your circadian rhythm is key to waking up refreshed. Regular sleep times help regulate your body clock.' },
            { heading: 'Blue Light', body: 'Exposure to screens before bed can disrupt melatonin production. Try to avoid screens 1 hour before sleep.' },
            { heading: 'Temperature', body: 'A cooler room (around 18-20°C) is generally optimal for deep sleep.' }
        ]
    },
    {
        id: '2',
        title: 'Gentle Movement for Energy',
        topic: 'activity',
        summary: 'You don’t need a gym. Learn how daily walks and stretching can boost your energy levels.',
        readMinutes: 3,
        recommended: true,
        sections: [
            { heading: 'Movement vs. Exercise', body: 'You don’t need intense workouts to feel better. "Movement snacks" throughout the day add up.' },
            { heading: 'Walking Benefits', body: 'A 10-minute walk after meals can help manage blood sugar levels and digestion.' }
        ]
    },
    {
        id: '3',
        title: 'Tracking Your Cycle',
        topic: 'period_pregnancy',
        summary: 'How to use symptom tracking to predict your cycle and understand your body’s signals.',
        readMinutes: 5,
        recommended: false,
        sections: [
            { heading: 'Phases of the Cycle', body: 'The menstrual cycle has four phases: Menstrual, Follicular, Ovulation, and Luteal. Each brings different energy levels.' },
            { heading: 'What to Track', body: 'Note your mood, energy, discharge, and physical symptoms daily to see patterns over time.' }
        ]
    },
    {
        id: '4',
        title: 'Dental Health & Heart Connection',
        topic: 'dental',
        summary: 'Did you know your oral health can impact your cardiovascular system? Here’s the science.',
        readMinutes: 4,
        recommended: false,
        sections: [
            { heading: 'The Oral-Systemic Link', body: 'Inflammation in the gums can contribute to inflammation elsewhere in the body, including effects on heart health.' },
            { heading: 'Daily Habits', body: 'Flossing isn’t just for teeth; it reduces gum inflammation that can enter the bloodstream.' }
        ]
    },
    {
        id: '5',
        title: 'Managing Medication Schedules',
        topic: 'medications',
        summary: 'Tips for never missing a dose and understanding interactions.',
        readMinutes: 3,
        recommended: false,
        sections: [
            { heading: 'Consistency is Key', body: 'Taking medication at the same time daily helps maintain stable levels in your body.' },
            { heading: 'Tools to Help', body: 'Pill organizers and phone reminders are simple but effective ways to stay on track.' }
        ]
    },
    {
        id: '6',
        title: 'When to Seek Help',
        topic: 'symptoms',
        summary: 'Red flags you shouldn’t ignore when tracking your daily symptoms.',
        readMinutes: 2,
        recommended: true,
        sections: [
            { heading: 'Listen to Your Body', body: 'Persistent pain, sudden weight changes, or high fevers always warrant a check-up.' },
            { heading: 'Journaling', body: 'Bring your symptom log to your doctor; it provides concrete data rather than just memory.' }
        ]
    },
    {
        title: 'Understanding Libido',
        id: '7',
        topic: 'sexual_health',
        summary: 'Factors that influence your drive and how they change over time.',
        readMinutes: 4,
        recommended: false,
        sections: [
            { heading: 'It fluctuates', body: 'Libido is not static. Stress, hormones, and sleep all play huge roles.' },
            { heading: 'Communication', body: 'Discussing changes with your partner is the first step to intimacy.' }
        ]
    },
    {
        id: '8',
        title: 'Body Literacy 101',
        topic: 'body_literacy',
        summary: 'Learning the language of your own body signals.',
        readMinutes: 5,
        recommended: false,
        sections: [
            { heading: 'Vital Signs', body: 'Heart rate, temperature, and cycle length are all vital signs that tell a story about your health.' },
            { heading: 'Agency', body: 'Knowing your body gives you agency in healthcare decisions.' }
        ]
    }
];

const TOPICS: { id: Topic; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'activity', label: 'Activity' },
    { id: 'dental', label: 'Dental' },
    { id: 'medications', label: 'Meds' },
    { id: 'symptoms', label: 'Symptoms' },
    { id: 'period_pregnancy', label: 'Period & Pregnancy' },
    { id: 'sexual_health', label: 'Sexual Health' },
    { id: 'body_literacy', label: 'Body Insight' },
];

export default function LearnPage() {
    const [selectedTopic, setSelectedTopic] = useState<Topic>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [openArticleId, setOpenArticleId] = useState<string | null>(null);

    // --- Filtering Logic ---

    const filteredArticles = useMemo(() => {
        return ARTICLES.filter(article => {
            const matchesTopic = selectedTopic === 'all' || article.topic === selectedTopic;
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTopic && matchesSearch;
        });
    }, [selectedTopic, searchQuery]);

    const recommendedArticles = useMemo(() => {
        // If a topic is selected, recommend from that topic, otherwise generic recommended
        if (selectedTopic !== 'all') {
            return ARTICLES.filter(a => a.topic === selectedTopic && a.recommended).slice(0, 3);
        }
        return ARTICLES.filter(a => a.recommended).slice(0, 3);
    }, [selectedTopic]);

    const savedArticles = useMemo(() => {
        return ARTICLES.filter(a => savedIds.includes(a.id));
    }, [savedIds]);

    const activeArticle = useMemo(() => {
        return ARTICLES.find(a => a.id === openArticleId);
    }, [openArticleId]);

    // --- Handlers ---

    const toggleSave = (e: React.MouseEvent<HTMLElement>, id: string) => {
        e.stopPropagation();
        setSavedIds((prev: string[]) =>
            prev.includes(id) ? prev.filter((sid: string) => sid !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 relative">

            {/* Header */}
            <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-slate-100">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        <h1 className="text-xl font-black text-slate-800">Learn</h1>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <BookOpen size={20} />
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="max-w-xl mx-auto px-6 pb-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-slate-700 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {TOPICS.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => setSelectedTopic(topic.id)}
                                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border ${selectedTopic === topic.id
                                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'
                                    }`}
                            >
                                {topic.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-6 space-y-8">

                {/* Saved For Later (if any) */}
                {savedArticles.length > 0 && searchQuery === '' && selectedTopic === 'all' && (
                    <section>
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <Bookmark size={16} className="text-indigo-500" />
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Saved For Later</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                            {savedArticles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => setOpenArticleId(article.id)}
                                    className="min-w-[200px] bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform"
                                >
                                    <div className="mb-2">
                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                            {TOPICS.find(t => t.id === article.topic)?.label}
                                        </span>
                                        <h3 className="font-black text-slate-800 line-clamp-2 leading-tight">{article.title}</h3>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            <Clock size={10} /> {article.readMinutes} min
                                        </span>
                                        <button onClick={(e) => toggleSave(e, article.id)} className="text-indigo-500">
                                            <Bookmark size={16} fill="currentColor" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommended */}
                {recommendedArticles.length > 0 && searchQuery === '' && (
                    <section>
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <Sparkles size={16} className="text-amber-500" />
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Recommended For You</h2>
                        </div>
                        <div className="space-y-4">
                            {recommendedArticles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => setOpenArticleId(article.id)}
                                    className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="relative z-10">
                                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white mb-3 inline-block">
                                            {TOPICS.find(t => t.id === article.topic)?.label}
                                        </span>
                                        <h3 className="text-xl font-black mb-2">{article.title}</h3>
                                        <p className="text-indigo-100 text-sm font-medium line-clamp-2 mb-4 leading-relaxed opacity-90">{article.summary}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold flex items-center gap-1.5 bg-black/10 px-3 py-1.5 rounded-full">
                                                <Clock size={12} /> {article.readMinutes} min read
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <ChevronRight size={18} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative bubbles */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/30 rounded-full blur-xl -ml-5 -mb-5" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Articles Grid */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-black text-slate-800">
                            {searchQuery ? 'Search Results' : (selectedTopic === 'all' ? 'Latest Articles' : `${TOPICS.find(t => t.id === selectedTopic)?.label} Articles`)}
                        </h2>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{filteredArticles.length}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => setOpenArticleId(article.id)}
                                    className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm hover:border-indigo-50 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${article.topic === 'sleep' ? 'bg-indigo-50 text-indigo-500' :
                                            article.topic === 'activity' ? 'bg-emerald-50 text-emerald-500' :
                                                article.topic === 'symptoms' ? 'bg-rose-50 text-rose-500' :
                                                    'bg-slate-100 text-slate-500'
                                            }`}>
                                            {TOPICS.find(t => t.id === article.topic)?.label}
                                        </span>
                                        <button
                                            onClick={(e) => toggleSave(e, article.id)}
                                            className={`transition-colors ${savedIds.includes(article.id) ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-400'}`}
                                        >
                                            <Bookmark size={20} fill={savedIds.includes(article.id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>

                                    <h3 className="font-black text-slate-800 text-lg mb-2 leading-tight group-hover:text-indigo-700 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-4 flex-1">
                                        {article.summary}
                                    </p>

                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wide pt-4 border-t border-slate-50">
                                        <Clock size={12} /> {article.readMinutes} min read
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-400">
                                <Filter className="mx-auto w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold">No articles found matching that.</p>
                                <button onClick={() => { setSearchQuery(''); setSelectedTopic('all'); }} className="text-indigo-500 text-sm font-bold mt-2">Clear filters</button>
                            </div>
                        )}
                    </div>
                </section>

            </main>

            {/* Article Modal / Drawer */}
            {activeArticle && (
                <div className="fixed inset-0 z-50 flex justify-end sm:items-center sm:justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
                    <div
                        className="bg-white w-full h-full sm:h-[85vh] sm:max-w-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-50 flex items-start justify-between bg-white sticky top-0 z-10">
                            <div>
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                                    {TOPICS.find(t => t.id === activeArticle.topic)?.label}
                                </span>
                                <h2 className="text-2xl font-black text-slate-900 leading-tight pr-4">
                                    {activeArticle.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setOpenArticleId(null)}
                                className="bg-slate-50 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 border-b border-slate-50 pb-6">
                                <span className="flex items-center gap-1"><Clock size={14} /> {activeArticle.readMinutes} min read</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span>Written by FastingPro Team</span>
                            </div>

                            {activeArticle.sections.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="text-lg font-black text-slate-800 mb-3">{section.heading}</h3>
                                    <p className="text-slate-600 leading-loose">
                                        {section.body}
                                    </p>
                                </div>
                            ))}

                            {/* Disclaimer Box */}
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mt-8">
                                <h4 className="flex items-center gap-2 text-amber-900 font-black text-sm mb-2">
                                    <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    Medical Disclaimer
                                </h4>
                                <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                                    This article is for informational purposes only and does not constitute medical advice.
                                    Always consult a healthcare professional for concerns about your health.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                            <Button
                                onClick={(e) => toggleSave(e as any, activeArticle.id)}
                                className={`flex-1 rounded-xl font-bold py-6 shadow-none border items-center gap-2 ${savedIds.includes(activeArticle.id)
                                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                    }`}
                                variant="ghost"
                            >
                                <Bookmark size={18} fill={savedIds.includes(activeArticle.id) ? "currentColor" : "none"} />
                                {savedIds.includes(activeArticle.id) ? 'Saved' : 'Save for later'}
                            </Button>
                            <Button
                                className="rounded-xl font-bold py-6 px-8 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                onClick={() => setOpenArticleId(null)}
                            >
                                Done Reading
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
