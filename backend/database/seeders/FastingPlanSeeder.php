<?php

namespace Database\Seeders;

use App\Models\FastingPlan;
use Illuminate\Database\Seeder;

class FastingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => '16:8 Method',
                'fasting_hours' => 16,
                'eating_hours' => 8,
                'description' => 'The most popular intermittent fasting plan. Fast for 16 hours and eat within an 8-hour window.',
                'is_default' => true,
            ],
            [
                'name' => '18:6 Method',
                'fasting_hours' => 18,
                'eating_hours' => 6,
                'description' => 'A slightly more advanced plan. Fast for 18 hours and eat within a 6-hour window.',
                'is_default' => false,
            ],
            [
                'name' => '20:4 (Warrior Diet)',
                'fasting_hours' => 20,
                'eating_hours' => 4,
                'description' => 'Fast for 20 hours and consume most calories in a 4-hour evening window.',
                'is_default' => false,
            ],
            [
                'name' => 'OMAD (One Meal A Day)',
                'fasting_hours' => 23,
                'eating_hours' => 1,
                'description' => 'Eat only one nutritious meal per day.',
                'is_default' => false,
            ],
        ];

        foreach ($plans as $plan) {
            FastingPlan::updateOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }
    }
}
