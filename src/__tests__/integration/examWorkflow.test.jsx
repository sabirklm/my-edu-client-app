import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MockExamPageEnhanced from '../../pages/MockExamPageEnhanced';
import storageService from '../../services/storageService';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'test-exam-1' })
  };
});

// Mock toast notifications
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn()
  }
}));

// Mock dataService
vi.mock('../../services/dataService', () => ({
  default: {
    getExamById: vi.fn().mockResolvedValue({
      id: 'test-exam-1',
      title: 'Test Integration Exam',
      description: 'Test exam for integration testing',
      duration: 60,
      totalMarks: 100,
      passingMarks: 60,
      questions: [
        {
          id: 'q1',
          title: 'What is React?',
          type: 'single-select',
          options: [
            { id: 'a', text: 'A JavaScript library' },
            { id: 'b', text: 'A programming language' },
            { id: 'c', text: 'A database' },
            { id: 'd', text: 'An operating system' }
          ],
          correctAnswer: 'a',
          marks: 5,
          difficulty: 'easy'
        },
        {
          id: 'q2',
          title: 'What is JSX?',
          type: 'single-select',
          options: [
            { id: 'a', text: 'JavaScript XML' },
            { id: 'b', text: 'Java Syntax Extension' },
            { id: 'c', text: 'JSON eXtended' },
            { id: 'd', text: 'JavaScript eXtended' }
          ],
          correctAnswer: 'a',
          marks: 5,
          difficulty: 'medium'
        }
      ]
    }),
    saveProgress: vi.fn().mockResolvedValue(true),
    loadProgress: vi.fn().mockResolvedValue(null),
    saveAttempt: vi.fn().mockResolvedValue(true)
  }
}));

const renderExamPage = () => {
  return render(
    <BrowserRouter>
      <MockExamPageEnhanced />
    </BrowserRouter>
  );
};

