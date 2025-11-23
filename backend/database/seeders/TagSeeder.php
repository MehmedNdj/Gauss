<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript',
            'PHP', 'Laravel', 'Python', 'Django', 'Node.js',
            'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
            'React Native', 'Flutter', 'Swift', 'Kotlin',
            'Jest', 'Cypress', 'PHPUnit', 'Testing'
        ];

        foreach ($tags as $tag) {
            \App\Models\Tag::create([
                'name' => $tag,
                'slug' => \Illuminate\Support\Str::slug($tag),
            ]);
        }
    }
}
