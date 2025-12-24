'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Timer, Target, Brain, Heart, Zap, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Option {
    id: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
}

interface Step {
    id: string;
    sectionTitle?: string;
    question: string;
    subtitle?: string;
    options?: Option[];
    theme?: 'green' | 'light';
    type?: 'select' | 'input' | 'height';
    placeholder?: string;
}

const steps: Step[] = [
    {
        id: 'goal',
        question: 'What is your main goal?',
        theme: 'green',
        options: [
            { id: 'weight', label: 'Lose weight', icon: <Target className="w-6 h-6" /> },
            { id: 'health', label: 'Improve health', icon: <Heart className="w-6 h-6" /> },
            { id: 'mind', label: 'Mental clarity', icon: <Brain className="w-6 h-6" /> },
            { id: 'energy', label: 'More energy', icon: <Zap className="w-6 h-6" /> },
        ]
    },
    {
        id: 'experience',
        question: 'How much experience do you have with fasting?',
        theme: 'green',
        options: [
            { id: 'beginner', label: 'Never tried it', icon: <div className="w-6 h-6 flex items-center justify-center font-bold">1</div> },
            { id: 'intermediate', label: 'I do it occasionally', icon: <div className="w-6 h-6 flex items-center justify-center font-bold">2</div> },
            { id: 'pro', label: 'I am a pro', icon: <div className="w-6 h-6 flex items-center justify-center font-bold">3</div> },
        ]
    },
    {
        id: 'activity',
        question: 'What is your activity level?',
        theme: 'green',
        options: [
            { id: 'sedentary', label: 'Sedentary', description: 'Office job, little exercise' },
            { id: 'moderate', label: 'Moderate', description: 'Exercise 2-3 times a week' },
            { id: 'active', label: 'Active', description: 'Exercise daily or physical job' },
        ]
    },
    {
        id: 'gender',
        sectionTitle: "Let's Create Your Body Profile",
        question: 'Select your gender:',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'female', label: 'Female', icon: <User className="w-6 h-6 text-pink-500" /> },
            { id: 'male', label: 'Male', icon: <User className="w-6 h-6 text-blue-500" /> },
            { id: 'divers', label: 'Divers', icon: <User className="w-6 h-6 text-purple-500" /> },
        ]
    },
    {
        id: 'age',
        question: 'How old are you?',
        subtitle: 'We ask this to establish if FastingPro is safe for you',
        theme: 'light',
        type: 'input',
        placeholder: 'I am ... years old'
    },
    {
        id: 'height',
        question: 'How tall are you?',
        subtitle: 'Height is needed to determine a safe weight loss rate.',
        theme: 'light',
        type: 'height'
    }
];

