import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const examTypes = [
    {
      title: 'JEE Main',
      description: 'Engineering entrance exam with comprehensive question bank',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      color: 'from-blue-500 to-blue-700',
      icon: '🔬',
    },
    {
      title: 'JEE Advanced',
      description: 'Advanced engineering entrance for IIT admissions',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      color: 'from-purple-500 to-purple-700',
      icon: '⚡',
    },
    {
      title: 'NEET',
      description: 'Medical entrance exam preparation platform',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      color: 'from-green-500 to-green-700',
      icon: '🩺',
    },
    {
      title: 'GATE',
      description: 'Graduate Aptitude Test in Engineering',
      subjects: ['Multiple Streams', 'Aptitude', 'Core Subjects'],
      color: 'from-orange-500 to-orange-700',
      icon: '🎓',
    },
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Previous Year Questions',
      description: 'Extensive collection of authentic previous year questions',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Timed Mock Tests',
      description: 'Real exam experience with proper time management',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Performance Analytics',
      description: 'Detailed analysis of your strengths and weaknesses',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Instant Results',
      description: 'Get immediate feedback with detailed solutions',
    },
  ];

  const stats = [
    {
      number: '50,000+',
      label: 'Questions',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      number: '25,000+',
      label: 'Students',
      icon: <Users className="w-5 h-5" />,
    },
    {
      number: '15+',
      label: 'Years Covered',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      number: '95%',
      label: 'Success Rate',
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MockExam Pro
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#exams"
                  className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                >
                  Exams
                </a>
                <a
                  href="#features"
                  className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-gray-900 hover:text-blue-600 transition-colors font-medium"
                >
                  About
                </a>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-900 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <a
                  href="#exams"
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600"
                >
                  Exams
                </a>
                <a
                  href="#features"
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600"
                >
                  About
                </a>
                <button className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
                  Start Practicing
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
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
              and GATE. Experience real exam conditions and boost your
              confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center">
                Start Free Practice <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all">
                View Sample Questions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section id="exams" className="py-20 bg-gray-50">
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
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div
                  className={`h-32 bg-gradient-to-r ${exam.color} flex items-center justify-center`}
                >
                  <span className="text-4xl">{exam.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {exam.description}
                  </p>
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
                  <button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Start Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MockExam Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the most comprehensive and realistic exam preparation
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
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
            their preparation
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MockExam Pro
              </h3>
              <p className="text-gray-400">
                Your trusted partner for competitive exam preparation with
                authentic previous year questions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Exams</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    JEE Main
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    JEE Advanced
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    NEET
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GATE
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
