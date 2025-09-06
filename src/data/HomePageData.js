// Sample data for home page - replace with API calls later
export const featuredArticles = [
  {
    id: "1",
    title: "Complete Guide to JEE Main 2025: Preparation Strategy and Tips",
    slug: "complete-guide-jee-main-2025-preparation-strategy-tips",
    excerpt: "Master JEE Main 2025 with our comprehensive preparation guide. Learn effective study strategies, time management tips, and exam patterns.",
    featuredImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
    category: "JEE Main",
    readingTime: 12,
    publishedDate: "2024-09-06T10:00:00.000Z",
    author: "Dr. Ramesh Kumar",
    isFeatured: true,
    views: 15420
  },
  {
    id: "2", 
    title: "NEET 2025: Top 10 Biology Topics You Must Master",
    slug: "neet-2025-top-biology-topics-master",
    excerpt: "Discover the most important biology topics for NEET 2025 and effective study strategies to score maximum marks.",
    featuredImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    category: "NEET",
    readingTime: 8,
    publishedDate: "2024-09-05T14:30:00.000Z",
    author: "Dr. Priya Sharma",
    isFeatured: true,
    views: 12350
  },
  {
    id: "3",
    title: "GATE 2025: Computer Science Preparation Roadmap",
    slug: "gate-2025-computer-science-preparation-roadmap",
    excerpt: "A comprehensive roadmap for GATE Computer Science preparation with subject-wise strategies and resource recommendations.",
    featuredImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop",
    category: "GATE",
    readingTime: 15,
    publishedDate: "2024-09-04T09:15:00.000Z",
    author: "Prof. Ankit Verma",
    isFeatured: true,
    views: 9870
  }
];

export const latestNews = [
  {
    id: "news-1",
    title: "JEE Main 2025 Registration Opens: Key Dates and Process",
    excerpt: "NTA announces JEE Main 2025 registration schedule with important dates and application guidelines.",
    publishedDate: "2024-09-06T12:00:00.000Z",
    category: "Admission Updates",
    isUrgent: true,
    source: "NTA Official",
    link: "/news/jee-main-2025-registration"
  },
  {
    id: "news-2",
    title: "NEET 2025: New Exam Pattern Changes Announced",
    excerpt: "Medical Council of India announces significant changes to NEET exam pattern for 2025.",
    publishedDate: "2024-09-05T16:30:00.000Z",
    category: "Exam Updates",
    isUrgent: true,
    source: "MCI Official",
    link: "/news/neet-2025-pattern-changes"
  },
  {
    id: "news-3",
    title: "IIT Placements 2024: Record Breaking Package Offers",
    excerpt: "IIT campuses witness unprecedented placement records with highest packages reaching new heights.",
    publishedDate: "2024-09-04T10:45:00.000Z",
    category: "Career News",
    isUrgent: false,
    source: "IIT News",
    link: "/news/iit-placements-2024"
  },
  {
    id: "news-4",
    title: "New Engineering Colleges Approved for 2025 Admissions",
    excerpt: "AICTE approves 45 new engineering colleges across India for the 2025-26 academic session.",
    publishedDate: "2024-09-03T13:20:00.000Z",
    category: "Education Policy",
    isUrgent: false,
    source: "AICTE",
    link: "/news/new-colleges-approved-2025"
  },
  {
    id: "news-5",
    title: "Scholarship Programs for Engineering Students Launched",
    excerpt: "Government launches new scholarship programs worth ₹500 crores for deserving engineering students.",
    publishedDate: "2024-09-02T11:00:00.000Z",
    category: "Scholarships",
    isUrgent: false,
    source: "Government",
    link: "/news/engineering-scholarships-2025"
  }
];

export const examStats = {
  totalExams: 250,
  totalQuestions: 15000,
  activeUsers: 45000,
  successRate: 87
};

export const popularExams = [
  {
    id: '68aa3554eb65a371b7a4dafc',
    title: 'JEE Main Physics',
    description: 'Complete physics mock test covering all JEE Main topics',
    subjects: ['Mechanics', 'Thermodynamics', 'Optics'],
    duration: '45 min',
    questions: 30,
    difficulty: 'Medium',
    attempts: 12500,
    averageScore: 72,
    color: 'from-blue-500 to-blue-700',
    icon: '🔬'
  },
  {
    id: '68aa3554eb65a371b7a4dafd',
    title: 'NEET Biology',
    description: 'Comprehensive biology test for NEET preparation',
    subjects: ['Botany', 'Zoology', 'Human Physiology'],
    duration: '60 min',
    questions: 45,
    difficulty: 'Medium',
    attempts: 18200,
    averageScore: 68,
    color: 'from-green-500 to-green-700',
    icon: '🩺'
  },
  {
    id: '68aa3554eb65a371b7a4dafe',
    title: 'JEE Advanced Mathematics',
    description: 'Advanced level mathematics for IIT JEE preparation',
    subjects: ['Calculus', 'Algebra', 'Coordinate Geometry'],
    duration: '90 min',
    questions: 20,
    difficulty: 'Hard',
    attempts: 8900,
    averageScore: 58,
    color: 'from-purple-500 to-purple-700',
    icon: '⚡'
  },
  {
    id: '68aa3554eb65a371b7a4daff',
    title: 'GATE Computer Science',
    description: 'Complete GATE CSE mock test with latest pattern',
    subjects: ['DSA', 'OS', 'Networks', 'DBMS'],
    duration: '120 min',
    questions: 25,
    difficulty: 'Hard',
    attempts: 6700,
    averageScore: 64,
    color: 'from-orange-500 to-orange-700',
    icon: '💻'
  }
];

export const quickStats = [
  {
    label: 'Total Students',
    value: '50K+',
    icon: '👨‍🎓',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    label: 'Mock Exams',
    value: '250+',
    icon: '📝',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    label: 'Success Rate',
    value: '87%',
    icon: '🎯',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    label: 'Expert Faculty',
    value: '100+',
    icon: '👨‍🏫',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    exam: "JEE Main 2024",
    score: "99.2 Percentile",
    message: "The mock tests here were incredibly helpful. They perfectly simulated the actual exam environment and helped me identify my weak areas.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Priya Patel",
    exam: "NEET 2024",
    score: "AIR 150",
    message: "The detailed explanations and analysis reports helped me improve significantly. I couldn't have achieved this rank without these resources.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Ankit Kumar",
    exam: "GATE CSE 2024", 
    score: "AIR 25",
    message: "The variety of questions and difficulty levels helped me prepare for every possible scenario. Highly recommended for GATE preparation.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
];

export const studyTips = [
  {
    id: 1,
    title: "Create a Study Schedule",
    description: "Plan your daily study routine with specific time slots for each subject",
    icon: "⏰",
    category: "Time Management"
  },
  {
    id: 2,
    title: "Practice Mock Tests",
    description: "Take regular mock tests to improve speed and accuracy",
    icon: "📝",
    category: "Practice"
  },
  {
    id: 3,
    title: "Analyze Your Performance",
    description: "Review your mistakes and work on weak areas consistently",
    icon: "📊",
    category: "Analysis"
  },
  {
    id: 4,
    title: "Stay Healthy",
    description: "Maintain proper diet, exercise, and sleep schedule during preparation",
    icon: "💪",
    category: "Health"
  }
];

export default {
  featuredArticles,
  latestNews,
  examStats,
  popularExams,
  quickStats,
  testimonials,
  studyTips
};