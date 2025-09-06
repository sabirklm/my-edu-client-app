// Exam-related constants
export const EXAM_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused'
};

export const QUESTION_TYPES = {
  SINGLE_SELECT: 'single-select',
  MULTI_SELECT: 'multi-select',
  TEXT: 'text'
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const STORAGE_KEYS = {
  EXAM_PROGRESS: 'exam_progress_',
  ATTEMPT_HISTORY: 'attempt_history',
  USER_SETTINGS: 'user_settings',
  BOOKMARKS: 'bookmarks'
};

export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 90,
  VERY_GOOD: 80,
  GOOD: 70,
  FAIR: 60
};

export const TIME_WARNING_THRESHOLD = 300; // 5 minutes in seconds