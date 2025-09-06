import { useState, useEffect, useCallback, useRef } from 'react';
import storageService from '../services/storageService';
import { AUTO_SAVE_INTERVAL, EXAM_STATUS } from '../constants/examConstants';

/**
 * Custom hook for managing exam progress with auto-save functionality
 * @param {string} examId - The exam ID
 * @returns {object} - Exam progress utilities
 */
export const useExamProgress = (examId) => {
  const [examProgress, setExamProgress] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveRef = useRef(null);
  const progressRef = useRef(null);

  // Load saved progress on mount
  useEffect(() => {
    if (examId) {
      const savedProgress = storageService.loadExamProgress(examId);
      if (savedProgress) {
        setExamProgress(savedProgress);
        setLastSaved(new Date(savedProgress.lastSaved));
      }
    }
  }, [examId]);

  // Auto-save functionality
  const autoSave = useCallback(async (progressData) => {
    if (!examId || !progressData) return false;

    try {
      setIsAutoSaving(true);
      const success = storageService.saveExamProgress(examId, progressData);
      
      if (success) {
        setLastSaved(new Date());
        progressRef.current = progressData;
      }
      
      setIsAutoSaving(false);
      return success;
    } catch (error) {
      console.error('Auto-save failed:', error);
      setIsAutoSaving(false);
      return false;
    }
  }, [examId]);

  // Manual save
  const saveProgress = useCallback((progressData) => {
    return autoSave(progressData);
  }, [autoSave]);

  // Start auto-save interval
  const startAutoSave = useCallback((progressData) => {
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
    }

    progressRef.current = progressData;
    
    autoSaveRef.current = setInterval(() => {
      if (progressRef.current) {
        autoSave(progressRef.current);
      }
    }, AUTO_SAVE_INTERVAL);
  }, [autoSave]);

  // Stop auto-save
  const stopAutoSave = useCallback(() => {
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
      autoSaveRef.current = null;
    }
  }, []);

  // Update progress data (this will be auto-saved)
  const updateProgress = useCallback((updates) => {
    const newProgress = {
      ...progressRef.current,
      ...updates,
      status: updates.status || EXAM_STATUS.IN_PROGRESS
    };
    
    progressRef.current = newProgress;
    setExamProgress(newProgress);
    
    // Immediate save for critical updates
    if (updates.status === EXAM_STATUS.COMPLETED || updates.answers) {
      autoSave(newProgress);
    }
  }, [autoSave]);

  // Clear progress
  const clearProgress = useCallback(() => {
    if (examId) {
      storageService.clearExamProgress(examId);
      setExamProgress(null);
      setLastSaved(null);
      stopAutoSave();
    }
  }, [examId, stopAutoSave]);

  // Check if there's incomplete progress
  const hasIncompleteProgress = useCallback(() => {
    if (!examProgress) return false;
    return examProgress.status === EXAM_STATUS.IN_PROGRESS || examProgress.status === EXAM_STATUS.PAUSED;
  }, [examProgress]);

  // Get resume data
  const getResumeData = useCallback(() => {
    if (!hasIncompleteProgress()) return null;
    
    return {
      examId: examProgress.examId,
      answers: examProgress.answers || {},
      currentQuestionIndex: examProgress.currentQuestionIndex || 0,
      timeRemaining: examProgress.timeRemaining,
      flaggedQuestions: new Set(examProgress.flaggedQuestions || []),
      lastSaved: examProgress.lastSaved,
      examData: examProgress.examData
    };
  }, [examProgress, hasIncompleteProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoSave();
    };
  }, [stopAutoSave]);

  return {
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
  };
};

/**
 * Hook for managing exam attempts history
 */
export const useExamHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load attempt history
  useEffect(() => {
    setIsLoading(true);
    try {
      const history = storageService.getAttemptHistory();
      setAttempts(history);
    } catch (error) {
      console.error('Failed to load exam history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save new attempt
  const saveAttempt = useCallback((attemptData) => {
    try {
      const success = storageService.saveAttempt(attemptData);
      if (success) {
        // Reload attempts to get the updated list
        const updatedHistory = storageService.getAttemptHistory();
        setAttempts(updatedHistory);
      }
      return success;
    } catch (error) {
      console.error('Failed to save attempt:', error);
      return false;
    }
  }, []);

  // Get attempts for specific exam
  const getExamAttempts = useCallback((examId) => {
    return attempts.filter(attempt => attempt.examId === examId);
  }, [attempts]);

  // Get performance stats
  const getStats = useCallback(() => {
    return storageService.getPerformanceStats();
  }, []);

  // Clear all attempts
  const clearHistory = useCallback(() => {
    try {
      storageService.clearAttemptHistory();
      setAttempts([]);
      return true;
    } catch (error) {
      console.error('Failed to clear history:', error);
      return false;
    }
  }, []);

  return {
    attempts,
    isLoading,
    saveAttempt,
    getExamAttempts,
    getStats,
    clearHistory
  };
};