<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSettings extends Model
{
    protected $fillable = [
        'user_id',
        'view_mode',
        'cards_per_page',
        'default_collection',
        'email_notifications',
        'tool_updates',
        'workshop_reminders',
        'weekly_digest',
        'public_collections',
        'public_profile',
        'share_tool_history',
    ];

    protected $casts = [
        'cards_per_page' => 'integer',
        'email_notifications' => 'boolean',
        'tool_updates' => 'boolean',
        'workshop_reminders' => 'boolean',
        'weekly_digest' => 'boolean',
        'public_collections' => 'boolean',
        'public_profile' => 'boolean',
        'share_tool_history' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
