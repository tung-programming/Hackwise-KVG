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

export const mockCourseRoadmaps: Record<string, {
  id: string
  title: string
  instructor: string
  image: string
  progress: number
  description: string
  totalDuration: string
  phases: {
    phase: number
    title: string
    lessons: {
      id: string
      title: string
      type: 'video' | 'article' | 'quiz' | 'project'
      duration: string
      status: 'completed' | 'in-progress' | 'todo'
    }[]
  }[]
}> = {
  '1': {
    id: '1',
    title: 'Advanced TypeScript',
    instructor: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    progress: 75,
    description: 'Deep dive into TypeScript generics, utility types, decorators, and advanced patterns used in production codebases.',
    totalDuration: '18 weeks',
    phases: [
      {
        phase: 1,
        title: 'Type System Deep Dive',
        lessons: [
          { id: 'ts-1-1', title: 'TypeScript Compiler & tsconfig', type: 'video', duration: '45 min', status: 'completed' },
          { id: 'ts-1-2', title: 'Advanced Types & Intersections', type: 'video', duration: '60 min', status: 'completed' },
          { id: 'ts-1-3', title: 'Generics & Constraints', type: 'video', duration: '55 min', status: 'completed' },
          { id: 'ts-1-4', title: 'Type Inference & Narrowing', type: 'article', duration: '30 min', status: 'completed' },
          { id: 'ts-1-5', title: 'Module 1 Quiz', type: 'quiz', duration: '20 min', status: 'completed' },
        ],
      },
      {
        phase: 2,
        title: 'Utility Types & Mapped Types',
        lessons: [
          { id: 'ts-2-1', title: 'Built-in Utility Types', type: 'video', duration: '50 min', status: 'completed' },
          { id: 'ts-2-2', title: 'Creating Custom Utility Types', type: 'video', duration: '65 min', status: 'completed' },
          { id: 'ts-2-3', title: 'Mapped & Conditional Types', type: 'video', duration: '70 min', status: 'in-progress' },
          { id: 'ts-2-4', title: 'Template Literal Types', type: 'article', duration: '25 min', status: 'todo' },
          { id: 'ts-2-5', title: 'Utility Types Project', type: 'project', duration: '3 hrs', status: 'todo' },
        ],
      },
      {
        phase: 3,
        title: 'Decorators & Metaprogramming',
        lessons: [
          { id: 'ts-3-1', title: 'Class & Method Decorators', type: 'video', duration: '55 min', status: 'todo' },
          { id: 'ts-3-2', title: 'Reflect Metadata API', type: 'article', duration: '35 min', status: 'todo' },
          { id: 'ts-3-3', title: 'Building a DI Container', type: 'project', duration: '4 hrs', status: 'todo' },
          { id: 'ts-3-4', title: 'Final Assessment', type: 'quiz', duration: '30 min', status: 'todo' },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    title: 'React Patterns & Best Practices',
    instructor: 'Alex Johnson',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=250&fit=crop',
    progress: 45,
    description: 'Master compound components, render props, custom hooks, performance optimization, and modern React architecture patterns.',
    totalDuration: '14 weeks',
    phases: [
      {
        phase: 1,
        title: 'Component Design Patterns',
        lessons: [
          { id: 'r-1-1', title: 'Compound Components Pattern', type: 'video', duration: '50 min', status: 'completed' },
          { id: 'r-1-2', title: 'Render Props & Higher-Order Components', type: 'video', duration: '55 min', status: 'completed' },
          { id: 'r-1-3', title: 'Controlled vs Uncontrolled Components', type: 'article', duration: '25 min', status: 'completed' },
          { id: 'r-1-4', title: 'Pattern Practice Quiz', type: 'quiz', duration: '15 min', status: 'completed' },
        ],
      },
      {
        phase: 2,
        title: 'Custom Hooks & State Management',
        lessons: [
          { id: 'r-2-1', title: 'Designing Reusable Custom Hooks', type: 'video', duration: '60 min', status: 'completed' },
          { id: 'r-2-2', title: 'useReducer & Complex State', type: 'video', duration: '45 min', status: 'in-progress' },
          { id: 'r-2-3', title: 'Context API Best Practices', type: 'video', duration: '50 min', status: 'todo' },
          { id: 'r-2-4', title: 'State Management Project', type: 'project', duration: '5 hrs', status: 'todo' },
        ],
      },
      {
        phase: 3,
        title: 'Performance & Architecture',
        lessons: [
          { id: 'r-3-1', title: 'React.memo & useMemo Deep Dive', type: 'video', duration: '55 min', status: 'todo' },
          { id: 'r-3-2', title: 'Code Splitting & Lazy Loading', type: 'video', duration: '40 min', status: 'todo' },
          { id: 'r-3-3', title: 'Profiling & Optimization Workshop', type: 'project', duration: '3 hrs', status: 'todo' },
          { id: 'r-3-4', title: 'Final Architecture Quiz', type: 'quiz', duration: '25 min', status: 'todo' },
        ],
      },
    ],
  },
  '3': {
    id: '3',
    title: 'System Design Fundamentals',
    instructor: 'Mike Brown',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    progress: 60,
    description: 'Learn to design scalable distributed systems — from load balancing and caching to database sharding and microservices.',
    totalDuration: '20 weeks',
    phases: [
      {
        phase: 1,
        title: 'Core System Concepts',
        lessons: [
          { id: 'sd-1-1', title: 'Scalability & CAP Theorem', type: 'video', duration: '60 min', status: 'completed' },
          { id: 'sd-1-2', title: 'Load Balancing Strategies', type: 'video', duration: '50 min', status: 'completed' },
          { id: 'sd-1-3', title: 'Caching Patterns & CDNs', type: 'video', duration: '55 min', status: 'completed' },
          { id: 'sd-1-4', title: 'Concepts Assessment', type: 'quiz', duration: '20 min', status: 'completed' },
        ],
      },
      {
        phase: 2,
        title: 'Database Design & Storage',
        lessons: [
          { id: 'sd-2-1', title: 'SQL vs NoSQL Trade-offs', type: 'video', duration: '65 min', status: 'completed' },
          { id: 'sd-2-2', title: 'Database Sharding & Replication', type: 'video', duration: '70 min', status: 'in-progress' },
          { id: 'sd-2-3', title: 'Designing a URL Shortener', type: 'project', duration: '4 hrs', status: 'todo' },
          { id: 'sd-2-4', title: 'Storage Systems Quiz', type: 'quiz', duration: '20 min', status: 'todo' },
        ],
      },
      {
        phase: 3,
        title: 'Microservices & APIs',
        lessons: [
          { id: 'sd-3-1', title: 'Microservices vs Monolith', type: 'article', duration: '30 min', status: 'todo' },
          { id: 'sd-3-2', title: 'API Gateway & Service Mesh', type: 'video', duration: '55 min', status: 'todo' },
          { id: 'sd-3-3', title: 'Event-Driven Architecture', type: 'video', duration: '60 min', status: 'todo' },
          { id: 'sd-3-4', title: 'Design Twitter / Instagram', type: 'project', duration: '6 hrs', status: 'todo' },
        ],
      },
    ],
  },
  '4': {
    id: '4',
    title: 'Algorithms & Data Structures',
    instructor: 'Emma Wilson',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=250&fit=crop',
    progress: 30,
    description: 'Build strong problem-solving foundations: arrays, trees, graphs, dynamic programming, and interview-ready patterns.',
    totalDuration: '22 weeks',
    phases: [
      {
        phase: 1,
        title: 'Linear Data Structures',
        lessons: [
          { id: 'ds-1-1', title: 'Arrays & Sliding Window', type: 'video', duration: '55 min', status: 'completed' },
          { id: 'ds-1-2', title: 'Linked Lists & Two Pointers', type: 'video', duration: '60 min', status: 'completed' },
          { id: 'ds-1-3', title: 'Stacks, Queues & Monotonic Stacks', type: 'video', duration: '65 min', status: 'in-progress' },
          { id: 'ds-1-4', title: 'Linear Structures Quiz', type: 'quiz', duration: '25 min', status: 'todo' },
        ],
      },
      {
        phase: 2,
        title: 'Trees & Graphs',
        lessons: [
          { id: 'ds-2-1', title: 'Binary Trees & DFS / BFS', type: 'video', duration: '70 min', status: 'todo' },
          { id: 'ds-2-2', title: 'Heaps & Priority Queues', type: 'video', duration: '55 min', status: 'todo' },
          { id: 'ds-2-3', title: 'Graph Traversals & Shortest Paths', type: 'video', duration: '75 min', status: 'todo' },
          { id: 'ds-2-4', title: 'Trees & Graphs Project', type: 'project', duration: '5 hrs', status: 'todo' },
        ],
      },
      {
        phase: 3,
        title: 'Dynamic Programming & Advanced',
        lessons: [
          { id: 'ds-3-1', title: 'Intro to Dynamic Programming', type: 'video', duration: '80 min', status: 'todo' },
          { id: 'ds-3-2', title: 'DP Patterns: Knapsack, LCS, LIS', type: 'video', duration: '75 min', status: 'todo' },
          { id: 'ds-3-3', title: 'Greedy Algorithms', type: 'article', duration: '35 min', status: 'todo' },
          { id: 'ds-3-4', title: 'Mock Interview: 5 Problems', type: 'project', duration: '3 hrs', status: 'todo' },
          { id: 'ds-3-5', title: 'Final Assessment', type: 'quiz', duration: '40 min', status: 'todo' },
        ],
      },
    ],
  },
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