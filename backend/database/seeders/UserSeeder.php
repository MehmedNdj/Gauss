<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Backend Developer',
                'email' => 'backend@gauss.com',
                'password' => 'backend123',
                'role' => 'backend',
            ],
            [
                'name' => 'Frontend Developer',
                'email' => 'frontend@gauss.com',
                'password' => 'frontend123',
                'role' => 'frontend',
            ],
            [
                'name' => 'QA Engineer',
                'email' => 'qa@gauss.com',
                'password' => 'qa123',
                'role' => 'qa',
            ],
            [
                'name' => 'UI/UX Designer',
                'email' => 'designer@gauss.com',
                'password' => 'designer123',
                'role' => 'designer',
            ],
            [
                'name' => 'Project Manager',
                'email' => 'manager@gauss.com',
                'password' => 'manager123',
                'role' => 'manager',
            ],
            [
                'name' => 'DevOps Engineer',
                'email' => 'devops@gauss.com',
                'password' => 'devops123',
                'role' => 'devops',
            ],
            [
                'name' => 'Product Owner',
                'email' => 'product@gauss.com',
                'password' => 'product123',
                'role' => 'product',
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@gauss.com',
                'password' => 'admin123',
                'role' => 'admin',
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                    'role' => $userData['role'],
                ]
            );
        }
    }
}
