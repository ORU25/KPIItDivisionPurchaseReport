<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PR extends Model
{
    use HasFactory;

    protected $fillable = [
        "pr_no","pr_desc","pr_type","buyer","departement","requested_by",
    ];

    public function pr_line(){
        return $this->hasMany(PRLine::class,'pr_id', 'id');
    }

    public function po(){
        return $this->belongsToMany(PO::class, 'pr_po', 'pr_id', 'po_id');
    }
    
}
