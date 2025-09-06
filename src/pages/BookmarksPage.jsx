import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkX,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  Target,
  ArrowRight,
  AlertCircle,
  BookOpen,
  Star,
  Trash2,
  Eye,
  ChevronDown
} from 'lucide-react';
import Navigation from '../components/common/Navigation';
import dataService from '../services/dataService';
import { notifySuccess, notifyError, notifyWarning } from '../utils/notifications';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const bookmarkData = await dataService.getBookmarks();
      setBookmarks(bookmarkData || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      notifyError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (questionId, examId) => {
    try {
      await dataService.removeBookmark(questionId, examId);
      setBookmarks(prev => prev.filter(b => !(b.questionId === questionId && b.examId === examId)));
      notifySuccess('Bookmark removed');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      notifyError('Failed to remove bookmark');
    }
  };

  const clearAllBookmarks = async () => {
    if (window.confirm('Are you sure you want to remove all bookmarks? This action cannot be undone.')) {
      try {
        const promises = bookmarks.map(bookmark => 
          dataService.removeBookmark(bookmark.questionId, bookmark.examId)
        );
        await Promise.all(promises);
        setBookmarks([]);
        notifyWarning('All bookmarks cleared');
      } catch (error) {
        console.error('Error clearing bookmarks:', error);
        notifyError('Failed to clear bookmarks');
      }
    }
  };

  // Get unique categories from bookmarks
  const categories = ['all', ...new Set(bookmarks.map(b => b.questionData?.tags).flat().filter(Boolean))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.questionData?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.questionData?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           bookmark.questionData?.tags?.includes(selectedCategory);
    const matchesDifficulty = selectedDifficulty === 'all' || 
                             bookmark.questionData?.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'single-select': return '●';
      case 'multi-select': return '☑';
      case 'text': return '✎';
      default: return '?';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Bookmark className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Loading Bookmarks...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Bookmarks
              </h1>
              <p className="text-xl text-gray-600">
                Review your saved questions and create custom study sessions
              </p>
            </div>
            {bookmarks.length > 0 && (
              <button
                onClick={clearAllBookmarks}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        /* Empty State */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Bookmark className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Bookmarks Yet</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start taking exams and bookmark challenging questions to build your personalized study collection.
            </p>
            <Link
              to="/exams"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Exams
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Filters and Search */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search bookmarked questions..."
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
                          {category === 'all' ? 'All Topics' : category}
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
                          {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
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
                  {filteredBookmarks.length} Bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchTerm && `Results for "${searchTerm}"`}
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  {selectedDifficulty !== 'all' && ` (${selectedDifficulty} level)`}
                </p>
              </div>
            </div>

            {/* Bookmarks Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">
                          {getQuestionTypeIcon(bookmark.questionData?.type)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(bookmark.questionData?.difficulty)}`}>
                          {bookmark.questionData?.difficulty || 'Unknown'}
                        </span>
                      </div>
                      <button
                        onClick={() => removeBookmark(bookmark.questionId, bookmark.examId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove bookmark"
                      >
                        <BookmarkX className="w-5 h-5" />
                      </button>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 leading-tight">
                      {bookmark.questionData?.title || 'Question Title'}
                    </h3>

                    {/* Tags */}
                    <div className="mb-4">
                      {bookmark.questionData?.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs mr-2 mb-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Points */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Target className="w-4 h-4 mr-1" />
                      {bookmark.questionData?.points || 1} point{(bookmark.questionData?.points || 1) !== 1 ? 's' : ''}
                    </div>

                    {/* Notes */}
                    {bookmark.notes && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Note:</span> {bookmark.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/mocks/${bookmark.examId}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Practice
                      </Link>
                    </div>

                    {/* Bookmark Date */}
                    <div className="mt-3 text-xs text-gray-400 text-center">
                      Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg">
                            {getQuestionTypeIcon(bookmark.questionData?.type)}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {bookmark.questionData?.title || 'Question Title'}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(bookmark.questionData?.difficulty)}`}>
                            {bookmark.questionData?.difficulty || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {bookmark.questionData?.points || 1} point{(bookmark.questionData?.points || 1) !== 1 ? 's' : ''}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-3">
                          {bookmark.questionData?.tags?.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs mr-2 mb-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Notes */}
                        {bookmark.notes && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                            <p className="text-sm text-yellow-800">
                              <span className="font-medium">Note:</span> {bookmark.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 ml-6">
                        <Link
                          to={`/mocks/${bookmark.examId}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Practice
                        </Link>
                        <button
                          onClick={() => removeBookmark(bookmark.questionId, bookmark.examId)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove bookmark"
                        >
                          <BookmarkX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredBookmarks.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks found</h3>
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

          {/* Study Tips */}
          {bookmarks.length > 0 && (
            <div className="bg-blue-50 border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start">
                    <Star className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Study Tip</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Review your bookmarked questions regularly. These are typically the most challenging concepts 
                        that require extra attention. Try to solve them again without looking at the answers first!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;