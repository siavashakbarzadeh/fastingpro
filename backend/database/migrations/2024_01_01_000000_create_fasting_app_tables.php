<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Users table (extending default)
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('gender')->nullable();
                $table->decimal('goal_weight', 5, 2)->nullable();
                $table->string('timezone')->default('UTC');
                $table->rememberToken();
                $table->timestamps();
            });
        }

        Schema::create('fasting_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->integer('fasting_hours');
            $table->integer('eating_hours');
            $table->text('description')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('fasts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->nullable()->constrained('fasting_plans')->nullOnDelete();
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->string('status')->default('active'); // active, completed, aborted
            $table->integer('planned_duration_minutes');
            $table->integer('actual_duration_minutes')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('weights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('value', 5, 2);
            $table->string('unit')->default('kg');
            $table->timestamp('logged_at');
            $table->timestamps();
        });

        Schema::create('water_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('amount_ml');
            $table->timestamp('logged_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('water_logs');
        Schema::dropIfExists('weights');
        Schema::dropIfExists('fasts');
        Schema::dropIfExists('fasting_plans');
        // Users table usually handled by default migration, but here for completeness
    }
};
