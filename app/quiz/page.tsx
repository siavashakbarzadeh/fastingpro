'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Timer, Target, Brain, Heart, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const steps = [
    {
        id: 'goal',
        question: 'What is your main goal?',
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
        options: [
            { id: 'beginner', label: 'Never tried it', icon: <div className="w-6 h-6 flex items-center justify-center font-bold">1</div> },
            { id: 'intermediate', label: 'I do it occasionally', icon: <div className="w-6 h-6 flex items-center justify-center font-bold">2</div> },
            { id: 'pro', label: 'I am a pro', icon: <div className="w-6 h-6 flex items-center justify-center font-bold">3</div> },
        ]
    },
    {
        id: 'activity',
        question: 'What is your activity level?',
        options: [
            { id: 'sedentary', label: 'Sedentary', description: 'Office job, little exercise' },
            { id: 'moderate', label: 'Moderate', description: 'Exercise 2-3 times a week' },
            { id: 'active', label: 'Active', description: 'Exercise daily or physical job' },
        ]
    }
];

export default function QuizPage() {
    const router = useRouter();
    const [view, setView] = useState<'intro' | 'quiz'>('intro');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    // Simulate loading progress for the intro screen
    useEffect(() => {
        if (view === 'intro') {
            const interval = setInterval(() => {
                setLoadingProgress((prev) => {
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

    const handleOptionSelect = (optionId: string) => {
        const newAnswers = { ...answers, [steps[currentStep].id]: optionId };
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
        <main className="min-h-screen bg-[#00ca86] text-white selection:bg-white/20">
            <header className="h-16 flex items-center px-6 max-w-2xl mx-auto w-full">
                {currentStep > 0 ? (
                    <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                ) : (
                    <button
                        onClick={() => setView('intro')}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                <div className="flex-1 flex justify-center mr-6">
                    <div className="flex items-center gap-1">
                        <Timer className="w-5 h-5" />
                        <span className="font-bold tracking-tight">FastingPro</span>
                    </div>
                </div>
            </header>

            <div className="h-2 bg-black/10 w-full font-bold">
                <div
                    className="h-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${quizProgress}%` }}
                />
            </div>

            <div className="max-w-xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <span className="text-white/70 text-sm font-bold uppercase tracking-widest">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                            {steps[currentStep].question}
                        </h1>
                    </div>

                    <div className="grid gap-4">
                        {steps[currentStep].options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={`
                  group relative flex items-center gap-4 p-6 rounded-3xl text-left transition-all duration-200
                  ${answers[steps[currentStep].id] === option.id
                                        ? 'bg-white text-[#00ca86] shadow-xl scale-[1.02]'
                                        : 'bg-white/10 hover:bg-white/20 text-white'}
                `}
                            >
                                {/* @ts-ignore */}
                                {option.icon && (
                                    <div className={`
                    p-3 rounded-2xl transition-colors
                    ${answers[steps[currentStep].id] === option.id ? 'bg-[#00ca86]/10' : 'bg-white/10'}
                  `}>
                                        {/* @ts-ignore */}
                                        {option.icon}
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="font-bold text-lg">{option.label}</div>
                                    {/* @ts-ignore */}
                                    {option.description && (
                                        <div className="text-sm opacity-80 mt-0.5">{option.description}</div>
                                    )}
                                </div>

                                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${answers[steps[currentStep].id] === option.id
                                        ? 'border-[#00ca86] bg-[#00ca86]'
                                        : 'border-white/20 group-hover:border-white/40'}
                `}>
                                    {answers[steps[currentStep].id] === option.id && (
                                        <Check className="w-4 h-4 text-white" strokeWidth={4} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
