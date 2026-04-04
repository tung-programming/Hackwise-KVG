export const mockAnalytics = {
  streak: 14,
  completedCourses: 7,
  ongoingInterests: 3,
  projectsCompleted: 12,
}

export const mockTimeActivityData = [
  { day: 'Mon', value: 3.2 },
  { day: 'Tue', value: 2.8 },
  { day: 'Wed', value: 4.5 },
  { day: 'Thu', value: 3.9 },
  { day: 'Fri', value: 5.2 },
  { day: 'Sat', value: 2.1 },
  { day: 'Sun', value: 1.8 },
]

export const mockProjectsData = [
  { name: 'Backend Development', value: 35, fill: 'var(--color-chart-1)' },
  { name: 'Frontend Projects', value: 30, fill: 'var(--color-chart-2)' },
  { name: 'Full Stack', value: 25, fill: 'var(--color-chart-3)' },
  { name: 'Mobile Apps', value: 10, fill: 'var(--color-chart-4)' },
]

export const mockCourses = [
  {
    id: '1',
    title: 'Advanced TypeScript',
    instructor: 'Sarah Chen',
    progress: 75,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    title: 'React Patterns & Best Practices',
    instructor: 'Alex Johnson',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    title: 'System Design Fundamentals',
    instructor: 'Mike Brown',
    progress: 60,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
  },
  {
    id: '4',
    title: 'Algorithms & Data Structures',
    instructor: 'Emma Wilson',
    progress: 30,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=250&fit=crop',
  },
]

export const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    status: 'In Progress',
    difficulty: 'Hard',
    progress: 65,
  },
  {
    id: '2',
    title: 'Weather Dashboard',
    status: 'Completed',
    difficulty: 'Medium',
    progress: 100,
  },
  {
    id: '3',
    title: 'Social Media API',
    status: 'In Progress',
    difficulty: 'Hard',
    progress: 45,
  },
  {
    id: '4',
    title: 'Blog Platform',
    status: 'Completed',
    difficulty: 'Medium',
    progress: 100,
  },
  {
    id: '5',
    title: 'AI Chat Assistant',
    status: 'In Progress',
    difficulty: 'Hard',
    progress: 80,
  },
  {
    id: '6',
    title: 'Todo App',
    status: 'Completed',
    difficulty: 'Easy',
    progress: 100,
  },
]

export const mockLeaderboard = [
  {
    rank: 1,
    name: 'Alex Rodriguez',
    field: 'Engineering',
    points: 2850,
    streak: 45,
  },
  {
    rank: 2,
    name: 'Sarah Chen',
    field: 'Engineering',
    points: 2620,
    streak: 32,
  },
  {
    rank: 3,
    name: 'Mike Johnson',
    field: 'Business',
    points: 2410,
    streak: 28,
  },
  {
    rank: 4,
    name: 'Emma Wilson',
    field: 'Medical',
    points: 2190,
    streak: 21,
  },
  {
    rank: 5,
    name: 'James Brown',
    field: 'Law',
    points: 1980,
    streak: 19,
  },
]

export const mockInterests = [
  {
    id: 'web-dev',
    name: 'Web Development',
    description: 'Full-stack web development with modern frameworks',
    icon: 'Code2',
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Machine learning, data analysis, and visualization',
    icon: 'BarChart3',
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    description: 'iOS and Android app development',
    icon: 'Smartphone',
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Deep learning, neural networks, and AI systems',
    icon: 'Brain',
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    description: 'Infrastructure, deployment, and cloud services',
    icon: 'Cloud',
  },
  {
    id: 'design',
    name: 'UI/UX Design',
    description: 'Digital product design and user experience',
    icon: 'Palette',
  },
]

export const fieldTypes = {
  Engineering: [
    'Software Development',
    'Web Development',
    'Mobile Development',
    'DevOps & Cloud',
    'Data Science',
    'AI & Machine Learning',
  ],
  Law: [
    'Corporate Law',
    'Intellectual Property',
    'Criminal Law',
    'International Law',
    'Family Law',
    'Environmental Law',
  ],
  Business: [
    'Finance & Accounting',
    'Marketing & Sales',
    'Operations Management',
    'Strategic Management',
    'Entrepreneurship',
    'HR & Organizational Development',
  ],
  Medical: [
    'General Medicine',
    'Surgery',
    'Pediatrics',
    'Cardiology',
    'Psychiatry',
    'Nursing',
  ],
}

export const mockRoadmap = {
  id: 'web-dev',
  title: 'Web Development Roadmap',
  phases: [
    {
      phase: 1,
      title: 'Fundamentals',
      courses: [
        {
          id: 'html-css',
          title: 'HTML & CSS Essentials',
          status: 'completed',
          duration: '4 weeks',
        },
        {
          id: 'js-basics',
          title: 'JavaScript Basics',
          status: 'completed',
          duration: '6 weeks',
        },
        {
          id: 'responsive',
          title: 'Responsive Design',
          status: 'in-progress',
          duration: '3 weeks',
        },
      ],
    },
    {
      phase: 2,
      title: 'Frontend Frameworks',
      courses: [
        {
          id: 'react-intro',
          title: 'React Introduction',
          status: 'todo',
          duration: '6 weeks',
        },
        {
          id: 'react-advanced',
          title: 'Advanced React Patterns',
          status: 'todo',
          duration: '5 weeks',
        },
        {
          id: 'nextjs',
          title: 'Next.js & Server Components',
          status: 'todo',
          duration: '4 weeks',
        },
      ],
    },
    {
      phase: 3,
      title: 'Backend Development',
      courses: [
        {
          id: 'node-basics',
          title: 'Node.js Fundamentals',
          status: 'todo',
          duration: '4 weeks',
        },
        {
          id: 'databases',
          title: 'Databases & SQL',
          status: 'todo',
          duration: '5 weeks',
        },
        {
          id: 'apis',
          title: 'Building REST APIs',
          status: 'todo',
          duration: '4 weeks',
        },
      ],
    },
  ],
}

export const mockUserProfile = {
  name: 'Jordan Smith',
  email: 'jordan@example.com',
  field: 'Engineering',
  type: 'Web Development',
  joinDate: '2024-01-15',
  totalPoints: 2450,
  completedCourses: 7,
  certificatesEarned: 3,
}
