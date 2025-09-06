import { describe, it, expect, beforeEach, vi } from 'vitest';
import storageService from '../../services/storageService';
import { EXAM_STATUS } from '../../constants/examConstants';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Basic Storage Operations', () => {
    it('should save and retrieve items from localStorage', () => {
      const testData = { test: 'value', number: 123 };
      
      const result = storageService.setItem('test-key', testData);
      expect(result).toBe(true);
      
      const retrieved = storageService.getItem('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = storageService.getItem('non-existent-key');
      expect(result).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      const result = storageService.setItem('test', 'value');
      expect(result).toBe(false);

      // Restore original method
      localStorage.setItem = originalSetItem;
    });
  });

  describe('Exam Progress Management', () => {
    const mockExamData = {
      id: 'exam-123',
      name: 'Test Exam',
      questions: [
        { id: 'q1', title: 'Question 1' },
        { id: 'q2', title: 'Question 2' }
      ]
    };

    const mockProgressData = {
      answers: { 'q1': 'answer1' },
      currentQuestionIndex: 1,
      timeRemaining: 1800,
      flaggedQuestions: new Set(['q2']),
      status: EXAM_STATUS.IN_PROGRESS,
      examData: mockExamData
    };

    it('should save exam progress correctly', () => {
      const result = storageService.saveExamProgress('exam-123', mockProgressData);
      expect(result).toBe(true);

      const saved = storageService.loadExamProgress('exam-123');
      expect(saved.examId).toBe('exam-123');
      expect(saved.answers).toEqual(mockProgressData.answers);
      expect(saved.currentQuestionIndex).toBe(1);
      expect(saved.timeRemaining).toBe(1800);
      expect(saved.status).toBe(EXAM_STATUS.IN_PROGRESS);
    });

    it('should convert flagged questions Set to Array when saving', () => {
      storageService.saveExamProgress('exam-123', mockProgressData);
      const saved = storageService.loadExamProgress('exam-123');
      
      expect(Array.isArray(saved.flaggedQuestions)).toBe(true);
      expect(saved.flaggedQuestions).toContain('q2');
    });

    it('should clear exam progress', () => {
      storageService.saveExamProgress('exam-123', mockProgressData);
      expect(storageService.loadExamProgress('exam-123')).toBeTruthy();

      const result = storageService.clearExamProgress('exam-123');
      expect(result).toBe(true);
      expect(storageService.loadExamProgress('exam-123')).toBeNull();
    });
  });

  describe('Attempt History Management', () => {
    const mockAttempt = {
      examId: 'exam-123',
      examName: 'Test Exam',
      totalQuestions: 10,
      answeredQuestions: 8,
      correctAnswers: 6,
      score: 18,
      maxScore: 25,
      percentage: 72,
      accuracy: 75,
      timeTaken: 2400,
      timeLimit: 2700,
      answers: { 'q1': 'a', 'q2': 'b' },
      flaggedQuestions: ['q3']
    };

    it('should save attempt to history', () => {
      const result = storageService.saveAttempt(mockAttempt);
      expect(result).toBe(true);

      const history = storageService.getAttemptHistory();
      expect(history).toHaveLength(1);
      expect(history[0].examId).toBe('exam-123');
      expect(history[0].percentage).toBe(72);
      expect(history[0].id).toBeTruthy(); // Should have auto-generated ID
    });

    it('should maintain attempt history order (newest first)', () => {
      const attempt1 = { ...mockAttempt, examName: 'First Exam' };
      const attempt2 = { ...mockAttempt, examName: 'Second Exam' };

      storageService.saveAttempt(attempt1);
      storageService.saveAttempt(attempt2);

      const history = storageService.getAttemptHistory();
      expect(history[0].examName).toBe('Second Exam'); // Most recent first
      expect(history[1].examName).toBe('First Exam');
    });

    it('should filter attempts by exam ID', () => {
      const attempt1 = { ...mockAttempt, examId: 'exam-1' };
      const attempt2 = { ...mockAttempt, examId: 'exam-2' };

      storageService.saveAttempt(attempt1);
      storageService.saveAttempt(attempt2);

      const exam1Attempts = storageService.getAttemptsByExamId('exam-1');
      expect(exam1Attempts).toHaveLength(1);
      expect(exam1Attempts[0].examId).toBe('exam-1');
    });

    it('should limit history to 50 attempts', () => {
      // Create 55 attempts
      for (let i = 0; i < 55; i++) {
        storageService.saveAttempt({ ...mockAttempt, examName: `Exam ${i}` });
      }

      const history = storageService.getAttemptHistory();
      expect(history).toHaveLength(50);
    });
  });

  describe('Bookmarks Management', () => {
    const mockQuestionData = {
      id: 'q1',
      title: 'Test Question',
      type: 'single-select',
      difficulty: 'medium'
    };

    it('should add bookmark correctly', () => {
      const result = storageService.addBookmark('q1', 'exam-123', mockQuestionData, 'Test note');
      expect(result).toBe(true);

      const bookmarks = storageService.getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].questionId).toBe('q1');
      expect(bookmarks[0].examId).toBe('exam-123');
      expect(bookmarks[0].notes).toBe('Test note');
    });

    it('should check if question is bookmarked', () => {
      storageService.addBookmark('q1', 'exam-123', mockQuestionData);
      
      expect(storageService.isBookmarked('q1', 'exam-123')).toBe(true);
      expect(storageService.isBookmarked('q2', 'exam-123')).toBe(false);
    });

    it('should remove bookmark correctly', () => {
      storageService.addBookmark('q1', 'exam-123', mockQuestionData);
      expect(storageService.getBookmarks()).toHaveLength(1);

      const result = storageService.removeBookmark('q1', 'exam-123');
      expect(result).toBe(true);
      expect(storageService.getBookmarks()).toHaveLength(0);
    });

    it('should replace existing bookmark with same ID', () => {
      storageService.addBookmark('q1', 'exam-123', mockQuestionData, 'First note');
      storageService.addBookmark('q1', 'exam-123', mockQuestionData, 'Second note');

      const bookmarks = storageService.getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].notes).toBe('Second note');
    });
  });

  describe('Performance Statistics', () => {
    beforeEach(() => {
      // Add sample attempts
      const attempts = [
        {
          examId: 'exam-1',
          examName: 'Physics Test',
          percentage: 80,
          correctAnswers: 8,
          totalQuestions: 10
        },
        {
          examId: 'exam-1',
          examName: 'Physics Test',
          percentage: 90,
          correctAnswers: 9,
          totalQuestions: 10
        },
        {
          examId: 'exam-2',
          examName: 'Chemistry Test',
          percentage: 70,
          correctAnswers: 7,
          totalQuestions: 10
        }
      ];

      attempts.forEach(attempt => storageService.saveAttempt(attempt));
    });

    it('should calculate performance stats correctly', () => {
      const stats = storageService.getPerformanceStats();
      
      expect(stats.totalAttempts).toBe(3);
      expect(stats.averageScore).toBe(80); // (80 + 90 + 70) / 3 = 80
      expect(stats.bestScore).toBe(90);
      expect(stats.averageAccuracy).toBe(80); // (80 + 90 + 70) / 3 = 80
    });

    it('should group stats by exam correctly', () => {
      const stats = storageService.getPerformanceStats();
      
      expect(stats.examStats['exam-1']).toEqual({
        examName: 'Physics Test',
        attempts: 2,
        bestScore: 90,
        averageScore: 85, // (80 + 90) / 2
        totalScore: 170
      });

      expect(stats.examStats['exam-2']).toEqual({
        examName: 'Chemistry Test',
        attempts: 1,
        bestScore: 70,
        averageScore: 70,
        totalScore: 70
      });
    });

    it('should return default stats when no attempts exist', () => {
      storageService.clearAttemptHistory();
      
      const stats = storageService.getPerformanceStats();
      expect(stats.totalAttempts).toBe(0);
      expect(stats.averageScore).toBe(0);
      expect(stats.bestScore).toBe(0);
      expect(stats.examStats).toEqual({});
    });
  });

  describe('Data Export/Import', () => {
    beforeEach(() => {
      // Setup test data
      storageService.saveAttempt({
        examId: 'exam-1',
        examName: 'Test Exam',
        percentage: 85
      });
      
      storageService.addBookmark('q1', 'exam-1', { title: 'Test Question' }, 'Note');
      storageService.saveUserSettings({ theme: 'dark' });
    });

    it('should export all user data', () => {
      const exportedData = storageService.exportData();
      const parsed = JSON.parse(exportedData);
      
      expect(parsed.attempts).toHaveLength(1);
      expect(parsed.bookmarks).toHaveLength(1);
      expect(parsed.settings.theme).toBe('dark');
      expect(parsed.exportedAt).toBeTruthy();
    });

    it('should import user data correctly', () => {
      const exportedData = storageService.exportData();
      storageService.clearAllData();
      
      // Verify data is cleared
      expect(storageService.getAttemptHistory()).toHaveLength(0);
      expect(storageService.getBookmarks()).toHaveLength(0);
      
      // Import data
      const result = storageService.importData(exportedData);
      expect(result).toBe(true);
      
      // Verify data is restored
      expect(storageService.getAttemptHistory()).toHaveLength(1);
      expect(storageService.getBookmarks()).toHaveLength(1);
      expect(storageService.getUserSettings().theme).toBe('dark');
    });

    it('should handle invalid import data', () => {
      const result = storageService.importData('invalid json');
      expect(result).toBe(false);
    });
  });

  describe('User Settings Management', () => {
    it('should save and retrieve user settings', () => {
      const settings = {
        theme: 'dark',
        language: 'en',
        notifications: true,
        autoSave: false
      };

      const result = storageService.saveUserSettings(settings);
      expect(result).toBe(true);

      const retrieved = storageService.getUserSettings();
      expect(retrieved).toEqual(settings);
    });

    it('should merge settings with defaults', () => {
      const partialSettings = { theme: 'dark' };
      storageService.saveUserSettings(partialSettings);

      const settings = storageService.getUserSettings();
      expect(settings.theme).toBe('dark');
      expect(settings.language).toBe('en'); // default value
    });

    it('should return default settings when none saved', () => {
      const settings = storageService.getUserSettings();
      expect(settings.theme).toBe('light'); // default value
      expect(settings.language).toBe('en'); // default value
    });
  });

  describe('Data Clearing Operations', () => {
    beforeEach(() => {
      // Setup test data across all categories
      storageService.saveAttempt({ examId: 'test', percentage: 80 });
      storageService.addBookmark('q1', 'exam-1', { title: 'Question' });
      storageService.saveUserSettings({ theme: 'dark' });
      storageService.saveExamProgress('exam-1', { answers: { q1: 'a' } });
    });

    it('should clear all data', () => {
      const result = storageService.clearAllData();
      expect(result).toBe(true);

      expect(storageService.getAttemptHistory()).toHaveLength(0);
      expect(storageService.getBookmarks()).toHaveLength(0);
      expect(storageService.loadExamProgress('exam-1')).toBeNull();
      expect(storageService.getUserSettings().theme).toBe('light'); // reset to default
    });

    it('should clear only attempt history', () => {
      const result = storageService.clearAttemptHistory();
      expect(result).toBe(true);

      expect(storageService.getAttemptHistory()).toHaveLength(0);
      expect(storageService.getBookmarks()).toHaveLength(1); // unchanged
      expect(storageService.getUserSettings().theme).toBe('dark'); // unchanged
    });
  });
});