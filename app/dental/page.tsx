'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Check,
    Calendar,
    Clock,
    ChevronRight,
    Activity,
    ShieldCheck,
    Sparkles,
    Droplet,
    Edit2,
    Save,
    X,
    Play,
    Pause,
    RotateCcw,
    Trophy
} from 'lucide-react';

// --- Types ---

interface DailyHabits {
    date: string; // YYYY-MM-DD
    brushed: boolean;
    flossed: boolean;
    mouthwash: boolean;
}

interface VisitInfo {
    date: string; // YYYY-MM-DD
    type: 'Check-up' | 'Cleaning' | 'Filling' | 'Other';
}

interface ReminderSettings {
    time: string; // HH:mm
    active: boolean;
}

// --- Mock Data & Helpers ---

const MOCK_VISIT: VisitInfo = {
    date: '2024-07-15',
    type: 'Check-up'
};

const INITIAL_REMINDER: ReminderSettings = {
    time: '21:30',
    active: true
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getLast7Days = (): string[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
};

// --- Hook: useDentalState ---

function useDentalState() {
    const [habitsHistory, setHabitsHistory] = useState<DailyHabits[]>([]);
    const [visitInfo, setVisitInfo] = useState<VisitInfo>(MOCK_VISIT);
    const [reminder, setReminder] = useState<ReminderSettings>(INITIAL_REMINDER);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Initialize Data
    useEffect(() => {
        // Simulate fetching data
        const dates = getLast7Days();
        // Create random history for demo purposes if empty
        const initialHistory: DailyHabits[] = dates.map((date, index) => ({
            date,
            brushed: Math.random() > 0.1, // mostly true
            flossed: Math.random() > 0.5,
            mouthwash: Math.random() > 0.7
        }));

        // Ensure today is fresh/clean logic if we want, but let's just use the generated one or reset
        // For specific requirement "today's habits", let's make today empty by default for the demo unless we persist
        const today = getTodayDateString();
        const todayEntry = initialHistory.find(h => h.date === today);
        if (todayEntry) {
            // Reset today for the demo so user can click
            todayEntry.brushed = false;
            todayEntry.flossed = false;
            todayEntry.mouthwash = false;
        }

        setHabitsHistory(initialHistory);
    }, []);

    const getTodayHabits = () => {
        const today = getTodayDateString();
        return habitsHistory.find(h => h.date === today) || { date: today, brushed: false, flossed: false, mouthwash: false };
    };

    const toggleHabit = (habit: keyof Omit<DailyHabits, 'date'>) => {
        const today = getTodayDateString();
        setHabitsHistory(prev => prev.map(day => {
            if (day.date === today) {
                const newVal = !day[habit];
                if (newVal) showToast(`Marked ${habit} as done!`);
                return { ...day, [habit]: newVal };
            }
            return day;
        }));
    };

    const markHabitDone = (habit: keyof Omit<DailyHabits, 'date'>) => {
        const today = getTodayDateString();
        setHabitsHistory(prev => prev.map(day => {
            if (day.date === today && !day[habit]) {
                showToast(`Auto-marked ${habit} as done!`);
                return { ...day, [habit]: true };
            }
            return day;
        }));
    };

    const saveReminder = async (newSettings: ReminderSettings) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800)); // Fake API
        setReminder(newSettings);
        setLoading(false);
        showToast('Reminder saved');
    };

    const saveVisit = async (newVisit: VisitInfo) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800)); // Fake API
        setVisitInfo(newVisit);
        setLoading(false);
        showToast('Visit info updated');
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    return {
        habitsHistory,
        todayHabits: getTodayHabits(),
        visitInfo,
        reminder,
        loading,
        toast,
        toggleHabit,
        saveReminder,
        saveVisit,
        markHabitDone
    };
}

// --- Components ---

function ProgressBar({ progress, colorClass = "bg-blue-500" }: { progress: number, colorClass?: string }) {
    return (
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all duration-300 ${colorClass}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
        </div>
    );
}

// --- Main Page Component ---

