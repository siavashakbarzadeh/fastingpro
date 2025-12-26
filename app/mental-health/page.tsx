'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    Smile,
    Frown,
    Meh,
    SmilePlus,
    Wind,
    Moon,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ChevronRight,
    Heart,
    Coffee,
    Footprints,
    Users,
    Zap,
    Info,
    CloudRain,
    Send,
    Loader2,
    Trash2
} from 'lucide-react';
import Link from 'next/link';

// --- Types ---

type Mood = 'very_low' | 'low' | 'okay' | 'good' | 'great';
type StressLevel = 'none' | 'mild' | 'moderate' | 'high';

interface CheckIn {
    id: string;
    date: string; // ISO string
    mood: Mood;
    stress: StressLevel;
    sleepQuality: number; // 1-5
    note?: string;
}

interface SelfCareAction {
    id: string;
    label: string;
    icon: React.ElementType;
    completed: boolean;
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// --- Helpers & Consts ---

const MOOD_CONFIG: Record<Mood, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    very_low: { label: 'Very Low', icon: CloudRain, color: 'text-rose-600', bg: 'bg-rose-50' },
    low: { label: 'Low', icon: Frown, color: 'text-orange-600', bg: 'bg-orange-50' },
    okay: { label: 'Okay', icon: Meh, color: 'text-amber-600', bg: 'bg-amber-50' },
    good: { label: 'Good', icon: Smile, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    great: { label: 'Great', icon: SmilePlus, color: 'text-teal-600', bg: 'bg-teal-50' },
};

const STRESS_CONFIG: Record<StressLevel, { label: string; color: string }> = {
    none: { label: 'None', color: 'bg-emerald-100 text-emerald-700' },
    mild: { label: 'Mild', color: 'bg-blue-100 text-blue-700' },
    moderate: { label: 'Moderate', color: 'bg-amber-100 text-amber-700' },
    high: { label: 'High', color: 'bg-rose-100 text-rose-700' },
};

const INITIAL_HISTORY: CheckIn[] = [
    { id: '1', date: new Date(Date.now() - 86400000 * 6).toISOString(), mood: 'good', stress: 'mild', sleepQuality: 4 },
    { id: '2', date: new Date(Date.now() - 86400000 * 5).toISOString(), mood: 'great', stress: 'none', sleepQuality: 5 },
    { id: '3', date: new Date(Date.now() - 86400000 * 4).toISOString(), mood: 'okay', stress: 'moderate', sleepQuality: 3 },
    { id: '4', date: new Date(Date.now() - 86400000 * 3).toISOString(), mood: 'low', stress: 'high', sleepQuality: 2 },
    { id: '5', date: new Date(Date.now() - 86400000 * 2).toISOString(), mood: 'okay', stress: 'mild', sleepQuality: 4 },
    { id: '6', date: new Date(Date.now() - 86400000 * 1).toISOString(), mood: 'good', stress: 'none', sleepQuality: 4 },
];

const ACTIONS_LIST: SelfCareAction[] = [
    { id: 'a1', label: '5-min breathing or relaxation', icon: Wind, completed: false },
    { id: 'a2', label: 'Short walk or gentle movement', icon: Footprints, completed: false },
    { id: 'a3', label: 'Write down 3 things you are grateful for', icon: Heart, completed: false },
    { id: 'a4', label: 'Take a short break from screens', icon: Zap, completed: false },
    { id: 'a5', label: 'Reach out to a friend or loved one', icon: Users, completed: false },
];

export default function MentalHealthPage() {
    // --- State ---
    const [history, setHistory] = useState<CheckIn[]>(INITIAL_HISTORY);
    const [currentMood, setCurrentMood] = useState<Mood>('okay');
    const [currentStress, setCurrentStress] = useState<StressLevel>('mild');
    const [currentSleep, setCurrentSleep] = useState<number>(3);
    const [currentNote, setCurrentNote] = useState('');
    const [isSavingCheckIn, setIsSavingCheckIn] = useState(false);
    const [checkInSaved, setCheckInSaved] = useState(false);

    const [actions, setActions] = useState<SelfCareAction[]>(ACTIONS_LIST);
    const [isSavingPlan, setIsSavingPlan] = useState(false);
    const [planSaved, setPlanSaved] = useState(false);

    // AI Chat State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);

    // Load chat history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('mental_health_chat_history');
        if (saved) {
            try {
                setChatHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load chat history', e);
            }
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('mental_health_chat_history', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    // --- Derived ---
    const insights = useMemo(() => {
        const last7 = history.slice(-7);
        const lowMoods = last7.filter((c: CheckIn) => c.mood === 'low' || c.mood === 'very_low').length;
        const highStressDays = last7.filter((c: CheckIn) => c.stress === 'high' || c.stress === 'moderate').length;

        const messages: string[] = [];
        if (lowMoods > 0) messages.push(`You rated ${lowMoods} of the last 7 days as 'Low' or 'Very Low'.`);
        if (highStressDays > 2) messages.push(`Stress has been moderate to high on ${highStressDays} days this week.`);
        if (messages.length === 0) messages.push('Your mood has been consistent and positive lately.');

        return messages;
    }, [history]);

    const completedActions = actions.filter((a: SelfCareAction) => a.completed).length;

    // --- Actions ---
    const saveCheckIn = async () => {
        setIsSavingCheckIn(true);
        // Fake async
        await new Promise(r => setTimeout(r, 1200));

        const newEntry: CheckIn = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            mood: currentMood,
            stress: currentStress,
            sleepQuality: currentSleep,
            note: currentNote,
        };

        setHistory((prev: CheckIn[]) => [...prev.filter((c: CheckIn) => new Date(c.date).toDateString() !== new Date().toDateString()), newEntry]);
        setIsSavingCheckIn(false);
        setCheckInSaved(true);
        setTimeout(() => setCheckInSaved(false), 3000);
    };

    const savePlan = async () => {
        setIsSavingPlan(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSavingPlan(false);
        setPlanSaved(true);
        setTimeout(() => setPlanSaved(false), 3000);
    };

    const toggleAction = (id: string) => {
        setActions((prev: SelfCareAction[]) => prev.map((a: SelfCareAction) => a.id === id ? { ...a, completed: !a.completed } : a));
    };

    const sendChatMessage = async () => {
        if (!userInput.trim() || isTyping) return;

        const newMessage: ChatMessage = { role: 'user', content: userInput.trim() };
        const updatedHistory = [...chatHistory, newMessage];

        setChatHistory(updatedHistory);
        setUserInput('');
        setIsTyping(true);
        setChatError(null);

        try {
            const res = await fetch('/api/ai/mental-health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: 'en', // Could be dynamic
                    mood: currentMood,
                    stress: currentStress,
                    history: updatedHistory.slice(-6), // Send last 6 turns for context
                    message: newMessage.content
                })
            });

            if (!res.ok) throw new Error('Failed to get response');

            const aiResponse = await res.text();
            setChatHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);
        } catch (err: any) {
            setChatError('Sorry, I am having trouble connecting right now. Please try again or reach out to a professional.');
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        if (confirm('Clear conversation history?')) {
            setChatHistory([]);
            localStorage.removeItem('mental_health_chat_history');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
            {/* Header */}
            <header className="bg-white sticky top-0 z-10 shadow-sm border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Support My Mind</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Track how you feel, reduce stress, and know when to ask for help.</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Tracking */}
                    <div className="space-y-8">
                        {/* Today's Check-in */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                    <Heart size={20} fill="currentColor" />
                                </div>
                                <h2 className="text-xl font-black">How are you today?</h2>
                            </div>

                            <div className="space-y-8">
                                {/* Mood Rating */}
                                <div>
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 block">Mood Rating</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {(Object.keys(MOOD_CONFIG) as Mood[]).map((m: Mood) => {
                                            const Icon = MOOD_CONFIG[m].icon;
                                            const isSelected = currentMood === m;
                                            return (
                                                <button
                                                    key={m}
                                                    onClick={() => setCurrentMood(m)}
                                                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${isSelected ? `${MOOD_CONFIG[m].bg} ${MOOD_CONFIG[m].color} ring-2 ring-current` : 'bg-slate-50 text-slate-400 grayscale hover:grayscale-0'
                                                        }`}
                                                >
                                                    <Icon size={28} />
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">{MOOD_CONFIG[m].label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Stress & Sleep */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 block">Stress Level</label>
                                        <div className="flex flex-wrap gap-2">
                                            {(Object.keys(STRESS_CONFIG) as StressLevel[]).map((s: StressLevel) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setCurrentStress(s)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${currentStress === s
                                                        ? `${STRESS_CONFIG[s].color} border-current`
                                                        : 'bg-slate-50 text-slate-400 border-transparent'
                                                        }`}
                                                >
                                                    {STRESS_CONFIG[s].label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 block">Sleep Quality</label>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((val: number) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setCurrentSleep(val)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all ${currentSleep === val ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400'
                                                        }`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 block">What&apos;s on your mind?</label>
                                    <textarea
                                        value={currentNote}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentNote(e.target.value)}
                                        placeholder="Short note about your day..."
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-600 font-medium h-24 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-100 transition-all outline-none resize-none"
                                    />
                                </div>

                                <button
                                    onClick={saveCheckIn}
                                    disabled={isSavingCheckIn}
                                    className={`w-full py-4 rounded-2xl font-black text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isSavingCheckIn ? 'bg-slate-300' : checkInSaved ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'
                                        }`}
                                >
                                    {isSavingCheckIn ? <Zap className="animate-pulse" /> : checkInSaved ? <CheckCircle2 /> : null}
                                    {isSavingCheckIn ? 'Saving...' : checkInSaved ? 'Saved!' : 'Save today’s check-in'}
                                </button>
                            </div>
                        </section>

                        {/* 7-Day Overview */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                        <Moon size={20} fill="currentColor" />
                                    </div>
                                    <h2 className="text-xl font-black">Last 7 Days</h2>
                                </div>
                            </div>

                            {/* Day Row */}
                            <div className="flex items-end justify-between gap-1 mb-10 overflow-x-auto no-scrollbar py-2">
                                {history.map((day: CheckIn, idx: number) => {
                                    const m = MOOD_CONFIG[day.mood];
                                    const Icon = m.icon;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-4 shrink-0 px-2 group">
                                            <div className={`p-2 rounded-xl ${m.bg} ${m.color} transition-transform group-hover:scale-110`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${STRESS_CONFIG[day.stress].color}`}>
                                                {day.stress}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Insights */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wide flex items-center gap-2">
                                    <Info size={14} /> Weekly Insights
                                </h3>
                                {insights.map((msg: string, i: number) => (
                                    <div key={i} className="flex gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 items-start">
                                        <Zap size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed">{msg}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Self-Care */}
                    <div className="space-y-8">
                        {/* Self-care Plan */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-fit">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <CheckCircle2 size={20} fill="currentColor" />
                                    </div>
                                    <h2 className="text-xl font-black">Small steps for today</h2>
                                </div>
                                <div className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                                    {completedActions}/{actions.length} Done
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {actions.map((action: SelfCareAction) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.id}
                                            onClick={() => toggleAction(action.id)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${action.completed
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-100'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-xl ${action.completed ? 'bg-emerald-100' : 'bg-slate-50 text-slate-300'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <span className={`text-sm font-bold flex-1 text-left ${action.completed ? 'line-through opacity-60' : ''}`}>
                                                {action.label}
                                            </span>
                                            {action.completed && <CheckCircle2 size={16} />}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={savePlan}
                                disabled={isSavingPlan}
                                className={`w-full py-4 rounded-2xl font-black text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isSavingPlan ? 'bg-slate-300' : planSaved ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {isSavingPlan ? 'Updating...' : planSaved ? 'Saved!' : 'Save today’s plan'}
                            </button>
                        </section>

                        {/* Quick Exercises */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">Relief Exercises</h2>

                            <ExerciseCard
                                title="Box Breathing"
                                detail="Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 4 times."
                                sub="2 minutes • Focus & Calm"
                                icon={Wind}
                                color="text-blue-500 bg-blue-50"
                            />
                            <ExerciseCard
                                title="Grounding (5-4-3-2-1)"
                                detail="Acknowledge 5 things you see, 4 you can touch, 3 you can hear, 2 you smell, 1 you can taste."
                                sub="3 minutes • Reduce Anxiety"
                                icon={AlertCircle}
                                color="text-amber-500 bg-amber-50"
                            />
                            <ExerciseCard
                                title="Gratitude Reflection"
                                detail="Identify 3 small things that went well today or made you smile. Explain why."
                                sub="5 minutes • Positive Mindset"
                                icon={Heart}
                                color="text-rose-500 bg-rose-50"
                            />
                        </div>

                        {/* AI Chat Companion */}
                        <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[500px]">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                        <MessageSquare size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black tracking-tight">AI Companion</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supportive Listener</p>
                                    </div>
                                </div>
                                <button
                                    onClick={clearChat}
                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                    title="Clear chat history"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                                {chatHistory.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
                                            <MessageSquare size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 max-w-[200px]">
                                            Speak your mind. I&apos;m here to listen and support you.
                                        </p>
                                    </div>
                                ) : (
                                    chatHistory.map((msg: ChatMessage, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-slate-50 text-slate-700 rounded-bl-none border border-slate-100'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-50 text-slate-400 p-4 rounded-3xl rounded-bl-none border border-slate-100 flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">AI is thinking...</span>
                                        </div>
                                    </div>
                                )}

                                {chatError && (
                                    <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 italic">
                                        {chatError}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50/50 border-t border-slate-50">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={userInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendChatMessage()}
                                        placeholder="How are you feeling?"
                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all outline-none transition-all"
                                    />
                                    <button
                                        onClick={sendChatMessage}
                                        disabled={!userInput.trim() || isTyping}
                                        className="absolute right-2 p-2 bg-indigo-600 text-white rounded-xl disabled:opacity-30 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <p className="text-[9px] text-center text-slate-400 font-bold mt-3 uppercase tracking-tighter">
                                    AI-powered companion • Not a replacement for professional care
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Safety Box */}
                <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <AlertCircle size={120} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <AlertCircle className="text-rose-400" /> When to seek urgent help
                        </h2>
                        <p className="text-slate-300 font-medium mb-8 leading-relaxed">
                            Tracking your mood is helpful, but some feelings need professional specialized care. Please contact a professional urgently if you experience:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {[
                                'Thoughts of self-harm or hurting others',
                                'Feeling unable to cope with basic daily tasks',
                                'Severe anxiety or panic lasting many days',
                                'Feeling detached or hearing voices',
                            ].map((text: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm font-bold text-slate-200">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xs font-black uppercase text-rose-300 tracking-widest mb-1">Important Notice</h4>
                            <p className="text-sm font-bold text-white leading-relaxed">
                                This app cannot provide crisis support or medical diagnosis. If you are in crisis, contact local emergency services or a dedicated crisis hotline immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- Subcomponents ---

function ExerciseCard({ title, detail, sub, icon: Icon, color }: { title: string; detail: string; sub: string; icon: React.ElementType; color: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-indigo-100' : ''}`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${color}`}>
                        <Icon size={20} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-sm font-black text-slate-800">{title}</h4>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-0.5">{sub}</p>
                    </div>
                </div>
                <ChevronRight size={18} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                            &quot;{detail}&quot;
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