describe('Exam Workflow Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Mock timer functions
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Exam Start Flow', () => {
    it('should display exam instructions and allow exam start', async () => {
      renderExamPage();

      // Should show exam instructions first
      await waitFor(() => {
        expect(screen.getByText('Test Integration Exam')).toBeInTheDocument();
        expect(screen.getByText(/Please read the following instructions/)).toBeInTheDocument();
      });

      // Should have Start Exam button
      const startButton = screen.getByRole('button', { name: /start exam/i });
      expect(startButton).toBeInTheDocument();

      // Click start exam
      await userEvent.click(startButton);

      // Should now show the first question
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument();
      });
    });

    it('should initialize timer when exam starts', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Should show timer
      await waitFor(() => {
        expect(screen.getByText(/59:59|60:00/)).toBeInTheDocument();
      });
    });
  });

  describe('Question Navigation', () => {
    it('should navigate between questions', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Should show first question
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument();
      });

      // Navigate to next question
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      // Should show second question
      await waitFor(() => {
        expect(screen.getByText('What is JSX?')).toBeInTheDocument();
      });

      // Navigate back
      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      // Should show first question again
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument();
      });
    });

    it('should update question palette when navigating', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Should show question palette
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });

      // First question should be active
      const question1Button = screen.getByText('1').closest('button');
      expect(question1Button).toHaveClass('bg-blue-500');
    });
  });

  describe('Answer Selection', () => {
    it('should save answers when selected', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Select an answer
      await waitFor(() => {
        const option = screen.getByText('A JavaScript library');
        fireEvent.click(option.closest('label'));
      });

      // Answer should be selected visually
      const selectedOption = screen.getByText('A JavaScript library').closest('label');
      expect(selectedOption.querySelector('input')).toBeChecked();

      // Navigate to next question and back to verify answer is saved
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      // Answer should still be selected
      await waitFor(() => {
        const optionInput = screen.getByText('A JavaScript library').closest('label').querySelector('input');
        expect(optionInput).toBeChecked();
      });
    });

    it('should update question status in palette when answered', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Select an answer
      await waitFor(() => {
        const option = screen.getByText('A JavaScript library');
        fireEvent.click(option.closest('label'));
      });

      // Question should show as answered in palette
      await waitFor(() => {
        const question1Button = screen.getByText('1').closest('button');
        expect(question1Button).toHaveClass('bg-green-500');
      });
    });
  });

  describe('Auto-save Functionality', () => {
    it('should auto-save progress every 30 seconds', async () => {
      const saveProgressSpy = vi.spyOn(storageService, 'saveExamProgress');
      
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Select an answer
      await waitFor(() => {
        const option = screen.getByText('A JavaScript library');
        fireEvent.click(option.closest('label'));
      });

      // Fast-forward 30 seconds
      vi.advanceTimersByTime(30000);

      // Should have auto-saved
      await waitFor(() => {
        expect(saveProgressSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Question Flagging', () => {
    it('should flag and unflag questions', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Flag the question
      await waitFor(() => {
        const flagButton = screen.getByRole('button', { name: /flag/i });
        fireEvent.click(flagButton);
      });

      // Question should show as flagged in palette
      await waitFor(() => {
        const question1Button = screen.getByText('1').closest('button');
        expect(question1Button).toHaveClass('bg-orange-500');
      });

      // Unflag the question
      const flagButton = screen.getByRole('button', { name: /unflag/i });
      fireEvent.click(flagButton);

      // Question should no longer be flagged
      await waitFor(() => {
        const question1Button = screen.getByText('1').closest('button');
        expect(question1Button).not.toHaveClass('bg-orange-500');
      });
    });
  });

  describe('Exam Submission', () => {
    it('should submit exam and show results', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Answer both questions
      await waitFor(() => {
        const option1 = screen.getByText('A JavaScript library');
        fireEvent.click(option1.closest('label'));
      });

      // Navigate to second question
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        const option2 = screen.getByText('JavaScript XML');
        fireEvent.click(option2.closest('label'));
      });

      // Submit exam
      const submitButton = screen.getByRole('button', { name: /submit exam/i });
      await userEvent.click(submitButton);

      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByText(/are you sure you want to submit/i)).toBeInTheDocument();
      });

      // Confirm submission
      const confirmButton = screen.getByRole('button', { name: /yes, submit/i });
      await userEvent.click(confirmButton);

      // Should show results
      await waitFor(() => {
        expect(screen.getByText(/exam completed/i)).toBeInTheDocument();
        expect(screen.getByText(/your score/i)).toBeInTheDocument();
      });
    });

    it('should auto-submit when timer expires', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Fast-forward past exam duration (60 minutes = 3600 seconds)
      vi.advanceTimersByTime(3601000);

      // Should auto-submit and show results
      await waitFor(() => {
        expect(screen.getByText(/time's up/i)).toBeInTheDocument();
      });
    });
  });

  describe('Resume Functionality', () => {
    it('should show resume dialog when previous progress exists', async () => {
      // Setup previous progress
      const mockProgress = {
        examId: 'test-exam-1',
        answers: { 'q1': 'a' },
        currentQuestionIndex: 1,
        timeRemaining: 1800,
        status: 'in_progress'
      };
      
      vi.spyOn(storageService, 'loadExamProgress').mockReturnValue(mockProgress);

      renderExamPage();

      // Should show resume dialog
      await waitFor(() => {
        expect(screen.getByText(/resume previous attempt/i)).toBeInTheDocument();
      });

      // Resume exam
      const resumeButton = screen.getByRole('button', { name: /resume/i });
      await userEvent.click(resumeButton);

      // Should start from where left off
      await waitFor(() => {
        expect(screen.getByText('What is JSX?')).toBeInTheDocument(); // Second question
      });
    });

    it('should start fresh when choosing new attempt', async () => {
      // Setup previous progress
      const mockProgress = {
        examId: 'test-exam-1',
        answers: { 'q1': 'a' },
        currentQuestionIndex: 1,
        timeRemaining: 1800,
        status: 'in_progress'
      };
      
      vi.spyOn(storageService, 'loadExamProgress').mockReturnValue(mockProgress);

      renderExamPage();

      // Choose new attempt
      const newAttemptButton = await screen.findByRole('button', { name: /start new/i });
      await userEvent.click(newAttemptButton);

      // Should show instructions
      await waitFor(() => {
        expect(screen.getByText(/please read the following instructions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Bookmarking Integration', () => {
    it('should bookmark and unbookmark questions during exam', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Bookmark current question
      await waitFor(() => {
        const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
        fireEvent.click(bookmarkButton);
      });

      // Should show bookmark success message
      await waitFor(() => {
        expect(screen.getByText(/bookmarked/i)).toBeInTheDocument();
      });

      // Navigate away and back
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      // Should still show as bookmarked
      await waitFor(() => {
        const bookmarkButton = screen.getByRole('button', { name: /remove bookmark/i });
        expect(bookmarkButton).toBeInTheDocument();
      });
    });
  });

  describe('Exam Statistics and Results', () => {
    it('should calculate and display accurate results', async () => {
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Answer first question correctly
      await waitFor(() => {
        const option = screen.getByText('A JavaScript library');
        fireEvent.click(option.closest('label'));
      });

      // Navigate to second question
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      // Answer second question correctly
      await waitFor(() => {
        const option = screen.getByText('JavaScript XML');
        fireEvent.click(option.closest('label'));
      });

      // Submit exam
      const submitButton = screen.getByRole('button', { name: /submit exam/i });
      await userEvent.click(submitButton);

      // Confirm submission
      const confirmButton = await screen.findByRole('button', { name: /yes, submit/i });
      await userEvent.click(confirmButton);

      // Should show 100% score (both questions correct)
      await waitFor(() => {
        expect(screen.getByText(/100%|10\/10/)).toBeInTheDocument();
      });
    });

    it('should save attempt to history after submission', async () => {
      const saveAttemptSpy = vi.spyOn(storageService, 'saveAttempt');
      
      renderExamPage();

      // Start and complete exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Answer question
      await waitFor(() => {
        const option = screen.getByText('A JavaScript library');
        fireEvent.click(option.closest('label'));
      });

      // Submit exam
      const submitButton = screen.getByRole('button', { name: /submit exam/i });
      await userEvent.click(submitButton);

      const confirmButton = await screen.findByRole('button', { name: /yes, submit/i });
      await userEvent.click(confirmButton);

      // Should save attempt
      await waitFor(() => {
        expect(saveAttemptSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            examId: 'test-exam-1',
            examName: 'Test Integration Exam',
            totalQuestions: 2,
            correctAnswers: expect.any(Number),
            percentage: expect.any(Number)
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle exam loading errors gracefully', async () => {
      // Mock dataService to reject
      const dataService = await import('../../services/dataService');
      dataService.default.getExamById.mockRejectedValue(new Error('Network error'));

      renderExamPage();

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to load exam/i)).toBeInTheDocument();
      });
    });

    it('should handle save progress errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderExamPage();

      // Start exam
      const startButton = await screen.findByRole('button', { name: /start exam/i });
      await userEvent.click(startButton);

      // Mock localStorage to fail
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      // Answer question (should trigger auto-save)
      await waitFor(() => {
        const option = screen.getByText('A JavaScript library');
        fireEvent.click(option.closest('label'));
      });

      // Fast-forward to trigger auto-save
      vi.advanceTimersByTime(30000);

      // Should log error but continue functioning
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Failed to auto-save'),
          expect.any(Error)
        );
      });

      // Restore localStorage
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });
});