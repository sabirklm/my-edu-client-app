import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  Calendar,
  ArrowRight,
  RefreshCw,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Navigation from '../components/common/Navigation';
import { useExamHistory } from '../hooks/useExamProgress';
import dataService from '../services/dataService';
import { notifySuccess, notifyError, notifyWarning } from '../utils/notifications';

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  
  const { attempts, getStats, clearHistory } = useExamHistory();
  
  useEffect(() => {
    loadAnalytics();
  }, [attempts]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const stats = getStats();
      const analyticsData = await dataService.getUserAnalytics();
      
      setAnalytics({
        ...stats,
        ...analyticsData,
        recentAttempts: attempts.slice(0, 10)
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      notifyError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await dataService.exportUserData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mockexam-pro-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notifySuccess('Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      notifyError('Failed to export data');
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all exam history? This action cannot be undone.')) {
      try {
        await clearHistory();
        await loadAnalytics();
        notifyWarning('Exam history cleared');
      } catch (error) {
        console.error('Clear history failed:', error);
        notifyError('Failed to clear history');
      }
    }
  };

  // Prepare chart data
  const performanceData = analytics?.recentAttempts?.slice(0, 8).reverse().map((attempt, index) => ({
    name: `Attempt ${index + 1}`,
    score: attempt.percentage,
    accuracy: attempt.accuracy,
    examName: attempt.examName.split(' ').slice(0, 2).join(' ')
  })) || [];

  const subjectData = Object.entries(analytics?.examStats || {}).map(([examId, stats]) => ({
    name: stats.examName.split(' ').slice(0, 2).join(' '),
    score: stats.bestScore,
    attempts: stats.attempts
  }));

  const difficultyColors = ['#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Loading Analytics...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalAttempts === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <BarChart3 className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start taking exams to see your performance analytics, progress tracking, and detailed insights.
            </p>
            <Link
              to="/exams"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Take Your First Exam
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
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
                Performance Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Track your progress and analyze your exam performance
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={handleClearHistory}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-green-600">{analytics.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.bestScore}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-3xl font-bold text-orange-600">
                  {Math.round(analytics.totalTimeSpent / 3600)}h
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Trend</h3>
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name === 'score' ? 'Score' : 'Accuracy']}
                    labelFormatter={(label) => `Attempt: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No data available yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Subject Performance */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Exam Performance</h3>
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'score' ? `${value}%` : value,
                      name === 'score' ? 'Best Score' : 'Attempts'
                    ]}
                  />
                  <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No exam data available yet</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Attempts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Recent Exam Attempts</h3>
              <div className="text-sm text-gray-500">
                Showing last {Math.min(analytics.recentAttempts?.length || 0, 10)} attempts
              </div>
            </div>
          </div>

          {analytics.recentAttempts?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.recentAttempts.map((attempt, index) => (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {attempt.examName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {attempt.answeredQuestions}/{attempt.totalQuestions} answered
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-lg font-bold ${
                            attempt.percentage >= 80 ? 'text-green-600' :
                            attempt.percentage >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {attempt.percentage}%
                          </span>
                          {attempt.percentage >= 80 && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attempt.accuracy}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/mocks/${attempt.examId}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          Retry <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No attempts yet</h3>
              <p className="text-gray-600 mb-6">Start taking exams to see your performance data here</p>
              <Link
                to="/exams"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Exams
              </Link>
            </div>
          )}
        </div>

        {/* Performance Insights */}
        {analytics.totalAttempts > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Consistency</span>
                </div>
                <p className="text-sm text-blue-800">
                  Your average score is {analytics.averageScore}%. 
                  {analytics.averageScore >= 75 ? ' Great consistency!' : ' Keep practicing for better consistency.'}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">Achievement</span>
                </div>
                <p className="text-sm text-green-800">
                  Your best score is {analytics.bestScore}%.
                  {analytics.bestScore >= 85 ? ' Excellent performance!' : ' Aim for 85%+ scores.'}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-900">Time Management</span>
                </div>
                <p className="text-sm text-purple-800">
                  Total study time: {Math.round(analytics.totalTimeSpent / 3600)} hours.
                  {analytics.totalTimeSpent > 7200 ? ' Great dedication!' : ' Increase practice time for better results.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            to="/exams"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
          >
            <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Take New Exam</h3>
            <p className="text-sm text-gray-600 mb-4">Challenge yourself with a new assessment</p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span className="text-sm font-medium">Start Now</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/bookmarks"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
          >
            <BookOpen className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Review Bookmarks</h3>
            <p className="text-sm text-gray-600 mb-4">Study your saved questions</p>
            <div className="flex items-center text-purple-600 group-hover:text-purple-700">
              <span className="text-sm font-medium">Review Now</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <button
            onClick={loadAnalytics}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all group text-left"
          >
            <RefreshCw className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Refresh Data</h3>
            <p className="text-sm text-gray-600 mb-4">Update your latest performance metrics</p>
            <div className="flex items-center text-green-600 group-hover:text-green-700">
              <span className="text-sm font-medium">Refresh</span>
              <RefreshCw className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;