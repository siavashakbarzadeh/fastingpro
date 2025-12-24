'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Timer, Target, Brain, Heart, Zap, User, Loader2, GitBranch, Clock, RefreshCcw, Briefcase, Search, Calendar, Star, ThumbsUp, ThumbsDown, Hand, Activity, Droplets, Droplet, HeartPulse, Wind, UserCircle, Container, Ban, Dumbbell, Weight, Soup, Coffee, XCircle, Scan, Frown, Meh, Smile, Calculator, FileText, Cpu, BarChart3, Cookie, GlassWater, Moon, Pizza, Utensils, Wine, Hourglass, Users, HelpCircle, Apple, Salad, BookOpen, Scale, Fish, Leaf, Wheat, GraduationCap } from 'lucide-react';
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
    type?: 'select' | 'input' | 'height' | 'weight' | 'summary' | 'testimonial' | 'bmi_summary' | 'feature_intro' | 'scanner_comparison' | 'tech_intro' | 'transformation' | 'diet_comparison' | 'food_comparison' | 'exercise_comparison' | 'meal_comparison' | 'nutrition_report' | 'motivation_intro';
    placeholder?: string;
    comparison?: {
        left: { title: string; subtitle: string; icon?: React.ReactNode; points?: string[]; value?: string };
        right: { title: string; subtitle: string; icon?: React.ReactNode | string; points?: string[]; value?: string };
    };
    exercises?: { name: string; time: string; icon: React.ReactNode }[];
}

const steps: Step[] = [
    {
        id: 'goal',
        question: 'What is your main goal?',
        theme: 'green',
        options: [
            { id: 'weight_goal', label: 'Lose weight', icon: <Target className="w-6 h-6" /> },
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

export default function QuizPage() {
    const router = useRouter();
    const [view, setView] = useState<'intro' | 'quiz'>('intro');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('ft');
    const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('kg');
    const [bmiValue, setBmiValue] = useState<number | null>(null);

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
                        <div className="flex flex-col items-center space-y-8 animate-fade-in py-8">
                            <div className="relative w-64 h-64">
                                <Image
                                    src="/bear_with_flag.png"
                                    alt="Motivation Bear"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-center space-y-4 max-w-sm">
                                <h3 className="text-3xl font-black text-[#ff8a00] leading-tight">
                                    {currentStepData.question}
                                </h3>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {currentStepData.subtitle}
                                </p>
                            </div>
                            <div className="fixed bottom-12 left-0 right-0 px-6 max-w-xl mx-auto">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-5 bg-[#00ca86] text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 hover:bg-[#00b578] transition-all active:scale-[1.02] active:shadow-md"
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
