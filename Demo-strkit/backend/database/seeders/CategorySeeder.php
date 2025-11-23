<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Frontend',
                'slug' => 'frontend',
                'description' => 'Tools and libraries for frontend development',
                'icon' => 'code',
                'color' => '#3b82f6',
            ],
            [
                'name' => 'Backend',
                'slug' => 'backend',
                'description' => 'Server-side frameworks and tools',
                'icon' => 'server',
                'color' => '#10b981',
            ],
            [
                'name' => 'DevOps',
                'slug' => 'devops',
                'description' => 'CI/CD, deployment, and infrastructure tools',
                'icon' => 'settings',
                'color' => '#f59e0b',
            ],
            [
                'name' => 'Database',
                'slug' => 'database',
                'description' => 'Database management systems and tools',
                'icon' => 'database',
                'color' => '#8b5cf6',
            ],
            [
                'name' => 'Mobile',
                'slug' => 'mobile',
                'description' => 'Mobile app development frameworks and tools',
                'icon' => 'smartphone',
                'color' => '#ec4899',
            ],
            [
                'name' => 'Testing',
                'slug' => 'testing',
                'description' => 'Testing frameworks and quality assurance tools',
                'icon' => 'check-circle',
                'color' => '#14b8a6',
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