export default function QuizPage() {
    const router = useRouter();
    const [view, setView] = useState<'intro' | 'quiz'>('intro');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [unit, setUnit] = useState<'ft' | 'cm'>('ft');

    const currentStepData = steps[currentStep];
    const isLight = currentStepData.theme === 'light';

    // Simulate loading progress for the intro screen
    useEffect(() => {
        if (view === 'intro') {
            const interval = setInterval(() => {
                setLoadingProgress((prev: number) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setView('quiz'), 500);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [view]);

    const handleOptionSelect = (optionId: string | number) => {
        const newAnswers = { ...answers, [currentStepData.id]: String(optionId) };
        setAnswers(newAnswers);

        if (currentStep < steps.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            setTimeout(() => router.push('/register'), 500);
        }
    };

    if (view === 'intro') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <header className="fixed top-0 w-full h-16 flex items-center justify-center px-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[#00ca86] font-bold text-2xl tracking-tighter flex items-center gap-1">
                            <Timer className="w-6 h-6" /> FastingPro
                        </span>
                    </div>
                </header>

                <div className="max-w-md w-full space-y-8 flex flex-col items-center">
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                        {/* Replace with actual image path if possible, using a stylized placeholder for now */}
                        <div className="absolute inset-0 bg-orange-100 rounded-full scale-90 -z-10 opacity-50" />
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="w-full h-full overflow-hidden flex items-center justify-center">
                                <Image
                                    src="/weight_loss.png"
                                    alt="Weight loss success"
                                    width={400}
                                    height={400}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-black text-orange-500 tracking-tight leading-tight">
                            Get a new you in 12 weeks
                        </h1>
                        <p className="text-slate-900 font-bold text-lg md:text-xl leading-snug px-4">
                            See how fast you can hit your weight loss goals with FastingPro
                        </p>
                    </div>

                    <div className="w-full space-y-6 pt-8">
                        <div className="flex items-center justify-center gap-3 text-slate-500 font-semibold tracking-wide text-lg">
                            <span>Loading the quiz</span>
                            <div className="w-6 h-6 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                        </div>

                        <div className="relative w-full h-14 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-out flex items-center justify-center"
                                style={{ width: `${loadingProgress}%` }}
                            >
                                <span className="text-white font-black text-lg drop-shadow-sm">
                                    {loadingProgress}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const quizProgress = ((currentStep + 1) / steps.length) * 100;

    return (
        <main className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#00ca86] text-white'} selection:bg-orange-500/20`}>
            <header className="h-16 flex items-center px-6 max-w-2xl mx-auto w-full">
                {currentStep > 0 ? (
                    <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className={`p-2 -ml-2 rounded-full transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-white/10 text-white'}`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                ) : (
                    <button
                        onClick={() => setView('intro')}
                        className={`p-2 -ml-2 rounded-full transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-white/10 text-white'}`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                <div className="flex-1 flex justify-center mr-6">
                    <div className="flex items-center gap-1">
                        <Timer className={`w-5 h-5 ${isLight ? 'text-[#00ca86]' : 'text-white'}`} />
                        <span className={`font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>FastingPro</span>
                    </div>
                </div>
            </header>

            <div className={`h-2 w-full font-bold ${isLight ? 'bg-slate-200' : 'bg-black/10'}`}>
                <div
                    className={`h-full transition-all duration-500 ease-out ${isLight ? 'bg-[#00ca86]' : 'bg-white'}`}
                    style={{ width: `${quizProgress}%` }}
                />
            </div>

            <div className="max-w-xl mx-auto px-6 py-12 md:py-20 animate-fade-in text-center md:text-left">
                <div className="space-y-8">
                    <div className="space-y-4">
                        {currentStepData.sectionTitle && (
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight animate-slide-up">
                                {currentStepData.sectionTitle}
                            </h2>
                        )}
                        <div className="space-y-1">
                            {!currentStepData.sectionTitle && !currentStepData.subtitle && (
                                <span className={`text-sm font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/70'}`}>
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                            )}
                            <h1 className={`text-3xl md:text-4xl font-extrabold leading-tight ${isLight && (currentStepData.sectionTitle || currentStepData.subtitle) ? 'text-slate-900' : 'text-inherit'}`}>
                                {currentStepData.question}
                            </h1>
                            {currentStepData.subtitle && (
                                <p className="text-slate-500 font-medium text-lg mt-2">
                                    {currentStepData.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {currentStepData.type === 'height' ? (
                        <div className="space-y-10">
                            <div className="flex justify-center">
                                <div className="inline-flex bg-slate-100 p-1 rounded-full">
                                    <button
                                        onClick={() => setUnit('ft')}
                                        className={`px-12 py-3 rounded-full font-black transition-all ${unit === 'ft' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}
                                    >
                                        ft
                                    </button>
                                    <button
                                        onClick={() => setUnit('cm')}
                                        className={`px-12 py-3 rounded-full font-black transition-all ${unit === 'cm' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}
                                    >
                                        cm
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {unit === 'ft' ? (
                                    <>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                placeholder="Your height"
                                                value={answers['height_ft'] || ''}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswers({ ...answers, 'height_ft': e.target.value })}
                                                className="w-full bg-white border-2 border-slate-100 rounded-2xl p-6 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ca86] transition-all placeholder:text-slate-300 pr-12"
                                                autoFocus
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400 pointer-events-none">ft</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                placeholder="Your height"
                                                value={answers['height_in'] || ''}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswers({ ...answers, 'height_in': e.target.value })}
                                                className="w-full bg-white border-2 border-slate-100 rounded-2xl p-6 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ca86] transition-all placeholder:text-slate-300 pr-12"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400 pointer-events-none">in</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="relative col-span-2">
                                        <input
                                            type="number"
                                            placeholder="Your height"
                                            value={answers['height_cm'] || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswers({ ...answers, 'height_cm': e.target.value })}
                                            className="w-full bg-white border-2 border-slate-100 rounded-2xl p-6 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ca86] transition-all placeholder:text-slate-300 pr-12"
                                            autoFocus
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400 pointer-events-none">cm</span>
                                    </div>
                                )}
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        const canProceed = unit === 'ft'
                                            ? answers['height_ft'] && answers['height_in']
                                            : answers['height_cm'];

                                        if (canProceed) {
                                            if (currentStep < steps.length - 1) {
                                                setCurrentStep(currentStep + 1);
                                            } else {
                                                router.push('/register');
                                            }
                                        }
                                    }}
                                    disabled={!(unit === 'ft' ? (answers['height_ft'] && answers['height_in']) : answers['height_cm'])}
                                    className={`
                              w-full py-5 rounded-2xl text-xl font-black transition-all shadow-lg
                              ${(unit === 'ft' ? (answers['height_ft'] && answers['height_in']) : answers['height_cm'])
                                            ? 'bg-[#00ca86] text-white hover:scale-[1.02] active:scale-[0.98]'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                            `}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'input' ? (
                        <div className="space-y-12">
                            <div className="relative">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    min="1"
                                    max="120"
                                    placeholder={currentStepData.placeholder}
                                    value={answers[currentStepData.id] || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswers({ ...answers, [currentStepData.id]: e.target.value })}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter' && answers[currentStepData.id]) {
                                            if (currentStep < steps.length - 1) {
                                                setCurrentStep(currentStep + 1);
                                            } else {
                                                router.push('/register');
                                            }
                                        }
                                    }}
                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-6 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ca86] transition-all placeholder:text-slate-300"
                                    autoFocus
                                />
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        if (answers[currentStepData.id]) {
                                            if (currentStep < steps.length - 1) {
                                                setCurrentStep(currentStep + 1);
                                            } else {
                                                router.push('/register');
                                            }
                                        }
                                    }}
                                    disabled={!answers[currentStepData.id] || answers[currentStepData.id].length === 0}
                                    className={`
                              w-full py-5 rounded-2xl text-xl font-black transition-all shadow-lg
                              ${answers[currentStepData.id] && answers[currentStepData.id].length > 0
                                            ? 'bg-[#00ca86] text-white hover:scale-[1.02] active:scale-[0.98]'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                            `}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {currentStepData.options?.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    className={`
                  group relative flex items-center gap-4 p-6 rounded-3xl text-left transition-all duration-200
                  ${answers[currentStepData.id] === option.id
                                            ? (isLight ? 'bg-white text-[#00ca86] ring-2 ring-[#00ca86] shadow-lg' : 'bg-white text-[#00ca86] shadow-xl scale-[1.02]')
                                            : (isLight ? 'bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-100' : 'bg-white/10 hover:bg-white/20 text-white')}
                `}
                                >
                                    {option.icon && (
                                        <div className={`
                    p-3 rounded-2xl transition-colors
                    ${answers[currentStepData.id] === option.id
                                                ? (isLight ? 'bg-[#00ca86]/10' : 'bg-[#00ca86]/10')
                                                : (isLight ? 'bg-slate-100' : 'bg-white/10')}
                  `}>
                                            {option.icon}
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{option.label}</div>
                                        {option.description && (
                                            <div className={`text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-white/80'}`}>
                                                {option.description}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${answers[currentStepData.id] === option.id
                                            ? (isLight ? 'border-[#00ca86] bg-[#00ca86]' : 'border-[#00ca86] bg-[#00ca86]')
                                            : (isLight ? 'border-slate-200 bg-slate-100' : 'border-white/20 group-hover:border-white/40')}
                `}>
                                        {answers[currentStepData.id] === option.id && (
                                            <Check className="w-4 h-4 text-white" strokeWidth={4} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
