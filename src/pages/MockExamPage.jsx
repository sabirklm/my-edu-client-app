import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, Circle, Square, CheckSquare, ChevronLeft, ChevronRight, Flag, RotateCcw, BookOpen, Timer, Award, AlertCircle, Home, Settings, User, Menu, X, Eye, EyeOff, HelpCircle, TrendingUp, Target, Zap, Star } from 'lucide-react';

// Mock data structure based on your CMS config
const mockExamData = {
    id: '1',
    name: 'Advanced Mathematics Assessment',
    description: 'A comprehensive test covering algebra, calculus, and geometry concepts.',
    timeLimit: 45, // minutes
    QuestionGroups: [
        {
            id: 'group1',
            name: 'Algebra Fundamentals',
            description: 'Basic algebraic concepts and equations',
            randomize: false,
            questions: [
                {
                    id: 'q1',
                    title: 'Solve for x: $2x + 5 = 15$',
                    subtitle: 'Linear equation solving',
                    hint: 'Isolate x by performing the same operation on both sides',
                    type: 'single-select',
                    difficulty: 'easy',
                    points: 2,
                    tags: ['algebra', 'linear-equations'],
                    options: [
                        { id: 'opt1', label: 'x = 5', isCorrect: true },
                        { id: 'opt2', label: 'x = 10', isCorrect: false },
                        { id: 'opt3', label: 'x = 7.5', isCorrect: false },
                        { id: 'opt4', label: 'x = -5', isCorrect: false }
                    ]
                },
                {
                    id: 'q2',
                    title: 'Which of the following are prime numbers?',
                    subtitle: 'Select all that apply',
                    type: 'multi-select',
                    difficulty: 'medium',
                    points: 3,
                    tags: ['number-theory', 'primes'],
                    options: [
                        { id: 'opt1', label: '17', isCorrect: true },
                        { id: 'opt2', label: '21', isCorrect: false },
                        { id: 'opt3', label: '23', isCorrect: true },
                        { id: 'opt4', label: '25', isCorrect: false },
                        { id: 'opt5', label: '29', isCorrect: true }
                    ]
                }
            ]
        },
        {
            id: 'group2',
            name: 'Calculus Basics',
            description: 'Fundamental calculus concepts',
            randomize: true,
            questions: [
                {
                    id: 'q3',
                    title: 'What is the derivative of $f(x) = x^3 + 2x^2 - x + 5$?',
                    type: 'text',
                    difficulty: 'hard',
                    points: 5,
                    tags: ['calculus', 'derivatives'],
                    correctAnswer: '3x^2 + 4x - 1'
                },
                {
                    id: 'q4',
                    title: 'The fundamental theorem of calculus connects which two concepts?',
                    type: 'single-select',
                    difficulty: 'medium',
                    points: 3,
                    tags: ['calculus', 'theory'],
                    options: [
                        { id: 'opt1', label: 'Derivatives and integrals', isCorrect: true },
                        { id: 'opt2', label: 'Limits and continuity', isCorrect: false },
                        { id: 'opt3', label: 'Functions and graphs', isCorrect: false },
                        { id: 'opt4', label: 'Sequences and series', isCorrect: false }
                    ]
                },
                {
                    id: 'q5',
                    title: 'What is the limit of $\\frac{\\sin(x)}{x}$ as x approaches 0?',
                    subtitle: 'This is a fundamental limit in calculus',
                    hint: 'This is one of the most important limits in calculus - think about the unit circle',
                    type: 'single-select',
                    difficulty: 'medium',
                    points: 4,
                    tags: ['calculus', 'limits'],
                    options: [
                        { id: 'opt1', label: '0', isCorrect: false },
                        { id: 'opt2', label: '1', isCorrect: true },
                        { id: 'opt3', label: '∞', isCorrect: false },
                        { id: 'opt4', label: 'undefined', isCorrect: false }
                    ]
                },
                {
                    id: 'q6',
                    title: 'Which of the following functions are continuous everywhere?',
                    type: 'multi-select',
                    difficulty: 'hard',
                    points: 6,
                    tags: ['calculus', 'continuity'],
                    options: [
                        { id: 'opt1', label: 'f(x) = x²', isCorrect: true },
                        { id: 'opt2', label: 'f(x) = |x|', isCorrect: true },
                        { id: 'opt3', label: 'f(x) = 1/x', isCorrect: false },
                        { id: 'opt4', label: 'f(x) = sin(x)', isCorrect: true },
                        { id: 'opt5', label: 'f(x) = floor(x)', isCorrect: false }
                    ]
                }
            ]
        }
    ]
};

