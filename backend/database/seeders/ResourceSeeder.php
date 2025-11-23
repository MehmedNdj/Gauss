<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a demo user if it doesn't exist
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'demo@gauss.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('password'),
            ]
        );

        $resources = [
            [
                'title' => 'React Documentation',
                'description' => 'Official React documentation - Learn React with our comprehensive guides and API reference.',
                'type' => 'documentation',
                'url' => 'https://react.dev',
                'repository_url' => 'https://github.com/facebook/react',
                'status' => 'published',
                'categories' => [1], // Frontend
                'tags' => [1, 4, 5], // React, TypeScript, JavaScript
            ],
            [
                'title' => 'Laravel',
                'description' => 'The PHP Framework for Web Artisans. Laravel is a web application framework with expressive, elegant syntax.',
                'type' => 'library',
                'url' => 'https://laravel.com',
                'repository_url' => 'https://github.com/laravel/laravel',
                'status' => 'published',
                'categories' => [2], // Backend
                'tags' => [6, 7], // PHP, Laravel
            ],
            [
                'title' => 'Docker Desktop',
                'description' => 'Docker Desktop is an easy-to-install application that enables you to build and share containerized applications.',
                'type' => 'tool',
                'url' => 'https://www.docker.com/products/docker-desktop',
                'repository_url' => 'https://github.com/docker/docker',
                'status' => 'published',
                'categories' => [3], // DevOps
                'tags' => [11], // Docker
            ],
            [
                'title' => 'PostgreSQL',
                'description' => 'The World\'s Most Advanced Open Source Relational Database.',
                'type' => 'tool',
                'url' => 'https://www.postgresql.org',
                'repository_url' => 'https://github.com/postgres/postgres',
                'status' => 'published',
                'categories' => [4], // Database
                'tags' => [17], // PostgreSQL
            ],
            [
                'title' => 'Flutter',
                'description' => 'Build beautiful native apps in record time with Flutter - Google\'s UI toolkit for mobile, web, and desktop.',
                'type' => 'library',
                'url' => 'https://flutter.dev',
                'repository_url' => 'https://github.com/flutter/flutter',
                'status' => 'published',
                'categories' => [5], // Mobile
                'tags' => [22], // Flutter
            ],
            [
                'title' => 'Cypress',
                'description' => 'Fast, easy and reliable testing for anything that runs in a browser.',
                'type' => 'tool',
                'url' => 'https://www.cypress.io',
                'repository_url' => 'https://github.com/cypress-io/cypress',
                'status' => 'published',
                'categories' => [6], // Testing
                'tags' => [5, 26], // JavaScript, Cypress
            ],
        ];

        foreach ($resources as $resourceData) {
            $categories = $resourceData['categories'];
            $tags = $resourceData['tags'];
            unset($resourceData['categories'], $resourceData['tags']);

            $resourceData['user_id'] = $user->id;
            $resourceData['slug'] = \Illuminate\Support\Str::slug($resourceData['title']);

            $resource = \App\Models\Resource::create($resourceData);
            $resource->categories()->attach($categories);
            $resource->tags()->attach($tags);
        }
    }
}
