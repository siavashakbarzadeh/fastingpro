<?php

namespace Database\Seeders;

use App\Models\DietPlan;
use Illuminate\Database\Seeder;

class DietPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'title' => 'Summer weight loss',
                'is_pro' => true,
                'category' => 'trending',
                'duration_weeks' => 1,
                'summary' => 'Light, refreshing meals for hot weather weight loss.',
                'highlight' => 'Boost metabolism naturally',
                'image_url' => 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
                'description' => [
                    'Includes seasonal fruits and vegetables to keep you hydrated.',
                    'Focuses on light salads and grilled proteins.',
                    'Avoids heavy gravies and processed carbs.'
                ]
            ],
            [
                'title' => 'Low calorie',
                'is_pro' => true,
                'category' => 'lose_weight',
                'duration_weeks' => 1,
                'summary' => 'Control intake, help weight loss.',
                'highlight' => 'Deficit without hunger',
                'image_url' => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80',
                'description' => [
                    'Calorie-controlled meals under 1500kcal/day.',
                    'High volume foods to keep you feeling full.',
                    'Balanced macronutrients for energy.'
                ]
            ],
            [
                'title' => 'Fat burning',
                'is_pro' => true,
                'category' => 'burn_fat',
                'duration_weeks' => 1,
                'summary' => 'Boost metabolism and burn fat efficiently.',
                'highlight' => 'Thermogenic foods included',
                'image_url' => 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&q=80',
                'description' => [
                    'Incorporates spicy foods and green tea.',
                    'Higher protein ratio to support muscle retention.',
                    'Intermittent fasting friendly structure.'
                ]
            ],
            [
                'title' => 'High fiber',
                'is_pro' => true,
                'category' => 'stay_healthy',
                'duration_weeks' => 1,
                'summary' => 'Promote gut health, lose weight.',
                'highlight' => 'Digestive wellness',
                'image_url' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
                'description' => [
                    'Daily fiber intake >30g.',
                    'Great for gut microbiome diversity.',
                    'Reduces bloating and improves regularity.'
                ]
            ],
            [
                'title' => 'Low-Fat',
                'is_pro' => true,
                'category' => 'heart_health',
                'duration_weeks' => 1,
                'summary' => 'Good for cardiovascular health.',
                'highlight' => 'Heart smart choices',
                'image_url' => 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=500&q=80',
                'description' => [
                    'Minimizes saturated fats.',
                    'Emphasizes whole grains and legumes.',
                    'Includes fatty fish for Omega-3s.'
                ]
            ],
            [
                'title' => 'Vegan',
                'is_pro' => true,
                'category' => 'vegan',
                'duration_weeks' => 1,
                'summary' => 'Health, environmental protection.',
                'highlight' => '100% Plant Power',
                'image_url' => 'https://images.unsplash.com/photo-1540914124281-342587941389?w=500&q=80',
                'description' => [
                    'No animal products whatsoever.',
                    'Rich in vitamins and antioxidants.',
                    'Environmentally conscious meal planning.'
                ]
            ]
        ];

        foreach ($plans as $plan) {
            DietPlan::create($plan);
        }
    }
}
