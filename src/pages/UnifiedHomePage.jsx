import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Users, Award, TrendingUp, Clock, CheckCircle, Star, ArrowRight,
  Play, Target, Zap, BarChart3, Bookmark, History, Lightbulb, Calendar,
  Eye, User, Bell, AlertCircle, Search, Filter, ExternalLink, ChevronRight
} from 'lucide-react';
import { Button, Card, Input, Tag, Statistic, Avatar } from 'antd';
import '../styles/marquee.css';
import Navigation from '../components/common/Navigation';
import { useExamHistory } from '../hooks/useExamProgress';
import { notifyInfo } from '../utils/notifications';
import { 
  featuredArticles, 
  latestNews, 
  popularExams, 
  quickStats, 
  testimonials 
} from '../data/HomePageData';

const { Search: AntSearch } = Input;

const UnifiedHomePage = () => {
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { attempts, getStats } = useExamHistory();

  useEffect(() => {
    const stats = getStats();
    setUserStats(stats);
    setRecentAttempts(attempts.slice(0, 3));
  }, [attempts, getStats]);

  const examTypes = [
    {
      id: 'jee-main',
      title: 'JEE Main',
      description: 'Engineering entrance exam with comprehensive question bank',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      color: 'from-blue-500 to-blue-700',
      icon: '🔬',
      examId: '68aa3554eb65a371b7a4dafc',
      difficulty: 'Medium',
      duration: '45 min',
      questions: 30
    },
    {
      id: 'jee-advanced',
      title: 'JEE Advanced',
      description: 'Advanced engineering entrance for IIT admissions',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      color: 'from-purple-500 to-purple-700',
      icon: '⚡',
      examId: '68aa3554eb65a371b7a4dafc',
      difficulty: 'Hard',
      duration: '90 min',
      questions: 20
    },
    {
      id: 'neet',
      title: 'NEET',
      description: 'Medical entrance exam preparation platform',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      color: 'from-green-500 to-green-700',
      icon: '🩺',
      examId: '68aa3554eb65a371b7a4dafc',
      difficulty: 'Medium',
      duration: '60 min',
      questions: 45
    },
    {
      id: 'gate',
      title: 'GATE',
      description: 'Graduate Aptitude Test in Engineering',
      subjects: ['Multiple Streams', 'Aptitude', 'Core Subjects'],
      color: 'from-orange-500 to-orange-700',
      icon: '🎓',
      examId: '68aa3554eb65a371b7a4dafc',
      difficulty: 'Hard',
      duration: '120 min',
      questions: 25
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Realistic Mock Tests',
      description: 'Practice with exam-like interface and time constraints',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track your progress with comprehensive performance reports',
      color: 'text-green-600'
    },
    {
      icon: Lightbulb,
      title: 'Instant Solutions',
      description: 'Get detailed explanations for every question',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Expert Content',
      description: 'Questions designed by experienced faculty members',
      color: 'text-orange-600'
    }
  ];

  const recentActivity = [
    { type: 'exam', title: 'JEE Main Physics', score: 85, date: '2 days ago' },
    { type: 'article', title: 'Study Tips for NEET', views: 1200, date: '1 week ago' },
    { type: 'exam', title: 'GATE Mathematics', score: 78, date: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section - Mock Exams Focus */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white opacity-5 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-5 rounded-full"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 py-20"
        >
          <div className="text-center max-w-5xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Master Your <span className="text-yellow-400">Competitive Exams</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
            >
              Practice with realistic mock tests, get instant feedback, and track your progress with our comprehensive platform
            </motion.p>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8"
            >
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-200">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Link to="/exams">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<Play className="w-5 h-5" />}
                  className="bg-yellow-500 border-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 h-auto"
                >
                  Start Mock Test
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  size="large" 
                  icon={<BarChart3 className="w-5 h-5" />}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 h-auto font-semibold"
                >
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Breaking News - Quick Updates */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-red-600 text-white py-3"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Bell className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs px-1 rounded-full font-bold">
                  LIVE
                </span>
              </div>
              <span className="font-bold text-sm hidden sm:inline">BREAKING:</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  {latestNews.filter(news => news.isUrgent).map((news, index) => (
                    <span key={news.id} className="text-sm">
                      {news.title}
                      {index < latestNews.filter(n => n.isUrgent).length - 1 && (
                        <span className="mx-8 text-yellow-400">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Popular Exam Categories - Primary Focus */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Exam</h2>
            <p className="text-xl text-gray-600">Start practicing with our comprehensive mock test library</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examTypes.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <Card 
                  hoverable
                  className="h-full text-center group hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${exam.color} flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform duration-300`}>
                    {exam.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{exam.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{exam.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Questions:</span>
                      <span className="font-medium">{exam.questions}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Tag color={exam.difficulty === 'Easy' ? 'green' : exam.difficulty === 'Medium' ? 'orange' : 'red'}>
                      {exam.difficulty}
                    </Tag>
                    <Link to={`/mocks/${exam.examId}`}>
                      <Button type="primary" block size="large" icon={<Play className="w-4 h-4" />}>
                        Start Practice
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-gray-600">Advanced features designed to maximize your exam performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity & Popular Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Recent Activity */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
              <Link to="/dashboard">
                <Button type="link" icon={<History className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'exam' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'exam' ? <Target className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-500">
                        {activity.score ? `Score: ${activity.score}%` : `Views: ${activity.views}`} • {activity.date}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Most Popular Tests */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Most Popular Tests</h2>
              <Link to="/exams">
                <Button type="link" icon={<TrendingUp className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {popularExams.slice(0, 3).map((exam, index) => (
                <Card key={exam.id} hoverable className="hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${exam.color} flex items-center justify-center text-white text-lg`}>
                      {exam.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{exam.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{exam.duration}</span>
                        <span>{exam.questions} questions</span>
                        <span>{exam.attempts.toLocaleString()} attempts</span>
                      </div>
                    </div>
                    <Link to={`/mocks/${exam.id}`}>
                      <Button type="primary" size="small" icon={<Play className="w-3 h-3" />}>
                        Start
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Featured Articles - Secondary */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Study Resources</h2>
              <p className="text-gray-600">Expert articles and guides to boost your preparation</p>
            </div>
            <Link to="/articles">
              <Button type="link" icon={<ArrowRight className="w-4 h-4" />}>
                View All Articles
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.slice(0, 3).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <Card 
                  hoverable
                  className="h-full overflow-hidden group"
                  cover={
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.featuredImage} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Tag color="blue">{article.category}</Tag>
                      </div>
                    </div>
                  }
                >
                  <div className="p-2">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {article.readingTime} min
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        {(article.views / 1000).toFixed(1)}K
                      </div>
                    </div>

                    <Link to={`/articles/${article.slug}`}>
                      <Button type="primary" size="small" block>
                        Read Article
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Success Stories */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">Hear from students who achieved their dreams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <Card className="h-full">
                  <div className="text-center mb-4">
                    <Avatar src={testimonial.avatar} size={80} className="mb-4" />
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <Tag color="green" className="mb-2">{testimonial.score}</Tag>
                    <p className="text-sm text-gray-600">{testimonial.exam}</p>
                  </div>
                  <p className="text-gray-700 italic text-center">"{testimonial.message}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Exams?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of successful students and start your preparation journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/exams">
              <Button 
                type="primary" 
                size="large" 
                icon={<Play className="w-5 h-5" />}
                className="bg-yellow-500 border-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8"
              >
                Start Your First Test
              </Button>
            </Link>
            <Link to="/articles">
              <Button 
                size="large" 
                icon={<BookOpen className="w-5 h-5" />}
                className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600 px-8 font-semibold"
              >
                Explore Study Materials
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default UnifiedHomePage;