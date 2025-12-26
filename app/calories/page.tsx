'use client';

import React, { useState, useMemo } from 'react';
import {
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Utensils,
    Activity,
    Settings,
    History,
    Check
} from 'lucide-react';

import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/StatusStates';
import { useCalories } from '@/hooks/useCalories';
import { validate } from '@/lib/utils';
import { MealType, FoodEntry } from '@/lib/api-client';

const TODAY = new Date().toISOString().split('T')[0];

export default function CaloriesDiaryPage() {
    const [selectedDate, setSelectedDate] = useState(TODAY);
    const {
        data: dayData,
        isLoading,
        error,
        isSaving,
        totals,
        addFood,
        removeFood,
        addExercise,
        removeExercise,
        toggleComplete,
        retry
    } = useCalories(selectedDate);

    // UI state for modals/forms
    const [activeAddMeal, setActiveAddMeal] = useState<MealType | null>(null);
    const [isAddingExercise, setIsAddingExercise] = useState(false);

    // Form states
    const [foodForm, setFoodForm] = useState({ name: '', calories: '', portion: '1 serving' });
    const [exerciseForm, setExerciseForm] = useState({ name: '', duration: '', burned: '' });
    const [formError, setFormError] = useState<string | null>(null);

    // --- Actions ---

    const handleAddFood = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!activeAddMeal) return;

        // Validation
        if (!validate.isNotEmpty(foodForm.name)) {
            setFormError('Food name is required');
            return;
        }
        if (!validate.isPositiveNumber(foodForm.calories)) {
            setFormError('Calories must be a positive number');
            return;
        }

        const success = await addFood(activeAddMeal, {
            name: foodForm.name,
            calories: parseInt(foodForm.calories),
            portion: foodForm.portion
        });

        if (success) {
            setFoodForm({ name: '', calories: '', portion: '1 serving' });
            setActiveAddMeal(null);
        }
    };

    const handleAddExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validation
        if (!validate.isNotEmpty(exerciseForm.name)) {
            setFormError('Activity name is required');
            return;
        }
        if (!validate.isPositiveNumber(exerciseForm.burned)) {
            setFormError('Calories burned must be a positive number');
            return;
        }

        const success = await addExercise({
            name: exerciseForm.name,
            durationMinutes: parseInt(exerciseForm.duration) || 0,
            calories: parseInt(exerciseForm.burned)
        });

        if (success) {
            setExerciseForm({ name: '', duration: '', burned: '' });
            setIsAddingExercise(false);
        }
    };

    const changeDay = (offset: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + offset);
        setSelectedDate(d.toISOString().split('T')[0]);
    };
    const isOver = totals.remaining < 0;

    // Helper to filter foods by meal
    const getMealFoods = (meal: MealType) => dayData?.foods.filter((f: FoodEntry) => f.meal === meal) || [];
    const getMealTotal = (meal: MealType) => getMealFoods(meal).reduce((acc: number, f: FoodEntry) => acc + f.calories, 0);

    if (isLoading && !dayData) return <LoadingState />;
    if (error && !dayData) return <ErrorState message={error} onRetry={retry} />;
    if (!dayData) return <EmptyState message="No data for this day" />;

    return (
        <AppShell
            title="Calories"
            subtitle="Diary"
            showBackButton
            backUrl="/"
            activeTab="recipes"
            hideTopBar
        >
            <div className="flex flex-col min-h-full">

                {/* Custom Header with Date Switcher */}
                <header className="bg-white px-6 pt-6 pb-4 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-4">
                        <History size={20} className="text-slate-300" />
                        <div className="flex items-center gap-4">
                            <button onClick={() => changeDay(-1)} className="p-1 text-slate-400 hover:text-primary transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <span className="text-sm font-black text-slate-900">
                                {selectedDate === TODAY ? "Today" : new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <button onClick={() => changeDay(1)} className="p-1 text-slate-400 hover:text-primary transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <Settings size={20} className="text-slate-300" />
                    </div>

                    {/* Simple Date Strip (last 7 days logic could be improved with real data) */}
                    <div className="flex justify-between w-full px-2 mb-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            const dateStr = d.toISOString().split('T')[0];
                            const isSelected = dateStr === selectedDate;
                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${isSelected ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                        {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                                    </div>
                                    <div className={`w-1 h-1 rounded-full bg-primary ${isSelected ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`} />
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Summary Bar Card */}
                <section className="px-6 relative -mb-10 z-10">
                    <Card variant="white" padding="none" className="shadow-xl py-6 border-b-4 border-primary">
                        <div className="grid grid-cols-4 items-end px-4 text-center">
                            <div>
                                <div className="text-xs font-black text-slate-900">{dayData.goal}</div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Goal</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-300 mb-1">-</span>
                                <div className="text-xs font-black text-orange-500">{totals.food}</div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Food</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-300 mb-1">+</span>
                                <div className="text-xs font-black text-emerald-500">{totals.exercise}</div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Exercise</div>
                            </div>
                            <div>
                                <div className={`text-xs font-black ${isOver ? 'text-danger' : 'text-primary'}`}>{totals.remaining}</div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Remaining</div>
                            </div>
                        </div>
                        <div className="mt-4 px-8">
                            <ProgressBar progress={Math.min(100, (totals.net / dayData.goal) * 100)} color={isOver ? 'danger' : 'primary'} height="sm" />
                        </div>
                    </Card>
                </section>

                {/* Diary Content */}
                <div className="flex-1 bg-slate-50 pt-16 px-6 pb-32 space-y-6">

                    {/* Meal Sections */}
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => (
                        <MealSection
                            key={meal}
                            meal={meal}
                            entries={getMealFoods(meal)}
                            total={getMealTotal(meal)}
                            onAdd={() => setActiveAddMeal(meal)}
                            onRemove={removeFood}
                        />
                    ))}

                    {/* Exercise Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <Activity size={14} className="text-emerald-500" />
                                Exercise
                            </h3>
                            <span className="text-[10px] font-black text-emerald-500">{totals.exercise} kcal</span>
                        </div>
                        <Card padding="none">
                            <div className="divide-y divide-slate-50">
                                {dayData.exercises.map(entry => (
                                    <div key={entry.id} className="p-4 flex justify-between items-center bg-white first:rounded-t-3xl last:rounded-b-3xl">
                                        <div>
                                            <div className="text-xs font-black text-slate-800">{entry.name}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase">{entry.durationMinutes} minutes</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black text-emerald-500">{entry.calories}</span>
                                            <button onClick={() => removeExercise(entry.id)} className="text-slate-200 hover:text-danger p-1">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setIsAddingExercise(true)}
                                    className="w-full py-4 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} />
                                    Add Exercise
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Daily Footer */}
                    <div className="pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Daily Success</span>
                                <div className={`text-xl font-black ${isOver ? 'text-danger' : 'text-primary'}`}>
                                    {isOver ? `${Math.abs(totals.remaining)} over` : `${totals.remaining} remaining`}
                                </div>
                            </div>
                            <Button
                                variant={dayData.isCompleted ? 'ghost' : 'primary'}
                                icon={dayData.isCompleted ? <Check size={16} /> : undefined}
                                onClick={toggleComplete}
                            >
                                {dayData.isCompleted ? 'Completed' : 'Complete Day'}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Add Food Form Overlay */}
            {activeAddMeal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <Card variant="white" className="w-full max-w-sm mb-20 animate-in slide-in-from-bottom-8 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest">Add to {activeAddMeal}</h3>
                            <button onClick={() => setActiveAddMeal(null)} className="p-2 text-slate-300">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddFood} className="space-y-4">
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    placeholder="Food name"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={foodForm.name}
                                    onChange={e => setFoodForm({ ...foodForm, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Calories"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={foodForm.calories}
                                    onChange={e => setFoodForm({ ...foodForm, calories: e.target.value })}
                                />
                                <select
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-black focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                    value={foodForm.portion}
                                    onChange={e => setFoodForm({ ...foodForm, portion: e.target.value })}
                                >
                                    <option value="½ serving">½ serving</option>
                                    <option value="1 serving">1 serving</option>
                                    <option value="2 servings">2 servings</option>
                                    <option value="1 bowl">1 bowl</option>
                                    <option value="1 cup">1 cup</option>
                                </select>
                            </div>

                            {formError && <p className="text-[10px] font-bold text-danger uppercase tracking-tighter px-2">{formError}</p>}

                            <Button type="submit" className="w-full" size="lg" isLoading={isSaving} disabled={isSaving}>
                                Add Food
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Add Exercise Form Overlay */}
            {isAddingExercise && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <Card variant="white" className="w-full max-w-sm mb-20 animate-in slide-in-from-bottom-8 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest">Log Exercise</h3>
                            <button onClick={() => setIsAddingExercise(false)} className="p-2 text-slate-300">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddExercise} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Activity (e.g. Running)"
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none"
                                value={exerciseForm.name}
                                onChange={e => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                                autoFocus
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Minutes"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={exerciseForm.duration}
                                    onChange={e => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Burned kcal"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={exerciseForm.burned}
                                    onChange={e => setExerciseForm({ ...exerciseForm, burned: e.target.value })}
                                />
                            </div>

                            {formError && <p className="text-[10px] font-bold text-danger uppercase tracking-tighter px-2">{formError}</p>}

                            <Button type="submit" className="w-full" size="lg" variant="secondary" isLoading={isSaving} disabled={isSaving}>
                                Add Exercise
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

        </AppShell>
    );
}

// --- Internal Components ---

function MealSection({ meal, entries, total, onAdd, onRemove }: {
    meal: MealType;
    entries: FoodEntry[];
    total: number;
    onAdd: () => void;
    onRemove: (id: string) => void;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Utensils size={14} className="text-orange-500" />
                    {meal}
                </h3>
                <span className="text-[10px] font-black text-orange-500">{total} kcal</span>
            </div>
            <Card padding="none">
                <div className="divide-y divide-slate-50">
                    {entries.map(entry => (
                        <div key={entry.id} className="p-4 flex justify-between items-center bg-white first:rounded-t-3xl last:rounded-b-3xl">
                            <div>
                                <div className="text-xs font-black text-slate-800">{entry.name}</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">{entry.portion}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-orange-400">{entry.calories}</span>
                                <button onClick={() => onRemove(entry.id)} className="text-slate-200 hover:text-danger p-1">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={onAdd}
                        className="w-full py-4 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={14} />
                        Add Food
                    </button>
                </div>
            </Card>
        </div>
    );
}
