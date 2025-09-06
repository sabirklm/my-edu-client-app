import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Target,
  Filter,
  Search,
  Play,
  Star,
  TrendingUp,
  Users,
  ChevronDown,
  Grid3X3,
  List,
  ArrowRight
} from 'lucide-react';
import Navigation from '../components/common/Navigation';
import { useExamHistory } from '../hooks/useExamProgress';
import { notifyInfo } from '../utils/notifications';

const ExamListingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const { attempts, getStats } = useExamHistory();
  const userStats = getStats();

  // Mock exam data - replace with API call when backend is ready
  const allExams = [
    {
      id: '68aa3554eb65a371b7a4dafc',
      name: 'JEE Main Physics Mock Test',
      description: 'Comprehensive physics test covering mechanics, thermodynamics, and optics',
      category: 'JEE Main',
      difficulty: 'Medium',
      duration: 45,
      questions: 10,
      subjects: ['Physics'],
      color: 'from-blue-500 to-blue-700',
      icon: '🔬',
      tags: ['mechanics', 'thermodynamics', 'optics'],
      attempts: attempts.filter(a => a.examId === '68aa3554eb65a371b7a4dafc').length,
      bestScore: Math.max(...attempts.filter(a => a.examId === '68aa3554eb65a371b7a4dafc').map(a => a.percentage), 0)
    },
    {
      id: 'chem_001',
      name: 'JEE Main Chemistry Fundamentals',
      description: 'Essential chemistry concepts for JEE Main preparation',
      category: 'JEE Main',
      difficulty: 'Easy',
      duration: 30,
      questions: 8,
      subjects: ['Chemistry'],
      color: 'from-green-500 to-green-700',
      icon: '🧪',
      tags: ['organic', 'inorganic', 'physical'],
      attempts: 0,
      bestScore: 0
    },
    {
      id: 'math_001',
      name: 'JEE Advanced Mathematics',
      description: 'Advanced mathematical concepts and problem-solving',
      category: 'JEE Advanced',
      difficulty: 'Hard',
      duration: 60,
      questions: 15,
      subjects: ['Mathematics'],
      color: 'from-purple-500 to-purple-700',
      icon: '📐',
      tags: ['calculus', 'algebra', 'geometry'],
      attempts: 0,
      bestScore: 0
    },
    {
      id: 'neet_bio_001',
      name: 'NEET Biology Comprehensive',
      description: 'Complete biology coverage for NEET preparation',
      category: 'NEET',
      difficulty: 'Medium',
      duration: 50,
      questions: 12,
      subjects: ['Biology'],
      color: 'from-green-500 to-emerald-700',
      icon: '🩺',
      tags: ['botany', 'zoology', 'human physiology'],
      attempts: 0,
      bestScore: 0
    },
    {
      id: 'gate_cs_001',
      name: 'GATE Computer Science',
      description: 'Core computer science concepts for GATE CSE',
      category: 'GATE',
      difficulty: 'Hard',
      duration: 75,
      questions: 20,
      subjects: ['Computer Science'],
      color: 'from-orange-500 to-red-500',
      icon: '💻',
      tags: ['algorithms', 'data structures', 'operating systems'],
      attempts: 0,
      bestScore: 0
    },
    {
      id: 'neet_phy_001',
      name: 'NEET Physics Practice',
      description: 'Physics fundamentals for medical entrance',
      category: 'NEET',
      difficulty: 'Medium',
      duration: 45,
      questions: 10,
      subjects: ['Physics'],
      color: 'from-blue-500 to-teal-500',
      icon: '⚗️',
      tags: ['mechanics', 'electricity', 'modern physics'],
      attempts: 0,
      bestScore: 0
    }
  ];

  const categories = ['all', ...new Set(allExams.map(exam => exam.category))];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  // Filter and sort exams
  const filteredExams = allExams
    .filter(exam => {
      const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'duration':
          return a.duration - b.duration;
        case 'attempts':
          return b.attempts - a.attempts;
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStartExam = (examId, examName) => {
    notifyInfo(`Starting ${examName}... 🚀`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Available Exams
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive collection of mock exams and start practicing today
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exams, subjects, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-4`}>
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Difficulties' : difficulty}
                    </option>
                  ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="attempts">Sort by Attempts</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {filteredExams.length} Exam{filteredExams.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-gray-600 mt-1">
              {searchTerm && `Results for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {selectedDifficulty !== 'all' && ` (${selectedDifficulty} level)`}
            </p>
          </div>
        </div>

        {/* Exam Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-r ${exam.color} flex items-center justify-center relative`}>
                  <span className="text-4xl">{exam.icon}</span>
                  {exam.attempts > 0 && (
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                      {exam.attempts} attempt{exam.attempts !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {exam.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(exam.difficulty)}`}>
                      {exam.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {exam.description}
                  </p>

                  {/* Exam Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {exam.duration} min
                    </div>
                    <div className="flex items-center text-gray-500">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {exam.questions} questions
                    </div>
                  </div>

                  {/* Performance Badge */}
                  {exam.bestScore > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 font-medium">Your Best:</span>
                        <span className="text-blue-900 font-bold">{exam.bestScore}%</span>
                      </div>
                    </div>
                  )}

                  {/* Subjects */}
                  <div className="mb-4">
                    {exam.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2 mb-1"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/mocks/${exam.id}`}
                    onClick={() => handleStartExam(exam.id, exam.name)}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center group"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {exam.attempts > 0 ? 'Practice Again' : 'Start Practice'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl">{exam.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exam.name}</h3>
                        <p className="text-gray-600 text-sm">{exam.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {exam.duration} min
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {exam.questions} questions
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {exam.category}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(exam.difficulty)}`}>
                        {exam.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {exam.bestScore > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{exam.bestScore}%</div>
                        <div className="text-xs text-gray-500">Best Score</div>
                      </div>
                    )}
                    
                    <Link
                      to={`/mocks/${exam.id}`}
                      onClick={() => handleStartExam(exam.id, exam.name)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {exam.attempts > 0 ? 'Retry' : 'Start'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredExams.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse different categories
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{allExams.length}</div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{userStats?.totalAttempts || 0}</div>
              <div className="text-sm text-gray-600">Your Attempts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {userStats?.bestScore ? `${userStats.bestScore}%` : '0%'}
              </div>
              <div className="text-sm text-gray-600">Your Best Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamListingPage;