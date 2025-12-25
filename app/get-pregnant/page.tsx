'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Timer } from 'lucide-react';

interface Option {
    id: string;
    label: string;
    icon?: string;
}

interface Step {
    id: string;
    question: string;
    subtitle?: string;
    type?: 'select' | 'year' | 'info' | 'testimonials' | 'height_weight' | 'multi_select';
    options?: Option[];
    highlight?: string;
    highlightSuffix?: string;
    testimonials?: { quote: string; author: string; highlight?: string }[];
    ratingText?: string;
    variant?: 'stats' | 'standard';
    buttonText?: string;
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
    {
        id: 'children_goal',
        question: 'How many children do you ultimately want to have?',
        options: [
            { id: '1', label: '1' },
            { id: '2', label: '2' },
            { id: '3', label: '3' },
            { id: 'more_3', label: 'More than 3' },
        ]
    },
    {
        id: 'trying_duration',
        question: 'How long have you been trying to get pregnant?',
        options: [
            { id: 'just_started', label: "I've just started" },
            { id: '3_6_months', label: 'Around 3–6 months' },
            { id: '7_12_months', label: 'Around 7–12 months' },
            { id: 'more_12_months', label: 'More than 12 months' },
        ]
    },
    {
        id: 'birth_year',
        question: 'What year were you born?',
        subtitle: 'We ask this to build a clearer picture of your fertility.',
        type: 'year',
    },
    {
        id: 'support_info',
        question: "We're here to support you!",
        type: 'info',
        variant: 'stats',
        highlight: '5.7 million',
        highlightSuffix: 'women in their 30s got pregnant',
    },
    {
        id: 'testimonials',
        question: '',
        type: 'testimonials',
        ratingText: 'Over 7 million 5-star ratings',
        testimonials: [
            { quote: 'Best app. I wanted to get pregnant for my 2nd and', highlight: 'this app has helped me.', author: 'Flo user' },
            { quote: 'Flo helped me track my period and', highlight: 'helped me find out early that I was pregnant.', author: 'Flo user' },
            { quote: 'Flo has definitely educated me about the menstrual cycle and conception. I honestly didn\'t realize how little I knew until I started using the app to help me.', author: 'Flo user' },
            { quote: 'It helped me track my fertile ovulation till I', highlight: 'got pregnant right through to delivery.', author: 'Flo user' },
        ],
    },
    {
        id: 'age_info',
        question: 'Good to know',
        subtitle: 'It can be more difficult to get pregnant as we get older, so understanding your fertile window is key.',
        type: 'info',
        variant: 'standard',
        buttonText: 'OK, got it',
    },
    {
        id: 'last_period_knowledge',
        question: 'Do you know when your last period started?',
        subtitle: 'We’ll use this to help identify when you could be ovulating.',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
            { id: 'no_periods', label: 'I don’t get periods; I’m on birth control' },
        ]
    },
    {
        id: 'period_changes',
        question: 'Have you noticed any changes to your period recently?',
        options: [
            { id: 'heavier', label: 'Heavier flow' },
            { id: 'lighter', label: 'Lighter flow' },
            { id: 'irregular', label: 'Irregular periods' },
            { id: 'longer_shorter', label: 'Longer/shorter periods' },
        ]
    },
    {
        id: 'discharge_texture',
        question: 'Have you ever noticed an egg white texture to your discharge?',
        subtitle: 'This is usually a sign of ovulation.',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
            { id: 'not_sure', label: 'I’m not sure' },
        ]
    },
    {
        id: 'discharge_tracking_info',
        question: 'Keep track of your discharge',
        subtitle: 'Regularly tracking the color, texture, and amount of your discharge can help you tell when you’re most fertile (and when something’s not right).',
        type: 'info',
        variant: 'standard',
        buttonText: 'Good to know',
    },
    {
        id: 'sex_frequency',
        question: 'Are you having sex at least every other day during your fertile window?',
        subtitle: 'Medical experts recommend this to maximize your chances of conception.',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ]
    },
    {
        id: 'cycle_tracking_info',
        question: 'Track your cycle to understand your fertility window and get educational insights',
        type: 'info',
        variant: 'standard',
        buttonText: 'Great!',
    },
    {
        id: 'birth_control_history',
        question: 'Have you ever been on hormonal birth control?',
        options: [
            { id: 'yes_past', label: 'Yes, I used to be on hormonal birth control' },
            { id: 'yes_now', label: 'Yes, I’m on hormonal birth control now' },
            { id: 'no_never', label: 'No, never' },
            { id: 'prefer_not_to_say', label: 'Prefer not to answer' },
        ]
    },
    {
        id: 'prenatal_vitamins',
        question: 'Do you take any prenatal vitamins?',
        options: [
            { id: 'multivitamins', label: 'I take multivitamins' },
            { id: 'folic_acid', label: 'I take folic acid' },
            { id: 'none', label: 'I don’t take any' },
            { id: 'prefer_not_to_say', label: 'Prefer not to answer' },
        ]
    },
    {
        id: 'medical_conditions',
        question: 'Do you have any conditions that may affect your cycle?',
        options: [
            { id: 'pcos', label: 'PCOS' },
            { id: 'endometriosis', label: 'Endometriosis' },
            { id: 'thyroid', label: 'Thyroid disorder' },
            { id: 'fibroids', label: 'Fibroids' },
            { id: 'none', label: 'None of the above' },
        ]
    },
    {
        id: 'health_insights_info',
        question: 'Get insights you can trust about your health condition',
        type: 'info',
        variant: 'standard',
        buttonText: 'Next',
    },
    {
        id: 'biometrics',
        question: 'What’s your height and weight?',
        type: 'height_weight',
    },
    {
        id: 'symptoms',
        question: 'Have you noticed any of these symptoms today?',
        subtitle: 'Select all that apply.',
        type: 'multi_select',
        options: [
            { id: 'cramps', label: 'Cramps', icon: 'cramps' },
            { id: 'tender_breasts', label: 'Tender breasts', icon: 'breasts' },
            { id: 'fatigue', label: 'Fatigue', icon: 'fatigue' },
            { id: 'bloating', label: 'Bloating', icon: 'bloating' },
        ]
    },
];

