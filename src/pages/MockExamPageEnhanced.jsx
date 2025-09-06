import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Clock,
  CheckCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  BookOpen,
  Timer,
  Award,
  AlertCircle,
  Home,
  Menu,
  X,
  EyeOff,
  HelpCircle,
  TrendingUp,
  Target,
  Zap,
  Star,
  Loader,
  Bookmark,
  BookmarkCheck,
  Save
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { formatDistanceToNow } from 'date-fns';

// Import our new services and components
import dataService from '../services/dataService';
import { useExamProgress, useExamHistory } from '../hooks/useExamProgress';
import ResumeExamDialog from '../components/exam/ResumeExamDialog';
import { 
  notifySuccess, 
  notifyError, 
  notifyWarning, 
  notifyAutoSave,
  notifyInfo 
} from '../utils/notifications';
import { EXAM_STATUS, AUTO_SAVE_INTERVAL } from '../constants/examConstants';

const MockExamPageEnhanced = () => {
  // Existing state
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHints, setShowHints] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { id } = useParams();
  
  // Submit modal state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  // New enhanced state
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Auto-save ref
  const autoSaveIntervalRef = useRef(null);
  const currentProgressRef = useRef(null);
  
  // Custom hooks
  const {
    examProgress,
    isAutoSaving,
    lastSaved,
    saveProgress,
    startAutoSave,
    stopAutoSave,
    updateProgress,
    clearProgress,
    hasIncompleteProgress,
    getResumeData
  } = useExamProgress(id);
  
  const { saveAttempt } = useExamHistory();

  // Modal handlers
  const showModal = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  // Check for incomplete progress on mount
  useEffect(() => {
    const checkIncompleteProgress = async () => {
      if (id) {
        try {
          const savedProgress = await dataService.getExamProgress(id);
          if (savedProgress && savedProgress.status === EXAM_STATUS.IN_PROGRESS) {
            setShowResumeDialog(true);
          }
        } catch (error) {
          console.error('Error checking progress:', error);
        }
      }
    };
    
    checkIncompleteProgress();
  }, [id]);

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await dataService.getExamById(id);
        
        if (!response.success || !response.data) {
          throw new Error('No exam data found');
        }

        // Transform API data to match component structure
        const transformedData = {
          id: response.data._id,
          name: response.data.name,
          description: response.data.description || `Assessment containing ${response.data.questions.length} questions`,
          timeLimit: response.data.timeLimit || 45,
          questions: response.data.questions.map((question) => ({
            id: question._id,
            title: question.title,
            subtitle: question.type === 'multi-select' ? 'Select all that apply' : undefined,
            type: question.type,
            difficulty: question.difficulty || 'medium',
            points: question.points || 1,
            tags: question.tags || [],
            hint: question.hint,
            options: question.options
              ? question.options.map((option) => ({
                  id: option.id,
                  label: option.label,
                  isCorrect: option.isCorrect,
                }))
              : undefined,
            correctAnswer: question.correctAnswer,
          })),
        };

        setExamData(transformedData);
        setTimeRemaining(transformedData.timeLimit * 60);
        
        // Load bookmarks
        await loadBookmarks();
        
      } catch (err) {
        console.error('Failed to fetch exam data:', err);
        setError(err.message);
        notifyError('Failed to load exam data');
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [id]);

  // Load bookmarks
  const loadBookmarks = async () => {
    try {
      const bookmarks = await dataService.getBookmarks();
      const examBookmarks = new Set(
        bookmarks
          .filter(bookmark => bookmark.examId === id)
          .map(bookmark => bookmark.questionId)
      );
      setBookmarkedQuestions(examBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  // Auto-save current progress
  const autoSaveProgress = useCallback(async () => {
    if (!examData || !examStarted || examCompleted) return;

    const progressData = {
      examId: id,
      answers,
      currentQuestionIndex,
      timeRemaining,
      flaggedQuestions,
      status: EXAM_STATUS.IN_PROGRESS,
      examData
    };

    try {
      await saveProgress(progressData);
      setLastSavedTime(new Date());
      setHasUnsavedChanges(false);
      notifyAutoSave();
    } catch (error) {
      console.error('Auto-save failed:', error);
      notifyError('Failed to save progress');
    }
  }, [id, examData, answers, currentQuestionIndex, timeRemaining, flaggedQuestions, examStarted, examCompleted, saveProgress]);

  // Start auto-save when exam begins
  useEffect(() => {
    if (examStarted && !examCompleted) {
      // Save immediately when exam starts
      autoSaveProgress();
      
      // Set up interval
      autoSaveIntervalRef.current = setInterval(autoSaveProgress, AUTO_SAVE_INTERVAL);
      
      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [examStarted, examCompleted, autoSaveProgress]);

  // Mark unsaved changes when answers change
  useEffect(() => {
    if (examStarted && !examCompleted) {
      setHasUnsavedChanges(true);
    }
  }, [answers, flaggedQuestions, examStarted, examCompleted]);

  // Get current question and totals
  const allQuestions = examData ? examData.questions : [];
  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;

  // Timer effect
  useEffect(() => {
    let interval;
    if (examStarted && !examCompleted && timeRemaining > 0 && examData) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 300 && prev > 299) {
            setShowWarning(true);
            notifyWarning('⏰ Only 5 minutes remaining!');
          }
          if (prev <= 60 && prev > 59) {
            notifyError('⏰ Final minute! Submit your exam!');
          }
          if (prev <= 1) {
            notifyError('⏰ Time\'s up! Auto-submitting exam...');
            setTimeout(() => submitExam(), 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, examCompleted, timeRemaining, examData]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswer = (questionId, answerValue, isMultiSelect = false) => {
    setAnswers((prev) => {
      if (isMultiSelect) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answerValue)
          ? currentAnswers.filter((a) => a !== answerValue)
          : [...currentAnswers, answerValue];
        return { ...prev, [questionId]: newAnswers };
      }
      return { ...prev, [questionId]: answerValue };
    });
  };

  // Calculate score (unchanged)
  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    let correctAnswers = 0;

    allQuestions.forEach((question) => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      let isCorrect = false;

      if (question.type === 'single-select') {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (userAnswer === correctOption?.id) {
          totalScore += question.points;
          isCorrect = true;
        }
      } else if (question.type === 'multi-select') {
        const correctOptions = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id);
        const userAnswers = userAnswer || [];
        if (
          correctOptions.length === userAnswers.length &&
          correctOptions.every((id) => userAnswers.includes(id))
        ) {
          totalScore += question.points;
          isCorrect = true;
        }
      } else if (question.type === 'text') {
        if (
          userAnswer?.toLowerCase().trim() ===
          question.correctAnswer?.toLowerCase().trim()
        ) {
          totalScore += question.points;
          isCorrect = true;
        }
      }

      if (isCorrect) correctAnswers++;
    });

    return {
      totalScore,
      maxScore,
      correctAnswers,
      totalQuestions: allQuestions.length,
      percentage: Math.round((totalScore / maxScore) * 100),
      accuracy: Math.round((correctAnswers / allQuestions.length) * 100),
    };
  };

  // Navigation functions
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(Math.max(0, Math.min(totalQuestions - 1, index)));
    setSidebarOpen(false);
  };

  // Toggle flag
  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Toggle bookmark
  const toggleBookmark = async (questionId) => {
    try {
      const isCurrentlyBookmarked = bookmarkedQuestions.has(questionId);
      
      if (isCurrentlyBookmarked) {
        await dataService.removeBookmark(questionId, id);
        setBookmarkedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
        notifyInfo('Bookmark removed');
      } else {
        const question = allQuestions.find(q => q.id === questionId);
        await dataService.addBookmark(questionId, id, question, '');
        setBookmarkedQuestions(prev => new Set([...prev, questionId]));
        notifySuccess('Question bookmarked');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      notifyError('Failed to update bookmark');
    }
  };

  // Toggle hint
  const toggleHint = (questionId) => {
    setShowHints((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Start exam
  const startExam = () => {
    setExamStarted(true);
    notifySuccess('Exam started! Good luck! 🍀');
  };

  // Resume exam
  const resumeExam = async () => {
    try {
      const resumeData = await dataService.getExamProgress(id);
      if (resumeData) {
        setAnswers(resumeData.answers || {});
        setCurrentQuestionIndex(resumeData.currentQuestionIndex || 0);
        setTimeRemaining(resumeData.timeRemaining);
        setFlaggedQuestions(new Set(resumeData.flaggedQuestions || []));
        setExamStarted(true);
        setShowResumeDialog(false);
        notifySuccess('Exam resumed from where you left off!');
      }
    } catch (error) {
      console.error('Error resuming exam:', error);
      notifyError('Failed to resume exam');
      setShowResumeDialog(false);
    }
  };

  // Start new exam (clear previous progress)
  const startNewExam = async () => {
    try {
      await clearProgress();
      setShowResumeDialog(false);
      notifyInfo('Starting fresh exam');
    } catch (error) {
      console.error('Error clearing progress:', error);
      notifyError('Failed to clear previous progress');
    }
  };

  // Submit exam
  const submitExam = async () => {
    try {
      setConfirmLoading(true);
      
      // Calculate final score
      const score = calculateScore();
      
      // Prepare attempt data
      const attemptData = {
        examId: id,
        examName: examData.name,
        totalQuestions: allQuestions.length,
        answeredQuestions: Object.keys(answers).length,
        correctAnswers: score.correctAnswers,
        score: score.totalScore,
        maxScore: score.maxScore,
        percentage: score.percentage,
        accuracy: score.accuracy,
        timeTaken: (examData.timeLimit * 60) - timeRemaining,
        timeLimit: examData.timeLimit * 60,
        answers,
        flaggedQuestions: Array.from(flaggedQuestions)
      };

      // Save attempt to history
      await saveAttempt(attemptData);
      
      // Clear progress
      await clearProgress();
      
      // Stop auto-save
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      
      setExamCompleted(true);
      setShowResults(true);
      setOpen(false);
      
      notifySuccess('Exam submitted successfully! 🎉');
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      notifyError('Failed to submit exam');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleOk = () => {
    submitExam();
  };

  // Reset exam
  const resetExam = async () => {
    try {
      await clearProgress();
      
      setExamStarted(false);
      setExamCompleted(false);
      setShowResults(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setFlaggedQuestions(new Set());
      setTimeRemaining(examData.timeLimit * 60);
      setShowHints({});
      setShowWarning(false);
      setHasUnsavedChanges(false);
      
      notifyInfo('Exam reset successfully');
    } catch (error) {
      console.error('Error resetting exam:', error);
      notifyError('Failed to reset exam');
    }
  };

  // Get score color and badge (unchanged)
  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage) => {
    if (percentage >= 90)
      return {
        label: 'Excellent',
        color: 'bg-green-100 text-green-800',
        icon: Star,
      };
    if (percentage >= 80)
      return {
        label: 'Very Good',
        color: 'bg-blue-100 text-blue-800',
        icon: TrendingUp,
      };
    if (percentage >= 70)
      return {
        label: 'Good',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Target,
      };
    if (percentage >= 60)
      return {
        label: 'Fair',
        color: 'bg-orange-100 text-orange-800',
        icon: Zap,
      };
    return {
      label: 'Needs Improvement',
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading Assessment
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your questions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to Load Assessment
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Resume dialog
  if (showResumeDialog && examProgress) {
    return (
      <ResumeExamDialog
        open={showResumeDialog}
        onClose={() => setShowResumeDialog(false)}
        onResume={resumeExam}
        onStartNew={startNewExam}
        progressData={examProgress}
      />
    );
  }

  // Pre-exam start screen (enhanced with progress indicator)
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {examData.name}
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  {examData.description}
                </p>
              </div>
            </div>

            <div className="px-8 py-8">
              {/* Auto-save status indicator */}
              {lastSavedTime && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Save className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      Progress from previous session available - you can resume where you left off
                    </span>
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Timer className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time Limit</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {examData.timeLimit} min
                  </p>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Questions</h3>
                  <p className="text-2xl font-bold text-green-600">{totalQuestions}</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Total Points</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {allQuestions.reduce((sum, q) => sum + q.points, 0)}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">
                      Enhanced Features
                    </h3>
                    <ul className="text-amber-700 space-y-2 text-sm">
                      <li>• Progress is automatically saved every 30 seconds</li>
                      <li>• You can bookmark questions for later review</li>
                      <li>• Navigate freely between questions</li>
                      <li>• Flag questions you want to review</li>
                      <li>• Hints available for selected questions</li>
                      <li>• Your exam will auto-submit when time expires</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={startExam}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Begin Assessment
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Auto-save will activate once you begin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen (enhanced with attempt history)
  if (showResults) {
    const score = calculateScore();
    const badge = getScoreBadge(score.percentage);
    const BadgeIcon = badge.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Assessment Complete! 🎉
                </h1>
                <p className="text-xl text-green-100">
                  Great job completing the {examData.name}
                </p>
              </div>
            </div>

            <div className="px-8 py-8">
              <div className="text-center mb-8">
                <div
                  className={`text-7xl font-bold mb-4 ${getScoreColor(score.percentage)}`}
                >
                  {score.percentage}%
                </div>
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full ${badge.color} font-medium`}
                >
                  <BadgeIcon className="w-5 h-5 mr-2" />
                  {badge.label}
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {score.totalScore}
                  </div>
                  <div className="text-sm font-medium text-blue-800">
                    Points Earned
                  </div>
                  <div className="text-xs text-blue-600">
                    out of {score.maxScore}
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {score.correctAnswers}
                  </div>
                  <div className="text-sm font-medium text-green-800">
                    Correct Answers
                  </div>
                  <div className="text-xs text-green-600">
                    out of {score.totalQuestions}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {score.accuracy}%
                  </div>
                  <div className="text-sm font-medium text-purple-800">
                    Accuracy Rate
                  </div>
                  <div className="text-xs text-purple-600">
                    questions answered correctly
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {Object.keys(answers).length}
                  </div>
                  <div className="text-sm font-medium text-orange-800">
                    Attempted
                  </div>
                  <div className="text-xs text-orange-600">
                    questions answered
                  </div>
                </div>
              </div>

              {/* Additional stats */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Stats</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="ml-2 font-medium">
                      {formatTime((examData.timeLimit * 60) - timeRemaining)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Questions Flagged:</span>
                    <span className="ml-2 font-medium">{flaggedQuestions.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Questions Bookmarked:</span>
                    <span className="ml-2 font-medium">{bookmarkedQuestions.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetExam}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake Assessment
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main exam interface (enhanced)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Time Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ⏰ Time Warning
              </h3>
              <p className="text-gray-600 mb-4">
                You have less than 5 minutes remaining!
              </p>
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with enhanced features */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors mr-2"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
                {/* Auto-save indicator */}
                {isAutoSaving && (
                  <div className="ml-3 flex items-center text-sm text-gray-500">
                    <Save className="w-4 h-4 mr-1 animate-pulse" />
                    <span>Saving...</span>
                  </div>
                )}
                {!isAutoSaving && lastSavedTime && (
                  <div className="ml-3 text-xs text-gray-400">
                    Saved {formatDistanceToNow(lastSavedTime)} ago
                  </div>
                )}
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                Question{' '}
                <span className="font-semibold">
                  {currentQuestionIndex + 1}
                </span>{' '}
                of {totalQuestions}
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div
                className={`flex items-center font-mono text-lg font-semibold ${
                  timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={showModal}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Submit Exam
              </button>
            </div>

            <div className="sm:hidden flex items-center space-x-2">
              <div
                className={`font-mono text-sm font-semibold ${
                  timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={showModal}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Enhanced Sidebar - Question Navigator */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto p-6 pt-20 lg:pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Question Navigator</h3>
              <div className="text-sm text-gray-500">
                {Object.keys(answers).length}/{totalQuestions}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round((Object.keys(answers).length / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(Object.keys(answers).length / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question Grid with enhanced indicators */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {allQuestions.map((question, index) => {
                const isAnswered = answers[question.id] !== undefined;
                const isFlagged = flaggedQuestions.has(question.id);
                const isBookmarked = bookmarkedQuestions.has(question.id);
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`relative h-12 w-12 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                        : isAnswered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                    <div className="absolute -top-1 -right-1 flex space-x-1">
                      {isFlagged && <Flag className="w-3 h-3 text-red-500" />}
                      {isBookmarked && <Bookmark className="w-3 h-3 text-purple-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Enhanced Legend */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded mr-3"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 rounded mr-3"></div>
                <span className="text-gray-600">Not answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-3"></div>
                <span className="text-gray-600">Current question</span>
              </div>
              <div className="flex items-center">
                <Flag className="w-4 h-4 text-red-500 mr-3" />
                <span className="text-gray-600">Flagged for review</span>
              </div>
              <div className="flex items-center">
                <Bookmark className="w-4 h-4 text-purple-500 mr-3" />
                <span className="text-gray-600">Bookmarked</span>
              </div>
            </div>

            {/* Enhanced Summary Stats */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium text-green-600">
                    {Object.keys(answers).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-gray-700">
                    {totalQuestions - Object.keys(answers).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flagged:</span>
                  <span className="font-medium text-red-600">{flaggedQuestions.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookmarked:</span>
                  <span className="font-medium text-purple-600">
                    {bookmarkedQuestions.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Left:</span>
                  <span
                    className={`font-medium ${
                      timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Submit Confirmation Modal */}
              <Modal
                title={
                  <div style={{ color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
                    📝 Submit Exam
                  </div>
                }
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Submit Exam"
                cancelText="Continue"
                okButtonProps={{ danger: true, size: 'large' }}
                cancelButtonProps={{ size: 'large' }}
                centered
                bodyStyle={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  padding: '24px',
                }}
              >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div
                    style={{
                      background: '#fff2f0',
                      border: '1px solid #ffccc7',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ color: '#ff7875', fontSize: '24px', marginBottom: '8px' }}>
                      ⚠️
                    </div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      Are you sure you want to submit?
                    </p>
                    <p style={{ margin: '8px 0 0 0', color: '#8c8c8c', fontSize: '14px' }}>
                      You won't be able to make changes after submission.
                    </p>
                  </div>

                  {/* Progress Summary in Modal */}
                  <div
                    style={{
                      background: '#f6ffed',
                      border: '1px solid #b7eb8f',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      color: '#52c41a',
                      marginBottom: '16px'
                    }}
                  >
                    ✅ {Object.keys(answers).length} of {totalQuestions} questions answered
                    <br />
                    📍 {flaggedQuestions.size} questions flagged for review
                    <br />
                    ⏰ {formatTime(timeRemaining)} time remaining
                  </div>

                  <div
                    style={{
                      background: '#e6f7ff',
                      border: '1px solid #91d5ff',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      color: '#1890ff',
                    }}
                  >
                    💾 Your progress has been automatically saved
                  </div>
                </div>
              </Modal>

              {/* Enhanced Question Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Question Header with enhanced controls */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-3 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            currentQuestion.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : currentQuestion.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {currentQuestion.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {currentQuestion.points}{' '}
                          {currentQuestion.points === 1 ? 'point' : 'points'}
                        </span>
                        {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {currentQuestion.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        {currentQuestion.title}
                      </h2>

                      {currentQuestion.subtitle && (
                        <p className="text-gray-600 text-lg">{currentQuestion.subtitle}</p>
                      )}
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="ml-6 flex space-x-2">
                      <button
                        onClick={() => toggleBookmark(currentQuestion.id)}
                        className={`p-3 rounded-lg transition-all duration-200 flex-shrink-0 ${
                          bookmarkedQuestions.has(currentQuestion.id)
                            ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={
                          bookmarkedQuestions.has(currentQuestion.id)
                            ? 'Remove bookmark'
                            : 'Bookmark question'
                        }
                      >
                        {bookmarkedQuestions.has(currentQuestion.id) ? (
                          <BookmarkCheck className="w-5 h-5" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => toggleFlag(currentQuestion.id)}
                        className={`p-3 rounded-lg transition-all duration-200 flex-shrink-0 ${
                          flaggedQuestions.has(currentQuestion.id)
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={
                          flaggedQuestions.has(currentQuestion.id)
                            ? 'Remove flag'
                            : 'Flag for review'
                        }
                      >
                        <Flag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-8">
                  {/* Answer Options */}
                  <div className="space-y-4 mb-8">
                    {currentQuestion.type === 'single-select' && (
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                          const optionLabel = String.fromCharCode(65 + index);
                          return (
                            <label
                              key={option.id}
                              className={`group flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                answers[currentQuestion.id] === option.id
                                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={currentQuestion.id}
                                value={option.id}
                                checked={answers[currentQuestion.id] === option.id}
                                onChange={() => handleAnswer(currentQuestion.id, option.id)}
                                className="hidden"
                              />
                              <div className="flex items-center mr-4 flex-shrink-0">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                    answers[currentQuestion.id] === option.id
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-300 group-hover:border-blue-400'
                                  }`}
                                >
                                  {answers[currentQuestion.id] === option.id && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span className="ml-3 font-semibold text-gray-500 text-sm">
                                  {optionLabel}
                                </span>
                              </div>
                              <span className="text-gray-800 text-lg leading-relaxed flex-1">
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {currentQuestion.type === 'multi-select' && (
                      <div className="space-y-3">
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Select all answers that apply
                          </p>
                        </div>
                        {currentQuestion.options.map((option, index) => {
                          const isSelected =
                            answers[currentQuestion.id]?.includes(option.id) || false;
                          const optionLabel = String.fromCharCode(65 + index);
                          return (
                            <label
                              key={option.id}
                              className={`group flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleAnswer(currentQuestion.id, option.id, true)
                                }
                                className="hidden"
                              />
                              <div className="flex items-center mr-4 flex-shrink-0">
                                <div
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-300 group-hover:border-blue-400'
                                  }`}
                                >
                                  {isSelected && (
                                    <CheckSquare className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span className="ml-3 font-semibold text-gray-500 text-sm">
                                  {optionLabel}
                                </span>
                              </div>
                              <span className="text-gray-800 text-lg leading-relaxed flex-1">
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {currentQuestion.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Your Answer:
                        </label>
                        <textarea
                          value={answers[currentQuestion.id] || ''}
                          onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                          placeholder="Type your detailed answer here..."
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-lg resize-none"
                          rows="6"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Provide a clear and complete answer. Your response will be evaluated for accuracy.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Hint Section */}
                  {currentQuestion.hint && (
                    <div className="border-t pt-6">
                      <button
                        onClick={() => toggleHint(currentQuestion.id)}
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        {showHints[currentQuestion.id] ? (
                          <EyeOff className="w-5 h-5 mr-2" />
                        ) : (
                          <HelpCircle className="w-5 h-5 mr-2" />
                        )}
                        {showHints[currentQuestion.id] ? 'Hide Hint' : 'Need a hint?'}
                      </button>
                      {showHints[currentQuestion.id] && (
                        <div className="mt-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-400">
                          <div className="flex items-start">
                            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-blue-900 mb-1">Hint</h4>
                              <p className="text-blue-800 leading-relaxed">
                                {currentQuestion.hint}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Navigation Footer */}
                <div className="bg-gray-50 px-8 py-6 border-t">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => goToQuestion(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 hover:border-gray-400"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Previous
                    </button>

                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{
                            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => goToQuestion(currentQuestionIndex + 1)}
                      disabled={currentQuestionIndex === totalQuestions - 1}
                      className="flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExamPageEnhanced;