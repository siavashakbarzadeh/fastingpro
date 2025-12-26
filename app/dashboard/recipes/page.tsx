'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
    Search,
    Clock,
    Flame,
    X,
    Leaf,
    Zap,
    Filter,
    ChevronRight,
    Check,
    Calendar,
    Award,
    ArrowLeft,
    ChevronLeft
} from 'lucide-react';
import { AppShell } from '@/components/ui/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';

// --- Types ---

type HealthCategory = "vegetarian" | "vegan" | "heart_healthy" | "low_carb";

type CourseCategory =
    | "salad"
    | "soup"
    | "breakfast"
    | "smoothie"
    | "main_course";

interface Recipe {
    id: string;
    title: string;
    isPro?: boolean;
    healthCategories: HealthCategory[];
    course: CourseCategory;
    summary: string;
    prepMinutes: number;
    calories: number;
    isQuick: boolean;
    highlights: string[];
    ingredients: string[];
    steps: string[];
    whyItFits: string;
    image: string;
}

type DietPlanCategory =
    | "trending"
    | "lose_weight"
    | "burn_fat"
    | "stay_healthy"
    | "heart_health"
    | "vegan";

interface DietPlan {
    id: string;
    title: string;
    isPro?: boolean;
    category: DietPlanCategory;
    durationWeeks: number;
    summary: string;
    highlight: string;
    imageUrl: string;
    description?: string[];
}

// --- Mock Data ---

