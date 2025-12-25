<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'is_pro',
        'health_categories',
        'course',
        'summary',
        'prep_minutes',
        'calories',
        'is_quick',
        'highlights',
        'ingredients',
        'steps',
        'why_it_fits',
        'image',
    ];

    protected $casts = [
        'is_pro' => 'boolean',
        'is_quick' => 'boolean',
        'health_categories' => 'array',
        'highlights' => 'array',
        'ingredients' => 'array',
        'steps' => 'array',
    ];
}
