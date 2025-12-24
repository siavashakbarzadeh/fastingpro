'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Timer, Target, Brain, Heart, Zap, User, Loader2, GitBranch, Clock, RefreshCcw, Briefcase, Search, Calendar, Star, ThumbsUp, ThumbsDown, Hand, Activity, Droplets, Droplet, HeartPulse, Wind, UserCircle, Container, Ban, Dumbbell, Weight, Soup, Coffee, XCircle, Scan, Frown, Meh, Smile, Calculator, FileText, Cpu, BarChart3, Cookie, GlassWater, Moon, Pizza, Utensils, Wine, Hourglass, Users, HelpCircle, Apple, Salad, BookOpen, Scale, Fish, Leaf, Wheat, GraduationCap, Shirt, Magnet, Ruler, Flower2, Infinity, Palmtree, CakeSlice, IceCream, CreditCard } from 'lucide-react';
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
    type?: 'select' | 'input' | 'height' | 'weight' | 'summary' | 'testimonial' | 'bmi_summary' | 'feature_intro' | 'scanner_comparison' | 'tech_intro' | 'transformation' | 'diet_comparison' | 'food_comparison' | 'exercise_comparison' | 'meal_comparison' | 'nutrition_report' | 'motivation_intro' | 'date_picker' | 'goal_chart' | 'weight_comparison_bar' | 'statement_relation' | 'social_proof' | 'feature_highlight' | 'processing_plan' | 'subscription_plan' | 'payment_method';
    multiSelect?: boolean;
    layout?: 'list' | 'grid';
    placeholder?: string;
    bg?: string;
    comparison?: {
        left: { title: string; subtitle: string; icon?: React.ReactNode; points?: string[]; value?: string };
        right: { title: string; subtitle: string; icon?: React.ReactNode | string; points?: string[]; value?: string };
    };
    exercises?: { name: string; time: string; icon: React.ReactNode }[];
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
        id: 'women_health_goals',
        question: "What's your goal?",
        theme: 'light',
        type: 'select',
        options: [
            { id: 'get_pregnant', label: 'Get pregnant', icon: <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl">🤰</div> },
            { id: 'track_pregnancy', label: 'Track my pregnancy', icon: <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl">👶</div> },
            { id: 'track_period', label: 'Track my period', icon: <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">📅</div> },
            { id: 'understand_body', label: 'Understand my body', icon: <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl">🧠</div> },
            { id: 'lose_weight', label: 'Lose weight', icon: <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl">⚖️</div> },
            { id: 'enhance_sex_life', label: 'Enhance my sex life', icon: <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">🔥</div> },
            { id: 'decode_discharge', label: 'Decode my discharge', icon: <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">🧪</div> },
            { id: 'none', label: 'None of the above', icon: <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-xl">❤️</div> },
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
    },
    {
        id: 'weight',
        question: 'What is your current weight?',
        subtitle: 'Weight is needed to determine a safe weight loss rate.',
        theme: 'light',
        type: 'weight'
    },
    {
        id: 'goal_weight',
        question: "What's your goal weight?",
        subtitle: 'A rough estimate will do - you can always change this later.',
        theme: 'light',
        type: 'weight'
    },
    {
        id: 'encouragement',
        question: '',
        theme: 'light',
        type: 'summary'
    },
    {
        id: 'activity_refined',
        question: 'What is your current activity level?',
        subtitle: 'This will help us determine how many extra calories you burn through exercise.',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'sedentary', label: "I'm not that active", icon: <SignalBars level={1} /> },
            { id: 'occasional', label: "I'm active once in a while", icon: <SignalBars level={2} /> },
            { id: 'active', label: "I'm active most days", icon: <SignalBars level={3} /> },
            { id: 'athlete', label: "I'm an athlete", icon: <SignalBars level={4} /> },
        ]
    },
    {
        id: 'work_schedule',
        question: "What's your work schedule?",
        theme: 'light',
        type: 'select',
        options: [
            { id: 'flexible', label: 'Flexible', icon: <GitBranch className="w-6 h-6 text-emerald-500" /> },
            { id: 'nine_to_five', label: 'Nine to five', icon: <Clock className="w-6 h-6 text-orange-500" /> },
            { id: 'shifts', label: 'Shifts', icon: <RefreshCcw className="w-6 h-6 text-blue-500" /> },
            { id: 'strict', label: 'Strict working hours', icon: <Briefcase className="w-6 h-6 text-amber-700" /> },
            { id: 'unemployed', label: 'Between jobs or unemployed', icon: <Search className="w-6 h-6 text-rose-500" /> },
            { id: 'seasonal', label: 'Seasonal', icon: <Calendar className="w-6 h-6 text-orange-400" /> },
        ]
    },
    {
        id: 'knowledge_level',
        question: 'How familiar are you with the topic of weight loss?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'beginner', label: "I'm new to weight loss", icon: <SignalBars level={1} /> },
            { id: 'intermediate', label: 'I have some experience but still need guidance', icon: <SignalBars level={2} /> },
            { id: 'advanced', label: 'I have rich experience', icon: <SignalBars level={3} /> },
        ]
    },
    {
        id: 'testimonial_james',
        question: 'Fastic makes weight loss easy & effective',
        theme: 'light',
        type: 'testimonial'
    },
    {
        id: 'fasting_history',
        question: 'Have you ever tried intermittent fasting?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'yes_like', label: 'Yes, I like it', icon: <ThumbsUp className="w-6 h-6 text-blue-400" /> },
            { id: 'yes_hard', label: "I tried it, but it wasn't for me", icon: <ThumbsDown className="w-6 h-6 text-emerald-500" /> },
            { id: 'no_want', label: 'No, but I want to try it.', icon: <Hand className="w-6 h-6 text-orange-400" /> },
            { id: 'no_interest', label: "No, I'm not interested.", icon: <ThumbsDown className="w-6 h-6 text-rose-400" /> },
        ]
    },
    {
        id: 'medical_conditions',
        question: 'Do you have any of the following medical conditions?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'none', label: "I don't have any of these", icon: <ThumbsUp className="w-6 h-6 text-blue-300" /> },
            { id: 'hypertension', label: 'Hypertension', icon: <Activity className="w-6 h-6 text-blue-500" /> },
            { id: 'cholesterol', label: 'High cholesterol', icon: <Droplets className="w-6 h-6 text-orange-500" /> },
            { id: 'obesity', label: 'Obesity', icon: <User className="w-6 h-6 text-blue-400" /> },
            { id: 'diabetes', label: 'Diabetes', icon: <Droplet className="w-6 h-6 text-rose-500" /> },
            { id: 'heart', label: 'Heart disease', icon: <HeartPulse className="w-6 h-6 text-rose-600" /> },
            { id: 'cancer', label: 'Cancer', icon: <Zap className="w-6 h-6 text-orange-600" /> },
            { id: 'lungs', label: 'Lung disease', icon: <Wind className="w-6 h-6 text-orange-400" /> },
            { id: 'thyroid', label: 'Thyroid disease', icon: <UserCircle className="w-6 h-6 text-blue-300" /> },
            { id: 'gastric', label: 'Gastric disease', icon: <Container className="w-6 h-6 text-orange-600" /> },
        ]
    },
    {
        id: 'bmi_summary',
        question: 'Personal summary based on your answers',
        theme: 'light',
        type: 'bmi_summary'
    },
    {
        id: 'ai_tracker_intro',
        question: "Let's prepare your meals effortlessly!",
        subtitle: 'Our revolutionary AI tracker makes the weight loss process much easier.',
        theme: 'light',
        type: 'summary'
    },
    {
        id: 'meal_habits',
        question: 'Do you usually keep a record of what you eat?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'every_meal', label: 'Every meal', icon: <Soup className="w-6 h-6 text-orange-400" /> },
            { id: 'when_remember', label: 'I do when I remember', icon: <Coffee className="w-6 h-6 text-amber-600" /> },
            { id: 'at_all', label: 'Not at all', icon: <XCircle className="w-6 h-6 text-rose-400" /> },
        ]
    },
    {
        id: 'nutrient_knowledge',
        question: 'Do you know what nutrients you have consumed?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'know_all', label: 'I do know all the nutrients', icon: <ThumbsUp className="w-6 h-6 text-blue-400" /> },
            { id: 'check_often', label: 'I often check the nutrient list', icon: <Scan className="w-6 h-6 text-blue-400" /> },
            { id: 'not_really', label: 'Not really', icon: <XCircle className="w-6 h-6 text-rose-400" /> },
        ]
    },
    {
        id: 'ai_scan_intro',
        question: 'A simple scan can tell you everything about your food',
        theme: 'light',
        type: 'feature_intro'
    },
    {
        id: 'eating_struggle',
        question: 'Do you always struggle with eating the wrong things after you dine?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'always', label: 'Always', icon: <Frown className="w-6 h-6 text-purple-400" /> },
            { id: 'sometimes', label: 'Sometimes', icon: <Meh className="w-6 h-6 text-blue-400" /> },
            { id: 'rarely', label: 'Rarely', icon: <Smile className="w-6 h-6 text-yellow-500" /> },
        ]
    },
    {
        id: 'scanner_comparison_1',
        question: 'Supports barcode and direct food scanning',
        theme: 'light',
        type: 'scanner_comparison',
        comparison: {
            left: { title: 'Traditional Method:', subtitle: 'Only available for food with barcode', icon: <Search className="w-10 h-10 text-white" /> },
            right: { title: 'Fastic AI Scanner:', subtitle: 'Simply take a picture of the food to get details', icon: <Scan className="w-10 h-10 text-[#00ca86]" /> }
        }
    },
    {
        id: 'scanner_comparison_2',
        question: 'Say goodbye to manual input, AI recognition is faster',
        theme: 'light',
        type: 'scanner_comparison',
        comparison: {
            left: { title: 'Traditional Method:', subtitle: 'Loging food portions manually takes forever', icon: <Calculator className="w-10 h-10 text-white" /> },
            right: { title: 'Fastic AI Scanner:', subtitle: 'A simple scan instantly reveals your food portions', icon: <Image src="/fit_physique_goal.png" alt="Portion" width={40} height={40} className="rounded-lg" /> }
        }
    },
    {
        id: 'scanner_comparison_3',
        question: "Can't find yor meal? AI tracker identifies every meal",
        theme: 'light',
        type: 'scanner_comparison',
        comparison: {
            left: { title: 'Traditional Method:', subtitle: 'Only a limited number of foods can be recognized', icon: <FileText className="w-10 h-10 text-white" /> },
            right: { title: 'Fastic AI Scanner:', subtitle: 'Accurately identifies all food components', icon: <Scan className="w-12 h-12 text-[#00ca86]" /> }
        }
    },
    {
        id: 'calorie_knowledge',
        question: 'Do you know the relationship between calories and weight?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'yes', label: 'Yes, calorie intake affects body weight', icon: <ThumbsUp className="w-6 h-6 text-blue-400" /> },
            { id: 'somewhat', label: 'Somewhat, calories impact weight.', icon: <Activity className="w-6 h-6 text-orange-400" /> },
            { id: 'no', label: "No, I'm not sure how calories influence weight.", icon: <XCircle className="w-6 h-6 text-rose-400" /> },
        ]
    },
    {
        id: 'tech_intro',
        question: 'Fastic uses the latest technologies to provide you with the best weight loss experience',
        theme: 'light',
        type: 'tech_intro'
    },
    {
        id: 'transformation_guarantee',
        question: 'With the revolutionary AI tracker, your success is guaranteed!',
        theme: 'light',
        type: 'transformation'
    },
    {
        id: 'eating_habits_intro',
        question: "Let's learn more about your eating habits",
        subtitle: 'Making smart food decisions is key to sustainable weight loss.',
        theme: 'light',
        type: 'summary'
    },
    {
        id: 'bad_habits',
        question: 'We all have some bad eating habits. Which is yours?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'sweets', label: 'I like chocolate and candy', icon: <Cookie className="w-6 h-6 text-orange-400" /> },
            { id: 'soda', label: 'Soda is my best friend', icon: <GlassWater className="w-6 h-6 text-blue-400" /> },
            { id: 'salty', label: 'I consume a lot of salty food', icon: <Droplets className="w-6 h-6 text-blue-300" /> },
            { id: 'midnight', label: "I'm a midnight snacker", icon: <Moon className="w-6 h-6 text-indigo-400" /> },
            { id: 'junk_food', label: 'Junk food is my guilty pleasure', icon: <Pizza className="w-6 h-6 text-rose-400" /> },
            { id: 'emotional', label: 'I eat whenever I feel bad', icon: <Frown className="w-6 h-6 text-slate-400" /> },
            { id: 'overeat', label: 'I tend to overeat', icon: <Utensils className="w-6 h-6 text-emerald-500" /> },
            { id: 'alcohol', label: "I won't say no to a drink", icon: <Wine className="w-6 h-6 text-rose-600" /> },
            { id: 'none', label: 'None of the above', icon: <XCircle className="w-6 h-6 text-slate-300" /> },
        ]
    },
    {
        id: 'snacking_triggers',
        question: 'What typically triggers your urge to snack and nibble?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'food_around', label: 'Food around me', icon: <Cookie className="w-6 h-6 text-orange-300" /> },
            { id: 'boredom', label: 'Boredom', icon: <Hourglass className="w-6 h-6 text-blue-400" /> },
            { id: 'hunger', label: 'Hunger', icon: <Soup className="w-6 h-6 text-orange-400" /> },
            { id: 'others', label: 'Other people snacking', icon: <Users className="w-6 h-6 text-emerald-400" /> },
            { id: 'something_else', label: 'Something else', icon: <HelpCircle className="w-6 h-6 text-slate-400" /> },
        ]
    },
    {
        id: 'diet_comparison',
        question: 'Fastic delivers long term results that fit your life',
        theme: 'light',
        type: 'diet_comparison',
        comparison: {
            left: {
                title: 'Restricted Diet',
                subtitle: '',
                points: ['Only temporary results', 'Ignores your needs', 'Unpleasant food to stick with', 'Eating the same food repeatedly']
            },
            right: {
                title: 'Fastic Meal Plan',
                subtitle: '',
                points: ['Achieves long-lasting results', 'Tailored to your lifestyle', 'Healthy and delicious meals', 'Diverse and flexible meal planning']
            }
        }
    },
    {
        id: 'improvement_priority',
        question: "What's most important when improving your eating habits?",
        theme: 'light',
        type: 'select',
        options: [
            { id: 'awareness', label: 'Being more aware of food choice', icon: <Smile className="w-6 h-6 text-yellow-400" /> },
            { id: 'whole_food', label: 'Focusing on whole food', icon: <Salad className="w-6 h-6 text-emerald-500" /> },
            { id: 'fruits_veggies', label: 'Aiming for more fruits & vegetables', icon: <Apple className="w-6 h-6 text-rose-500" /> },
            { id: 'nutrition_learning', label: 'Learning more about nutrition', icon: <BookOpen className="w-6 h-6 text-orange-400" /> },
            { id: 'avoid_temptation', label: 'Avoiding having tempting food nearby', icon: <Ban className="w-6 h-6 text-red-500" /> },
            { id: 'portion_size', label: 'Paying attention to portion size', icon: <Scale className="w-6 h-6 text-blue-500" /> },
        ]
    },
    {
        id: 'meal_frequency',
        question: 'How many meals do you typically eat per day?',
        theme: 'light',
        type: 'select',
        options: [
            {
                id: '2_meals',
                label: '2 meals per day',
                description: 'Breakfast or Dinner with Lunch',
                icon: (
                    <div className="flex gap-2">
                        <Salad className="w-6 h-6 text-emerald-400" />
                        <Soup className="w-6 h-6 text-orange-400" />
                    </div>
                )
            },
            {
                id: '3_meals',
                label: '3 meals per day',
                description: 'Breakfast, Lunch, and Dinner',
                icon: (
                    <div className="flex gap-2">
                        <Salad className="w-6 h-6 text-emerald-400" />
                        <Soup className="w-6 h-6 text-orange-400" />
                        <Salad className="w-6 h-6 text-blue-400" />
                    </div>
                )
            },
            {
                id: '4_meals',
                label: '4 meals per day',
                description: 'Breakfast, Lunch, Dinner, and 1 snack',
                icon: (
                    <div className="flex gap-2">
                        <Salad className="w-6 h-6 text-emerald-400" />
                        <Soup className="w-6 h-6 text-orange-400" />
                        <Salad className="w-6 h-6 text-blue-400" />
                        <Pizza className="w-6 h-6 text-rose-400" />
                    </div>
                )
            },
            {
                id: '5_meals',
                label: '5 meals per day',
                description: 'Breakfast, Lunch, Dinner, and 2 snacks',
                icon: (
                    <div className="flex gap-2">
                        <Salad className="w-6 h-6 text-emerald-400" />
                        <Soup className="w-6 h-6 text-orange-400" />
                        <Salad className="w-6 h-6 text-blue-400" />
                        <Pizza className="w-6 h-6 text-rose-400" />
                        <Cookie className="w-6 h-6 text-orange-300" />
                    </div>
                )
            },
        ]
    },
    {
        id: 'food_comparison',
        question: 'Learn to make better food choices',
        theme: 'light',
        type: 'food_comparison',
        comparison: {
            left: {
                title: "Fastic's recipe",
                subtitle: '',
                value: '460 kcal',
                icon: <Salad className="w-24 h-24 text-white" />
            },
            right: {
                title: 'Other meal',
                subtitle: '',
                value: '460 kcal',
                icon: <Cookie className="w-24 h-24 text-white" />
            }
        }
    },
    {
        id: 'exercise_comparison',
        question: 'Cut 500 calories a day effortlessly',
        theme: 'light',
        type: 'exercise_comparison',
        exercises: [
            { name: 'Dumbbell lifting', time: '65 min', icon: <Dumbbell className="w-8 h-8 text-indigo-400" /> },
            { name: 'Running', time: '60 min', icon: <Activity className="w-8 h-8 text-emerald-400" /> },
            { name: 'Swimming', time: '83 min', icon: <Droplets className="w-8 h-8 text-blue-400" /> },
            { name: 'Rope skipping', time: '50 min', icon: <Timer className="w-8 h-8 text-yellow-500" /> }
        ]
    },
    {
        id: 'water_intake',
        question: 'Daily Water Intake',
        subtitle: 'How many glasses of water do you drink per day?',
        theme: 'light',
        type: 'select',
        options: [
            {
                id: '2_glasses',
                label: '2 Glasses',
                icon: (
                    <div className="flex gap-1">
                        <GlassWater className="w-5 h-5 text-blue-300" />
                        <GlassWater className="w-5 h-5 text-blue-300" />
                    </div>
                )
            },
            {
                id: '2_6_glasses',
                label: '2-6 Glasses',
                icon: (
                    <div className="flex gap-1">
                        <GlassWater className="w-5 h-5 text-blue-300" />
                        <GlassWater className="w-5 h-5 text-blue-300" />
                        <GlassWater className="w-5 h-5 text-blue-300" />
                        <GlassWater className="w-5 h-5 text-blue-300" />
                    </div>
                )
            },
            {
                id: '6_plus_glasses',
                label: '6+ Glasses',
                icon: (
                    <div className="flex gap-1 flex-wrap max-w-[100px]">
                        <GlassWater className="w-5 h-5 text-blue-400" />
                        <GlassWater className="w-5 h-5 text-blue-400" />
                        <GlassWater className="w-5 h-5 text-blue-400" />
                        <GlassWater className="w-5 h-5 text-blue-300" />
                        <GlassWater className="w-5 h-5 text-blue-200" />
                        <GlassWater className="w-5 h-5 text-blue-100" />
                    </div>
                )
            },
            {
                id: 'other_drinks',
                label: 'I prefer other drinks',
                icon: (
                    <div className="flex gap-2">
                        <Coffee className="w-6 h-6 text-orange-700" />
                        <Soup className="w-6 h-6 text-emerald-600" />
                        <GlassWater className="w-6 h-6 text-orange-400" />
                    </div>
                )
            },
        ]
    },
    {
        id: 'eating_style',
        question: "What's your preferred eating style?",
        subtitle: 'Are you currently on a specific diet?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'everything', label: 'I eat everything', icon: <Check className="w-6 h-6 text-emerald-500" /> },
            { id: 'keto', label: 'Keto', icon: <Salad className="w-6 h-6 text-emerald-400" /> },
            { id: 'vegan', label: 'Vegan', icon: <Leaf className="w-6 h-6 text-emerald-600" /> },
            { id: 'vegetarian', label: 'Vegetarian', icon: <Moon className="w-6 h-6 text-yellow-500" /> },
            { id: 'paleo', label: 'Paleo', icon: <Utensils className="w-6 h-6 text-orange-400" /> },
            { id: 'climatarian', label: 'Climatarian', icon: <Container className="w-6 h-6 text-orange-600" /> },
            { id: 'alkaline', label: 'Alkaline', icon: <Apple className="w-6 h-6 text-rose-500" /> },
            { id: 'pescatarian', label: 'Pescatarian', icon: <Fish className="w-6 h-6 text-blue-400" /> },
        ]
    },
    {
        id: 'dietary_restrictions',
        question: 'Do you have any of the following dietary restrictions we should know about?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'none', label: 'None', icon: <XCircle className="w-6 h-6 text-rose-500" /> },
            { id: 'sugar_free', label: 'Sugar Free', icon: <div className="relative"><Cookie className="w-6 h-6 text-orange-400 opacity-50" /><Ban className="absolute inset-0 w-6 h-6 text-rose-500" /></div> },
            { id: 'lactose_free', label: 'Lactose Free', icon: <div className="relative"><Droplets className="w-6 h-6 text-blue-400 opacity-50" /><Ban className="absolute inset-0 w-6 h-6 text-rose-500" /></div> },
            { id: 'gluten_free', label: 'Gluten Free', icon: <div className="relative"><Wheat className="w-6 h-6 text-yellow-600 opacity-50" /><Ban className="absolute inset-0 w-6 h-6 text-rose-500" /></div> },
            { id: 'nut_free', label: 'Nut Free', icon: <div className="relative"><Container className="w-6 h-6 text-amber-700 opacity-50" /><Ban className="absolute inset-0 w-6 h-6 text-rose-500" /></div> },
        ]
    },
    {
        id: 'cooking_skills',
        question: 'How would you describe your cooking skills?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'expert', label: "I'm an expert cook", icon: <Utensils className="w-6 h-6 text-orange-400" /> },
            { id: 'learning', label: "I'm learning to be a better cook", icon: <GraduationCap className="w-6 h-6 text-indigo-500" /> },
            { id: 'none', label: "I don't know how to cook at all", icon: <HelpCircle className="w-6 h-6 text-emerald-500" /> },
        ]
    },
    {
        id: 'meal_prep_time',
        question: 'How much time are you willing to spend on each meal?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'less_15', label: 'Less than 15 min', icon: <Timer className="w-6 h-6 text-emerald-400" /> },
            { id: '15_30', label: '15 to 30 min', icon: <Timer className="w-6 h-6 text-orange-400" /> },
            { id: '30_60', label: '30 to 60 min', icon: <Timer className="w-6 h-6 text-rose-400" /> },
            { id: 'more_1h', label: 'More than 1 hour', icon: <Clock className="w-6 h-6 text-rose-500" /> },
        ]
    },
    {
        id: 'meal_comparison',
        question: 'Learn to make better food choices',
        theme: 'light',
        type: 'meal_comparison',
    },
    {
        id: 'nutrition_report',
        question: 'Nutrition report based on your answers',
        theme: 'light',
        type: 'nutrition_report',
    },
    {
        id: 'motivation_intro',
        question: "Let's find out what motivates you",
        subtitle: "It's scientifically proven that the right motivation drives long-term change. We just need a few more things from you to finalize your plan.",
        theme: 'light',
        type: 'motivation_intro',
    },
    {
        id: 'primary_motivation',
        question: 'What motivates you most?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'look', label: 'I want to change how I look', icon: <Search className="w-6 h-6 text-orange-400" /> },
            { id: 'feel', label: 'I want to feel better about myself', icon: <Flower2 className="w-6 h-6 text-rose-400" /> },
            {
                id: 'health', label: 'I want to improve my health', icon: (
                    <div className="relative">
                        <Heart className="w-6 h-6 text-orange-500" />
                        <Infinity className="w-3 h-3 text-blue-400 absolute -bottom-1 -right-1" />
                    </div>
                )
            },
        ]
    },
    {
        id: 'appearance_focus',
        question: "When it comes to changing how you look, what's most important to you?",
        theme: 'light',
        type: 'select',
        options: [
            { id: 'clothes', label: 'Looking better in my clothes', icon: <Shirt className="w-6 h-6 text-orange-300" /> },
            { id: 'measurements', label: 'Changing my body measurements', icon: <Ruler className="w-6 h-6 text-blue-400" /> },
            { id: 'attractive', label: 'Being more attractive', icon: <Magnet className="w-6 h-6 text-rose-400" /> },
            { id: 'satisfied', label: 'Being more satisfied with how I look', icon: <Search className="w-6 h-6 text-orange-400" /> },
        ]
    },
    {
        id: 'special_occasion',
        question: 'Is there a special occasion you want to lose weight for?',
        subtitle: 'Having a goal in mind can help motivate you to stay on track.',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'vacation', label: 'Vacation', icon: <Palmtree className="w-6 h-6 text-emerald-400" /> },
            { id: 'wedding', label: 'Wedding', icon: <CakeSlice className="w-6 h-6 text-rose-300" /> },
            { id: 'birthday', label: 'Birthday', icon: <CakeSlice className="w-6 h-6 text-orange-400" /> },
            { id: 'summer', label: 'Summer', icon: <IceCream className="w-6 h-6 text-pink-300" /> },
            { id: 'reunion', label: 'School reunion', icon: <GraduationCap className="w-6 h-6 text-blue-500" /> },
            { id: 'none', label: 'No special reason', icon: <XCircle className="w-6 h-6 text-slate-400" /> },
        ]
    },
    {
        id: 'special_occasion_date',
        sectionTitle: 'Special Occasion',
        question: 'When is your special occasion?',
        theme: 'light',
        type: 'date_picker',
    },
    {
        id: 'goal_chart',
        question: 'You have great potential to crush your goal',
        theme: 'light',
        type: 'goal_chart',
    },
    {
        id: 'weight_satisfaction',
        question: 'When was the last time you were happy with your weight?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'less_1_year', label: '< 1 year ago', icon: <ThumbsUp className="w-6 h-6 text-orange-200" /> },
            { id: '1_2_years', label: '1 to 2 years ago', icon: <Timer className="w-6 h-6 text-orange-400" /> },
            { id: 'more_3_years', label: '> 3 years ago', icon: <Hourglass className="w-6 h-6 text-orange-300" /> },
            { id: 'happy_now', label: "I'm happy now", icon: <Check className="w-6 h-6 text-emerald-400" /> },
            { id: 'never', label: 'Never', icon: <XCircle className="w-6 h-6 text-rose-400" /> },
        ]
    },
    {
        id: 'past_experience',
        question: 'Have you had the same weightloss experience?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'none', label: 'None of these', icon: <XCircle className="w-6 h-6 text-orange-400" /> },
            { id: 'motivation', label: 'Lack of motivation', icon: <ThumbsDown className="w-6 h-6 text-blue-400" /> },
            { id: 'rebound', label: 'Weight rebound', icon: <Scale className="w-6 h-6 text-orange-300" /> },
            { id: 'no_change', label: 'No significant change', icon: <Frown className="w-6 h-6 text-purple-400" /> },
            { id: 'time', label: 'Not enough time', icon: <Timer className="w-6 h-6 text-orange-400" /> },
        ]
    },
    {
        id: 'weight_vs_own',
        question: 'Lose twice as much weight with FastingPro vs trying on your own',
        subtitle: '89% of user reported that the app helped them to achieve long-lasting weight loss goals.',
        theme: 'light',
        type: 'weight_comparison_bar',
    },
    {
        id: 'confidence_statement',
        question: 'Does this statement relate to what you think?',
        subtitle: 'My current weight often makes me feel less confident.',
        theme: 'light',
        type: 'statement_relation',
        bg: 'bg-blue-50',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ]
    },
    {
        id: 'plan_struggle_statement',
        question: 'Does this statement relate to what you think?',
        subtitle: 'I struggle to find the right plan to help me lose weight.',
        theme: 'light',
        type: 'statement_relation',
        bg: 'bg-emerald-50',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ]
    },
    {
        id: 'junk_food_struggle_statement',
        question: 'Does this statement relate to what you think?',
        subtitle: "My attempts at dieting usually fail because I can't resist junk food.",
        theme: 'light',
        type: 'statement_relation',
        bg: 'bg-yellow-50',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ]
    },
    {
        id: 'guilty_pleasure_statement',
        question: 'Does this statement relate to what you think?',
        subtitle: 'Junk food is my guilty pleasure. I always regret it after indulging.',
        theme: 'light',
        type: 'statement_relation',
        bg: 'bg-purple-50',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ]
    },
    {
        id: 'social_proof_stats',
        question: 'FastingPro was made for people just like you!',
        subtitle: '93% of FastingPro users claim that the plan is easy to follow and makes it simple to stay on track',
        theme: 'light',
        type: 'social_proof',
    },
    {
        id: 'stubborn_fat_highlight',
        question: 'Shed your stubborn Fat with no exercise',
        theme: 'light',
        type: 'feature_highlight',
        subtitle: 'Our AI-powered plan targets the right metabolic states to help you lose fat where it matters most.',
    },
    {
        id: 'lose_more_weight_q',
        question: 'Do you want to lose more weight and feel better?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'yes', label: 'Yes', icon: <ThumbsUp className="w-6 h-6 text-[#00ca86]" /> },
            { id: 'no', label: 'No', icon: <XCircle className="w-6 h-6 text-slate-400" /> },
        ]
    },
    {
        id: 'diary_organization_q',
        question: 'Do you want to get more organized with your diary?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'yes', label: 'Yes', icon: <Check className="w-6 h-6 text-[#00ca86]" /> },
            { id: 'no', label: 'No', icon: <XCircle className="w-6 h-6 text-slate-400" /> },
        ]
    },
    {
        id: 'chronic_diseases_q',
        question: 'Do you want to say goodbye to chronic diseases?',
        theme: 'light',
        type: 'select',
        options: [
            { id: 'yes', label: 'Yes', icon: <Heart className="w-6 h-6 text-red-500" /> },
            { id: 'no', label: 'No', icon: <XCircle className="w-6 h-6 text-slate-400" /> },
        ]
    },
    {
        id: 'processing_plan',
        question: 'We are processing your personal plan...',
        theme: 'light',
        type: 'processing_plan',
    },
    {
        id: 'subscription_plan',
        question: 'Get Your Personal Fasting Plan',
        theme: 'light',
        type: 'subscription_plan',
    },
    {
        id: 'payment_method',
        question: 'Choose your payment method',
        theme: 'light',
        type: 'payment_method',
    }
];