const RECIPES: Recipe[] = [
    {
        id: '1',
        title: 'Curry and Tuna Salad Roll',
        isPro: true,
        healthCategories: ['heart_healthy', 'low_carb'],
        course: 'salad',
        summary: 'A spicy and savory tuna salad wrapped in crisp lettuce leaves.',
        prepMinutes: 15,
        calories: 320,
        isQuick: true,
        highlights: ['High in protein', 'Omega-3 rich'],
        ingredients: ['1 can tuna', '1 tbsp curry powder', 'Lettuce leaves', 'Diced cucumber'],
        steps: ['Mix tuna with curry powder and cucumber.', 'Spoon into lettuce leaves.', 'Roll and serve.'],
        whyItFits: 'Tuna provides heart-healthy fats while lettuce keeps carbs low.',
        image: '/recipes/curry_tuna_salad.png'
    },
    {
        id: '2',
        title: 'Grilled Chicken Caesar Salad',
        isPro: true,
        healthCategories: ['low_carb'],
        course: 'salad',
        summary: 'Classic Caesar salad with grilled chicken breast and homemade dressing.',
        prepMinutes: 25,
        calories: 450,
        isQuick: false,
        highlights: ['High protein', 'Zero sugar'],
        ingredients: ['Chicken breast', 'Romaine lettuce', 'Parmesan', 'Caesar dressing'],
        steps: ['Grill chicken until cooked.', 'Toss lettuce with dressing.', 'Top with chicken and parmesan.'],
        whyItFits: 'High protein content with minimal carbs from croutons.',
        image: '/recipes/chicken_caesar_salad.png'
    },
    {
        id: '3',
        title: 'Tuscan Kale & Bean Soup',
        isPro: true,
        healthCategories: ['vegetarian', 'heart_healthy'],
        course: 'soup',
        summary: 'A hearty Italian soup loaded with fiber-rich beans and superfood kale.',
        prepMinutes: 30,
        calories: 280,
        isQuick: false,
        highlights: ['High fiber', 'Nutrient dense'],
        ingredients: ['White beans', 'Kale', 'Carrots', 'Vegetable broth', 'Garlic'],
        steps: ['Sauté garlic and carrots.', 'Add broth and beans; simmer 20 min.', 'Stir in kale until wilted.'],
        whyItFits: 'Beans help lower cholesterol and kale offers essential vitamins.',
        image: '/recipes/kale_bean_soup.png'
    },
    {
        id: '4',
        title: 'Creamy Pumpkin Soup',
        isPro: true,
        healthCategories: ['vegan', 'vegetarian'],
        course: 'soup',
        summary: 'Silky smooth pumpkin soup made creamy with coconut milk.',
        prepMinutes: 20,
        calories: 220,
        isQuick: true,
        highlights: ['Vitamin A rich', 'Dairy-free'],
        ingredients: ['Pumpkin puree', 'Coconut milk', 'Ginger', 'Onion'],
        steps: ['Sauté onion and ginger.', 'Add pumpkin and mix.', 'Blend with coconut milk until smooth.'],
        whyItFits: 'Plant-based and rich in antioxidants.',
        image: '/recipes/pumpkin_soup.png'
    },
    {
        id: '5',
        title: 'Soft-Scrambled Eggs',
        isPro: true,
        healthCategories: ['low_carb', 'vegetarian'],
        course: 'breakfast',
        summary: 'Perfectly cooked, creamy scrambled eggs for a protein-packed start.',
        prepMinutes: 10,
        calories: 180,
        isQuick: true,
        highlights: ['High quality protein', 'Keto friendly'],
        ingredients: ['2 eggs', 'Butter', 'Salt', 'Chives'],
        steps: ['Whisk eggs well.', 'Cook on low heat stirring constantly.', 'Top with chives.'],
        whyItFits: 'Eggs are a complete protein source with zero carbs.',
        image: '/recipes/soft_scrambled_eggs.png'
    },
    {
        id: '6',
        title: 'Spinach and Egg Sandwiches',
        isPro: true,
        healthCategories: ['vegetarian'],
        course: 'breakfast',
        summary: 'Whole grain sandwich with fresh spinach and hard-boiled eggs.',
        prepMinutes: 15,
        calories: 350,
        isQuick: true,
        highlights: ['Balanced meal', 'Iron rich'],
        ingredients: ['Whole wheat bread', 'Spinach', 'Boiled eggs', 'Hummus'],
        steps: ['Toast bread.', 'Spread hummus.', 'Layer spinach and sliced eggs.'],
        whyItFits: 'Provides sustained energy from complex carbs and protein.',
        image: '/recipes/spinach_egg_sandwich.png'
    },
    {
        id: '7',
        title: 'Cucumber Smoothie',
        isPro: true,
        healthCategories: ['vegan', 'low_carb'],
        course: 'smoothie',
        summary: 'Refreshing and hydrating green smoothie with lime and mint.',
        prepMinutes: 5,
        calories: 120,
        isQuick: true,
        highlights: ['Hydrating', 'Low calorie'],
        ingredients: ['Cucumber', 'Lime juice', 'Mint leaves', 'Ice'],
        steps: ['Peel cucumber.', 'Blend all ingredients until slushy.', 'Serve immediately.'],
        whyItFits: 'Very low sugar and high water content for hydration.',
        image: 'https://images.unsplash.com/photo-1505252585441-df537f1e403d?w=500&q=80'
    },
    {
        id: '8',
        title: 'Blueberry Matcha Shake',
        isPro: true,
        healthCategories: ['vegetarian', 'heart_healthy'],
        course: 'smoothie',
        summary: 'Antioxidant powerhouse with matcha green tea and wild blueberries.',
        prepMinutes: 5,
        calories: 200,
        isQuick: true,
        highlights: ['Antioxidants', 'Energy boost'],
        ingredients: ['Matcha powder', 'Blueberries', 'Almond milk', 'Honey'],
        steps: ['Blend matcha, berries, and milk.', 'Add honey to taste.'],
        whyItFits: 'Matcha and blueberries supports heart health and brain function.',
        image: 'https://images.unsplash.com/photo-1502741221712-4299b4226d40?w=500&q=80'
    },
    {
        id: '9',
        title: 'Grilled Pork with Fresh Coconut Milk',
        isPro: true,
        healthCategories: ['low_carb'],
        course: 'main_course',
        summary: 'Tender grilled pork loin with a rich coconut sauce.',
        prepMinutes: 35,
        calories: 550,
        isQuick: false,
        highlights: ['High protein', 'Savory'],
        ingredients: ['Pork loin', 'Coconut milk', 'Lemongrass', 'Chili'],
        steps: ['Marinate pork with lemongrass.', 'Grill until cooked through.', 'Simmer coconut milk and serve over pork.'],
        whyItFits: 'Satisfying high-protein meal with healthy fats from coconut.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80'
    },
    {
        id: '10',
        title: 'Thai rice porridge with pork meatballs',
        isPro: true,
        healthCategories: ['heart_healthy'],
        course: 'main_course',
        summary: 'Comforting rice porridge with lean pork meatballs.',
        prepMinutes: 40,
        calories: 380,
        isQuick: false,
        highlights: ['Comfort food', 'Lean meat'],
        ingredients: ['Jasmine rice', 'Minced pork', 'Ginger', 'Scallions'],
        steps: ['Boil rice into porridge.', 'Form small meatballs.', 'Cook meatballs in the porridge.'],
        whyItFits: 'Uses lean pork and ginger for digestion and heart health.',
        image: 'https://images.unsplash.com/photo-1512058560366-cd242d4532be?w=500&q=80'
    }
];

