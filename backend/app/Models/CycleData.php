<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CycleData extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'last_period_start',
        'cycle_length',
        'period_duration',
    ];

    protected $casts = [
        'last_period_start' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
