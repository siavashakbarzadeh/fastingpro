<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recipes = [
            [
                'title' => 'Curry and Tuna Salad Roll',
                'is_pro' => true,
                'health_categories' => ['heart_healthy', 'low_carb'],
                'course' => 'salad',
                'summary' => 'A spicy and savory tuna salad wrapped in crisp lettuce leaves.',
                'prep_minutes' => 15,
                'calories' => 320,
                'is_quick' => true,
                'highlights' => ['High in protein', 'Omega-3 rich'],
                'ingredients' => ['1 can tuna', '1 tbsp curry powder', 'Lettuce leaves', 'Diced cucumber'],
                'steps' => ['Mix tuna with curry powder and cucumber.', 'Spoon into lettuce leaves.', 'Roll and serve.'],
                'why_it_fits' => 'Tuna provides heart-healthy fats while lettuce keeps carbs low.',
                'image' => '/recipes/curry_tuna_salad.png'
            ],
            [
                'title' => 'Grilled Chicken Caesar Salad',
                'is_pro' => true,
                'health_categories' => ['low_carb'],
                'course' => 'salad',
                'summary' => 'Classic Caesar salad with grilled chicken breast and homemade dressing.',
                'prep_minutes' => 25,
                'calories' => 450,
                'is_quick' => false,
                'highlights' => ['High protein', 'Zero sugar'],
                'ingredients' => ['Chicken breast', 'Romaine lettuce', 'Parmesan', 'Caesar dressing'],
                'steps' => ['Grill chicken until cooked.', 'Toss lettuce with dressing.', 'Top with chicken and parmesan.'],
                'why_it_fits' => 'High protein content with minimal carbs from croutons.',
                'image' => '/recipes/chicken_caesar_salad.png'
            ],
            [
                'title' => 'Tuscan Kale & Bean Soup',
                'is_pro' => true,
                'health_categories' => ['vegetarian', 'heart_healthy'],
                'course' => 'soup',
                'summary' => 'A hearty Italian soup loaded with fiber-rich beans and superfood kale.',
                'prep_minutes' => 30,
                'calories' => 280,
                'is_quick' => false,
                'highlights' => ['High fiber', 'Nutrient dense'],
                'ingredients' => ['White beans', 'Kale', 'Carrots', 'Vegetable broth', 'Garlic'],
                'steps' => ['Sauté garlic and carrots.', 'Add broth and beans; simmer 20 min.', 'Stir in kale until wilted.'],
                'why_it_fits' => 'Beans help lower cholesterol and kale offers essential vitamins.',
                'image' => '/recipes/kale_bean_soup.png'
            ],
            [
                'title' => 'Creamy Pumpkin Soup',
                'is_pro' => true,
                'health_categories' => ['vegan', 'vegetarian'],
                'course' => 'soup',
                'summary' => 'Silky smooth pumpkin soup made creamy with coconut milk.',
                'prep_minutes' => 20,
                'calories' => 220,
                'is_quick' => true,
                'highlights' => ['Vitamin A rich', 'Dairy-free'],
                'ingredients' => ['Pumpkin puree', 'Coconut milk', 'Ginger', 'Onion'],
                'steps' => ['Sauté onion and ginger.', 'Add pumpkin and mix.', 'Blend with coconut milk until smooth.'],
                'why_it_fits' => 'Plant-based and rich in antioxidants.',
                'image' => '/recipes/pumpkin_soup.png'
            ],
            [
                'title' => 'Soft-Scrambled Eggs',
                'is_pro' => true,
                'health_categories' => ['low_carb', 'vegetarian'],
                'course' => 'breakfast',
                'summary' => 'Perfectly cooked, creamy scrambled eggs for a protein-packed start.',
                'prep_minutes' => 10,
                'calories' => 180,
                'is_quick' => true,
                'highlights' => ['High quality protein', 'Keto friendly'],
                'ingredients' => ['2 eggs', 'Butter', 'Salt', 'Chives'],
                'steps' => ['Whisk eggs well.', 'Cook on low heat stirring constantly.', 'Top with chives.'],
                'why_it_fits' => 'Eggs are a complete protein source with zero carbs.',
                'image' => '/recipes/soft_scrambled_eggs.png'
            ],
            [
                'title' => 'Spinach and Egg Sandwiches',
                'is_pro' => true,
                'health_categories' => ['vegetarian'],
                'course' => 'breakfast',
                'summary' => 'Whole grain sandwich with fresh spinach and hard-boiled eggs.',
                'prep_minutes' => 15,
                'calories' => 350,
                'is_quick' => true,
                'highlights' => ['Balanced meal', 'Iron rich'],
                'ingredients' => ['Whole wheat bread', 'Spinach', 'Boiled eggs', 'Hummus'],
                'steps' => ['Toast bread.', 'Spread hummus.', 'Layer spinach and sliced eggs.'],
                'why_it_fits' => 'Provides sustained energy from complex carbs and protein.',
                'image' => '/recipes/spinach_egg_sandwich.png'
            ],
            [
                'title' => 'Cucumber Smoothie',
                'is_pro' => true,
                'health_categories' => ['vegan', 'low_carb'],
                'course' => 'smoothie',
                'summary' => 'Refreshing and hydrating green smoothie with lime and mint.',
                'prep_minutes' => 5,
                'calories' => 120,
                'is_quick' => true,
                'highlights' => ['Hydrating', 'Low calorie'],
                'ingredients' => ['Cucumber', 'Lime juice', 'Mint leaves', 'Ice'],
                'steps' => ['Peel cucumber.', 'Blend all ingredients until slushy.', 'Serve immediately.'],
                'why_it_fits' => 'Very low sugar and high water content for hydration.',
                'image' => 'https://images.unsplash.com/photo-1505252585441-df537f1e403d?w=500&q=80'
            ],
            [
                'title' => 'Blueberry Matcha Shake',
                'is_pro' => true,
                'health_categories' => ['vegetarian', 'heart_healthy'],
                'course' => 'smoothie',
                'summary' => 'Antioxidant powerhouse with matcha green tea and wild blueberries.',
                'prep_minutes' => 5,
                'calories' => 200,
                'is_quick' => true,
                'highlights' => ['Antioxidants', 'Energy boost'],
                'ingredients' => ['Matcha powder', 'Blueberries', 'Almond milk', 'Honey'],
                'steps' => ['Blend matcha, berries, and milk.', 'Add honey to taste.'],
                'why_it_fits' => 'Matcha and blueberries supports heart health and brain function.',
                'image' => 'https://images.unsplash.com/photo-1502741221712-4299b4226d40?w=500&q=80'
            ],
            [
                'title' => 'Grilled Pork with Fresh Coconut Milk',
                'is_pro' => true,
                'health_categories' => ['low_carb'],
                'course' => 'main_course',
                'summary' => 'Tender grilled pork loin with a rich coconut sauce.',
                'prep_minutes' => 35,
                'calories' => 550,
                'is_quick' => false,
                'highlights' => ['High protein', 'Savory'],
                'ingredients' => ['Pork loin', 'Coconut milk', 'Lemongrass', 'Chili'],
                'steps' => ['Marinate pork with lemongrass.', 'Grill until cooked through.', 'Simmer coconut milk and serve over pork.'],
                'why_it_fits' => 'Satisfying high-protein meal with healthy fats from coconut.',
                'image' => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80'
            ],
            [
                'title' => 'Thai rice porridge with pork meatballs',
                'is_pro' => true,
                'health_categories' => ['heart_healthy'],
                'course' => 'main_course',
                'summary' => 'Comforting rice porridge with lean pork meatballs.',
                'prep_minutes' => 40,
                'calories' => 380,
                'is_quick' => false,
                'highlights' => ['Comfort food', 'Lean meat'],
                'ingredients' => ['Jasmine rice', 'Minced pork', 'Ginger', 'Scallions'],
                'steps' => ['Boil rice into porridge.', 'Form small meatballs.', 'Cook meatballs in the porridge.'],
                'why_it_fits' => 'Uses lean pork and ginger for digestion and heart health.',
                'image' => 'https://images.unsplash.com/photo-1512058560366-cd242d4532be?w=500&q=80'
            ]
        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }
    }
}
