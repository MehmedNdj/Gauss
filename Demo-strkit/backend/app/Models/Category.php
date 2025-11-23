<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
    ];

    public function resources(): BelongsToMany
    {
        return $this->belongsToMany(Resource::class, 'resource_category');
    }
}