function SignalBars({ level }: { level: number }) {
    return (
        <div className="flex items-end gap-1 h-6">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className={`w-1.5 rounded-full transition-colors ${i <= level ? 'bg-[#00ca86]' : 'bg-[#00ca86]/20'}`}
                    style={{ height: `${25 * i}%` }}
                />
            ))}
        </div>
    );
}

export default function FastingSetupPage() {
    const router = useRouter();
    const [view, setView] = useState<'intro' | 'quiz'>('intro');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('ft');
    const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('kg');
    const [bmiValue, setBmiValue] = useState<number | null>(null);
    const [processProgress, setProcessProgress] = useState(0);

    // Calculate BMI whenever height or weight changes
    useEffect(() => {
        if (answers['weight'] && (answers['height_cm'] || (answers['height_ft'] && answers['height_in']))) {
            let w = Number(answers['weight']);
            let h = 0;

            if (heightUnit === 'cm') {
                h = Number(answers['height_cm']) / 100; // to meters
            } else {
                h = (Number(answers['height_ft']) * 12 + Number(answers['height_in'])) * 0.0254; // to meters
            }

            if (weightUnit === 'lbs') {
                w = w * 0.453592; // to kg
            }

            if (h > 0) {
                const bmi = w / (h * h);
                setBmiValue(Number(bmi.toFixed(1)));
            }
        }
    }, [answers, heightUnit, weightUnit]);

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

    // Handle automated progress for processing_plan step
    useEffect(() => {
        if (currentStepData?.type === 'processing_plan') {
            const interval = setInterval(() => {
                setProcessProgress((prev: number) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => handleNext(), 500);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [currentStep, currentStepData?.type]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const nextStepData = steps[currentStep + 1];

            // Branching logic for Women's Health
            if (nextStepData.id === 'women_health_goals' && answers['gender'] !== 'female') {
                setCurrentStep(currentStep + 2); // Skip women_health_goals
                return;
            }

            setCurrentStep(currentStep + 1);
        } else {
            router.push('/register');
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
                        onClick={() => {
                            if (currentStep > 0 && steps[currentStep].id === 'age' && answers['gender'] !== 'female') {
                                setCurrentStep(currentStep - 2); // Skip back past women_health_goals
                            } else {
                                setCurrentStep(currentStep - 1);
                            }
                        }}
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
                                        onClick={() => setHeightUnit('ft')}
                                        className={`px-12 py-3 rounded-full font-black transition-all ${heightUnit === 'ft' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}
                                    >
                                        ft
                                    </button>
                                    <button
                                        onClick={() => setHeightUnit('cm')}
                                        className={`px-12 py-3 rounded-full font-black transition-all ${heightUnit === 'cm' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}
                                    >
                                        cm
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {heightUnit === 'ft' ? (
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
                                        const canProceed = heightUnit === 'ft'
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
                                    disabled={!(heightUnit === 'ft' ? (answers['height_ft'] && answers['height_in']) : answers['height_cm'])}
                                    className={`
                              w-full py-5 rounded-2xl text-xl font-black transition-all shadow-lg
                              ${(heightUnit === 'ft' ? (answers['height_ft'] && answers['height_in']) : answers['height_cm'])
                                            ? 'bg-[#00ca86] text-white hover:scale-[1.02] active:scale-[0.98]'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                            `}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'weight' ? (
                        <div className="space-y-10">
                            <div className="flex justify-center">
                                <div className="inline-flex bg-slate-100 p-1 rounded-full">
                                    <button
                                        onClick={() => setWeightUnit('lbs')}
                                        className={`px-12 py-3 rounded-full font-black transition-all ${weightUnit === 'lbs' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}
                                    >
                                        lbs
                                    </button>
                                    <button
                                        onClick={() => setWeightUnit('kg')}
                                        className={`px-12 py-3 rounded-full font-black transition-all ${weightUnit === 'kg' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}
                                    >
                                        kg
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder={currentStepData.id === 'weight' ? "Current weight" : "Target weight"}
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
                                    className="w-full bg-white border-2 border-slate-100 rounded-2xl p-6 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ca86] transition-all placeholder:text-slate-300 pr-12"
                                    autoFocus
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-500 pointer-events-none text-xl">{weightUnit}</span>
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
                    ) : currentStepData.type === 'summary' ? (
                        <div className="flex flex-col items-center space-y-8 py-4 animate-fade-in text-center">
                            <div className="relative w-72 h-72 md:w-80 md:h-80">
                                <div className="absolute inset-0 bg-[#e8f5e9] rounded-full scale-95 opacity-50" />
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <Image
                                        src={currentStepData.id === 'ai_tracker_intro' || currentStepData.id === 'eating_habits_intro' ? "/bear_with_flag.png" : "/success_cat.png"}
                                        alt="Success motivation"
                                        width={400}
                                        height={400}
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 max-w-md">
                                <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                                    {(currentStepData.id === 'ai_tracker_intro' || currentStepData.id === 'eating_habits_intro') ? (
                                        <span className="text-[#ff8a65]">{currentStepData.question}</span>
                                    ) : (
                                        <>
                                            Losing <span className="text-[#00ca86]">{Math.max(0, Number(answers['weight']) - Number(answers['goal_weight'])) || 0} {weightUnit}</span> will bring you health benefits. You can do it!
                                        </>
                                    )}
                                </h1>
                                <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed px-4">
                                    {currentStepData.subtitle || "89% of users see obvious results with FastingPro's plan, and find it easy to maintain their progress."}
                                </p>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            router.push('/register');
                                        }
                                    }}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {currentStepData.id === 'ai_tracker_intro' || currentStepData.id === 'eating_habits_intro' ? "Next" : "Got it"}
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'testimonial' ? (
                        <div className="flex flex-col items-center space-y-8 animate-fade-in pb-20">
                            <div className="w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                                <div className="relative aspect-[4/3] w-full">
                                    <Image
                                        src="/success_story_james.png"
                                        alt="James Success Story"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-black text-slate-800">James</h3>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 font-medium text-lg leading-relaxed text-left">
                                        "I began this journey with another weightloss app but I didn't like it at all. Then a friend recommended Fastic. I've never felt better!"
                                    </p>
                                </div>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            router.push('/register');
                                        }
                                    }}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'bmi_summary' ? (
                        <div className="flex flex-col space-y-6 animate-fade-in pb-24">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 p-8 space-y-8">
                                {/* BMI Header */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-800">Body Mass Index (BMI)</h3>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-black text-slate-900">{bmiValue || '0.0'}</span>
                                        <span className={`text-3xl font-black ${!bmiValue ? 'text-slate-400' :
                                            bmiValue < 18.5 ? 'text-blue-500' :
                                                bmiValue < 25 ? 'text-emerald-500' :
                                                    bmiValue < 30 ? 'text-orange-500' : 'text-rose-500'
                                            }`}>
                                            {!bmiValue ? 'Calculating...' :
                                                bmiValue < 18.5 ? 'Underweight' :
                                                    bmiValue < 25 ? 'Normal' :
                                                        bmiValue < 30 ? 'Overweight' : 'Obesity'}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {bmiValue && bmiValue >= 30 ?
                                            "Your BMI is 30 or higher. This is considered obesity. You may need to lose weight to improve your health." :
                                            bmiValue && bmiValue >= 25 ?
                                                "Your BMI is between 25 and 29.9. This is considered overweight. A healthy lifestyle can help you reach a normal weight." :
                                                bmiValue && bmiValue >= 18.5 ?
                                                    "Your BMI is within the normal range. Great job! Staying active and eating well will help you maintain this." :
                                                    "Your BMI is below 18.5. This is considered underweight. You may want to consult with a professional."}
                                    </p>
                                </div>

                                {/* BMI Scale */}
                                <div className="space-y-4">
                                    <div className="relative h-2 w-full rounded-full overflow-hidden flex">
                                        <div className="h-full bg-blue-400" style={{ width: '18.5%' }}></div>
                                        <div className="h-full bg-emerald-400" style={{ width: '25%' }}></div>
                                        <div className="h-full bg-yellow-400" style={{ width: '25%' }}></div>
                                        <div className="h-full bg-orange-400" style={{ width: '15%' }}></div>
                                        <div className="h-full bg-rose-500" style={{ width: '16.5%' }}></div>
                                    </div>
                                    {bmiValue && (
                                        <div className="relative w-full h-4">
                                            <div
                                                className="absolute top-0 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-md transition-all duration-1000"
                                                style={{
                                                    left: `${Math.min(100, Math.max(0, (bmiValue / 40) * 100))}%`,
                                                    transform: 'translateX(-50%)'
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-slate-100 w-full"></div>

                                {/* Summary Grid */}
                                <div className="flex justify-between items-end">
                                    <div className="space-y-6 flex-1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Weight className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Target Weight</p>
                                                <p className="text-slate-800 text-lg font-black">{answers['goal_weight'] || '--'} {weightUnit}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Dumbbell className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Level</p>
                                                <p className="text-slate-800 text-lg font-black">
                                                    {answers['knowledge_level'] === 'beginner' ? 'Beginner' :
                                                        answers['knowledge_level'] === 'intermediate' ? 'Intermediate' :
                                                            answers['knowledge_level'] === 'advanced' ? 'Advanced' : 'Not set'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Activity Level</p>
                                                <p className="text-slate-800 text-lg font-black">
                                                    {answers['activity_refined'] === 'not_active' ? 'Not very active' :
                                                        answers['activity_refined'] === 'lightly_active' ? 'Lightly active' :
                                                            answers['activity_refined'] === 'active' ? 'Active' :
                                                                answers['activity_refined'] === 'athlete' ? 'Athlete' : 'Not set'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Heart className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Medical Conditions</p>
                                                <p className="text-slate-800 text-lg font-black">
                                                    {answers['medical_conditions'] === 'none' ? 'None' :
                                                        answers['medical_conditions']?.replace('_', ' ').replace(/\b\w/g, (l: any) => l.toUpperCase()) || 'None'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Illustration */}
                                    <div className="w-1/2 relative aspect-[3/4]">
                                        <Image
                                            src="/fit_physique_goal.png"
                                            alt="Physique Goal"
                                            fill
                                            className="object-contain object-bottom drop-shadow-2xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            router.push('/register');
                                        }
                                    }}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'feature_intro' ? (
                        <div className="flex flex-col items-center space-y-12 animate-fade-in py-8">
                            <h3 className="text-3xl font-black text-slate-800 leading-tight px-4 text-center">
                                {currentStepData.question}
                            </h3>
                            <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-slate-900 bg-slate-100">
                                <Image
                                    src="/food_scan.png"
                                    alt="Food Scan"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            router.push('/register');
                                        }
                                    }}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'scanner_comparison' ? (
                        <div className="flex flex-col items-center space-y-12 animate-fade-in py-8">
                            <h3 className="text-3xl font-black text-slate-800 leading-tight px-4 text-center">
                                {currentStepData.question}
                            </h3>

                            <div className="relative w-full max-w-md h-[400px] mt-8">
                                {/* Left Card (Traditional) */}
                                <div className="absolute top-0 left-0 w-[70%] bg-[#8c91b5] rounded-[2rem] p-6 shadow-xl space-y-4 z-10 translate-x-4 translate-y-4">
                                    <p className="text-white/80 font-bold text-sm uppercase tracking-wider">{currentStepData.comparison?.left.title}</p>
                                    <p className="text-white text-xl font-black leading-tight">{currentStepData.comparison?.left.subtitle}</p>
                                    <div className="relative w-24 h-24 mx-auto opacity-30 mt-8 flex items-center justify-center">
                                        {currentStepData.comparison?.left.icon}
                                    </div>
                                </div>

                                {/* Right Card (AI) */}
                                <div className="absolute top-12 right-4 w-[75%] bg-[#ffb71b] rounded-[2.5rem] p-8 shadow-2xl space-y-4 z-20 border-4 border-white">
                                    <div className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg">
                                        <div className="bg-[#00ca86] rounded-full p-2">
                                            <Check className="w-6 h-6 text-white stroke-[4]" />
                                        </div>
                                    </div>
                                    <p className="text-slate-800 font-bold text-sm uppercase tracking-wider">{currentStepData.comparison?.right.title}</p>
                                    <p className="text-slate-900 text-2xl font-black leading-tight">{currentStepData.comparison?.right.subtitle}</p>
                                    <div className="relative w-32 h-32 mx-auto mt-4 flex items-center justify-center overflow-hidden">
                                        <div className={`relative bg-white rounded-2xl p-2 border-2 border-slate-800 flex flex-col items-center justify-center h-28 w-full rotate-2 shadow-inner`}>
                                            <div className="absolute top-0 left-0 w-full h-full opacity-10 flex items-center justify-center">
                                                <Timer className="w-20 h-20" />
                                            </div>
                                            {currentStepData.comparison?.right.icon}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            router.push('/register');
                                        }
                                    }}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'diet_comparison' ? (
                        <div className="flex flex-col items-center space-y-12 animate-fade-in py-8">
                            <h3 className="text-3xl font-black text-slate-800 leading-tight px-4 text-center">
                                {currentStepData.question}
                            </h3>

                            <div className="flex gap-3 w-full max-w-2xl px-2">
                                {/* Left Card (Restricted Diet) */}
                                <div className="flex-1 bg-[#fff2f2] rounded-[2rem] p-5 shadow-lg border border-red-50">
                                    <h4 className="text-lg font-black text-slate-800 mb-6 text-center leading-tight">{currentStepData.comparison?.left.title}</h4>
                                    <ul className="space-y-4">
                                        {currentStepData.comparison?.left.points?.map((point, i) => (
                                            <li key={i} className="flex gap-2 items-start">
                                                <XCircle className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                                                <span className="text-slate-600 font-bold text-[13px] leading-tight">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Right Card (Fastic Meal Plan) */}
                                <div className="flex-1 bg-[#eafff8] rounded-[2rem] p-5 shadow-xl border-2 border-[#00ca86]/10">
                                    <h4 className="text-lg font-black text-slate-800 mb-6 text-center leading-tight">{currentStepData.comparison?.right.title}</h4>
                                    <ul className="space-y-4">
                                        {currentStepData.comparison?.right.points?.map((point, i) => (
                                            <li key={i} className="flex gap-2 items-start">
                                                <Check className="w-4 h-4 text-[#00ca86] mt-1 shrink-0 stroke-[4]" />
                                                <span className="text-slate-700 font-bold text-[13px] leading-tight">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            router.push('/register');
                                        }
                                    }}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'tech_intro' ? (
                        <div className="flex flex-col items-center space-y-12 animate-fade-in py-8">
                            <h3 className="text-3xl font-black text-slate-800 leading-tight px-4 text-center">
                                {currentStepData.question}
                            </h3>

                            <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
                                {/* Background Decorative Orb */}
                                <div className="absolute w-64 h-64 bg-[#fff3d6] rounded-full opacity-50 blur-2xl"></div>

                                {/* Central Core */}
                                <div className="relative w-48 h-48 bg-[#fff3d6] rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                                    <div className="absolute w-full h-full rounded-full border-2 border-dashed border-[#ffb71b]/30 animate-spin-slow"></div>
                                    <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-12 h-12 bg-[#00ca86] rounded-full flex items-center justify-center">
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                <div className="w-3 h-3 bg-[#00ca86] rounded-full"></div>
                                            </div>
                                        </div>
                                        {/* Circuit Lines */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#ffb71b]"></div>
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#ffb71b]"></div>
                                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 h-0.5 w-8 bg-[#ffb71b]"></div>
                                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 h-0.5 w-8 bg-[#ffb71b]"></div>
                                    </div>
                                </div>

                                {/* Tech Nodes */}
                                <div className="absolute top-4 left-4 flex flex-col items-center group">
                                    <div className="w-16 h-16 bg-[#2ed199] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Scan className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="mt-2 text-xs font-black text-slate-700 uppercase tracking-tighter">Image Recognition</span>
                                </div>

                                <div className="absolute top-4 right-4 flex flex-col items-center group">
                                    <div className="w-16 h-16 bg-[#fde1f1] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Brain className="w-8 h-8 text-[#ff6cb7]" />
                                    </div>
                                    <span className="mt-2 text-xs font-black text-slate-700 uppercase tracking-tighter">Machine Learning</span>
                                </div>

                                <div className="absolute bottom-4 left-4 flex flex-col items-center group">
                                    <div className="w-16 h-16 bg-[#ff8a65] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <BarChart3 className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="mt-2 text-xs font-black text-slate-700 uppercase tracking-tighter">Analytics</span>
                                </div>

                                <div className="absolute bottom-4 right-4 flex flex-col items-center group">
                                    <div className="w-16 h-16 bg-[#ced8ff] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Cpu className="w-8 h-8 text-[#5a76ff]" />
                                    </div>
                                    <span className="mt-2 text-xs font-black text-slate-700 uppercase tracking-tighter">AI</span>
                                </div>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'transformation' ? (
                        <div className="flex flex-col items-center space-y-12 animate-fade-in py-8">
                            <h3 className="text-3xl font-black text-slate-800 leading-tight px-4 text-center">
                                {currentStepData.question}
                            </h3>
                            <div className="relative w-full max-w-[320px] aspect-square">
                                <div className="absolute inset-0 bg-emerald-50 rounded-full scale-110 opacity-50 blur-2xl" />
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src="/success_cat.png"
                                        alt="Transformation Success"
                                        width={400}
                                        height={400}
                                        className="object-contain drop-shadow-2xl animate-bounce-slow"
                                    />
                                </div>
                                {/* Success Badge */}
                                <div className="absolute -bottom-4 -right-4 bg-white rounded-3xl p-4 shadow-xl border-2 border-emerald-100 flex items-center gap-3 animate-slide-in-right">
                                    <div className="bg-emerald-500 rounded-full p-2">
                                        <Check className="w-6 h-6 text-white stroke-[4]" />
                                    </div>
                                    <span className="font-black text-slate-800 text-lg uppercase tracking-tight">Success Guaranteed</span>
                                </div>
                            </div>
                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'food_comparison' ? (
                        <div className="flex flex-col items-center space-y-12 animate-fade-in py-8">
                            <h3 className="text-3xl font-black text-slate-800 leading-tight px-4 text-center">
                                {currentStepData.question}
                            </h3>

                            <div className="flex gap-4 w-full max-w-2xl px-2">
                                {/* Left Card */}
                                <div className="flex-1 bg-[#00ca86] rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                        {currentStepData.comparison?.left.icon}
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <p className="text-white/80 font-bold text-sm uppercase tracking-wider">{currentStepData.comparison?.left.title}</p>
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                            {React.cloneElement(currentStepData.comparison?.left.icon as React.ReactElement, { className: 'w-10 h-10 text-white' })}
                                        </div>
                                        <p className="text-white text-3xl font-black">{currentStepData.comparison?.left.value}</p>
                                    </div>
                                </div>

                                {/* Right Card */}
                                <div className="flex-1 bg-slate-800 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:-rotate-12 transition-transform">
                                        {currentStepData.comparison?.right.icon}
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <p className="text-white/60 font-bold text-sm uppercase tracking-wider">{currentStepData.comparison?.right.title}</p>
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                            {React.cloneElement(currentStepData.comparison?.right.icon as React.ReactElement, { className: 'w-10 h-10 text-white/40' })}
                                        </div>
                                        <p className="text-white/40 text-3xl font-black">{currentStepData.comparison?.right.value}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-500 font-bold text-center px-8 leading-relaxed">
                                {currentStepData.id === 'food_comparison' ? "Notice how Fastic's recipes are much more calorie-efficient without sacrificing volume." : "Make the smart choice for your body."}
                            </p>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'exercise_comparison' ? (
                        <div className="flex flex-col items-center space-y-8 animate-fade-in py-8">
                            <h3 className="text-3xl font-black text-slate-800 leading-tight px-4 text-center">
                                {currentStepData.question}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl px-4 pb-24">
                                {currentStepData.exercises?.map((ex, i) => (
                                    <div key={i} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center space-y-3 hover:shadow-xl transition-shadow">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-2">
                                            {ex.icon}
                                        </div>
                                        <h4 className="font-black text-slate-800 leading-tight">{ex.name}</h4>
                                        <p className="text-[#ff8a65] font-black text-xl">{ex.time}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'meal_comparison' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex justify-between items-center px-4">
                                <div className="text-center flex-1">
                                    <div className="w-32 h-32 mx-auto rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden mb-2 ring-4 ring-emerald-50">
                                        <Salad className="w-20 h-20 text-emerald-500" />
                                    </div>
                                    <p className="font-bold text-slate-800">Fastic's meals</p>
                                </div>
                                <div className="text-2xl font-black text-emerald-500 mx-4 italic">VS</div>
                                <div className="text-center flex-1">
                                    <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 flex items-center justify-center overflow-hidden mb-2 ring-4 ring-slate-50 grayscale">
                                        <Pizza className="w-20 h-20 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-600">Other diet meals</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: 'More efficient', subLabel: '10-minute quick meals', emoji: '😎', otherEmoji: '🤨', value: 85 },
                                    { label: 'More nutritious', subLabel: 'Variety of colorful ingredients', emoji: '😊', otherEmoji: '🤨', value: 85 },
                                    { label: 'More delicious', subLabel: 'Meals you will enjoy eating', emoji: '😋', otherEmoji: '🤨', value: 85 }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{item.emoji}</span>
                                            <div className="flex-1">
                                                <div className="bg-slate-100 rounded-full h-10 relative overflow-hidden flex items-center px-4">
                                                    <div
                                                        className="absolute left-0 top-0 bottom-0 bg-emerald-100 transition-all duration-1000 ease-out"
                                                        style={{ width: `${item.value}%` }}
                                                    />
                                                    <span className="relative font-bold text-slate-800">{item.label}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1 px-1">{item.subLabel}</p>
                                            </div>
                                            <span className="text-2xl">{item.otherEmoji}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-[#00b578] transition-all active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'nutrition_report' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50">
                                <div className="text-center space-y-2 mb-8">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">BMR (Basal Metabolic Rate)</p>
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
                                    <h4 className="text-4xl font-black text-slate-800">
                                        {(() => {
                                            const weight = parseFloat(answers['weight_current'] || '70');
                                            const height = parseFloat(answers['height'] || '170');
                                            const age = parseInt(answers['age'] || '30');
                                            const gender = answers['gender'] || 'male';
                                            const val = gender === 'male' ? (10 * weight) + (6.25 * height) - (5 * age) + 5 : (10 * weight) + (6.25 * height) - (5 * age) - 161;
                                            return Math.round(val);
                                        })()} <span className="text-2xl text-slate-400">kcal/day</span>
                                    </h4>
                                </div>

                                {/* Donut Chart */}
                                <div className="relative w-64 h-64 mx-auto mb-10 group">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transition-transform duration-700 group-hover:scale-105">
                                        {/* Carbs 50% */}
                                        <circle
                                            cx="50" cy="50" r="40"
                                            fill="transparent"
                                            stroke="#ff7b54"
                                            strokeWidth="12"
                                            strokeDasharray="125.6 125.6"
                                            className="transition-all duration-1000"
                                        />
                                        {/* Fat 30% */}
                                        <circle
                                            cx="50" cy="50" r="40"
                                            fill="transparent"
                                            stroke="#a3e635"
                                            strokeWidth="12"
                                            strokeDasharray="75.4 175.9"
                                            strokeDashoffset="-125.6"
                                            className="transition-all duration-1000 delay-300"
                                        />
                                        {/* Protein 20% */}
                                        <circle
                                            cx="50" cy="50" r="40"
                                            fill="transparent"
                                            stroke="#60a5fa"
                                            strokeWidth="12"
                                            strokeDasharray="50.2 201.1"
                                            strokeDashoffset="-201"
                                            className="transition-all duration-1000 delay-500"
                                        />
                                        <circle cx="50" cy="50" r="28" fill="white" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase leading-none">Nutritional</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase leading-none mt-1">Requirements</p>
                                    </div>

                                    {/* Sector Labels */}
                                    <div className="absolute top-[40%] left-[15%] bg-slate-800 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">50%</div>
                                    <div className="absolute bottom-[20%] right-[30%] bg-slate-800 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">30%</div>
                                    <div className="absolute top-[25%] right-[25%] bg-slate-800 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">20%</div>
                                </div>

                                {/* Legend */}
                                <div className="flex justify-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#a3e635]"></div>
                                        <span className="text-sm font-bold text-slate-600">Fat</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff7b54]"></div>
                                        <span className="text-sm font-bold text-slate-600">Carbs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div>
                                        <span className="text-sm font-bold text-slate-600">Protein</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full py-4 bg-[#00ca86] text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-[#00b578] transition-all active:scale-[0.98]"
                            >
                                Next
                            </button>
                        </div>
                    ) : currentStepData.type === 'motivation_intro' ? (
                        <div className="flex flex-col items-center space-y-8 py-4 animate-fade-in text-center pb-20">
                            <div className="relative w-72 h-72 md:w-80 md:h-80">
                                <div className="absolute inset-0 bg-orange-50 rounded-full scale-110 opacity-50 blur-2xl" />
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <Image
                                        src="/bear_with_flag.png"
                                        alt="Motivation Intro"
                                        width={400}
                                        height={400}
                                        className="object-contain drop-shadow-2xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 max-w-md px-6">
                                <h1 className="text-3xl font-black text-[#ff8a65] leading-tight">
                                    {currentStepData.question}
                                </h1>
                                <p className="text-slate-600 font-bold text-lg leading-relaxed">
                                    {currentStepData.subtitle}
                                </p>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 rounded-2xl text-xl font-bold transition-all shadow-lg bg-[#07a372] text-white hover:bg-[#068e64] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'date_picker' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex gap-4 justify-center">
                                <div className="flex-1 max-w-[140px] relative">
                                    <select
                                        className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 focus:border-[#00ca86] focus:ring-2 focus:ring-[#00ca86]/20 transition-all appearance-none outline-none pr-10"
                                        defaultValue="July"
                                    >
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 -rotate-90 pointer-events-none" />
                                </div>
                                <div className="flex-1 max-w-[100px] relative">
                                    <select
                                        className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 focus:border-[#00ca86] focus:ring-2 focus:ring-[#00ca86]/20 transition-all appearance-none outline-none pr-10"
                                        defaultValue="25"
                                    >
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 -rotate-90 pointer-events-none" />
                                </div>
                                <div className="flex-1 max-w-[120px] relative">
                                    <select
                                        className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 focus:border-[#00ca86] focus:ring-2 focus:ring-[#00ca86]/20 transition-all appearance-none outline-none pr-10"
                                        defaultValue="2026"
                                    >
                                        {[2025, 2026, 2027].map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                    <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 -rotate-90 pointer-events-none" />
                                </div>
                            </div>
                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 hover:bg-[#00b578] transition-all active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'goal_chart' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                            <div className="relative h-64 w-full mt-8">
                                {/* Chart Axes */}
                                <div className="absolute left-10 top-0 bottom-0 w-1 bg-slate-800 rounded-full" />
                                <div className="absolute left-10 bottom-0 right-0 h-1 bg-slate-800 rounded-full" />

                                <span className="absolute -left-4 top-20 -rotate-90 font-bold text-slate-600 text-sm whitespace-nowrap">Weight loss effect</span>

                                {/* SVG Curve */}
                                <svg viewBox="0 0 400 200" className="absolute left-10 top-0 right-0 bottom-0 w-[calc(100%-40px)] h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ff7b54" />
                                            <stop offset="30%" stopColor="#ff7b54" />
                                            <stop offset="30%" stopColor="#ffb088" />
                                            <stop offset="60%" stopColor="#ffb088" />
                                            <stop offset="60%" stopColor="#22c55e" />
                                            <stop offset="100%" stopColor="#22c55e" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>

                                    {/* Areas */}
                                    <path d="M 0 150 Q 80 160 120 120 L 120 200 L 0 200 Z" fill="#ff7b54" fillOpacity="0.1" />
                                    <path d="M 120 120 Q 160 80 240 100 L 240 200 L 120 200 Z" fill="#ffb088" fillOpacity="0.1" />
                                    <path d="M 240 100 Q 320 120 380 20 L 380 200 L 240 200 Z" fill="#22c55e" fillOpacity="0.1" />

                                    {/* The Path */}
                                    <path
                                        d="M 0 150 Q 80 160 120 120 Q 160 80 240 100 Q 320 120 380 20"
                                        fill="none"
                                        stroke="url(#curveGradient)"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        filter="url(#glow)"
                                    />

                                    {/* Control Points */}
                                    <circle cx="0" cy="150" r="6" fill="white" stroke="#ff7b54" strokeWidth="3" />
                                    <circle cx="120" cy="120" r="6" fill="white" stroke="#ffb088" strokeWidth="3" />
                                    <circle cx="240" cy="100" r="6" fill="white" stroke="#ffb088" strokeWidth="3" />
                                    <circle cx="380" cy="20" r="8" fill="white" stroke="#22c55e" strokeWidth="4" />

                                    {/* Labels */}
                                    <text x="380" y="-10" textAnchor="middle" className="font-black text-emerald-500 text-xs uppercase italic" fill="#10b981">GOAL</text>
                                </svg>

                                {/* Emojis */}
                                <div className="absolute left-10 top-[110px] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shadow-md animate-bounce" style={{ animationDelay: '0s' }}>
                                    <Frown className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div className="absolute left-[35%] top-[80px] -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-md animate-bounce" style={{ animationDelay: '0.2s' }}>
                                    <Meh className="w-10 h-10 text-blue-400" />
                                </div>
                                <div className="absolute left-[70%] top-[60px] -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }}>
                                    <Smile className="w-14 h-14 text-yellow-500" />
                                </div>

                                {/* X-Axis Labels */}
                                <div className="absolute left-10 right-0 bottom-[-30px] flex justify-between px-4 font-black text-sm">
                                    <span className="text-orange-400">3 days</span>
                                    <span className="text-orange-300">7 days</span>
                                    <span className="text-emerald-500">30 days</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-800 text-center px-4 leading-tight pt-10">
                                {currentStepData.question}
                            </h3>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 hover:bg-[#00b578] transition-all active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'weight_comparison_bar' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                            <div className="text-center px-4">
                                <h3 className="text-3xl font-black text-slate-800 leading-tight">
                                    {currentStepData.question}
                                </h3>
                            </div>

                            <div className="relative pt-24 pb-12">
                                <div className="flex items-end justify-center gap-8 px-6">
                                    {/* Without Bar */}
                                    <div className="flex flex-col items-center gap-4 flex-1 max-w-[160px]">
                                        <div className="w-full h-24 bg-gradient-to-t from-slate-600 to-slate-400 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-slate-700">
                                            <span className="text-white font-black text-sm text-center px-2">Without FastingPro</span>
                                        </div>
                                    </div>

                                    {/* With Bar */}
                                    <div className="flex flex-col items-center gap-4 flex-1 max-w-[200px] relative">
                                        {/* Bear on top */}
                                        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-40 h-40 animate-bounce-slow">
                                            <Image
                                                src="/bear_with_flag.png"
                                                alt="Success Bear"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="w-full h-48 bg-gradient-to-t from-[#ff8a00] to-[#ffc000] rounded-2xl flex items-center justify-center shadow-xl border-b-4 border-[#e67e00]">
                                            <span className="text-white font-black text-lg text-center px-2">With FastingPro</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-3xl mx-4">
                                <p className="text-slate-600 font-bold text-center leading-relaxed">
                                    {currentStepData.subtitle}
                                </p>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 hover:bg-[#00b578] transition-all active:scale-[0.98]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'statement_relation' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center px-4">
                                <h3 className="text-3xl font-black text-slate-800 leading-tight">
                                    {currentStepData.question}
                                </h3>
                            </div>

                            <div className={`mx-4 p-8 rounded-[40px] relative mt-12 mb-20 ${currentStepData.bg || 'bg-blue-50'}`}>
                                <div className="absolute -top-6 left-10">
                                    <div className="flex gap-1">
                                        <div className={`w-3 h-10 ${currentStepData.bg === 'bg-blue-50' ? 'bg-blue-500' : currentStepData.bg === 'bg-emerald-50' ? 'bg-[#00ca86]' : currentStepData.bg === 'bg-yellow-50' ? 'bg-orange-400' : 'bg-purple-500'} rounded-full opacity-80`} />
                                        <div className={`w-3 h-10 ${currentStepData.bg === 'bg-blue-50' ? 'bg-blue-500' : currentStepData.bg === 'bg-emerald-50' ? 'bg-[#00ca86]' : currentStepData.bg === 'bg-yellow-50' ? 'bg-orange-400' : 'bg-purple-500'} rounded-full opacity-80`} />
                                    </div>
                                </div>

                                <p className="text-2xl font-extrabold text-slate-800 text-center leading-relaxed">
                                    {currentStepData.subtitle}
                                </p>

                                <div className="mt-8 flex justify-center">
                                    {currentStepData.id === 'confidence_statement' && (
                                        <div className="relative w-48 h-48">
                                            <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl" />
                                            <div className="relative h-full flex items-center justify-center text-6xl">🔍</div>
                                        </div>
                                    )}
                                    {currentStepData.id === 'plan_struggle_statement' && (
                                        <div className="relative w-48 h-48">
                                            <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl" />
                                            <div className="relative h-full flex items-center justify-center text-6xl">📋</div>
                                        </div>
                                    )}
                                    {currentStepData.id === 'junk_food_struggle_statement' && (
                                        <div className="relative w-48 h-48">
                                            <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl" />
                                            <div className="relative h-full flex items-center justify-center text-6xl">🍩</div>
                                        </div>
                                    )}
                                    {currentStepData.id === 'guilty_pleasure_statement' && (
                                        <div className="relative w-48 h-48">
                                            <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl" />
                                            <div className="relative h-full flex items-center justify-center text-6xl">🍝</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 px-4 pb-12">
                                <button
                                    onClick={handleNext}
                                    className="py-5 bg-[#00ca86] text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-200"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="py-5 bg-slate-200 text-slate-600 rounded-2xl font-black text-xl"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'social_proof' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-center">
                            <h3 className="text-3xl font-black text-slate-800 px-4">
                                {currentStepData.question}
                            </h3>

                            <div className="flex justify-center py-8">
                                <div className="relative">
                                    <div className="w-56 h-56 rounded-full bg-yellow-50 flex items-center justify-center">
                                        <div className="w-44 h-44 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <div className="w-32 h-32 rounded-full bg-yellow-300 flex items-center justify-center flex-col shadow-inner">
                                                <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Join</span>
                                                <span className="text-2xl font-black text-yellow-900">8M+</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Small floating avatars placeholder */}
                                    <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-slate-200 shadow-lg">
                                        <div className="w-full h-full flex items-center justify-center text-2xl">👩</div>
                                    </div>
                                    <div className="absolute top-1/2 -left-8 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-slate-200 shadow-lg">
                                        <div className="w-full h-full flex items-center justify-center text-2xl">👨</div>
                                    </div>
                                    <div className="absolute -bottom-2 right-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-slate-200 shadow-lg">
                                        <div className="w-full h-full flex items-center justify-center text-2xl">👧</div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 space-y-2">
                                <p className="text-3xl font-black text-slate-800">
                                    <span className="text-[#ffc000]">93%</span> of Users
                                </p>
                                <p className="text-slate-500 font-bold leading-relaxed text-lg">
                                    {currentStepData.subtitle}
                                </p>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-bold text-xl shadow-lg"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'feature_highlight' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                            <h3 className="text-3xl font-black text-slate-800 text-center px-4">
                                {currentStepData.question}
                            </h3>

                            <div className="flex justify-center">
                                <div className="relative w-full max-w-xs aspect-square p-4">
                                    <div className="absolute inset-0 bg-emerald-50 rounded-[60px] transform rotate-3" />
                                    <div className="relative w-full h-full bg-white rounded-[50px] shadow-xl flex items-center justify-center overflow-hidden border-2 border-emerald-100">
                                        <div className="text-8xl animate-pulse">🔥</div>
                                        {/* Symbolic Belly/Abs lines background */}
                                        <div className="absolute inset-0 opacity-10 flex flex-col justify-center items-center gap-4">
                                            <div className="w-32 h-2 bg-emerald-500 rounded-full" />
                                            <div className="w-40 h-2 bg-emerald-500 rounded-full" />
                                            <div className="w-32 h-2 bg-emerald-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 text-center">
                                <p className="text-slate-600 font-bold leading-relaxed text-lg">
                                    {currentStepData.subtitle}
                                </p>
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-bold text-xl shadow-lg"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'processing_plan' ? (
                        <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in py-20 min-h-[60vh]">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 border-8 border-slate-100 rounded-full" />
                                <div className="absolute inset-0 border-8 border-[#00ca86] rounded-full border-t-transparent animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-black text-slate-800 tracking-tighter">{processProgress}%</span>
                                </div>
                            </div>
                            <div className="space-y-6 text-center max-w-sm">
                                <h3 className="text-2xl font-black text-slate-800 leading-tight">
                                    {processProgress < 30 ? "Analyzing your metabolic profile..." :
                                        processProgress < 60 ? "Customizing your fasting schedule..." :
                                            processProgress < 90 ? "Matching with successful user patterns..." :
                                                "Finalizing your personal plan!"}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-slate-500 font-bold">
                                        <Check className={`w-5 h-5 ${processProgress > 25 ? 'text-[#00ca86]' : 'text-slate-200'}`} />
                                        <span>Metabolic rate calculated</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold">
                                        <Check className={`w-5 h-5 ${processProgress > 55 ? 'text-[#00ca86]' : 'text-slate-200'}`} />
                                        <span>Fast burning zones identified</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold">
                                        <Check className={`w-5 h-5 ${processProgress > 85 ? 'text-[#00ca86]' : 'text-slate-200'}`} />
                                        <span>Meal plan generated</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : currentStepData.type === 'subscription_plan' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-2 border-[#00ca86]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-[#00ca86] text-white px-6 py-2 rounded-bl-3xl font-black text-sm uppercase tracking-wider">
                                    Most Popular
                                </div>

                                <h4 className="text-2xl font-black text-slate-800 mb-6 font-display">12-Week Transformation</h4>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Check className="w-5 h-5 text-[#00ca86] stroke-[4]" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-lg">Personal AI Coach</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Check className="w-5 h-5 text-[#00ca86] stroke-[4]" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-lg">Smart Fasting Timer</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Check className="w-5 h-5 text-[#00ca86] stroke-[4]" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-lg">Advanced Analytics</span>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-2 border-t pt-6">
                                    <span className="text-4xl font-black text-slate-900">$29.99</span>
                                    <span className="text-slate-400 font-bold">/ 3 months</span>
                                </div>
                                <p className="text-slate-400 text-sm font-bold mt-1">Just $2.50 per week</p>
                            </div>

                            <div className="bg-slate-100 rounded-[2rem] p-6 flex justify-between items-center opacity-70">
                                <div>
                                    <h5 className="font-black text-slate-800">1-Month Kickstart</h5>
                                    <p className="text-slate-500 font-bold">$14.99 / month</p>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                            </div>

                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-200 hover:bg-[#00b578] transition-all"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    ) : currentStepData.type === 'payment_method' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <button
                                onClick={() => router.push('/register')}
                                className="w-full bg-[#f8f9ff] p-6 rounded-3xl border-2 border-slate-100 flex items-center justify-between hover:border-[#5a76ff] transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <span className="text-2xl font-black text-blue-600 italic">Pay</span>
                                    </div>
                                    <span className="font-black text-slate-800 text-lg">PayPal</span>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-blue-500" />
                            </button>

                            <button
                                onClick={() => router.push('/register')}
                                className="w-full bg-[#f8f9ff] p-6 rounded-3xl border-2 border-slate-100 flex items-center justify-between hover:border-slate-800 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-slate-800" />
                                    </div>
                                    <span className="font-black text-slate-800 text-lg">Credit Card</span>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-slate-800" />
                            </button>

                            <p className="text-slate-400 text-center text-sm font-bold px-8 mt-12">
                                By continuing, you agree to our Terms of Service and Privacy Policy. Subscriptions automatically renew.
                            </p>
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
