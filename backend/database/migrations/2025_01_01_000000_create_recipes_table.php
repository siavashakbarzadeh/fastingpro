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
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->boolean('is_pro')->default(false);
            $table->json('health_categories'); // vegetarian, vegan, etc.
            $table->string('course'); // salad, soup, etc.
            $table->text('summary');
            $table->integer('prep_minutes');
            $table->integer('calories')->nullable();
            $table->boolean('is_quick')->default(false);
            $table->json('highlights');
            $table->json('ingredients');
            $table->json('steps');
            $table->text('why_it_fits');
            $table->string('image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
