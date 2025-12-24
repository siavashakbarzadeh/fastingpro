'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Timer } from 'lucide-react';

interface Option {
    id: string;
    label: string;
}

interface Step {
    id: string;
    question: string;
    subtitle?: string;
    options: Option[];
}

const steps: Step[] = [
    {
        id: 'feeling',
        question: 'How are you feeling about getting pregnant?',
        subtitle: "The journey to pregnancy is different for everyone — so we're checking in.",
        options: [
            { id: 'excited', label: 'Excited!' },
            { id: 'confident', label: 'Confident' },
            { id: 'anxious', label: 'Anxious' },
            { id: 'lonely', label: 'Lonely' },
        ]
    },
    {
        id: 'previous_pregnancy',
        question: 'Have you ever been pregnant before?',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
            { id: 'prefer_not', label: 'Prefer not to answer' },
        ]
    },
];

export default function GetPregnantPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const currentStepData = steps[currentStep];

    const handleOptionSelect = (optionId: string) => {
        setSelectedOption(optionId);
        setAnswers({ ...answers, [currentStepData.id]: optionId });
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setSelectedOption(null);
        } else {
            // Navigate to next page or complete
            router.push('/');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setSelectedOption(answers[steps[currentStep - 1].id] || null);
        } else {
            router.push('/');
        }
    };

    const quizProgress = ((currentStep + 1) / steps.length) * 100;

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-pink-500/20">
            {/* Header */}
            <header className="h-16 flex items-center px-6 max-w-2xl mx-auto w-full">
                <button
                    onClick={handleBack}
                    className="p-2 -ml-2 rounded-full transition-colors hover:bg-slate-200 text-slate-600"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 flex justify-center mr-6">
                    <div className="flex items-center gap-1">
                        <Timer className="w-5 h-5 text-pink-500" />
                        <span className="font-bold tracking-tight text-slate-900">FastingPro</span>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-200">
                <div
                    className="h-full transition-all duration-500 ease-out bg-pink-400"
                    style={{ width: `${quizProgress}%` }}
                />
            </div>

            {/* Content */}
            <div className="max-w-xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
                <div className="space-y-8">
                    {/* Question */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
                            {currentStepData.question}
                        </h1>
                        {currentStepData.subtitle && (
                            <p className="text-slate-500 font-medium text-lg">
                                {currentStepData.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        {currentStepData.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={`
                                    w-full p-5 rounded-2xl text-left font-bold text-lg transition-all
                                    flex items-center justify-between
                                    ${selectedOption === option.id
                                        ? 'bg-pink-100 border-2 border-pink-400'
                                        : 'bg-slate-100 border-2 border-transparent hover:bg-slate-200'
                                    }
                                `}
                            >
                                <span className="text-slate-800">{option.label}</span>
                                <div className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                                    ${selectedOption === option.id
                                        ? 'border-pink-500 bg-pink-500'
                                        : 'border-slate-300'
                                    }
                                `}>
                                    {selectedOption === option.id && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                    <button
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className={`
                            w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg
                            ${selectedOption
                                ? 'bg-pink-400 text-white hover:bg-pink-500 hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-pink-200 text-pink-400 cursor-not-allowed'
                            }
                        `}
                    >
                        Next
                    </button>
                </div>
            </div>
        </main>
    );
}
