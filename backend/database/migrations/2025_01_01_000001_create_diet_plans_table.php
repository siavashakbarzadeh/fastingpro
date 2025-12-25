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
        Schema::create('diet_plans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->boolean('is_pro')->default(false);
            $table->string('category'); // trending, lose_weight, etc.
            $table->integer('duration_weeks');
            $table->text('summary');
            $table->string('highlight');
            $table->string('image_url');
            $table->json('description')->nullable(); // Bullet points
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diet_plans');
    }
};
