'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
    Search,
    Clock,
    Flame,
    X,
    Leaf,
    Heart,
    Zap,
    Filter,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// --- Types ---

type RecipeCategory = "vegetarian" | "vegan" | "heart_healthy" | "low_carb";

interface Recipe {
    id: string;
    title: string;
    categories: RecipeCategory[];
    summary: string;
    prepMinutes: number;
    calories: number;
    highlights: string[];
    ingredients: string[];
    steps: string[];
    whyItFits: string;
    image: string;
}

// --- Mock Data ---

const RECIPES: Recipe[] = [
    {
        id: '1',
        title: 'Roasted Chickpea & Avocado Bowl',
        categories: ['vegetarian', 'vegan', 'heart_healthy'],
        summary: 'A nutrient-dense bowl packed with fiber and healthy fats, perfect for a quick lunch.',
        prepMinutes: 15,
        calories: 420,
        highlights: [
            'High in fiber',
            'Rich in healthy fats',
            'Plant-based protein'
        ],
        ingredients: [
            '1 can chickpeas, drained and roasted',
            '1 ripe avocado, sliced',
            '2 cups mixed greens',
            '1 lemon (juice)',
            '1 tbsp olive oil'
        ],
        steps: [
            'Preheat oven to 400°F (200°C). Toss chickpeas with seasonings and roast for 20 mins.',
            'Wash and dry the mixed greens.',
            'Slice the avocado.',
            'Assemble the bowl with greens base, chickpeas, and avocado.',
            'Drizzle with olive oil and fresh lemon juice.'
        ],
        whyItFits: 'Loaded with monounsaturated fats from avocado (heart healthy) and entirely plant-based.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
    },
    {
        id: '2',
        title: 'Grilled Salmon with Asparagus',
        categories: ['heart_healthy', 'low_carb'],
        summary: 'Omega-3 rich salmon paired with crisp roasted asparagus. Simple, elegant, and low carb.',
        prepMinutes: 25,
        calories: 380,
        highlights: [
            'Excellent source of Omega-3',
            'High protein',
            'Low net carbs'
        ],
        ingredients: [
            '2 salmon fillets',
            '1 bunch nutritious asparagus',
            '2 cloves garlic, minced',
            '1 lemon',
            'Salt & pepper to taste'
        ],
        steps: [
            'Season salmon fillets with salt, pepper, and garlic.',
            'Sear salmon in a hot pan for 4-5 mins per side.',
            'Simultaneously, steam or grill asparagus until tender-crisp.',
            'Serve salmon over asparagus with a lemon wedge.'
        ],
        whyItFits: 'Prioritizes lean protein and minimizes starchy carbohydrates for stable blood sugar.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=500&q=80'
    },
    {
        id: '3',
        title: 'Zucchini Noodle Stir-Fry',
        categories: ['vegan', 'low_carb', 'vegetarian'],
        summary: 'Craving pasta without the carbs? Try these zoodles tossed with colorful veggies.',
        prepMinutes: 15,
        calories: 210,
        highlights: [
            'Very low calorie',
            'Keto-friendly',
            'Vitamin-rich'
        ],
        ingredients: [
            '2 large zucchinis, spiralized',
            '1 red bell pepper, sliced',
            '1/2 cup mushrooms',
            '1 tbsp sesame oil',
            'Soy sauce or tamari'
        ],
        steps: [
            'Spiralize zucchini into noodles.',
            'Sauté peppers and mushrooms in sesame oil until soft.',
            'Add zucchini noodles and toss for just 2-3 minutes (do not overcook).',
            'Season with soy sauce and serve hot.'
        ],
        whyItFits: 'Replaces refined wheat pasta with vegetable noodles to drastically lower carb count.',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80'
    },
    {
        id: '4',
        title: 'Quinoa & Black Bean Taco Salad',
        categories: ['vegetarian', 'heart_healthy'],
        summary: 'A hearty salad that satisfies like a main meal, featuring protein-packed quinoa and beans.',
        prepMinutes: 20,
        calories: 450,
        highlights: [
            'Complete protein source',
            'High fiber',
            'Gluten-free'
        ],
        ingredients: [
            '1 cup cooked quinoa',
            '1/2 cup black beans, rinsed',
            '1/2 cup corn kernels',
            '1/4 cup salsa',
            'Cilantro for garnish'
        ],
        steps: [
            'Cook quinoa according to package instructions and let cool.',
            'Mix quinoa with black beans and corn.',
            'Stir in salsa as a dressing.',
            'Top with fresh cilantro.'
        ],
        whyItFits: 'Beans and quinoa provide fiber specifically known to help lower cholesterol.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80'
    },
    {
        id: '5',
        title: 'Egg White Veggie Omelet',
        categories: ['low_carb', 'vegetarian', 'heart_healthy'],
        summary: 'Start your day with a protein boost that keeps you full until lunch.',
        prepMinutes: 10,
        calories: 180,
        highlights: [
            'High protein',
            'Low fat',
            'Quick breakfast'
        ],
        ingredients: [
            '4 egg whites',
            '1 cup spinach',
            '1/4 onion, diced',
            'Cooking spray',
            'Salt and pepper'
        ],
        steps: [
            'Sauté onions and spinach in a non-stick pan until wilted.',
            'Whisk egg whites with salt and pepper.',
            'Pour eggs over veggies and cook until set.',
            'Fold and serve immediately.'
        ],
        whyItFits: 'Uses egg whites to eliminate cholesterol while maximizing protein intake.',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80'
    },
    {
        id: '6',
        title: 'Berry Chia Seed Pudding',
        categories: ['vegan', 'heart_healthy', 'vegetarian'],
        summary: 'A delightful make-ahead breakfast or dessert rich in antioxidants.',
        prepMinutes: 5,
        calories: 250,
        highlights: [
            'No added sugar',
            'Omega-3 rich',
            'Gut health support'
        ],
        ingredients: [
            '3 tbsp chia seeds',
            '1 cup almond milk',
            '1/2 tsp vanilla extract',
            '1/2 cup mixed berries'
        ],
        steps: [
            'Whisk chia seeds, almond milk, and vanilla vigorously in a jar.',
            'Let sit for 5 minutes, then whisk again to prevent clumps.',
            'Refrigerate for at least 2 hours or overnight.',
            'Top with fresh berries before eating.'
        ],
        whyItFits: 'Chia seeds are a powerhouse of fiber and heart-healthy omega-3 fatty acids.',
        image: 'https://images.unsplash.com/photo-1502741221712-4299b4226d40?w=500&q=80'
    }
];

