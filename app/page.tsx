'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Timer, Target, Brain, Heart, Zap, User, Loader2, GitBranch, Clock, RefreshCcw, Briefcase, Search, Calendar, Star, ThumbsUp, ThumbsDown, Hand, Activity, Droplets, Droplet, HeartPulse, Wind, UserCircle, Container, Ban, Dumbbell, Weight, Soup, Coffee, XCircle, Scan, Frown, Meh, Smile, Calculator, FileText, Cpu, BarChart3, Cookie, GlassWater, Moon, Pizza, Utensils, Wine, Hourglass, Users, HelpCircle, Apple, Salad, BookOpen, Scale, Fish, Leaf, Wheat, GraduationCap, Shirt, Magnet, Ruler, Flower2, Infinity, Palmtree, CakeSlice, IceCream, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Option {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Step {
  id: string;
  question: string;
  subtitle?: string;
  options?: Option[];
  theme?: 'green' | 'light';
  type?: 'select' | 'input' | 'height' | 'weight' | 'summary' | 'testimonial' | 'bmi_summary' | 'feature_intro' | 'scanner_comparison' | 'tech_intro' | 'transformation' | 'diet_comparison' | 'food_comparison' | 'exercise_comparison' | 'meal_comparison' | 'nutrition_report' | 'motivation_intro' | 'date_picker' | 'goal_chart' | 'weight_comparison_bar' | 'statement_relation' | 'social_proof' | 'feature_highlight' | 'processing_plan' | 'subscription_plan' | 'payment_method';
  multiSelect?: boolean;
  layout?: 'list' | 'grid';
  placeholder?: string;
  bg?: string;
  comparison?: {
    left: { label: string; image: string };
    right: { label: string; image: string };
  };
}