const DIET_PLANS: DietPlan[] = [
    {
        id: 'dp1',
        title: 'Summer weight loss',
        isPro: true,
        category: 'trending',
        durationWeeks: 1,
        summary: 'Light, refreshing meals for hot weather weight loss.',
        highlight: 'Boost metabolism naturally',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
        description: [
            'Includes seasonal fruits and vegetables to keep you hydrated.',
            'Focuses on light salads and grilled proteins.',
            'Avoids heavy gravies and processed carbs.'
        ]
    },
    {
        id: 'dp2',
        title: 'Low calorie',
        isPro: true,
        category: 'lose_weight',
        durationWeeks: 1,
        summary: 'Control intake, help weight loss.',
        highlight: 'Deficit without hunger',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80',
        description: [
            'Calorie-controlled meals under 1500kcal/day.',
            'High volume foods to keep you feeling full.',
            'Balanced macronutrients for energy.'
        ]
    },
    {
        id: 'dp3',
        title: 'Fat burning',
        isPro: true,
        category: 'burn_fat',
        durationWeeks: 1,
        summary: 'Boost metabolism and burn fat efficiently.',
        highlight: 'Thermogenic foods included',
        imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&q=80',
        description: [
            'Incorporates spicy foods and green tea.',
            'Higher protein ratio to support muscle retention.',
            'Intermittent fasting friendly structure.'
        ]
    },
    {
        id: 'dp4',
        title: 'High fiber',
        isPro: true,
        category: 'stay_healthy',
        durationWeeks: 1,
        summary: 'Promote gut health, lose weight.',
        highlight: 'Digestive wellness',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
        description: [
            'Daily fiber intake >30g.',
            'Great for gut microbiome diversity.',
            'Reduces bloating and improves regularity.'
        ]
    },
    {
        id: 'dp5',
        title: 'Low-Fat',
        isPro: true,
        category: 'heart_health',
        durationWeeks: 1,
        summary: 'Good for cardiovascular health.',
        highlight: 'Heart smart choices',
        imageUrl: 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=500&q=80',
        description: [
            'Minimizes saturated fats.',
            'Emphasizes whole grains and legumes.',
            'Includes fatty fish for Omega-3s.'
        ]
    },
    {
        id: 'dp6',
        title: 'Vegan',
        isPro: true,
        category: 'vegan',
        durationWeeks: 1,
        summary: 'Health, environmental protection.',
        highlight: '100% Plant Power',
        imageUrl: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=500&q=80',
        description: [
            'No animal products whatsoever.',
            'Rich in vitamins and antioxidants.',
            'Environmentally conscious meal planning.'
        ]
    }
];

const HEALTH_FILTERS: { id: HealthCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'heart_healthy', label: 'Heart Healthy' },
    { id: 'low_carb', label: 'Low Carb' }
];

const RECIPE_COURSE_CONFIG: { id: CourseCategory; label: string }[] = [
    { id: 'salad', label: 'Salads' },
    { id: 'soup', label: 'Soups' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'smoothie', label: 'Smoothies' },
    { id: 'main_course', label: 'Main Courses' }
];

