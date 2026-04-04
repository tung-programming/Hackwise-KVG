// Seed data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      xp: 500,
      level: 3,
      streak: 7,
      longestStreak: 14,
      onboardingCompleted: true,
    },
  });

  console.log(`✅ Created user: ${user1.name}`);

  // Create sample interests
  const interests = [
    { name: 'JavaScript', category: 'programming' },
    { name: 'React', category: 'web-dev' },
    { name: 'Node.js', category: 'web-dev' },
    { name: 'Python', category: 'programming' },
    { name: 'Machine Learning', category: 'ai-ml' },
  ];

  for (const interest of interests) {
    await prisma.interest.upsert({
      where: {
        userId_name: {
          userId: user1.id,
          name: interest.name,
        },
      },
      update: {},
      create: {
        userId: user1.id,
        ...interest,
      },
    });
  }

  console.log(`✅ Created ${interests.length} interests`);

  // Create sample course
  const course = await prisma.course.create({
    data: {
      userId: user1.id,
      title: 'Learn React Fundamentals',
      description: 'A comprehensive guide to React for beginners',
      topic: 'React',
      level: 'beginner',
      modules: {
        create: [
          {
            title: 'Introduction to React',
            description: 'What is React and why use it',
            resources: ['React docs', 'Getting started tutorial'],
            order: 0,
            completed: true,
          },
          {
            title: 'Components and Props',
            description: 'Building reusable components',
            resources: ['Components guide', 'Props tutorial'],
            order: 1,
            completed: true,
          },
          {
            title: 'State and Lifecycle',
            description: 'Managing component state',
            resources: ['State documentation', 'Lifecycle methods'],
            order: 2,
            completed: false,
          },
          {
            title: 'Hooks',
            description: 'Using React Hooks',
            resources: ['Hooks introduction', 'useState and useEffect'],
            order: 3,
            completed: false,
          },
        ],
      },
    },
  });

  console.log(`✅ Created course: ${course.title}`);

  // Create sample project
  const project = await prisma.project.create({
    data: {
      userId: user1.id,
      title: 'Todo App',
      description: 'A simple todo application built with React',
      repoUrl: 'https://github.com/demo/todo-app',
      liveUrl: 'https://todo-app.demo.com',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      status: 'completed',
    },
  });

  console.log(`✅ Created project: ${project.title}`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