const steps: Step[] = [
  {
    id: 'goal',
    question: 'What can we help you do?',
    subtitle: 'Select all goals that apply.',
    theme: 'light',
    type: 'select',
    multiSelect: true,
    layout: 'grid',
    options: [
      { id: 'get_pregnant', label: 'Get pregnant', icon: <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl">🤰</div> },
      { id: 'track_pregnancy', label: 'Track my pregnancy', icon: <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl">👶</div> },
      { id: 'track_period', label: 'Track my period', icon: <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">📅</div> },
      { id: 'understand_body', label: 'Understand my body', icon: <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-3xl">🧠</div> },
      { id: 'fasting', label: 'Fasting', icon: <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">⚖️</div> },
      { id: 'enhance_sex_life', label: 'Enhance my sex life', icon: <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">🔥</div> },
      { id: 'decode_discharge', label: 'Decode my discharge', icon: <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">🧪</div> },
      { id: 'none', label: 'None of the above', icon: <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-3xl">❤️</div> },
    ]
  },
  {
    id: 'gender',
    question: 'What is your gender?',
    theme: 'green',
    options: [
      { id: 'female', label: 'Female', icon: <div className="w-6 h-6 text-pink-500">♀</div> },
      { id: 'male', label: 'Male', icon: <div className="w-6 h-6 text-blue-500">♂</div> },
      { id: 'other', label: 'Other', icon: <User className="w-6 h-6" /> },
    ]
  },
  {
    id: 'women_health_goals',
    question: 'What are your health goals?',
    theme: 'light',
    options: [
      { id: 'pregnant', label: 'Get pregnant', icon: <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">🤰</div> },
      { id: 'track_period', label: 'Track my period', icon: <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">📅</div> },
      { id: 'lose_weight', label: 'Lose weight', icon: <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">⚖️</div> },
      { id: 'feel_better', label: 'Feel better', icon: <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">❤️</div> },
    ]
  },
  {
    id: 'tech_intro',
    type: 'tech_intro',
    question: 'Ready to start?',
  },
  {
    id: 'age',
    question: 'What is your age?',
    type: 'input',
    placeholder: 'Enter your age',
  },
  {
    id: 'height',
    question: 'What is your height?',
    type: 'height',
  },
  {
    id: 'weight_current',
    question: 'What is your current weight?',
    type: 'weight',
  },
  {
    id: 'weight_goal',
    question: 'What is your goal weight?',
    type: 'weight',
  },
  {
    id: 'bmi_summary',
    type: 'bmi_summary',
    question: 'Your BMI Analysis',
  },
  {
    id: 'processing_plan',
    type: 'processing_plan',
    question: 'Analyzing your information...',
  },
  {
    id: 'subscription_plan',
    type: 'subscription_plan',
    question: 'Your Personalized Fasting Plan',
  },
  {
    id: 'payment_method',
    type: 'payment_method',
    question: 'Choose your payment method',
  }
];

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [view, setView] = useState<'intro' | 'quiz'>('quiz'); // Direct to quiz

  const handleNext = () => {
    let nextStep = currentStep + 1;

    // Conditional Logic for Women's Health
    if (steps[currentStep].id === 'gender') {
      if (answers['gender'] !== 'female') {
        nextStep = steps.findIndex(s => s.id === 'tech_intro');
      }
    }

    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;

    // Skip back logic for gender
    if (steps[currentStep].id === 'tech_intro' && answers['gender'] !== 'female') {
      prevStep = steps.findIndex(s => s.id === 'gender');
    }

    if (prevStep >= 0) {
      setCurrentStep(prevStep);
    } else {
      setView('intro');
    }
  };

  const handleOptionSelect = (optionId: string) => {
    const step = steps[currentStep];
    if (step.multiSelect) {
      const currentAnswers: string[] = answers[step.id] || [];
      if (currentAnswers.includes(optionId)) {
        setAnswers({
          ...answers,
          [step.id]: currentAnswers.filter((id: string) => id !== optionId)
        });
      } else {
        setAnswers({
          ...answers,
          [step.id]: [...currentAnswers, optionId]
        });
      }
    } else {
      setAnswers({ ...answers, [step.id]: optionId });
      handleNext();
    }
  };

  const currentStepData = steps[currentStep];
  const Progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = (
    step: Step,
    currentStep: number,
    answers: Record<string, any>,
    handleOptionSelect: (id: string) => void,
    handleNext: () => void,
    setCurrentStep: (step: number) => void
  ) => {
    const isSelected = (id: string) => {
      if (step.multiSelect) {
        return (answers[step.id] || []).includes(id);
      }
      return answers[step.id] === id;
    };

    switch (step.type) {
      case 'tech_intro':
        return (
          <div className="text-center space-y-8 py-12">
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-blue-500/30 rounded-full animate-ping" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Cpu className="w-24 h-24 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Calculating your biology...</h3>
            <p className="text-gray-500">We're using our advanced core engine to create your personalized plan.</p>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              Next
            </button>
          </div>
        );

      case 'bmi_summary':
        const weight = parseFloat(answers['weight_current'] || '70');
        const height = parseFloat(answers['height'] || '170') / 100;
        const bmi = (weight / (height * height)).toFixed(1);

        return (
          <div className="space-y-8 py-8 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50">
              <div className="text-center space-y-2 mb-8">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Your BMI is</p>
                <h4 className="text-6xl font-black text-slate-800 tracking-tighter">{bmi}</h4>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
                  <Activity className="w-4 h-4" /> Healthy Weight
                </div>
              </div>

              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-8">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(parseFloat(bmi) / 40) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">Metabolism</p>
                  <p className="text-slate-800 font-black text-xl">Active</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1 tracking-wider">Potential</p>
                  <p className="text-slate-800 font-black text-xl">High</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-5 rounded-full bg-blue-600 text-white font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:-translate-y-1 active:scale-[0.98]"
            >
              Calculate My Plan
            </button>
          </div>
        );

      case 'select':
      default:
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className={step.layout === 'grid' ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                {step.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] flex flex-col items-center justify-center text-center gap-4 ${isSelected(option.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                      } ${step.layout === 'grid' ? 'aspect-square' : 'w-full flex-row text-left'}`}
                  >
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 ${isSelected(option.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`}>
                      {isSelected(option.id) && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">{option.icon}</div>
                    <span className={`text-base font-semibold leading-tight text-gray-900 ${step.layout === 'grid' ? 'max-w-[120px]' : ''}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {step.multiSelect && (
              <div className="mt-8 pb-8">
                <button
                  onClick={handleNext}
                  disabled={!(answers[step.id]?.length > 0)}
                  className={`w-full py-4 rounded-full text-lg font-bold transition-all ${(answers[step.id]?.length > 0)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white flex flex-col min-h-[600px]">
        {/* Progress Bar */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <div className="flex items-center gap-1">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-900">FastingPro</span>
            </div>
            <div className="w-6 h-6" /> {/* Spacer */}
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"
              style={{ width: `${Progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {currentStepData.question}
            </h2>
            {currentStepData.subtitle && (
              <p className="text-xl text-gray-500 font-medium">
                {currentStepData.subtitle}
              </p>
            )}
          </div>

          {renderStepContent(currentStepData, currentStep, answers, handleOptionSelect, handleNext, setCurrentStep)}
        </div>
      </div>

      {/* Security Badge */}
      <div className="mt-6 flex items-center gap-2 text-slate-400 text-sm font-medium">
        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
        Your data is safe and encrypted
      </div>
    </main>
  );
}
