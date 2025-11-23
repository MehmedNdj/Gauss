<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExploreTool extends Model
{
    protected $fillable = [
        'name',
        'description',
        'rating',
        'version',
        'image_url',
        'roles',
        'category',
        'popularity',
    ];

    protected $casts = [
        'roles' => 'array',
    ];
}
