import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Clock, CheckCircle, CheckSquare, ChevronLeft, ChevronRight, Flag, RotateCcw,
  BookOpen, Timer, Award, AlertCircle, Home, Menu, X, EyeOff, HelpCircle,
  TrendingUp, Target, Zap, Star, Loader, Bookmark, BookmarkCheck, Save,
  ArrowLeft, ArrowRight, FileText, Eye, Heart
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Card, Progress, Tag, Tooltip } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Import services and components
import dataService from '../services/dataService';
import { useExamProgress, useExamHistory } from '../hooks/useExamProgress';
import ResumeExamDialog from '../components/exam/ResumeExamDialog';
import { 
  notifySuccess, notifyError, notifyWarning, notifyAutoSave, notifyInfo 
} from '../utils/notifications';
import { EXAM_STATUS, AUTO_SAVE_INTERVAL } from '../constants/examConstants';

const MockExamPageImproved = () => {
  // Core state
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
  
  // Modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  // Enhanced state
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Refs
  const autoSaveIntervalRef = useRef(null);
  const timerRef = useRef(null);
  
  // Custom hooks
  const {
    examProgress, isAutoSaving, lastSaved, saveProgress, startAutoSave, 
    stopAutoSave, updateProgress, clearProgress, hasIncompleteProgress, getResumeData
  } = useExamProgress(id);
  
  const { saveAttempt } = useExamHistory();

  // Derived state
  const allQuestions = examData?.questions || [];
  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentQuestionIndex];
  const completionPercentage = totalQuestions > 0 ? (Object.keys(answers).length / totalQuestions) * 100 : 0;

  // Utility functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    let correctAnswers = 0;

    allQuestions.forEach((question) => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'single-select') {
        if (userAnswer && userAnswer === question.options.find(opt => opt.isCorrect)?.id) {
          totalScore += question.points;
          correctAnswers++;
        }
      } else if (question.type === 'multi-select') {
        const correctOptions = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);
        if (userAnswer && Array.isArray(userAnswer) && 
            userAnswer.length === correctOptions.length &&
            userAnswer.every(ans => correctOptions.includes(ans))) {
          totalScore += question.points;
          correctAnswers++;
        }
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const accuracy = Object.keys(answers).length > 0 ? Math.round((correctAnswers / Object.keys(answers).length) * 100) : 0;

    return { totalScore, maxScore, correctAnswers, totalQuestions, percentage, accuracy };
  };

  // Navigation functions
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setSidebarOpen(false);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Answer handling
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setHasUnsavedChanges(true);
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (questionId) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleHint = (questionId) => {
    setShowHints(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Exam lifecycle
  const fetchExamData = async () => {
    try {
      setLoading(true);
      const data = await dataService.getExam(id);
      setExamData(data);
      setTimeRemaining(data.timeLimit * 60);
      
      if (hasIncompleteProgress(id)) {
        setShowResumeDialog(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    setExamStarted(true);
    startTimer();
    startAutoSave();
    notifySuccess('Exam started! Progress will be saved automatically.');
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        if (prev === 300 && !showWarning) {
          setShowWarning(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitExam = async () => {
    try {
      setConfirmLoading(true);
      clearInterval(timerRef.current);
      stopAutoSave();
      
      const score = calculateScore();
      const attemptData = {
        examId: id,
        examName: examData.name,
        answers,
        score,
        timeSpent: (examData.timeLimit * 60) - timeRemaining,
        flaggedQuestions: Array.from(flaggedQuestions),
        bookmarkedQuestions: Array.from(bookmarkedQuestions),
        completedAt: new Date().toISOString()
      };

      await saveAttempt(attemptData);
      clearProgress(id);
      
      setExamCompleted(true);
      setShowResults(true);
      setSubmitModalOpen(false);
      notifySuccess('Exam submitted successfully!');
    } catch (error) {
      console.error('Error submitting exam:', error);
      notifyError('Failed to submit exam');
    } finally {
      setConfirmLoading(false);
    }
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlaggedQuestions(new Set());
    setBookmarkedQuestions(new Set());
    setTimeRemaining(examData.timeLimit * 60);
    setExamStarted(false);
    setExamCompleted(false);
    setShowResults(false);
    setShowHints({});
    clearProgress(id);
    notifyInfo('Exam reset successfully');
  };

  // Effects
  useEffect(() => {
    if (id) {
      fetchExamData();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  useEffect(() => {
    return () => {
      stopAutoSave();
    };
  }, [stopAutoSave]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Exam</h2>
          <p className="text-gray-600">Preparing your questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Exam</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button type="primary" danger onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Resume dialog
  if (showResumeDialog && examProgress) {
    return (
      <ResumeExamDialog
        open={showResumeDialog}
        onClose={() => setShowResumeDialog(false)}
        onResume={() => {/* Resume logic */}}
        onStartNew={() => {/* Start new logic */}}
        progressData={examProgress}
      />
    );
  }

  // Pre-exam screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{examData.name}</h1>
              <p className="text-blue-100 text-lg">{examData.description}</p>
            </div>

            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center bg-blue-50 border-blue-200">
                  <Timer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Time Limit</h3>
                  <p className="text-2xl font-bold text-blue-600">{examData.timeLimit} min</p>
                </Card>

                <Card className="text-center bg-green-50 border-green-200">
                  <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Questions</h3>
                  <p className="text-2xl font-bold text-green-600">{totalQuestions}</p>
                </Card>

                <Card className="text-center bg-purple-50 border-purple-200">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Total Points</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {allQuestions.reduce((sum, q) => sum + q.points, 0)}
                  </p>
                </Card>
              </div>

              {/* Instructions */}
              <Card className="bg-amber-50 border-amber-200 mb-8">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Exam Features</h3>
                    <ul className="text-amber-700 space-y-1 text-sm">
                      <li>• Auto-save progress every 30 seconds</li>
                      <li>• Navigate freely between questions</li>
                      <li>• Flag questions for review</li>
                      <li>• Bookmark important questions</li>
                      <li>• Access hints for selected questions</li>
                      <li>• Auto-submit when time expires</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Start Button */}
              <div className="text-center">
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={startExam}
                  icon={<BookOpen className="w-5 h-5" />}
                  className="h-12 px-8 text-lg font-semibold"
                >
                  Start Exam
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  Click to begin your assessment
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            {/* Results Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 text-center">
              <Award className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Exam Complete! 🎉</h1>
              <p className="text-green-100">You've successfully completed {examData.name}</p>
            </div>

            <div className="p-8">
              {/* Score Display */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {score.percentage}%
                </div>
                <Tag color={score.percentage >= 80 ? 'green' : score.percentage >= 60 ? 'orange' : 'red'} className="text-lg px-4 py-2">
                  {score.percentage >= 90 ? 'Excellent' :
                   score.percentage >= 80 ? 'Very Good' :
                   score.percentage >= 70 ? 'Good' :
                   score.percentage >= 60 ? 'Fair' : 'Needs Improvement'}
                </Tag>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="text-center bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">{score.totalScore}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </Card>
                <Card className="text-center bg-green-50">
                  <div className="text-2xl font-bold text-green-600">{score.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </Card>
                <Card className="text-center bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">{score.accuracy}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </Card>
                <Card className="text-center bg-orange-50">
                  <div className="text-2xl font-bold text-orange-600">{Object.keys(answers).length}</div>
                  <div className="text-sm text-gray-600">Attempted</div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  type="primary" 
                  icon={<RotateCcw className="w-4 h-4" />}
                  onClick={resetExam}
                  size="large"
                >
                  Retake Exam
                </Button>
                <Button 
                  icon={<Home className="w-4 h-4" />}
                  onClick={() => window.location.href = '/'}
                  size="large"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Main exam interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Time Warning Modal */}
      <Modal
        title="⏰ Time Warning"
        open={showWarning}
        onOk={() => setShowWarning(false)}
        onCancel={() => setShowWarning(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setShowWarning(false)}>
            Continue
          </Button>
        ]}
        centered
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg">You have less than 5 minutes remaining!</p>
        </div>
      </Modal>

      {/* Submit Confirmation Modal */}
      <Modal
        title="📝 Submit Exam"
        open={submitModalOpen}
        onOk={submitExam}
        onCancel={() => setSubmitModalOpen(false)}
        confirmLoading={confirmLoading}
        okText="Submit Exam"
        cancelText="Continue"
        okButtonProps={{ danger: true }}
        centered
      >
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="font-semibold">⚠️ Are you sure you want to submit?</p>
            <p className="text-sm text-gray-600 mt-1">
              You won't be able to make changes after submission.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm space-y-1">
              <p>✅ {Object.keys(answers).length} of {totalQuestions} questions answered</p>
              <p>📍 {flaggedQuestions.size} questions flagged</p>
              <p>⏰ {formatTime(timeRemaining)} remaining</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <Button
              type="text"
              icon={sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mr-2"
            />
            <BookOpen className="w-8 h-8 text-blue-600 mr-2" />
            
            {/* Auto-save indicator */}
            {isAutoSaving && (
              <div className="flex items-center text-sm text-gray-500">
                <Save className="w-4 h-4 mr-1 animate-pulse" />
                <span className="hidden sm:inline">Saving...</span>
              </div>
            )}
          </div>

          {/* Center */}
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Question <span className="font-semibold">{currentQuestionIndex + 1}</span> of {totalQuestions}
            </span>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className={`flex items-center font-mono font-semibold ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'}`}>
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <div className="sm:hidden text-sm font-mono font-semibold">
              {formatTime(timeRemaining)}
            </div>
            <Button type="primary" onClick={() => setSubmitModalOpen(true)}>
              <span className="hidden sm:inline">Submit Exam</span>
              <span className="sm:hidden">Submit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className={`fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white shadow-lg lg:shadow-none`}
            >
              <div className="h-full overflow-y-auto p-6 pt-20 lg:pt-6">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(completionPercentage)}%</span>
                  </div>
                  <Progress percent={completionPercentage} showInfo={false} />
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {allQuestions.map((question, index) => {
                    const isAnswered = answers[question.id] !== undefined;
                    const isFlagged = flaggedQuestions.has(question.id);
                    const isBookmarked = bookmarkedQuestions.has(question.id);
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <Tooltip key={question.id} title={`Question ${index + 1}`}>
                        <button
                          onClick={() => goToQuestion(index)}
                          className={`relative h-10 w-10 rounded-lg text-xs font-medium transition-all ${
                            isCurrent
                              ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                              : isAnswered
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {index + 1}
                          {(isFlagged || isBookmarked) && (
                            <div className="absolute -top-1 -right-1 flex">
                              {isFlagged && <Flag className="w-3 h-3 text-red-500" />}
                              {isBookmarked && <Bookmark className="w-3 h-3 text-purple-500" />}
                            </div>
                          )}
                        </button>
                      </Tooltip>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
                    <span>Not answered</span>
                  </div>
                  <div className="flex items-center">
                    <Flag className="w-3 h-3 text-red-500 mr-2" />
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center">
                    <Bookmark className="w-3 h-3 text-purple-500 mr-2" />
                    <span>Bookmarked</span>
                  </div>
                </div>

                {/* Stats */}
                <Card size="small" className="bg-gray-50">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Answered:</span>
                      <span className="font-medium">{Object.keys(answers).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-medium">{totalQuestions - Object.keys(answers).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flagged:</span>
                      <span className="font-medium">{flaggedQuestions.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Left:</span>
                      <span className={`font-medium ${timeRemaining <= 300 ? 'text-red-600' : ''}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <Card className="mb-6">
              {/* Question Header */}
              <div className="border-b pb-4 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag color={currentQuestion.difficulty === 'easy' ? 'green' : currentQuestion.difficulty === 'medium' ? 'orange' : 'red'}>
                        {currentQuestion.difficulty}
                      </Tag>
                      <Tag color="blue">{currentQuestion.points} pts</Tag>
                      {currentQuestion.tags?.slice(0, 2).map((tag, idx) => (
                        <Tag key={idx} color="default">{tag}</Tag>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {currentQuestion.title}
                    </h2>
                    {currentQuestion.subtitle && (
                      <p className="text-gray-600">{currentQuestion.subtitle}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-4 flex gap-2">
                    <Tooltip title="Bookmark">
                      <Button
                        type={bookmarkedQuestions.has(currentQuestion.id) ? "primary" : "default"}
                        icon={<Bookmark className="w-4 h-4" />}
                        onClick={() => toggleBookmark(currentQuestion.id)}
                        size="small"
                      />
                    </Tooltip>
                    <Tooltip title="Flag for review">
                      <Button
                        type={flaggedQuestions.has(currentQuestion.id) ? "primary" : "default"}
                        icon={<Flag className="w-4 h-4" />}
                        onClick={() => toggleFlag(currentQuestion.id)}
                        size="small"
                        danger={flaggedQuestions.has(currentQuestion.id)}
                      />
                    </Tooltip>
                    {currentQuestion.hint && (
                      <Tooltip title="Show hint">
                        <Button
                          icon={<HelpCircle className="w-4 h-4" />}
                          onClick={() => toggleHint(currentQuestion.id)}
                          size="small"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>

              {/* Hint */}
              {showHints[currentQuestion.id] && currentQuestion.hint && (
                <Card size="small" className="mb-6 bg-yellow-50 border-yellow-200">
                  <div className="flex items-start">
                    <HelpCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">Hint</p>
                      <p className="text-sm text-yellow-700">{currentQuestion.hint}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Question Content */}
              <div className="space-y-4">
                {currentQuestion.type === 'single-select' && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <Card
                        key={option.id}
                        size="small"
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          answers[currentQuestion.id] === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => handleAnswerChange(currentQuestion.id, option.id)}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            answers[currentQuestion.id] === option.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion.id] === option.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">{option.label}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'multi-select' && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = answers[currentQuestion.id]?.includes(option.id);
                      return (
                        <Card
                          key={option.id}
                          size="small"
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                          }`}
                          onClick={() => {
                            const currentAnswers = answers[currentQuestion.id] || [];
                            const newAnswers = isSelected
                              ? currentAnswers.filter(id => id !== option.id)
                              : [...currentAnswers, option.id];
                            handleAnswerChange(currentQuestion.id, newAnswers);
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-medium text-gray-700">{option.label}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <div>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                size="large"
              >
                Previous
              </Button>

              <div className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {totalQuestions}
              </div>

              <Button
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                size="large"
                type="primary"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExamPageImproved;