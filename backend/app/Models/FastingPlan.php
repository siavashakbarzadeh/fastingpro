<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FastingPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'fasting_hours',
        'eating_hours',
        'description',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];
}
