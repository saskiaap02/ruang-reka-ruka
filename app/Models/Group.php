<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Group extends Model
{
    protected $fillable = ['project_class_id', 'nama_kelompok', 'project_title'];

    public function projectClass(): BelongsTo
    {
        return $this->belongsTo(ProjectClass::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}