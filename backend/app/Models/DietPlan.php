<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DietPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'is_pro',
        'category',
        'duration_weeks',
        'summary',
        'highlight',
        'image_url',
        'description',
    ];

    protected $casts = [
        'is_pro' => 'boolean',
        'description' => 'array',
    ];
}