const DIET_PLAN_CONFIG: { id: DietPlanCategory; label: string; icon?: string }[] = [
    { id: 'trending', label: '🔥 Trending' },
    { id: 'lose_weight', label: 'Lose Weight' },
    { id: 'burn_fat', label: 'Burn Fat' },
    { id: 'stay_healthy', label: 'Stay Healthy' },
    { id: 'heart_health', label: 'Heart Health' },
    { id: 'vegan', label: 'Vegan' }
];

export default function RecipesPage() {
    // --- Tabs State ---
    const [activeTab, setActiveTab] = useState<'recipes' | 'diet_plans'>('recipes');

    // --- Recipes Filters ---
    const [selectedHealthCategory, setSelectedHealthCategory] = useState<HealthCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [quickOnly, setQuickOnly] = useState(false);

    // --- View States ---
    const [activeCourseForSeeAll, setActiveCourseForSeeAll] = useState<CourseCategory | null>(null);
    const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);
    const [openDietPlanId, setOpenDietPlanId] = useState<string | null>(null);

    // --- Derived Data ---
    const filteredRecipes = useMemo(() => {
        return RECIPES.filter(recipe => {
            if (activeCourseForSeeAll && recipe.course !== activeCourseForSeeAll) return false;
            if (selectedHealthCategory !== 'all' && !recipe.healthCategories.includes(selectedHealthCategory)) return false;
            const query = searchQuery.toLowerCase();
            const matchesSearch = recipe.title.toLowerCase().includes(query) || recipe.summary.toLowerCase().includes(query);
            if (!matchesSearch) return false;
            if (quickOnly && !recipe.isQuick) return false;
            return true;
        });
    }, [selectedHealthCategory, searchQuery, quickOnly, activeCourseForSeeAll]);

    const activeRecipe = useMemo(() => RECIPES.find(r => r.id === openRecipeId), [openRecipeId]);
    const activeDietPlan = useMemo(() => DIET_PLANS.find(p => p.id === openDietPlanId), [openDietPlanId]);

    // --- Helpers ---
    const getBadgeStyle = (cat: HealthCategory) => {
        switch (cat) {
            case 'vegetarian': return 'bg-orange-100 text-orange-700';
            case 'vegan': return 'bg-emerald-100 text-emerald-700';
            case 'heart_healthy': return 'bg-rose-100 text-rose-700';
            case 'low_carb': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getHealthCatLabel = (cat: HealthCategory) => {
        return HEALTH_FILTERS.find(f => f.id === cat)?.label || cat;
    };

    return (
        <AppShell
            title="Nutrition"
            subtitle="Recipes & Diet Plans"
            showBackButton
            backUrl="/dashboard"
            activeTab="plan"
        >
            <main className="px-6 py-8 space-y-10">
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => { setActiveTab('recipes'); setActiveCourseForSeeAll(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'recipes' ? 'bg-white text-primary shadow-md' : 'text-slate-400'}`}
                    >
                        Recipes
                    </button>
                    <button
                        onClick={() => { setActiveTab('diet_plans'); setActiveCourseForSeeAll(null); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'diet_plans' ? 'bg-white text-primary shadow-md' : 'text-slate-400'}`}
                    >
                        Diet Plans
                    </button>
                </div>

                {activeTab === 'recipes' ? (
                    <>
                        {/* Search & Filters */}
                        {!activeCourseForSeeAll && (
                            <section className="space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search recipes..."
                                        value={searchQuery}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 placeholder:opacity-50"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {HEALTH_FILTERS.map(filter => (
                                        <button
                                            key={filter.id}
                                            onClick={() => setSelectedHealthCategory(filter.id)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all border-2 ${selectedHealthCategory === filter.id
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-white border-slate-100 text-slate-400'
                                                }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setQuickOnly(!quickOnly)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${quickOnly ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'}`}
                                >
                                    <Zap size={14} fill={quickOnly ? "currentColor" : "none"} />
                                    Under 20 Minutes
                                </button>
                            </section>
                        )}

                        {activeCourseForSeeAll ? (
                            <section className="animate-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <button
                                        onClick={() => setActiveCourseForSeeAll(null)}
                                        className="p-2 -ml-2 rounded-xl bg-slate-50 text-slate-400"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <SectionHeader
                                        title={`${RECIPE_COURSE_CONFIG.find(c => c.id === activeCourseForSeeAll)?.label}`}
                                        description="All available recipes"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    {filteredRecipes.length > 0 ? (
                                        filteredRecipes.map((recipe: Recipe) => (
                                            <RecipeCard
                                                key={recipe.id}
                                                recipe={recipe}
                                                onClick={() => setOpenRecipeId(recipe.id)}
                                                getBadgeStyle={getBadgeStyle}
                                                getHealthCatLabel={getHealthCatLabel}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem]">
                                            <p className="text-sm font-black text-slate-400 uppercase">No recipes found matching filters</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ) : (
                            <section className="space-y-12">
                                {RECIPE_COURSE_CONFIG.map(section => {
                                    const sectionRecipes = RECIPES.filter(r => r.course === section.id);
                                    if (sectionRecipes.length === 0) return null;

                                    return (
                                        <div key={section.id} className="space-y-4">
                                            <SectionHeader
                                                title={section.label}
                                                description="Featured items"
                                                action={
                                                    <button
                                                        onClick={() => setActiveCourseForSeeAll(section.id)}
                                                        className="text-primary font-black text-[10px] uppercase flex items-center gap-1"
                                                    >
                                                        See All <ChevronRight size={14} />
                                                    </button>
                                                }
                                            />
                                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
                                                {sectionRecipes.slice(0, 4).map((recipe: Recipe) => (
                                                    <div key={recipe.id} className="snap-center shrink-0 w-[240px]">
                                                        <RecipeCard
                                                            recipe={recipe}
                                                            onClick={() => setOpenRecipeId(recipe.id)}
                                                            getBadgeStyle={getBadgeStyle}
                                                            getHealthCatLabel={getHealthCatLabel}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>
                        )}
                    </>
                ) : (
                    <section className="space-y-12">
                        {DIET_PLAN_CONFIG.map(section => {
                            const plans = DIET_PLANS.filter(p => p.category === section.id);
                            if (plans.length === 0) return null;

                            return (
                                <div key={section.id} className="space-y-4">
                                    <SectionHeader title={section.label} description="Curated by nutritionists" />
                                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
                                        {plans.map((plan: DietPlan) => (
                                            <div key={plan.id} className="snap-center shrink-0 w-[240px]">
                                                <DietPlanCard plan={plan} onClick={() => setOpenDietPlanId(plan.id)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
            </main>

            {/* Recipe Modal */}
            {activeRecipe && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 overflow-hidden">
                    <Card variant="white" className="w-full max-w-2xl h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                        <div className="relative h-64 shrink-0">
                            <Image
                                src={activeRecipe.image}
                                alt={activeRecipe.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <button
                                onClick={() => setOpenRecipeId(null)}
                                className="absolute top-6 right-6 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <div className="absolute bottom-6 left-8 right-8">
                                <div className="flex gap-2 mb-2">
                                    {activeRecipe.isPro && <Chip label="PRO" variant="primary" active />}
                                    {activeRecipe.healthCategories.map(cat => (
                                        <Chip key={cat} label={getHealthCatLabel(cat)} variant="secondary" active />
                                    ))}
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{activeRecipe.title}</h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Time</div>
                                        <div className="text-sm font-black text-slate-800">{activeRecipe.prepMinutes} MIN</div>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <Flame size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Energy</div>
                                        <div className="text-sm font-black text-slate-800">{activeRecipe.calories} KCAL</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SectionHeader title="Goal Fit" description="Why we chose this for you" />
                                <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-[2rem] p-6 flex gap-4">
                                    <Leaf className="text-emerald-500 shrink-0" size={24} />
                                    <p className="text-sm font-bold text-emerald-800 leading-relaxed italic">
                                        "{activeRecipe.whyItFits}"
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SectionHeader title="Ingredients" description="Everything you'll need" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {activeRecipe.ingredients.map((ing: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            <span className="text-sm font-black text-slate-700 uppercase">{ing}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SectionHeader title="Preparation" description="Step-by-step instructions" />
                                <div className="space-y-6">
                                    {activeRecipe.steps.map((step: string, idx: number) => (
                                        <div key={idx} className="flex gap-6">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20 shrink-0">
                                                    {idx + 1}
                                                </div>
                                                {idx < activeRecipe.steps.length - 1 && (
                                                    <div className="w-0.5 flex-1 bg-slate-100 rounded-full" />
                                                )}
                                            </div>
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed pt-1 uppercase tracking-tight">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Diet Plan Modal */}
            {activeDietPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 overflow-hidden">
                    <Card variant="white" className="w-full max-w-xl h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                        <div className="relative h-64 shrink-0">
                            <Image
                                src={activeDietPlan.imageUrl}
                                alt={activeDietPlan.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                            <button
                                onClick={() => setOpenDietPlanId(null)}
                                className="absolute top-6 right-6 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <div className="absolute bottom-6 left-8 right-8">
                                <Chip label={`${activeDietPlan.durationWeeks} WEEK PLAN`} variant="primary" active className="mb-2" />
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{activeDietPlan.title}</h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-[2rem] p-6">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                                    <Award size={18} /> Main Objective
                                </h4>
                                <p className="text-lg font-black text-slate-800 leading-tight uppercase tracking-tighter">
                                    {activeDietPlan.highlight}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <SectionHeader title="The Strategy" description="What makes this plan work" />
                                <div className="space-y-3">
                                    {activeDietPlan.description?.map((desc: string, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            <p className="text-sm font-black text-slate-700 uppercase leading-snug">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-slate-900 rounded-[2rem] text-center">
                                <h4 className="text-white font-black text-sm uppercase mb-2">Important Notice</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                                    Consult a healthcare professional before significantly changing your diet.
                                    This plan is for educational purposes only.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </AppShell>
    );
}

// --- Subcomponents ---

function RecipeCard({
    recipe,
    onClick,
    getBadgeStyle,
    getHealthCatLabel
}: {
    recipe: Recipe;
    onClick: () => void;
    getBadgeStyle: (cat: HealthCategory) => string;
    getHealthCatLabel: (cat: HealthCategory) => string;
}) {
    return (
        <Card
            variant="white"
            padding="none"
            className="overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group h-full flex flex-col"
            onClick={onClick}
        >
            <div className="relative h-44 shrink-0 overflow-hidden">
                <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-1">
                    {recipe.isPro && <div className="bg-amber-400 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg">PRO</div>}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white flex items-center gap-1">
                        <Clock size={10} /> {recipe.prepMinutes}M
                    </div>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex gap-1 mb-3">
                    {recipe.healthCategories.slice(0, 2).map(cat => (
                        <span key={cat} className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${getBadgeStyle(cat)}`}>
                            {getHealthCatLabel(cat)}
                        </span>
                    ))}
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-2 leading-none mb-4 flex-1">
                    {recipe.title}
                </h3>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase">
                        <Flame size={12} className="text-orange-500" /> {recipe.calories} KCAL
                    </div>
                    <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
            </div>
        </Card>
    );
}

function DietPlanCard({ plan, onClick }: { plan: DietPlan; onClick: () => void }) {
    return (
        <Card
            variant="white"
            padding="none"
            className="overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group h-full flex flex-col"
            onClick={onClick}
        >
            <div className="relative h-44 shrink-0 overflow-hidden">
                <Image
                    src={plan.imageUrl}
                    alt={plan.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                    {plan.isPro && <div className="bg-amber-400 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg">PRO</div>}
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white flex items-center gap-1 uppercase">
                        <Calendar size={10} /> {plan.durationWeeks} WEEK PLAN
                    </div>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-base font-black text-slate-800 uppercase tracking-tighter leading-none mb-2">
                    {plan.title}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase line-clamp-2 leading-relaxed italic">
                    {plan.summary}
                </p>
                <div className="mt-auto pt-4 flex justify-between items-center">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Enroll Now</span>
                    <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
            </div>
        </Card>
    );
}
