import { Link } from 'react-router-dom';
import {
  Target,
  Users,
  Award,
  BookOpen,
  Clock,
  BarChart3,
  Bookmark,
  ArrowRight,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import Navigation from '../components/common/Navigation';

const AboutPage = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Auto-Save Progress',
      description: 'Never lose your progress with automatic saving every 30 seconds during exams.'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Resume Functionality',
      description: 'Pick up exactly where you left off, even after closing your browser.'
    },
    {
      icon: <Bookmark className="w-8 h-8" />,
      title: 'Smart Bookmarking',
      description: 'Save challenging questions and create personalized study collections.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed charts and performance insights.'
    }
  ];

  const advantages = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Authentic Questions',
      description: 'Practice with real previous year questions from JEE, NEET, and GATE'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Real Exam Experience',
      description: 'Timed tests that simulate actual exam conditions'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Instant Feedback',
      description: 'Get immediate results with detailed performance breakdown'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Anonymous Practice',
      description: 'No registration required - start practicing immediately'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Questions Available', icon: BookOpen },
    { number: '4', label: 'Major Exams Covered', icon: Target },
    { number: '100%', label: 'Free to Use', icon: Star },
    { number: '24/7', label: 'Available Access', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                MockExam Pro
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Empowering students with advanced exam preparation tools, authentic questions, 
              and intelligent progress tracking for competitive exam success.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe every student deserves access to high-quality exam preparation tools. 
                MockExam Pro provides a comprehensive, technology-enhanced platform that simulates 
                real exam conditions while offering modern features like auto-save, progress tracking, 
                and intelligent analytics.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform focuses on authentic previous year questions from India's most competitive 
                exams, ensuring students practice with relevant, exam-standard content.
              </p>
              <Link
                to="/exams"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern technology meets educational excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MockExam Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our student-focused approach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Leveraging cutting-edge web technologies for optimal performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-blue-100">
                Built with React and Vite for instant loading and smooth interactions
              </p>
            </div>

            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reliable</h3>
              <p className="text-blue-100">
                Auto-save functionality ensures your progress is never lost
              </p>
            </div>

            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
              <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">User-Focused</h3>
              <p className="text-blue-100">
                Designed with student feedback for optimal learning experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Excel in Your Exams?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join the modern way of exam preparation with smart features and authentic content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/exams"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg inline-flex items-center justify-center"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Practicing Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;