<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExploreToolsSeeder extends Seeder
{
    public function run(): void
    {
        $tools = $this->getTools();

        foreach ($tools as &$tool) {
            $tool['roles'] = json_encode($tool['roles']);
            $tool['created_at'] = now();
            $tool['updated_at'] = now();
        }

        DB::table('explore_tools')->insert($tools);
    }

    private function getTools(): array
    {
        return [
            // Frontend (30)
            ['name' => 'React', 'description' => 'JavaScript library for building user interfaces', 'rating' => 5, 'version' => '18.2', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Vue.js', 'description' => 'Progressive JavaScript framework', 'rating' => 5, 'version' => '3.3', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Angular', 'description' => 'Platform for building web applications', 'rating' => 4, 'version' => '17.0', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Svelte', 'description' => 'Cybernetically enhanced web apps', 'rating' => 5, 'version' => '4.0', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Next.js', 'description' => 'The React Framework for Production', 'rating' => 5, 'version' => '14.0', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Nuxt', 'description' => 'The Intuitive Vue Framework', 'rating' => 5, 'version' => '3.8', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Tailwind CSS', 'description' => 'Utility-first CSS framework', 'rating' => 5, 'version' => '3.3', 'roles' => ['frontend', 'designer'], 'category' => 'frontend'],
            ['name' => 'Bootstrap', 'description' => 'Popular CSS Framework', 'rating' => 4, 'version' => '5.3', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Material-UI', 'description' => 'React components for faster development', 'rating' => 5, 'version' => '5.14', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Chakra UI', 'description' => 'Modular React component library', 'rating' => 5, 'version' => '2.8', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Ant Design', 'description' => 'Enterprise UI design language', 'rating' => 4, 'version' => '5.10', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Styled Components', 'description' => 'CSS-in-JS for React', 'rating' => 4, 'version' => '6.1', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Redux', 'description' => 'State container for JavaScript', 'rating' => 4, 'version' => '4.2', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'MobX', 'description' => 'Simple scalable state management', 'rating' => 4, 'version' => '6.10', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Zustand', 'description' => 'Bear necessities for state management', 'rating' => 5, 'version' => '4.4', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Vite', 'description' => 'Next Generation Frontend Tooling', 'rating' => 5, 'version' => '5.0', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Webpack', 'description' => 'Module bundler', 'rating' => 4, 'version' => '5.89', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Parcel', 'description' => 'Zero config build tool', 'rating' => 4, 'version' => '2.10', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'ESLint', 'description' => 'JavaScript code quality tool', 'rating' => 5, 'version' => '8.52', 'roles' => ['frontend', 'backend'], 'category' => 'frontend'],
            ['name' => 'Prettier', 'description' => 'Opinionated code formatter', 'rating' => 5, 'version' => '3.0', 'roles' => ['frontend', 'backend'], 'category' => 'frontend'],
            ['name' => 'TypeScript', 'description' => 'JavaScript with types', 'rating' => 5, 'version' => '5.2', 'roles' => ['frontend', 'backend'], 'category' => 'frontend'],
            ['name' => 'Sass', 'description' => 'CSS with superpowers', 'rating' => 4, 'version' => '1.69', 'roles' => ['frontend', 'designer'], 'category' => 'frontend'],
            ['name' => 'PostCSS', 'description' => 'Transform CSS with JavaScript', 'rating' => 4, 'version' => '8.4', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Framer Motion', 'description' => 'Motion library for React', 'rating' => 5, 'version' => '10.16', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'GSAP', 'description' => 'Professional animation for web', 'rating' => 5, 'version' => '3.12', 'roles' => ['frontend', 'designer'], 'category' => 'frontend'],
            ['name' => 'Three.js', 'description' => 'JavaScript 3D library', 'rating' => 5, 'version' => '0.158', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Chart.js', 'description' => 'Simple charting library', 'rating' => 4, 'version' => '4.4', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'D3.js', 'description' => 'Data-Driven Documents', 'rating' => 4, 'version' => '7.8', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Storybook', 'description' => 'UI component dev & test', 'rating' => 5, 'version' => '7.5', 'roles' => ['frontend'], 'category' => 'frontend'],
            ['name' => 'Remix', 'description' => 'Full stack web framework', 'rating' => 5, 'version' => '2.2', 'roles' => ['frontend'], 'category' => 'frontend'],

            // Backend (30)
            ['name' => 'Node.js', 'description' => 'JavaScript runtime', 'rating' => 5, 'version' => '20.9', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Express.js', 'description' => 'Web framework for Node.js', 'rating' => 5, 'version' => '4.18', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'NestJS', 'description' => 'Progressive Node.js framework', 'rating' => 5, 'version' => '10.2', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Fastify', 'description' => 'Fast web framework', 'rating' => 5, 'version' => '4.24', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Laravel', 'description' => 'PHP framework for web artisans', 'rating' => 5, 'version' => '11.0', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Django', 'description' => 'Python web framework', 'rating' => 5, 'version' => '4.2', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Flask', 'description' => 'Python micro framework', 'rating' => 4, 'version' => '3.0', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'FastAPI', 'description' => 'Modern Python framework', 'rating' => 5, 'version' => '0.104', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Spring Boot', 'description' => 'Java microservices framework', 'rating' => 5, 'version' => '3.1', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Ruby on Rails', 'description' => 'Ruby web framework', 'rating' => 4, 'version' => '7.1', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'ASP.NET Core', 'description' => '.NET framework for web apps', 'rating' => 5, 'version' => '8.0', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Go (Golang)', 'description' => 'Compiled programming language', 'rating' => 5, 'version' => '1.21', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Gin', 'description' => 'Go web framework', 'rating' => 5, 'version' => '1.9', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'PostgreSQL', 'description' => 'Advanced relational database', 'rating' => 5, 'version' => '16.0', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'MySQL', 'description' => 'Popular relational database', 'rating' => 4, 'version' => '8.0', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'MongoDB', 'description' => 'NoSQL document database', 'rating' => 5, 'version' => '7.0', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Redis', 'description' => 'In-memory data store', 'rating' => 5, 'version' => '7.2', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Elasticsearch', 'description' => 'Search and analytics engine', 'rating' => 5, 'version' => '8.10', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'RabbitMQ', 'description' => 'Message broker software', 'rating' => 4, 'version' => '3.12', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Apache Kafka', 'description' => 'Event streaming platform', 'rating' => 5, 'version' => '3.6', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'GraphQL', 'description' => 'Query language for APIs', 'rating' => 5, 'version' => '16.8', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Prisma', 'description' => 'Next-gen ORM for Node.js', 'rating' => 5, 'version' => '5.5', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Sequelize', 'description' => 'Promise-based ORM', 'rating' => 4, 'version' => '6.33', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'TypeORM', 'description' => 'ORM for TypeScript', 'rating' => 4, 'version' => '0.3', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Nginx', 'description' => 'HTTP and reverse proxy', 'rating' => 5, 'version' => '1.25', 'roles' => ['backend', 'devops'], 'category' => 'backend'],
            ['name' => 'Apache', 'description' => 'HTTP server', 'rating' => 4, 'version' => '2.4', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Socket.io', 'description' => 'Real-time communication', 'rating' => 5, 'version' => '4.7', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Swagger', 'description' => 'API development tools', 'rating' => 4, 'version' => '4.0', 'roles' => ['backend'], 'category' => 'backend'],
            ['name' => 'Postman', 'description' => 'API platform', 'rating' => 5, 'version' => '10.18', 'roles' => ['backend', 'qa'], 'category' => 'backend'],
            ['name' => 'Insomnia', 'description' => 'API client', 'rating' => 4, 'version' => '8.3', 'roles' => ['backend'], 'category' => 'backend'],

            // Design (15)
            ['name' => 'Figma', 'description' => 'Collaborative design tool', 'rating' => 5, 'version' => '2023.10', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Adobe XD', 'description' => 'Vector design tool', 'rating' => 4, 'version' => '57.0', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Sketch', 'description' => 'Digital design toolkit', 'rating' => 4, 'version' => '98.0', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'InVision', 'description' => 'Digital product design', 'rating' => 4, 'version' => '7.0', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Framer', 'description' => 'Interactive design tool', 'rating' => 5, 'version' => '2023.9', 'roles' => ['designer', 'frontend'], 'category' => 'design'],
            ['name' => 'Photoshop', 'description' => 'Image editing software', 'rating' => 5, 'version' => '25.0', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Illustrator', 'description' => 'Vector graphics editor', 'rating' => 5, 'version' => '28.0', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Canva', 'description' => 'Graphic design platform', 'rating' => 4, 'version' => '2023.10', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Affinity Designer', 'description' => 'Professional design software', 'rating' => 4, 'version' => '2.2', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Blender', 'description' => '3D creation suite', 'rating' => 5, 'version' => '4.0', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Zeplin', 'description' => 'Design handoff tool', 'rating' => 4, 'version' => '6.0', 'roles' => ['designer', 'frontend'], 'category' => 'design'],
            ['name' => 'Marvel', 'description' => 'Design and prototype', 'rating' => 4, 'version' => '2023.8', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'ProtoPie', 'description' => 'Interaction prototyping', 'rating' => 4, 'version' => '7.0', 'roles' => ['designer'], 'category' => 'design'],
            ['name' => 'Miro', 'description' => 'Collaborative whiteboard', 'rating' => 5, 'version' => '2023.10', 'roles' => ['designer', 'manager'], 'category' => 'design'],
            ['name' => 'Adobe After Effects', 'description' => 'Motion graphics software', 'rating' => 5, 'version' => '24.0', 'roles' => ['designer'], 'category' => 'design'],

            // DevOps (20)
            ['name' => 'Docker', 'description' => 'Container platform', 'rating' => 5, 'version' => '24.0', 'roles' => ['devops', 'backend'], 'category' => 'devops'],
            ['name' => 'Kubernetes', 'description' => 'Container orchestration', 'rating' => 5, 'version' => '1.28', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Jenkins', 'description' => 'CI/CD automation server', 'rating' => 4, 'version' => '2.426', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'GitLab CI/CD', 'description' => 'DevOps platform', 'rating' => 5, 'version' => '16.5', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'GitHub Actions', 'description' => 'CI/CD for GitHub', 'rating' => 5, 'version' => '2023.10', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'CircleCI', 'description' => 'CI/CD platform', 'rating' => 4, 'version' => '2.1', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Travis CI', 'description' => 'Continuous integration', 'rating' => 4, 'version' => '2023.9', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Terraform', 'description' => 'Infrastructure as Code', 'rating' => 5, 'version' => '1.6', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Ansible', 'description' => 'IT automation engine', 'rating' => 5, 'version' => '2.16', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Prometheus', 'description' => 'Monitoring system', 'rating' => 5, 'version' => '2.47', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Grafana', 'description' => 'Analytics platform', 'rating' => 5, 'version' => '10.1', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'AWS', 'description' => 'Amazon cloud platform', 'rating' => 5, 'version' => '2023.10', 'roles' => ['devops', 'backend'], 'category' => 'devops'],
            ['name' => 'Azure', 'description' => 'Microsoft cloud platform', 'rating' => 5, 'version' => '2023.10', 'roles' => ['devops', 'backend'], 'category' => 'devops'],
            ['name' => 'Google Cloud', 'description' => 'Google cloud platform', 'rating' => 5, 'version' => '2023.10', 'roles' => ['devops', 'backend'], 'category' => 'devops'],
            ['name' => 'Datadog', 'description' => 'Monitoring platform', 'rating' => 5, 'version' => '2023.10', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Helm', 'description' => 'Kubernetes package manager', 'rating' => 5, 'version' => '3.13', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'ArgoCD', 'description' => 'GitOps continuous delivery', 'rating' => 5, 'version' => '2.9', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Vault', 'description' => 'Secrets management', 'rating' => 5, 'version' => '1.15', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'Consul', 'description' => 'Service mesh solution', 'rating' => 4, 'version' => '1.17', 'roles' => ['devops'], 'category' => 'devops'],
            ['name' => 'New Relic', 'description' => 'Application monitoring', 'rating' => 4, 'version' => '2023.10', 'roles' => ['devops'], 'category' => 'devops'],

            // Testing/QA (15)
            ['name' => 'Jest', 'description' => 'JavaScript testing framework', 'rating' => 5, 'version' => '29.7', 'roles' => ['qa', 'frontend', 'backend'], 'category' => 'testing'],
            ['name' => 'Mocha', 'description' => 'JavaScript test framework', 'rating' => 4, 'version' => '10.2', 'roles' => ['qa', 'backend'], 'category' => 'testing'],
            ['name' => 'Chai', 'description' => 'BDD/TDD assertion library', 'rating' => 4, 'version' => '4.3', 'roles' => ['qa'], 'category' => 'testing'],
            ['name' => 'Cypress', 'description' => 'E2E testing for web apps', 'rating' => 5, 'version' => '13.4', 'roles' => ['qa', 'frontend'], 'category' => 'testing'],
            ['name' => 'Playwright', 'description' => 'End-to-end testing', 'rating' => 5, 'version' => '1.39', 'roles' => ['qa', 'frontend'], 'category' => 'testing'],
            ['name' => 'Selenium', 'description' => 'Browser automation', 'rating' => 4, 'version' => '4.15', 'roles' => ['qa'], 'category' => 'testing'],
            ['name' => 'Puppeteer', 'description' => 'Chrome automation', 'rating' => 5, 'version' => '21.5', 'roles' => ['qa', 'backend'], 'category' => 'testing'],
            ['name' => 'TestCafe', 'description' => 'E2E web testing', 'rating' => 4, 'version' => '3.4', 'roles' => ['qa'], 'category' => 'testing'],
            ['name' => 'Vitest', 'description' => 'Fast unit test framework', 'rating' => 5, 'version' => '0.34', 'roles' => ['qa', 'frontend'], 'category' => 'testing'],
            ['name' => 'pytest', 'description' => 'Python testing framework', 'rating' => 5, 'version' => '7.4', 'roles' => ['qa', 'backend'], 'category' => 'testing'],
            ['name' => 'JUnit', 'description' => 'Java unit testing', 'rating' => 5, 'version' => '5.10', 'roles' => ['qa', 'backend'], 'category' => 'testing'],
            ['name' => 'K6', 'description' => 'Modern load testing', 'rating' => 5, 'version' => '0.47', 'roles' => ['qa', 'devops'], 'category' => 'testing'],
            ['name' => 'Appium', 'description' => 'Mobile app automation', 'rating' => 4, 'version' => '2.2', 'roles' => ['qa'], 'category' => 'testing'],
            ['name' => 'SonarQube', 'description' => 'Code quality tool', 'rating' => 5, 'version' => '10.2', 'roles' => ['qa', 'devops'], 'category' => 'testing'],
            ['name' => 'TestRail', 'description' => 'Test management platform', 'rating' => 4, 'version' => '8.0', 'roles' => ['qa', 'manager'], 'category' => 'testing'],
        ];
    }
}