export default function GetPregnantPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [selectedOption, setSelectedOption] = useState<string | string[] | null>(null);
    const [yearDigits, setYearDigits] = useState(['', '', '', '']);
    const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
    const [heightWeight, setHeightWeight] = useState({ height: '', weight: '', heightFt: '', heightIn: '' });

    const currentStepData = steps[currentStep];

    const handleOptionSelect = (optionId: string) => {
        if (currentStepData.type === 'multi_select') {
            const currentSelected = Array.isArray(selectedOption) ? [...selectedOption] : [];
            const newSelected = currentSelected.includes(optionId)
                ? currentSelected.filter(id => id !== optionId)
                : [...currentSelected, optionId];

            setSelectedOption(newSelected);
            setAnswers(prev => ({ ...prev, [currentStepData.id]: newSelected }));
        } else {
            setSelectedOption(optionId);
            setAnswers(prev => ({ ...prev, [currentStepData.id]: optionId }));
        }
    };

    const handleHeightWeightChange = (field: string, value: string) => {
        if (!/^\d*\.?\d*$/.test(value)) return;

        const newValues = { ...heightWeight, [field]: value };
        setHeightWeight(newValues);

        // Update answers directly
        if (unitSystem === 'metric') {
            if (newValues.height && newValues.weight) {
                setAnswers(prev => ({ ...prev, [currentStepData.id]: JSON.stringify({ unit: 'metric', height: newValues.height, weight: newValues.weight }) }));
            } else {
                const { [currentStepData.id]: _, ...rest } = answers;
                setAnswers(rest);
            }
        } else {
            if (newValues.heightFt && newValues.heightIn && newValues.weight) {
                setAnswers(prev => ({ ...prev, [currentStepData.id]: JSON.stringify({ unit: 'imperial', heightFt: newValues.heightFt, heightIn: newValues.heightIn, weight: newValues.weight }) }));
            } else {
                const { [currentStepData.id]: _, ...rest } = answers;
                setAnswers(rest);
            }
        }
    };

    const handleYearDigitChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newDigits = [...yearDigits];
            newDigits[index] = value;
            setYearDigits(newDigits);

            const year = newDigits.join('');
            if (year.length === 4) {
                setAnswers({ ...answers, [currentStepData.id]: year });
            }

            // Auto-focus next input
            if (value && index < 3) {
                const nextInput = document.getElementById(`year-digit-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setSelectedOption(null);
            setYearDigits(['', '', '', '']);
            setHeightWeight({ height: '', weight: '', heightFt: '', heightIn: '' });
        } else {
            // Navigate to next page or complete
            router.push('/');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setSelectedOption(answers[steps[currentStep - 1].id] || null);
            setYearDigits(['', '', '', '']);
            setHeightWeight({ height: '', weight: '', heightFt: '', heightIn: '' });
        } else {
            router.push('/');
        }
    };

    const quizProgress = ((currentStep + 1) / steps.length) * 100;
    const isYearComplete = yearDigits.every((d: string) => d !== '');
    const isBiometricsComplete = unitSystem === 'metric'
        ? heightWeight.height && heightWeight.weight
        : heightWeight.heightFt && heightWeight.heightIn && heightWeight.weight;

    const canProceed = currentStepData.type === 'year'
        ? isYearComplete
        : currentStepData.type === 'info' || currentStepData.type === 'testimonials'
            ? true
            : currentStepData.type === 'height_weight'
                ? !!isBiometricsComplete
                : currentStepData.type === 'multi_select'
                    ? (Array.isArray(selectedOption) && selectedOption.length > 0)
                    : !!selectedOption;

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

                    {/* Year Input */}
                    {currentStepData.type === 'year' ? (
                        <div className="flex justify-center gap-4">
                            {yearDigits.map((digit: string, index: number) => (
                                <input
                                    key={index}
                                    id={`year-digit-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleYearDigitChange(index, e.target.value)}
                                    className="w-16 h-20 text-center text-2xl font-bold bg-slate-100 border-2 border-transparent rounded-xl focus:border-pink-400 focus:bg-white focus:outline-none transition-all"
                                    placeholder="Y"
                                />
                            ))}
                        </div>
                    ) : currentStepData.type === 'info' ? (
                        /* Info/Social Proof */
                        <div className="flex flex-col items-center text-center space-y-8">
                            {/* Illustration */}
                            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 rounded-3xl overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {currentStepData.variant === 'standard' ? (
                                        currentStepData.id === 'discharge_tracking_info' ? (
                                            /* Discharge Grid Illustration */
                                            <div className="grid grid-cols-3 gap-6 p-6">
                                                {[...Array(9)].map((_, i) => (
                                                    <div key={i} className="w-12 h-12 rounded-full bg-pink-200/50 flex items-center justify-center">
                                                        <div className={`w-6 h-6 rounded-full ${i === 4 ? 'bg-pink-500' : 'bg-pink-300'}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : currentStepData.id === 'cycle_tracking_info' ? (
                                            /* Cycle Tracking Mood Chart */
                                            <div className="relative w-full h-full p-6 flex items-center justify-center">
                                                {/* Chart curve background */}
                                                <svg viewBox="0 0 200 100" className="w-full absolute text-orange-200 fill-none stroke-current stroke-[3]">
                                                    <path d="M10,90 Q50,90 70,50 T130,50 T190,90" />
                                                </svg>
                                                {/* Mood bubbles */}
                                                <div className="absolute top-1/4 left-1/4 bg-orange-100 px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                                                    <span>⚡</span> Energetic
                                                </div>
                                                <div className="absolute top-1/3 right-1/4 bg-orange-100 px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                                                    <span>😌</span> Calm
                                                </div>
                                                <div className="absolute bottom-1/4 left-10 bg-orange-100 px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                                                    <span>😔</span> Sad
                                                </div>
                                                <div className="absolute bottom-1/4 right-10 bg-orange-100 px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                                                    <span>😠</span> Irritated
                                                </div>
                                            </div>
                                        ) : currentStepData.id === 'health_insights_info' ? (
                                            /* Health Insights Illustration */
                                            <div className="relative w-full h-full p-6">
                                                {/* Testimonial Bubble */}
                                                <div className="absolute top-4 left-4 right-12 bg-white rounded-2xl p-4 shadow-lg text-left z-10">
                                                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                                                        “As someone with PCOS and irregular periods, <span className="text-pink-500">this app has been a lifesaver</span> in assisting me with tracking my fertility!”
                                                    </p>
                                                    <p className="mt-2 text-xs text-slate-500 font-semibold">FastingPro user</p>
                                                </div>
                                                {/* Small info cards */}
                                                <div className="absolute bottom-4 left-4 w-24 h-28 bg-blue-100 rounded-xl p-2 flex flex-col justify-end shadow-sm">
                                                    <p className="text-[10px] font-bold text-slate-700 leading-tight">How thyroid affects fertility</p>
                                                </div>
                                                <div className="absolute bottom-4 left-32 w-24 h-28 bg-pink-200 rounded-xl p-2 flex flex-col justify-end shadow-sm">
                                                    <p className="text-[10px] font-bold text-slate-700 leading-tight">Endometriosis & fertility</p>
                                                </div>
                                                {/* Character placeholder */}
                                                <div className="absolute bottom-0 right-0 w-32 h-48 bg-contain bg-no-repeat bg-bottom z-0 opacity-80" style={{ backgroundImage: 'url(/images/woman-placeholder.png)' }}>
                                                    <div className="w-full h-full flex items-end justify-center pb-2 text-6xl">👩🏽</div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Standard Illustration (Chart/Cycle) */
                                            <div className="relative w-64 h-64">
                                                {/* Circular cycle */}
                                                <div className="absolute inset-0 rounded-full border-[16px] border-slate-200 border-t-pink-400 border-r-teal-400 rotate-45 transform" />
                                                {/* Character */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-8xl">👩‍⚕️</div>
                                                </div>
                                                {/* Labels */}
                                                <div className="absolute -top-4 right-0 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">Period</div>
                                                <div className="absolute bottom-10 -right-8 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">Fertile</div>
                                            </div>
                                        )
                                    ) : (
                                        /* Stats Illustration */
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full bg-pink-200/60 absolute -left-8 top-0" />
                                            <div className="w-24 h-24 rounded-full bg-rose-200/80 absolute right-0 top-4 flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full bg-rose-400" />
                                            </div>
                                            <div className="text-6xl">🤰</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text Content */}
                            {currentStepData.variant === 'standard' ? (
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-slate-900">{currentStepData.question}</h2>
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        {currentStepData.subtitle}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-slate-600 font-semibold text-lg">
                                        {currentStepData.question}
                                    </p>
                                    <p className="text-3xl md:text-4xl font-extrabold leading-tight">
                                        <span className="text-pink-500">{currentStepData.highlight}</span>{' '}
                                        <span className="text-slate-800">{currentStepData.highlightSuffix}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : currentStepData.type === 'testimonials' ? (
                        /* Testimonials */
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 gap-4">
                                {currentStepData.testimonials?.map((testimonial, index) => (
                                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                                        <div className="relative z-10 space-y-3">
                                            <p className="text-slate-700 font-medium leading-relaxed">
                                                "{testimonial.quote}
                                                {testimonial.highlight && (
                                                    <span className="font-bold text-slate-900"> {testimonial.highlight}</span>
                                                )}
                                                "
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xs">
                                                    {testimonial.author.charAt(0)}
                                                </div>
                                                <span className="text-slate-400 text-sm font-medium">{testimonial.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Rating Badge */}
                            <div className="flex flex-col items-center gap-3 py-4">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div key={star} className="text-2xl text-yellow-400">★</div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 text-teal-500">🌿</div>
                                    <p className="text-2xl font-bold text-slate-900 text-center max-w-[200px] leading-tight">
                                        {currentStepData.ratingText}
                                    </p>
                                    <div className="h-12 w-12 text-teal-500 transform scale-x-[-1]">🌿</div>
                                </div>
                            </div>
                        </div>
                    ) : currentStepData.type === 'height_weight' ? (
                        <div className="flex flex-col items-center space-y-8">
                            {/* Toggle */}
                            <div className="bg-slate-100 p-1 rounded-full flex gap-1">
                                <button
                                    onClick={() => setUnitSystem('metric')}
                                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${unitSystem === 'metric' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Metric
                                </button>
                                <button
                                    onClick={() => setUnitSystem('imperial')}
                                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${unitSystem === 'imperial' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Imperial
                                </button>
                            </div>

                            {/* Inputs */}
                            <div className="w-full space-y-6">
                                {unitSystem === 'metric' ? (
                                    <>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={heightWeight.height}
                                                onChange={(e) => handleHeightWeightChange('height', e.target.value)}
                                                className="w-full p-4 pr-12 rounded-2xl bg-slate-100 text-lg font-bold border-2 border-transparent focus:border-pink-400 focus:bg-white focus:outline-none transition-all"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">cm</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={heightWeight.weight}
                                                onChange={(e) => handleHeightWeightChange('weight', e.target.value)}
                                                className="w-full p-4 pr-12 rounded-2xl bg-slate-100 text-lg font-bold border-2 border-transparent focus:border-pink-400 focus:bg-white focus:outline-none transition-all"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">kg</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={heightWeight.heightFt}
                                                    onChange={(e) => handleHeightWeightChange('heightFt', e.target.value)}
                                                    className="w-full p-4 pr-12 rounded-2xl bg-slate-100 text-lg font-bold border-2 border-transparent focus:border-pink-400 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">ft</span>
                                            </div>
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={heightWeight.heightIn}
                                                    onChange={(e) => handleHeightWeightChange('heightIn', e.target.value)}
                                                    className="w-full p-4 pr-12 rounded-2xl bg-slate-100 text-lg font-bold border-2 border-transparent focus:border-pink-400 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">in</span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={heightWeight.weight}
                                                onChange={(e) => handleHeightWeightChange('weight', e.target.value)}
                                                className="w-full p-4 pr-12 rounded-2xl bg-slate-100 text-lg font-bold border-2 border-transparent focus:border-pink-400 focus:bg-white focus:outline-none transition-all"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">lb</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Options */
                        <div className="space-y-4">
                            {currentStepData.options?.map((option) => {
                                const isSelected = Array.isArray(selectedOption)
                                    ? selectedOption.includes(option.id)
                                    : selectedOption === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(option.id)}
                                        className={`
                                            w-full p-5 rounded-2xl text-left font-bold text-lg transition-all
                                            flex items-center justify-between
                                            ${isSelected
                                                ? 'bg-pink-100 border-2 border-pink-400'
                                                : 'bg-slate-100 border-2 border-transparent hover:bg-slate-200'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            {option.icon && (
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                                                    {option.id === 'cramps' ? '⚡'
                                                        : option.id === 'tender_breasts' ? '👙'
                                                            : option.id === 'fatigue' ? '🔋'
                                                                : option.id === 'bloating' ? '🎈'
                                                                    : '•'}
                                                </div>
                                            )}
                                            <span className="text-slate-800">{option.label}</span>
                                        </div>

                                        <div className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                                            ${isSelected
                                                ? 'border-pink-500 bg-pink-500'
                                                : 'border-slate-300'
                                            }
                                        `}>
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                    <button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className={`
                            w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg
                            ${canProceed
                                ? 'bg-pink-400 text-white hover:bg-pink-500 hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-pink-200 text-pink-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {currentStepData.buttonText || 'Next'}
                    </button>
                </div>
            </div>
        </main>
    );
}

