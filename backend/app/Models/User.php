<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'goal_weight',
        'timezone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'goal_weight' => 'decimal:2',
    ];

    public function fasts()
    {
        return $this->hasMany(Fast::class);
    }

    public function weights()
    {
        return $this->hasMany(Weight::class);
    }

    public function waterLogs()
    {
        return $this->hasMany(WaterLog::class);
    }
}