const CATEGORIES: { id: RecipeCategory; label: string; icon: string }[] = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
    { id: 'vegan', label: 'Vegan', icon: '🥦' },
    { id: 'heart_healthy', label: 'Heart Healthy', icon: '❤️' },
    { id: 'low_carb', label: 'Low Carb', icon: '🥩' },
];

export default function RecipesPage() {
    const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [quickOnly, setQuickOnly] = useState(false);
    const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);

    // --- Filter Logic ---

    const filteredRecipes = useMemo(() => {
        return RECIPES.filter(recipe => {
            // Category Filter
            if (selectedCategory !== "all" && !recipe.categories.includes(selectedCategory)) {
                return false;
            }

            // Search Filter
            const query = searchQuery.toLowerCase();
            const matchesSearch = recipe.title.toLowerCase().includes(query) ||
                recipe.summary.toLowerCase().includes(query);
            if (!matchesSearch) return false;

            // Quick Filter
            if (quickOnly && recipe.prepMinutes > 20) {
                return false;
            }

            return true;
        });
    }, [selectedCategory, searchQuery, quickOnly]);

    const activeRecipe = useMemo(() => {
        return RECIPES.find(r => r.id === openRecipeId);
    }, [openRecipeId]);

    // --- Badge Helper ---
    const getBadgeStyle = (cat: RecipeCategory) => {
        switch (cat) {
            case 'vegetarian': return 'bg-orange-100 text-orange-700';
            case 'vegan': return 'bg-green-100 text-green-700';
            case 'heart_healthy': return 'bg-rose-100 text-rose-700';
            case 'low_carb': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getCategoryLabel = (cat: RecipeCategory) => {
        return CATEGORIES.find(c => c.id === cat)?.label || cat;
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 relative">

            {/* Header */}
            <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-slate-100">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                            <ArrowLeft size={24} strokeWidth={2.5} />
                        </Link>
                        <h1 className="text-xl font-black text-slate-800">Healthy Recipes</h1>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="max-w-xl mx-auto px-6 pb-4 space-y-4">

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Find a recipe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-slate-700 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                        />
                    </div>

                    {/* Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border ${selectedCategory === "all"
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all border flex items-center gap-1.5 ${selectedCategory === cat.id
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Quick Filter Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setQuickOnly(!quickOnly)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${quickOnly ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                        >
                            <Zap size={14} fill={quickOnly ? "currentColor" : "none"} />
                            Only quick recipes (≤ 20 min)
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-6">

                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-lg font-black text-slate-800">
                        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Result' : 'Results'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map(recipe => (
                            <div
                                key={recipe.id}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full group"
                            >
                                <div className="relative h-48 w-full bg-slate-200">
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Prep Time Badge */}
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                        <Clock size={10} /> {recipe.prepMinutes} min
                                    </div>
                                    {/* Quick Badge if applicable */}
                                    {recipe.prepMinutes <= 15 && (
                                        <div className="absolute top-3 right-3 bg-amber-400 text-white p-1.5 rounded-full shadow-lg">
                                            <Zap size={12} fill="currentColor" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {recipe.categories.slice(0, 3).map(cat => (
                                            <span key={cat} className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${getBadgeStyle(cat)}`}>
                                                {getCategoryLabel(cat)}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">
                                        {recipe.title}
                                    </h3>

                                    {/* Quick Stats */}
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-4">
                                        <span className="flex items-center gap-1"><Flame size={12} /> {recipe.calories} kcal</span>
                                    </div>

                                    {/* Highlights */}
                                    <ul className="space-y-1 mb-6 flex-1">
                                        {recipe.highlights.slice(0, 2).map((highlight, idx) => (
                                            <li key={idx} className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                                <Check size={12} className="text-emerald-500" />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => setOpenRecipeId(recipe.id)}
                                        className="w-full bg-slate-50 text-slate-600 font-bold py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs uppercase tracking-wide"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-slate-400">
                            <Filter className="mx-auto w-12 h-12 mb-4 opacity-20" />
                            <p className="font-bold">No recipes found.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setQuickOnly(false); }}
                                className="text-emerald-500 text-sm font-bold mt-2"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Recipe Modal / Drawer */}
            {activeRecipe && (
                <div className="fixed inset-0 z-50 flex justify-end sm:items-center sm:justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
                    <div
                        className="bg-white w-full h-full sm:h-[90vh] sm:max-w-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header Image */}
                        <div className="relative h-48 sm:h-64 w-full shrink-0">
                            <Image
                                src={activeRecipe.image}
                                alt={activeRecipe.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <button
                                onClick={() => setOpenRecipeId(null)}
                                className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/40 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {activeRecipe.categories.map(cat => (
                                        <span key={cat} className="bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                            {getCategoryLabel(cat)}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight shadow-sm">
                                    {activeRecipe.title}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-white">

                            {/* Summary & Stats */}
                            <div>
                                <p className="text-slate-600 font-medium leading-relaxed mb-6">
                                    {activeRecipe.summary}
                                </p>
                                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-slate-400" size={18} />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Prep Time</div>
                                            <div className="text-sm font-black text-slate-800">{activeRecipe.prepMinutes} min</div>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200" />
                                    <div className="flex items-center gap-2">
                                        <Flame className="text-rose-400" size={18} />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Calories</div>
                                            <div className="text-sm font-black text-slate-800">{activeRecipe.calories}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Why It Fits */}
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wide mb-3">
                                    <Leaf size={16} className="text-emerald-500" />
                                    Why this fits your goal
                                </h3>
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm font-medium text-emerald-900 leading-relaxed">
                                    {activeRecipe.whyItFits}
                                </div>
                            </div>

                            {/* Ingredients */}
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-4">Ingredients</h3>
                                <ul className="space-y-3">
                                    {activeRecipe.ingredients.map((ing, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                            {ing}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Steps */}
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-4">Instructions</h3>
                                <div className="space-y-6">
                                    {activeRecipe.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black shrink-0">
                                                    {idx + 1}
                                                </div>
                                                {idx !== activeRecipe.steps.length - 1 && (
                                                    <div className="w-px h-full bg-slate-100 my-1" />
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed pb-4">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="pt-8 border-t border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                    Nutrition information is approximate and for general education only, not a medical or dietary prescription.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
