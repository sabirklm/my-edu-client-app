import { describe, it, expect, beforeEach, vi } from 'vitest';
import dataService from '../../services/dataService';

describe('DataService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Mock Data Mode', () => {
    it('should return mock exams list', async () => {
      const response = await dataService.getExamsList();
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data[0]).toHaveProperty('_id');
      expect(response.data[0]).toHaveProperty('name');
      expect(response.data[0]).toHaveProperty('description');
    });

    it('should return specific exam by ID', async () => {
      const listResponse = await dataService.getExamsList();
      const firstExam = listResponse.data[0];
      
      const response = await dataService.getExamById(firstExam._id);
      
      expect(response.success).toBe(true);
      expect(response.data._id).toBe(firstExam._id);
      expect(response.data).toHaveProperty('questions');
      expect(Array.isArray(response.data.questions)).toBe(true);
    });

    it('should return success:false for non-existent exam ID', async () => {
      const response = await dataService.getExamById('non-existent-id');
      expect(response.success).toBe(false);
    });
  });

  describe('Progress Management', () => {
    const mockExamData = {
      id: 'exam-123',
      title: 'Test Exam',
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
      status: 'in_progress',
      examData: mockExamData
    };

    it('should save and load exam progress', async () => {
      const saveResult = await dataService.saveProgress('exam-123', mockProgressData);
      expect(saveResult).toBe(true);

      const loadedProgress = await dataService.loadProgress('exam-123');
      expect(loadedProgress).toBeTruthy();
      expect(loadedProgress.examId).toBe('exam-123');
      expect(loadedProgress.answers).toEqual(mockProgressData.answers);
    });

    it('should clear exam progress', async () => {
      await dataService.saveProgress('exam-123', mockProgressData);
      expect(await dataService.loadProgress('exam-123')).toBeTruthy();

      const result = await dataService.clearProgress('exam-123');
      expect(result).toBe(true);
      expect(await dataService.loadProgress('exam-123')).toBeNull();
    });
  });

  describe('Attempt History', () => {
    const mockAttempt = {
      examId: 'exam-123',
      examName: 'Test Exam',
      totalQuestions: 10,
      correctAnswers: 8,
      percentage: 80,
      timeTaken: 1800
    };

    it('should save attempt', async () => {
      const result = await dataService.saveAttempt(mockAttempt);
      expect(result).toBe(true);

      const attempts = await dataService.getAttempts();
      expect(attempts).toHaveLength(1);
      expect(attempts[0].examId).toBe('exam-123');
    });

    it('should filter attempts by exam ID', async () => {
      await dataService.saveAttempt({ ...mockAttempt, examId: 'exam-1' });
      await dataService.saveAttempt({ ...mockAttempt, examId: 'exam-2' });

      const exam1Attempts = await dataService.getAttemptsByExam('exam-1');
      expect(exam1Attempts).toHaveLength(1);
      expect(exam1Attempts[0].examId).toBe('exam-1');
    });
  });

  describe('Bookmarks Management', () => {
    const mockQuestionData = {
      id: 'q1',
      title: 'Test Question',
      type: 'single-select'
    };

    it('should manage bookmarks', async () => {
      // Add bookmark
      const addResult = await dataService.addBookmark('q1', 'exam-123', mockQuestionData, 'Test note');
      expect(addResult).toBe(true);

      // Check if bookmarked
      const isBookmarked = await dataService.isBookmarked('q1', 'exam-123');
      expect(isBookmarked).toBe(true);

      // Get bookmarks
      const bookmarks = await dataService.getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].questionId).toBe('q1');

      // Remove bookmark
      const removeResult = await dataService.removeBookmark('q1', 'exam-123');
      expect(removeResult).toBe(true);
      expect(await dataService.isBookmarked('q1', 'exam-123')).toBe(false);
    });
  });

  describe('Performance Statistics', () => {
    beforeEach(async () => {
      // Add sample attempts for statistics
      const attempts = [
        { examId: 'exam-1', percentage: 85, correctAnswers: 8, totalQuestions: 10 },
        { examId: 'exam-1', percentage: 90, correctAnswers: 9, totalQuestions: 10 },
        { examId: 'exam-2', percentage: 75, correctAnswers: 7, totalQuestions: 10 }
      ];

      for (const attempt of attempts) {
        await dataService.saveAttempt(attempt);
      }
    });

    it('should calculate performance stats', async () => {
      const stats = await dataService.getStats();
      
      expect(stats.totalAttempts).toBe(3);
      expect(stats.averageScore).toBeCloseTo(83.33, 1);
      expect(stats.bestScore).toBe(90);
    });
  });

  describe('User Settings', () => {
    it('should manage user settings', async () => {
      const settings = {
        theme: 'dark',
        language: 'en',
        notifications: true
      };

      const saveResult = await dataService.saveSettings(settings);
      expect(saveResult).toBe(true);

      const loadedSettings = await dataService.getSettings();
      expect(loadedSettings).toEqual(settings);
    });
  });

  describe('Data Export/Import', () => {
    beforeEach(async () => {
      await dataService.saveAttempt({ examId: 'test', percentage: 80 });
      await dataService.addBookmark('q1', 'exam-1', { title: 'Question' });
      await dataService.saveSettings({ theme: 'dark' });
    });

    it('should export and import data', async () => {
      const exportedData = await dataService.exportData();
      expect(exportedData).toBeTruthy();

      const parsed = JSON.parse(exportedData);
      expect(parsed.attempts).toHaveLength(1);
      expect(parsed.bookmarks).toHaveLength(1);
      expect(parsed.settings.theme).toBe('dark');

      // Clear and import
      await dataService.clearAllData();
      const importResult = await dataService.importData(exportedData);
      expect(importResult).toBe(true);

      // Verify restoration
      const attempts = await dataService.getAttempts();
      const bookmarks = await dataService.getBookmarks();
      const settings = await dataService.getSettings();

      expect(attempts).toHaveLength(1);
      expect(bookmarks).toHaveLength(1);
      expect(settings.theme).toBe('dark');
    });
  });
});