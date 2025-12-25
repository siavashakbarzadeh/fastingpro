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
    ArrowLeft,
    ChevronRight,
    Check,
    Calendar,
    Award
} from 'lucide-react';
import Link from 'next/link';

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
    description?: string[]; // Bullet points for modal
}

// --- Mock Data ---

const RECIPES: Recipe[] = [
    // --- Salad ---
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

    // --- Soup ---
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

    // --- Breakfast ---
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

    // --- Smoothie ---
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

    // --- Main Course ---
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
    { id: 'salad', label: 'Salad' },
    { id: 'soup', label: 'Soup' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'smoothie', label: 'Smoothie' },
    { id: 'main_course', label: 'Main course' }
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
            if (selectedHealthCategory !== 'all' && !recipe.healthCategories.includes(selectedHealthCategory)) return false;
            const query = searchQuery.toLowerCase();
            const matchesSearch = recipe.title.toLowerCase().includes(query) || recipe.summary.toLowerCase().includes(query);
            if (!matchesSearch) return false;
            if (quickOnly && !recipe.isQuick) return false;
            return true;
        });
    }, [selectedHealthCategory, searchQuery, quickOnly]);

    const activeRecipe = useMemo(() => RECIPES.find(r => r.id === openRecipeId), [openRecipeId]);
    const activeDietPlan = useMemo(() => DIET_PLANS.find(p => p.id === openDietPlanId), [openDietPlanId]);

    // --- Helpers ---
    const getBadgeStyle = (cat: HealthCategory) => {
        switch (cat) {
            case 'vegetarian': return 'bg-orange-100 text-orange-700';
            case 'vegan': return 'bg-green-100 text-green-700';
            case 'heart_healthy': return 'bg-rose-100 text-rose-700';
            case 'low_carb': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getHealthCatLabel = (cat: HealthCategory) => {
        return HEALTH_FILTERS.find(f => f.id === cat)?.label || cat;
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 relative">

            {/* Header with Tabs */}
            <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-slate-100">
                <div className="max-w-xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        <h1 className="text-xl font-black text-slate-800">Nutrition & Plans</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-2">
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${activeTab === 'recipes'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Recipes
                        </button>
                        <button
                            onClick={() => setActiveTab('diet_plans')}
                            className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${activeTab === 'diet_plans'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Diet plans
                        </button>
                    </div>
                </div>

                {/* Sub-header Filters (only for Recipes) */}
                {activeTab === 'recipes' && (
                    <div className="max-w-xl mx-auto px-6 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-slate-700 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                            />
                        </div>

                        {/* Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {HEALTH_FILTERS.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedHealthCategory(filter.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border ${selectedHealthCategory === filter.id
                                        ? 'bg-slate-800 text-white border-slate-800'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Quick Filter */}
                        <button
                            onClick={() => setQuickOnly(!quickOnly)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${quickOnly ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Zap size={14} fill={quickOnly ? "currentColor" : "none"} />
                            Quick recipes only (≤ 20 min)
                        </button>
                    </div>
                )}
            </header>

            <main className="max-w-xl mx-auto px-6 py-6 space-y-8 min-h-[50vh]">

                {/* === RECIPES TAB CONTENT === */}
                {activeTab === 'recipes' && (
                    activeCourseForSeeAll ? (
                        // "See All" View
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={() => setActiveCourseForSeeAll(null)}
                                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-sm mb-6 transition-colors"
                            >
                                <ArrowLeft size={16} /> Back to recipes
                            </button>
                            <h2 className="text-2xl font-black text-slate-800 mb-6 capitalize">
                                All {RECIPE_COURSE_CONFIG.find(c => c.id === activeCourseForSeeAll)?.label} Recipes
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {filteredRecipes.filter(r => r.course === activeCourseForSeeAll).length > 0 ? (
                                    filteredRecipes.filter(r => r.course === activeCourseForSeeAll).map(recipe => (
                                        <RecipeCard
                                            key={recipe.id}
                                            recipe={recipe}
                                            onClick={() => setOpenRecipeId(recipe.id)}
                                            getBadgeStyle={getBadgeStyle}
                                            getHealthCatLabel={getHealthCatLabel}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                                        No recipes found for this category with current filters.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Sections View
                        <>
                            {RECIPE_COURSE_CONFIG.map(section => {
                                const sectionRecipes = filteredRecipes.filter(r => r.course === section.id);
                                return (
                                    <div key={section.id} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-xl font-black text-slate-800">{section.label}</h3>
                                            {sectionRecipes.length > 0 && (
                                                <button
                                                    onClick={() => setActiveCourseForSeeAll(section.id)}
                                                    className="flex items-center text-emerald-500 font-black text-xs hover:gap-1 transition-all"
                                                >
                                                    See all <ChevronRight size={14} />
                                                </button>
                                            )}
                                        </div>
                                        {sectionRecipes.length > 0 ? (
                                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
                                                {sectionRecipes.slice(0, 4).map(recipe => (
                                                    <div key={recipe.id} className="snap-center shrink-0 w-[280px]">
                                                        <RecipeCard
                                                            recipe={recipe}
                                                            onClick={() => setOpenRecipeId(recipe.id)}
                                                            getBadgeStyle={getBadgeStyle}
                                                            getHealthCatLabel={getHealthCatLabel}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-slate-100/50 rounded-xl p-6 text-center text-slate-400 text-sm font-medium">
                                                No matches.
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )
                )}

                {/* === DIET PLANS TAB CONTENT === */}
                {activeTab === 'diet_plans' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        {DIET_PLAN_CONFIG.map(section => {
                            const plans = DIET_PLANS.filter(p => p.category === section.id);
                            if (plans.length === 0) return null;

                            return (
                                <div key={section.id} className="space-y-4">
                                    <h3 className="text-xl font-black text-slate-800">{section.label}</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
                                        {plans.map(plan => (
                                            <div key={plan.id} className="snap-center shrink-0 w-[300px]">
                                                <DietPlanCard plan={plan} onClick={() => setOpenDietPlanId(plan.id)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* --- Recipe Modal --- */}
            {activeRecipe && (
                <div className="fixed inset-0 z-50 flex justify-end sm:items-center sm:justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
                    <div className="bg-white w-full h-full sm:h-[90vh] sm:max-w-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="relative h-56 sm:h-64 w-full shrink-0 group">
                            <Image src={activeRecipe.image} alt={activeRecipe.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <button onClick={() => setOpenRecipeId(null)} className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition-colors z-20">
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {activeRecipe.isPro && <span className="bg-amber-400 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">PRO</span>}
                                    {activeRecipe.healthCategories.map(cat => (
                                        <span key={cat} className="bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">{getHealthCatLabel(cat)}</span>
                                    ))}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight shadow-sm">{activeRecipe.title}</h2>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-white scrollbar-thin scrollbar-thumb-slate-200">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Clock size={18} /></div>
                                    <div><div className="text-[10px] font-bold text-slate-400 uppercase">Prep Time</div><div className="text-sm font-black text-slate-800">{activeRecipe.prepMinutes} min</div></div>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-full"><Flame size={18} /></div>
                                    <div><div className="text-[10px] font-bold text-slate-400 uppercase">Calories</div><div className="text-sm font-black text-slate-800">{activeRecipe.calories}</div></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-slate-600 font-medium leading-relaxed">{activeRecipe.summary}</p>
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
                                    <Leaf className="shrink-0 text-emerald-500 mt-0.5" size={18} />
                                    <div><h4 className="text-xs font-black text-emerald-800 uppercase tracking-wide mb-1">Why it fits your goals</h4><p className="text-sm text-emerald-700 font-medium">{activeRecipe.whyItFits}</p></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-4">Ingredients</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {activeRecipe.ingredients.map((ing, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />{ing}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-4">Instructions</h3>
                                <div className="space-y-6">
                                    {activeRecipe.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center"><div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-slate-200">{idx + 1}</div>{idx !== activeRecipe.steps.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-2 group-hover:bg-emerald-100 transition-colors" />}</div>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed pb-6 pt-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-100 text-center"><p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide max-w-xs mx-auto">Nutrition values are approximate and for general education only. This is not personalized dietary advice.</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Diet Plan Modal --- */}
            {activeDietPlan && (
                <div className="fixed inset-0 z-50 flex justify-end sm:items-center sm:justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
                    <div className="bg-white w-full h-full sm:h-[85vh] sm:max-w-xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="relative h-64 w-full shrink-0 group">
                            <Image src={activeDietPlan.imageUrl} alt={activeDietPlan.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent" />
                            <button onClick={() => setOpenDietPlanId(null)} className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition-colors z-20">
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-white text-emerald-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        <Calendar size={12} /> {activeDietPlan.durationWeeks} Week Plan
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-white leading-tight mb-2">{activeDietPlan.title}</h2>
                                <p className="text-emerald-100 font-medium">{activeDietPlan.summary}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                                <h4 className="flex items-center gap-2 text-sm font-black text-emerald-800 uppercase tracking-wide mb-3">
                                    <Award size={18} className="text-emerald-500" /> Plan Goal
                                </h4>
                                <p className="text-lg font-bold text-emerald-900 leading-snug">
                                    {activeDietPlan.highlight}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-4">What's included</h3>
                                <ul className="space-y-4">
                                    {activeDietPlan.description?.map((desc, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                            <p className="text-slate-600 font-medium">{desc}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-8 mt-8 border-t border-slate-100 text-center">
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                    Consult a healthcare professional before making significant changes to your diet, especially if you have pre-existing conditions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
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
        <div
            onClick={onClick}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full group"
        >
            <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                <Image src={recipe.image} alt={recipe.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {recipe.isPro && <div className="bg-amber-400 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg">PRO</div>}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"><Clock size={10} /> {recipe.prepMinutes}m</div>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-2">
                    {recipe.healthCategories.slice(0, 2).map(cat => (
                        <span key={cat} className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${getBadgeStyle(cat)}`}>{getHealthCatLabel(cat)}</span>
                    ))}
                    {recipe.healthCategories.length > 2 && <span className="text-[9px] font-black text-slate-400 px-1 py-1">+</span>}
                </div>
                <h3 className="text-base font-black text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{recipe.title}</h3>
                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Flame size={12} /> {recipe.calories} kcal</span>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-wide group-hover:underline decoration-2 underline-offset-2">View</span>
                </div>
            </div>
        </div>
    );
}

function DietPlanCard({ plan, onClick }: { plan: DietPlan; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full group"
        >
            <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
                <Image src={plan.imageUrl} alt={plan.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3">
                    {plan.isPro && <div className="bg-amber-400 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg">PRO</div>}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">{plan.title}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-3">
                    <Calendar size={14} /> {plan.durationWeeks} Week Plan
                </div>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{plan.summary}</p>
            </div>
        </div>
    );
}
