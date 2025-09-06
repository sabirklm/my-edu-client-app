import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Play,
  Target,
  Zap,
  CheckCircle,
  BarChart3,
  Bookmark,
  History,
  Lightbulb
} from 'lucide-react';
import Navigation from '../components/common/Navigation';
import { useExamHistory } from '../hooks/useExamProgress';
import { notifyInfo } from '../utils/notifications';

const HomePageEnhanced = () => {
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const { attempts, getStats } = useExamHistory();

  // Load user statistics on mount
  useEffect(() => {
    const stats = getStats();
    setUserStats(stats);
    setRecentAttempts(attempts.slice(0, 3)); // Show last 3 attempts
  }, [attempts, getStats]);

  const examTypes = [
    {
      id: 'jee-main',
      title: 'JEE Main',
      description: 'Engineering entrance exam with comprehensive question bank',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      color: 'from-blue-500 to-blue-700',
      icon: '🔬',
      examId: '68aa3554eb65a371b7a4dafc', // Mock exam ID
      difficulty: 'Medium',
      duration: '45 min',
      questions: 10
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
      duration: '60 min',
      questions: 15
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
      duration: '50 min',
      questions: 12
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
      duration: '75 min',
      questions: 20
    },
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Auto-Save Progress',
      description: 'Your progress is automatically saved every 30 seconds',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Resume Anytime',
      description: 'Pick up exactly where you left off with resume functionality',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Bookmark className="w-6 h-6" />,
      title: 'Question Bookmarking',
      description: 'Save important questions for later review and practice',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed performance insights',
      color: 'bg-orange-100 text-orange-600'
    },
  ];

  const stats = [
    {
      number: userStats?.totalAttempts || '0',
      label: 'Your Attempts',
      icon: <Target className="w-5 h-5" />,
      description: 'Total exams attempted'
    },
    {
      number: userStats?.bestScore ? `${userStats.bestScore}%` : '0%',
      label: 'Best Score',
      icon: <Award className="w-5 h-5" />,
      description: 'Your highest percentage'
    },
    {
      number: userStats?.averageScore ? `${userStats.averageScore}%` : '0%',
      label: 'Average Score',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Your average performance'
    },
    {
      number: Object.keys(userStats?.examStats || {}).length,
      label: 'Exams Tried',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Different exams attempted'
    },
  ];

  const handleStartPractice = () => {
    notifyInfo('Select an exam type below to get started! 🚀');
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section with Enhanced CTA */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Dream Exam
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Practice with authentic previous year questions from JEE, NEET,
              and GATE. Experience real exam conditions with auto-save and resume features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleStartPractice}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Start Free Practice 
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <Link
                to="/exams"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all flex items-center justify-center"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Browse Exams
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Stats Section (if user has data) */}
      {userStats && userStats.totalAttempts > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Progress</h2>
              <p className="text-gray-600">Track your improvement and achievements</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-center items-center mb-3 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Recent Attempts */}
            {recentAttempts.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Attempts</h3>
                  <Link 
                    to="/dashboard" 
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    View All <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {recentAttempts.map((attempt, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-md border">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {attempt.examName}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(attempt.completedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          {attempt.percentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {attempt.correctAnswers}/{attempt.totalQuestions} correct
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s taken
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enhanced Study Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced features designed to maximize your learning and exam performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Types Section with Enhanced Cards */}
      <section id="exams" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Exam
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice with carefully curated question banks from India's most
              competitive exams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {examTypes.map((exam, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div className={`h-32 bg-gradient-to-r ${exam.color} flex items-center justify-center relative`}>
                  <span className="text-4xl">{exam.icon}</span>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {exam.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      exam.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      exam.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {exam.description}
                  </p>

                  {/* Exam Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {exam.duration}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {exam.questions} questions
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="space-y-2 mb-4">
                    {exam.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/mocks/${exam.examId}`}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center group"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Practice
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link
                to="/exams"
                className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl transition-colors group"
              >
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Browse All Exams</h3>
                <p className="text-sm text-gray-600">Explore our complete exam collection</p>
              </Link>
              
              <Link
                to="/dashboard"
                className="bg-green-50 hover:bg-green-100 p-6 rounded-xl transition-colors group"
              >
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
                <p className="text-sm text-gray-600">Track your progress and performance</p>
              </Link>
              
              <Link
                to="/bookmarks"
                className="bg-purple-50 hover:bg-purple-100 p-6 rounded-xl transition-colors group"
              >
                <Bookmark className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">My Bookmarks</h3>
                <p className="text-sm text-gray-600">Review your saved questions</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study Tips Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Study Smart, Not Just Hard
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pro tips to maximize your exam preparation efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Regularly</h3>
              <p className="text-gray-600 mb-4">
                Consistent daily practice is more effective than cramming. Aim for 30-45 minutes daily.
              </p>
              <div className="text-sm text-blue-600 font-medium">✨ Use our auto-save feature to never lose progress</div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600 mb-4">
                Monitor your performance metrics to identify weak areas and focus your study efforts.
              </p>
              <div className="text-sm text-green-600 font-medium">📊 View detailed analytics in your dashboard</div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Review Strategically</h3>
              <p className="text-gray-600 mb-4">
                Bookmark challenging questions and create a personalized review collection.
              </p>
              <div className="text-sm text-purple-600 font-medium">🔖 Use bookmarks to build custom study sets</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Ace Your Exam?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of successful students who trusted MockExam Pro for
            their preparation journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/exams"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg inline-flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Your Journey Today
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-400 mr-2" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MockExam Pro
                </h3>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Your trusted partner for competitive exam preparation with
                authentic previous year questions and advanced progress tracking.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/exams" className="hover:text-white transition-colors">
                    Browse Exams
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/bookmarks" className="hover:text-white transition-colors">
                    My Bookmarks
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MockExam Pro. All rights reserved.</p>
            <p className="mt-2 text-sm">Enhanced with auto-save, bookmarks, and progress tracking</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePageEnhanced;