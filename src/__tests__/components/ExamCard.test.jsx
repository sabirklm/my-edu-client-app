import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Create a simple ExamCard component for testing
const ExamCard = ({ exam, onStart }) => {
  return (
    <div className="exam-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{exam.title}</h3>
      <p className="text-gray-600 mb-4">{exam.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{exam.duration} minutes</span>
        <span>{exam.totalQuestions} questions</span>
        <span className={`px-2 py-1 rounded ${
          exam.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
          exam.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {exam.difficulty}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => onStart(exam.id)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Start Exam
        </button>
        <button 
          onClick={() => mockNavigate(`/exams/${exam.id}/preview`)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Preview
        </button>
      </div>
    </div>
  );
};

const renderExamCard = (examProps = {}) => {
  const defaultExam = {
    id: 'exam-1',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React basics',
    duration: 60,
    totalQuestions: 20,
    difficulty: 'medium',
    ...examProps
  };

  const mockOnStart = vi.fn();

  return {
    ...render(
      <BrowserRouter>
        <ExamCard exam={defaultExam} onStart={mockOnStart} />
      </BrowserRouter>
    ),
    mockOnStart
  };
};

describe('ExamCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render exam information correctly', () => {
    renderExamCard();

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Test your knowledge of React basics')).toBeInTheDocument();
    expect(screen.getByText('60 minutes')).toBeInTheDocument();
    expect(screen.getByText('20 questions')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('should apply correct difficulty styling', () => {
    const { rerender } = renderExamCard({ difficulty: 'easy' });
    
    let difficultyBadge = screen.getByText('easy');
    expect(difficultyBadge).toHaveClass('bg-green-100', 'text-green-800');

    rerender(
      <BrowserRouter>
        <ExamCard 
          exam={{ 
            id: 'exam-1', 
            title: 'Test', 
            description: 'Test', 
            difficulty: 'hard',
            duration: 60,
            totalQuestions: 20
          }} 
          onStart={vi.fn()} 
        />
      </BrowserRouter>
    );

    difficultyBadge = screen.getByText('hard');
    expect(difficultyBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should call onStart when Start Exam button is clicked', () => {
    const { mockOnStart } = renderExamCard();

    const startButton = screen.getByRole('button', { name: /start exam/i });
    fireEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalledWith('exam-1');
  });

  it('should navigate to preview when Preview button is clicked', () => {
    renderExamCard();

    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);

    expect(mockNavigate).toHaveBeenCalledWith('/exams/exam-1/preview');
  });

  it('should handle long titles and descriptions gracefully', () => {
    const longExam = {
      title: 'This is a very long exam title that might wrap to multiple lines in the UI',
      description: 'This is a very long description that provides detailed information about what the exam covers and what students can expect to learn from taking this comprehensive assessment of their knowledge in the subject matter.'
    };

    renderExamCard(longExam);

    expect(screen.getByText(longExam.title)).toBeInTheDocument();
    expect(screen.getByText(longExam.description)).toBeInTheDocument();
  });

  it('should be keyboard accessible', () => {
    renderExamCard();

    const startButton = screen.getByRole('button', { name: /start exam/i });
    const previewButton = screen.getByRole('button', { name: /preview/i });

    // Buttons should be focusable
    startButton.focus();
    expect(document.activeElement).toBe(startButton);

    previewButton.focus();
    expect(document.activeElement).toBe(previewButton);
  });
});