import { STORAGE_KEYS, EXAM_STATUS } from '../constants/examConstants';

class StorageService {
  // Generic storage methods
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to retrieve from localStorage:', error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  // Exam progress methods
  saveExamProgress(examId, data) {
    const progressKey = `${STORAGE_KEYS.EXAM_PROGRESS}${examId}`;
    const progressData = {
      examId,
      answers: data.answers || {},
      currentQuestionIndex: data.currentQuestionIndex || 0,
      timeRemaining: data.timeRemaining,
      flaggedQuestions: Array.from(data.flaggedQuestions || []),
      status: data.status || EXAM_STATUS.IN_PROGRESS,
      lastSaved: new Date().toISOString(),
      examData: data.examData
    };
    
    return this.setItem(progressKey, progressData);
  }

  loadExamProgress(examId) {
    const progressKey = `${STORAGE_KEYS.EXAM_PROGRESS}${examId}`;
    return this.getItem(progressKey);
  }

  clearExamProgress(examId) {
    const progressKey = `${STORAGE_KEYS.EXAM_PROGRESS}${examId}`;
    return this.removeItem(progressKey);
  }

  // Attempt history methods
  saveAttempt(attemptData) {
    const attempts = this.getAttemptHistory();
    const newAttempt = {
      id: Date.now().toString(),
      examId: attemptData.examId,
      examName: attemptData.examName,
      totalQuestions: attemptData.totalQuestions,
      answeredQuestions: attemptData.answeredQuestions,
      correctAnswers: attemptData.correctAnswers,
      score: attemptData.score,
      maxScore: attemptData.maxScore,
      percentage: attemptData.percentage,
      accuracy: attemptData.accuracy,
      timeTaken: attemptData.timeTaken,
      timeLimit: attemptData.timeLimit,
      completedAt: new Date().toISOString(),
      answers: attemptData.answers,
      flaggedQuestions: attemptData.flaggedQuestions || []
    };

    attempts.unshift(newAttempt); // Add to beginning
    
    // Keep only last 50 attempts
    const limitedAttempts = attempts.slice(0, 50);
    
    return this.setItem(STORAGE_KEYS.ATTEMPT_HISTORY, limitedAttempts);
  }

  getAttemptHistory() {
    return this.getItem(STORAGE_KEYS.ATTEMPT_HISTORY) || [];
  }

  getAttemptsByExamId(examId) {
    const attempts = this.getAttemptHistory();
    return attempts.filter(attempt => attempt.examId === examId);
  }

  clearAttemptHistory() {
    return this.removeItem(STORAGE_KEYS.ATTEMPT_HISTORY);
  }

  // User settings methods
  saveUserSettings(settings) {
    const currentSettings = this.getUserSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    return this.setItem(STORAGE_KEYS.USER_SETTINGS, updatedSettings);
  }

  getUserSettings() {
    return this.getItem(STORAGE_KEYS.USER_SETTINGS) || {
      theme: 'light',
      autoSave: true,
      showHints: true,
      soundEnabled: true,
      notifications: true
    };
  }

  // Bookmarks methods
  addBookmark(questionId, examId, questionData, notes = '') {
    const bookmarks = this.getBookmarks();
    const bookmark = {
      id: `${examId}_${questionId}`,
      questionId,
      examId,
      questionData,
      notes,
      createdAt: new Date().toISOString()
    };

    // Remove existing bookmark if it exists
    const filteredBookmarks = bookmarks.filter(b => b.id !== bookmark.id);
    filteredBookmarks.unshift(bookmark);

    return this.setItem(STORAGE_KEYS.BOOKMARKS, filteredBookmarks);
  }

  removeBookmark(questionId, examId) {
    const bookmarks = this.getBookmarks();
    const bookmarkId = `${examId}_${questionId}`;
    const filteredBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    return this.setItem(STORAGE_KEYS.BOOKMARKS, filteredBookmarks);
  }

  getBookmarks() {
    return this.getItem(STORAGE_KEYS.BOOKMARKS) || [];
  }

  isBookmarked(questionId, examId) {
    const bookmarks = this.getBookmarks();
    const bookmarkId = `${examId}_${questionId}`;
    return bookmarks.some(b => b.id === bookmarkId);
  }

  // Analytics helper methods
  getPerformanceStats() {
    const attempts = this.getAttemptHistory();
    
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        examStats: {}
      };
    }

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.percentage, 0);
    const totalAccuracy = attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0);
    const totalTime = attempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0);
    const bestScore = Math.max(...attempts.map(attempt => attempt.percentage));

    // Group by exam
    const examStats = {};
    attempts.forEach(attempt => {
      if (!examStats[attempt.examId]) {
        examStats[attempt.examId] = {
          examName: attempt.examName,
          attempts: 0,
          bestScore: 0,
          averageScore: 0,
          totalScore: 0
        };
      }
      
      const examStat = examStats[attempt.examId];
      examStat.attempts += 1;
      examStat.totalScore += attempt.percentage;
      examStat.averageScore = examStat.totalScore / examStat.attempts;
      examStat.bestScore = Math.max(examStat.bestScore, attempt.percentage);
    });

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(totalScore / attempts.length),
      bestScore: Math.round(bestScore),
      averageAccuracy: Math.round(totalAccuracy / attempts.length),
      totalTimeSpent: totalTime,
      examStats
    };
  }

  // Utility methods
  exportData() {
    const data = {
      attempts: this.getAttemptHistory(),
      bookmarks: this.getBookmarks(),
      settings: this.getUserSettings(),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.attempts) {
        this.setItem(STORAGE_KEYS.ATTEMPT_HISTORY, data.attempts);
      }
      
      if (data.bookmarks) {
        this.setItem(STORAGE_KEYS.BOOKMARKS, data.bookmarks);
      }
      
      if (data.settings) {
        this.setItem(STORAGE_KEYS.USER_SETTINGS, data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        if (key.includes('_')) {
          // For keys with dynamic suffixes, clear all matching keys
          Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith(key)) {
              localStorage.removeItem(storageKey);
            }
          });
        } else {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const storageService = new StorageService();
export default storageService;