export default function DentalPage() {
    const {
        habitsHistory,
        todayHabits,
        visitInfo,
        reminder,
        loading,
        toast,
        toggleHabit,
        saveReminder,
        saveVisit,
        markHabitDone
    } = useDentalState();

    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

    // Computed Stats
    const brushingStreak = habitsHistory.reduce((streak, day, idx) => {
        // simple streak logic: consecutive days from yesterday going back
        // Since history sorts today -> back (index 0 is today), look at 1 onwards
        if (idx === 0) return 0; // skip today for *past* streak calculation or include? 
        // Let's count consecutive true from yesterday
        // Simplified for demo: count total recent 'brushed'
        // A real streak algorithm would be more complex
        return streak;
    }, 0);

    // Better simple streak: count consecutive 'brushed' starting from yesterday (index 1)
    let currentStreak = 0;
    for (let i = 1; i < habitsHistory.length; i++) {
        if (habitsHistory[i].brushed) currentStreak++;
        else break;
    }
    // If today is brushed, add 1? standard streak usually counts finished days. 
    if (todayHabits.brushed) currentStreak++;

    const last7DaysBrushed = habitsHistory.filter(h => h.brushed).length;

    const lastVisitDate = new Date(visitInfo.date);
    const diffTime = Math.abs(new Date().getTime() - lastVisitDate.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    const nextVisitDate = new Date(lastVisitDate);
    nextVisitDate.setMonth(lastVisitDate.getMonth() + 6);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white p-6 pb-8 border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900">Dental / Oral Health</h1>
                    <p className="text-slate-500 mt-1">Track your brushing, flossing and visits in one place.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-6 -mt-4">

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Card 1: Today */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">Today</h3>
                        <div className="flex gap-2">
                            <HabitPill label="Brushed" active={todayHabits.brushed} color="bg-blue-500" />
                            <HabitPill label="Flossed" active={todayHabits.flossed} color="bg-teal-500" />
                            <HabitPill label="Rinsed" active={todayHabits.mouthwash} color="bg-purple-500" />
                        </div>
                    </div>

                    {/* Card 2: Streak */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">Streak & History</h3>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-black text-slate-800">{currentStreak}<span className="text-sm font-normal text-slate-500 ml-1">days streak</span></p>
                                <p className="text-sm text-slate-400 mt-1">Last 7 days: {last7DaysBrushed}/7 brushed</p>
                            </div>
                            <Trophy className="text-yellow-400 w-8 h-8 mb-1" />
                        </div>
                    </div>

                    {/* Card 3: Last Visit */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">Last Visit</h3>
                        <div>
                            <p className="text-lg font-bold text-slate-800">{visitInfo.date}</p>
                            <p className="text-sm text-slate-500">{diffMonths} months ago</p>
                        </div>
                    </div>
                </div>

                {/* Habits Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Daily Habits</h2>

                    {/* Today's Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <HabitToggle
                            label="Brushed Teeth"
                            icon={<Sparkles className="w-5 h-5" />}
                            active={todayHabits.brushed}
                            color="blue"
                            onClick={() => toggleHabit('brushed')}
                        />
                        <HabitToggle
                            label="Flossed"
                            icon={<ShieldCheck className="w-5 h-5" />}
                            active={todayHabits.flossed}
                            color="teal"
                            onClick={() => toggleHabit('flossed')}
                        />
                        <HabitToggle
                            label="Mouthwash"
                            icon={<Droplet className="w-5 h-5" />}
                            active={todayHabits.mouthwash}
                            color="purple"
                            onClick={() => toggleHabit('mouthwash')}
                        />
                    </div>

                    {/* 7-Day History Visualizer */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 mb-3">Recent History</h3>
                        <div className="flex justify-between items-center sm:justify-start sm:gap-4 overflow-x-auto pb-2">
                            {[...habitsHistory].reverse().map((day) => (
                                <div key={day.date} className="flex flex-col items-center gap-2 min-w-[3rem]">
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${day.brushed ? 'bg-blue-500 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-300'}`}>
                                        {day.brushed ? <Check size={14} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                                    </div>
                                    <div className="flex gap-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${day.flossed ? 'bg-teal-500' : 'bg-slate-200'}`} />
                                        <div className={`w-1.5 h-1.5 rounded-full ${day.mouthwash ? 'bg-purple-500' : 'bg-slate-200'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Reminder Card */}
                    <ReminderCard
                        reminder={reminder}
                        loading={loading}
                        onSave={saveReminder}
                    />

                    {/* Last Visit Info */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                                <Calendar className="text-rose-500" />
                                <h3>Last Check-up</h3>
                            </div>
                            <button
                                onClick={() => setIsVisitModalOpen(true)}
                                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Type</p>
                                <p className="text-slate-800 font-medium">{visitInfo.date} • {visitInfo.type}</p>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-2xl">
                                <p className="text-indigo-900 text-sm font-medium flex items-center gap-2">
                                    <Clock size={16} />
                                    Next visit recommended:
                                </p>
                                <p className="text-indigo-600 font-bold mt-1 text-lg">
                                    {nextVisitDate.toISOString().split('T')[0]}
                                </p>
                                <p className="text-xs text-indigo-400 mt-1">~6 months from last visit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brushing Timer */}
                <BrushingTimer onComplete={() => markHabitDone('brushed')} />

            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
                    <Check size={16} className="text-emerald-400" />
                    <span className="font-medium text-sm">{toast}</span>
                </div>
            )}

            {/* Edit Visit Modal */}
            {isVisitModalOpen && (
                <VisitEditModal
                    visit={visitInfo}
                    loading={loading}
                    onClose={() => setIsVisitModalOpen(false)}
                    onSave={(v) => {
                        saveVisit(v);
                        setIsVisitModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

// --- Sub-Components ---

function HabitPill({ label, active, color }: { label: string, active: boolean, color: string }) {
    return (
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${active ? `${color} text-white` : 'bg-slate-100 text-slate-400'}`}>
            {label}
        </div>
    );
}

function HabitToggle({ label, icon, active, color, onClick }: { label: string, icon: React.ReactNode, active: boolean, color: 'blue' | 'teal' | 'purple', onClick: () => void }) {
    const colorMap = {
        blue: 'bg-blue-500 shadow-blue-500/30',
        teal: 'bg-teal-500 shadow-teal-500/30',
        purple: 'bg-purple-500 shadow-purple-500/30'
    };

    const textMap = {
        blue: 'text-blue-500',
        teal: 'text-teal-500',
        purple: 'text-purple-500'
    }

    return (
        <button
            onClick={onClick}
            className={`relative group p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${active
                    ? `${colorMap[color]} border-transparent shadow-lg transform scale-[1.02]`
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-white/20 text-white' : `bg-slate-100 ${textMap[color]}`}`}>
                {active ? <Check size={20} strokeWidth={4} /> : icon}
            </div>
            <span className={`font-bold text-sm ${active ? 'text-white' : 'text-slate-600'}`}>{label}</span>
        </button>
    );
}

function ReminderCard({ reminder, loading, onSave }: { reminder: ReminderSettings, loading: boolean, onSave: (r: ReminderSettings) => void }) {
    const [time, setTime] = useState(reminder.time);
    const [active, setActive] = useState(reminder.active);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(time !== reminder.time || active !== reminder.active);
    }, [time, active, reminder]);

    const handleSave = () => {
        onSave({ time, active });
        setHasChanges(false);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                    <Activity className="text-orange-500" />
                    <h3>Daily Reminder</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${active ? 'text-emerald-500' : 'text-slate-400'}`}>{active ? 'On' : 'Off'}</span>
                    <button
                        onClick={() => setActive(!active)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${active ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-slate-50 font-bold text-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {hasChanges && (
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : <>Save Changes <Save size={16} /></>}
                </button>
            )}
        </div>
    );
}

function BrushingTimer({ onComplete }: { onComplete: () => void }) {
    const [timeLeft, setTimeLeft] = useState(120);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const totalTime = 120;

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setIsCompleted(true);
            onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const toggleTimer = () => {
        if (isCompleted) {
            // Reset
            setTimeLeft(120);
            setIsCompleted(false);
            setIsActive(true);
        } else {
            setIsActive(!isActive);
        }
    };

    const reset = () => {
        setIsActive(false);
        setTimeLeft(120);
        setIsCompleted(false);
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            {/* Decals */}
            <Sparkles className="absolute top-4 right-6 text-white/20 w-24 h-24 rotate-12" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <Clock size={24} /> 2-Minute Timer
                </h2>

                <div className="relative mb-8">
                    {/* Circular Progress approximation with SVG if wanted, or just simple text */}
                    <div className="text-7xl font-black tabular-nums tracking-tighter">
                        {isCompleted ? "Done!" : formatTime(timeLeft)}
                    </div>
                    {isCompleted && <p className="text-blue-100 font-bold mt-2">Great job!</p>}
                </div>

                {/* Bar Progress */}
                <div className="w-full bg-black/20 h-3 rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={toggleTimer}
                        className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg hover:scale-110 transition-transform active:scale-95"
                    >
                        {isCompleted ? <RotateCcw size={28} strokeWidth={3} /> : (isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />)}
                    </button>
                    {!isCompleted && timeLeft < 120 && (
                        <button
                            onClick={reset}
                            className="h-16 w-16 bg-blue-400/50 hover:bg-blue-400/70 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                        >
                            <RotateCcw size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function VisitEditModal({ visit, loading, onClose, onSave }: { visit: VisitInfo, loading: boolean, onClose: () => void, onSave: (v: VisitInfo) => void }) {
    const [date, setDate] = useState(visit.date);
    const [type, setType] = useState(visit.type);

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Edit Visit Info</h3>
                    <button onClick={onClose} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-50 rounded-xl p-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="w-full bg-slate-50 rounded-xl p-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Check-up</option>
                            <option>Cleaning</option>
                            <option>Filling</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <button
                        onClick={() => onSave({ date, type })}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Details'}
                    </button>
                </div>
            </div>
        </div>
    )
}