const MockExamPage = () => {
    const [examData] = useState(mockExamData);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
    const [timeRemaining, setTimeRemaining] = useState(examData.timeLimit * 60);
    const [examStarted, setExamStarted] = useState(false);
    const [examCompleted, setExamCompleted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showHints, setShowHints] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    // Flatten all questions from question groups
    const allQuestions = examData.QuestionGroups.reduce((acc, group) => {
        return [...acc, ...group.questions];
    }, []);

    const currentQuestion = allQuestions[currentQuestionIndex];
    const totalQuestions = allQuestions.length;

    // Timer effect
    useEffect(() => {
        let interval;
        if (examStarted && !examCompleted && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 300 && prev > 299) { // 5 minutes warning
                        setShowWarning(true);
                    }
                    if (prev <= 1) {
                        setExamCompleted(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [examStarted, examCompleted, timeRemaining]);

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle answer selection
    const handleAnswer = (questionId, answerValue, isMultiSelect = false) => {
        setAnswers(prev => {
            if (isMultiSelect) {
                const currentAnswers = prev[questionId] || [];
                const newAnswers = currentAnswers.includes(answerValue)
                    ? currentAnswers.filter(a => a !== answerValue)
                    : [...currentAnswers, answerValue];
                return { ...prev, [questionId]: newAnswers };
            }
            return { ...prev, [questionId]: answerValue };
        });
    };

    // Calculate score
    const calculateScore = () => {
        let totalScore = 0;
        let maxScore = 0;
        let correctAnswers = 0;

        allQuestions.forEach(question => {
            maxScore += question.points;
            const userAnswer = answers[question.id];
            let isCorrect = false;

            if (question.type === 'single-select') {
                const correctOption = question.options.find(opt => opt.isCorrect);
                if (userAnswer === correctOption?.id) {
                    totalScore += question.points;
                    isCorrect = true;
                }
            } else if (question.type === 'multi-select') {
                const correctOptions = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);
                const userAnswers = userAnswer || [];
                if (correctOptions.length === userAnswers.length &&
                    correctOptions.every(id => userAnswers.includes(id))) {
                    totalScore += question.points;
                    isCorrect = true;
                }
            } else if (question.type === 'text') {
                if (userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim()) {
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
            accuracy: Math.round((correctAnswers / allQuestions.length) * 100)
        };
    };

    // Navigation functions
    const goToQuestion = (index) => {
        setCurrentQuestionIndex(Math.max(0, Math.min(totalQuestions - 1, index)));
        setSidebarOpen(false);
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

    const toggleHint = (questionId) => {
        setShowHints(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const startExam = () => {
        setExamStarted(true);
    };

    const submitExam = () => {
        setExamCompleted(true);
        setShowResults(true);
    };

    const resetExam = () => {
        setExamStarted(false);
        setExamCompleted(false);
        setShowResults(false);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setFlaggedQuestions(new Set());
        setTimeRemaining(examData.timeLimit * 60);
        setShowHints({});
        setShowWarning(false);
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 80) return 'text-blue-600';
        if (percentage >= 70) return 'text-yellow-600';
        if (percentage >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreBadge = (percentage) => {
        if (percentage >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800', icon: Star };
        if (percentage >= 80) return { label: 'Very Good', color: 'bg-blue-100 text-blue-800', icon: TrendingUp };
        if (percentage >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800', icon: Target };
        if (percentage >= 60) return { label: 'Fair', color: 'bg-orange-100 text-orange-800', icon: Zap };
        return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800', icon: AlertCircle };
    };

    // Pre-exam start screen
    if (!examStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                                    <BookOpen className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-4">{examData.name}</h1>
                                <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                                    {examData.description}
                                </p>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-8 py-8">
                            <div className="grid md:grid-cols-3 gap-8 mb-8">
                                <div className="text-center p-6 bg-blue-50 rounded-xl">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                                        <Timer className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Time Limit</h3>
                                    <p className="text-2xl font-bold text-blue-600">{examData.timeLimit} min</p>
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
                                        <h3 className="font-semibold text-amber-800 mb-2">Important Instructions</h3>
                                        <ul className="text-amber-700 space-y-2 text-sm">
                                            <li>• Carefully read each question before selecting your answer</li>
                                            <li>• Use the navigation panel to move between questions freely</li>
                                            <li>• Flag questions you want to review before submitting</li>
                                            <li>• Your exam will auto-submit when time expires</li>
                                            <li>• Ensure a stable internet connection throughout the exam</li>
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
                                    Click "Begin Assessment" when you're ready to start the timer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results screen
    if (showResults) {
        const score = calculateScore();
        const badge = getScoreBadge(score.percentage);
        const BadgeIcon = badge.icon;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">


                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Results Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-12">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-4">Assessment Complete!</h1>
                                <p className="text-xl text-green-100">
                                    Great job completing the {examData.name}
                                </p>
                            </div>
                        </div>

                        {/* Results Content */}
                        <div className="px-8 py-8">
                            {/* Score Display */}
                            <div className="text-center mb-8">
                                <div className={`text-7xl font-bold mb-4 ${getScoreColor(score.percentage)}`}>
                                    {score.percentage}%
                                </div>
                                <div className={`inline-flex items-center px-4 py-2 rounded-full ${badge.color} font-medium`}>
                                    <BadgeIcon className="w-5 h-5 mr-2" />
                                    {badge.label}
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <div className="grid md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-blue-50 rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {score.totalScore}
                                    </div>
                                    <div className="text-sm font-medium text-blue-800">Points Earned</div>
                                    <div className="text-xs text-blue-600">out of {score.maxScore}</div>
                                </div>

                                <div className="bg-green-50 rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {score.correctAnswers}
                                    </div>
                                    <div className="text-sm font-medium text-green-800">Correct Answers</div>
                                    <div className="text-xs text-green-600">out of {score.totalQuestions}</div>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">
                                        {score.accuracy}%
                                    </div>
                                    <div className="text-sm font-medium text-purple-800">Accuracy Rate</div>
                                    <div className="text-xs text-purple-600">questions answered correctly</div>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">
                                        {Object.keys(answers).length}
                                    </div>
                                    <div className="text-sm font-medium text-orange-800">Attempted</div>
                                    <div className="text-xs text-orange-600">questions answered</div>
                                </div>
                            </div>

                            {/* Performance Insights */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                                    Performance Insights
                                </h3>
                                <div className="space-y-3 text-sm">
                                    {score.percentage >= 90 && (
                                        <p className="text-green-700">🎉 Outstanding performance! You've mastered this material excellently.</p>
                                    )}
                                    {score.percentage >= 80 && score.percentage < 90 && (
                                        <p className="text-blue-700">👏 Very good work! You have a strong understanding of the concepts.</p>
                                    )}
                                    {score.percentage >= 70 && score.percentage < 80 && (
                                        <p className="text-yellow-700">👍 Good job! Consider reviewing a few key areas for improvement.</p>
                                    )}
                                    {score.percentage < 70 && (
                                        <p className="text-red-700">📚 Keep practicing! Review the material and try again to improve your score.</p>
                                    )}

                                    {Object.keys(answers).length < totalQuestions && (
                                        <p className="text-orange-700">
                                            ⚠️ You left {totalQuestions - Object.keys(answers).length} questions unanswered.
                                            Make sure to answer all questions next time for a better score.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={resetExam}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Retake Assessment
                                </button>
                                <button className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200">
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

    // Main exam interface
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Time Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Warning</h3>
                            <p className="text-gray-600 mb-4">You have less than 5 minutes remaining!</p>
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

            {/* Header */}
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

                            </div>
                        </div>

                        <div className="hidden sm:flex items-center space-x-6">
                            <div className="text-sm text-gray-600">
                                Question <span className="font-semibold">{currentQuestionIndex + 1}</span> of {totalQuestions}
                            </div>
                            <div className="w-px h-6 bg-gray-300"></div>
                            <div className={`flex items-center font-mono text-lg font-semibold ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'
                                }`}>
                                <Clock className="w-5 h-5 mr-2" />
                                {formatTime(timeRemaining)}
                            </div>
                            <button
                                onClick={submitExam}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Submit Exam
                            </button>
                        </div>

                        <div className="sm:hidden flex items-center space-x-2">
                            <div className={`font-mono text-sm font-semibold ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'
                                }`}>
                                {formatTime(timeRemaining)}
                            </div>
                            <button
                                onClick={submitExam}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex">
                {/* Sidebar - Question Navigator */}
                <div className={`
          fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
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
                                <span>{Math.round((Object.keys(answers).length / totalQuestions) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(Object.keys(answers).length / totalQuestions) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Question Grid */}
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {allQuestions.map((question, index) => {
                                const isAnswered = answers[question.id] !== undefined;
                                const isFlagged = flaggedQuestions.has(question.id);
                                const isCurrent = index === currentQuestionIndex;

                                return (
                                    <button
                                        key={question.id}
                                        onClick={() => goToQuestion(index)}
                                        className={`
                      relative h-12 w-12 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm
                      ${isCurrent
                                                ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                                                : isAnswered
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }
                    `}
                                    >
                                        {index + 1}
                                        {isFlagged && (
                                            <Flag className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="space-y-3 text-sm">
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
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Answered:</span>
                                    <span className="font-medium text-green-600">{Object.keys(answers).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining:</span>
                                    <span className="font-medium text-gray-700">{totalQuestions - Object.keys(answers).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Flagged:</span>
                                    <span className="font-medium text-red-600">{flaggedQuestions.size}</span>
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
                            {/* Question Card */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Question Header */}
                                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center flex-wrap gap-3 mb-4">
                                                <span className={`
                          px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                          ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }
                        `}>
                                                    {currentQuestion.difficulty}
                                                </span>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                    {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                                                </span>
                                                {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {currentQuestion.tags.slice(0, 2).map((tag, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
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

                                        <button
                                            onClick={() => toggleFlag(currentQuestion.id)}
                                            className={`
                        ml-6 p-3 rounded-lg transition-all duration-200 flex-shrink-0
                        ${flaggedQuestions.has(currentQuestion.id)
                                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }
                      `}
                                            title={flaggedQuestions.has(currentQuestion.id) ? 'Remove flag' : 'Flag for review'}
                                        >
                                            <Flag className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Question Content */}
                                <div className="p-8">
                                    {/* Answer Options */}
                                    <div className="space-y-4 mb-8">
                                        {currentQuestion.type === 'single-select' && (
                                            <div className="space-y-3">
                                                {currentQuestion.options.map((option, index) => {
                                                    const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...
                                                    return (
                                                        <label
                                                            key={option.id}
                                                            className={`
                                group flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                                ${answers[currentQuestion.id] === option.id
                                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                                }
                              `}
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
                                                                <div className={`
                                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                  ${answers[currentQuestion.id] === option.id
                                                                        ? 'border-blue-500 bg-blue-500'
                                                                        : 'border-gray-300 group-hover:border-blue-400'
                                                                    }
                                `}>
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
                                                    const isSelected = answers[currentQuestion.id]?.includes(option.id) || false;
                                                    const optionLabel = String.fromCharCode(65 + index);
                                                    return (
                                                        <label
                                                            key={option.id}
                                                            className={`
                                group flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                                ${isSelected
                                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                                }
                              `}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => handleAnswer(currentQuestion.id, option.id, true)}
                                                                className="hidden"
                                                            />
                                                            <div className="flex items-center mr-4 flex-shrink-0">
                                                                <div className={`
                                  w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200
                                  ${isSelected
                                                                        ? 'border-blue-500 bg-blue-500'
                                                                        : 'border-gray-300 group-hover:border-blue-400'
                                                                    }
                                `}>
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

                                    {/* Hint Section */}
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
                                                            <p className="text-blue-800 leading-relaxed">{currentQuestion.hint}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Navigation Footer */}
                                <div className="bg-gray-50 px-8 py-6 border-t">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => goToQuestion(currentQuestionIndex - 1)}
                                            disabled={currentQuestionIndex === 0}
                                            className="
                        flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 
                        disabled:opacity-40 disabled:cursor-not-allowed
                        bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 hover:border-gray-400
                      "
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
                                                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => goToQuestion(currentQuestionIndex + 1)}
                                            disabled={currentQuestionIndex === totalQuestions - 1}
                                            className="
                        flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                        disabled:opacity-40 disabled:cursor-not-allowed
                        bg-blue-600 hover:bg-blue-700 text-white
                      "
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

export default MockExamPage;