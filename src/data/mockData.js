// Mock exam data for development and testing
export const mockExamData = {
  success: true,
  data: {
    _id: "68aa3554eb65a371b7a4dafc",
    name: "JEE Main Physics Mock Test",
    description: "Comprehensive physics test covering mechanics, thermodynamics, and optics",
    timeLimit: 45, // minutes
    maxAttempts: 3,
    passingScore: 60,
    questions: [
      {
        _id: "q1",
        title: "A particle moves in a straight line with constant acceleration. If it covers 10m in the first 2 seconds and 20m in the next 2 seconds, what is its acceleration?",
        type: "single-select",
        difficulty: "medium",
        points: 2,
        tags: ["mechanics", "kinematics"],
        hint: "Use the equation s = ut + (1/2)at² and consider the motion in two intervals",
        options: [
          { id: "a", label: "2.5 m/s²", isCorrect: true },
          { id: "b", label: "5 m/s²", isCorrect: false },
          { id: "c", label: "1.25 m/s²", isCorrect: false },
          { id: "d", label: "7.5 m/s²", isCorrect: false }
        ]
      },
      {
        _id: "q2",
        title: "Which of the following statements about electromagnetic waves are correct?",
        subtitle: "Select all that apply",
        type: "multi-select",
        difficulty: "hard",
        points: 3,
        tags: ["electromagnetic waves", "physics"],
        hint: "Think about the properties of EM waves in vacuum and their relationship with electric and magnetic fields",
        options: [
          { id: "a", label: "They travel at the speed of light in vacuum", isCorrect: true },
          { id: "b", label: "Electric and magnetic field vectors are perpendicular to each other", isCorrect: true },
          { id: "c", label: "They require a medium for propagation", isCorrect: false },
          { id: "d", label: "They carry energy and momentum", isCorrect: true }
        ]
      },
      {
        _id: "q3",
        title: "Derive the expression for the time period of a simple pendulum. Explain how it varies with length.",
        type: "text",
        difficulty: "hard",
        points: 5,
        tags: ["oscillations", "derivation"],
        correctAnswer: "T = 2π√(l/g)",
        hint: "Start with the restoring force for small angular displacement and apply Newton's second law"
      },
      {
        _id: "q4",
        title: "The efficiency of a Carnot engine operating between two thermal reservoirs at temperatures 400K and 300K is:",
        type: "single-select",
        difficulty: "easy",
        points: 2,
        tags: ["thermodynamics", "carnot engine"],
        hint: "Efficiency of Carnot engine = 1 - (T₂/T₁)",
        options: [
          { id: "a", label: "25%", isCorrect: true },
          { id: "b", label: "75%", isCorrect: false },
          { id: "c", label: "33.3%", isCorrect: false },
          { id: "d", label: "50%", isCorrect: false }
        ]
      },
      {
        _id: "q5",
        title: "In Young's double slit experiment, which factors affect the fringe width?",
        subtitle: "Select all that apply",
        type: "multi-select",
        difficulty: "medium",
        points: 3,
        tags: ["optics", "interference"],
        hint: "Fringe width β = λD/d, consider what each variable represents",
        options: [
          { id: "a", label: "Wavelength of light", isCorrect: true },
          { id: "b", label: "Distance between slits and screen", isCorrect: true },
          { id: "c", label: "Intensity of light", isCorrect: false },
          { id: "d", label: "Separation between the two slits", isCorrect: true }
        ]
      },
      {
        _id: "q6",
        title: "A uniform rod of length L and mass M is pivoted at its center. What is the moment of inertia about the pivot?",
        type: "single-select",
        difficulty: "medium",
        points: 2,
        tags: ["rotational mechanics", "moment of inertia"],
        hint: "For a uniform rod about its center: I = ML²/12",
        options: [
          { id: "a", label: "ML²/12", isCorrect: true },
          { id: "b", label: "ML²/3", isCorrect: false },
          { id: "c", label: "ML²/4", isCorrect: false },
          { id: "d", label: "ML²/6", isCorrect: false }
        ]
      },
      {
        _id: "q7",
        title: "Explain the working principle of a photoelectric effect and derive Einstein's photoelectric equation.",
        type: "text",
        difficulty: "hard",
        points: 5,
        tags: ["modern physics", "photoelectric effect"],
        correctAnswer: "hν = φ + KEmax",
        hint: "Consider photon energy, work function, and maximum kinetic energy of emitted electrons"
      },
      {
        _id: "q8",
        title: "The capacitance of a parallel plate capacitor with air as dielectric is C₀. If a dielectric slab of dielectric constant K is inserted between the plates, the new capacitance becomes:",
        type: "single-select",
        difficulty: "easy",
        points: 2,
        tags: ["electrostatics", "capacitors"],
        hint: "Capacitance with dielectric = K × original capacitance",
        options: [
          { id: "a", label: "KC₀", isCorrect: true },
          { id: "b", label: "C₀/K", isCorrect: false },
          { id: "c", label: "C₀ + K", isCorrect: false },
          { id: "d", label: "C₀ - K", isCorrect: false }
        ]
      },
      {
        _id: "q9",
        title: "Which of the following are properties of magnetic field lines?",
        subtitle: "Select all that apply",
        type: "multi-select",
        difficulty: "medium",
        points: 3,
        tags: ["magnetism", "field lines"],
        hint: "Think about the fundamental properties and behavior of magnetic field lines",
        options: [
          { id: "a", label: "They form closed loops", isCorrect: true },
          { id: "b", label: "They never intersect each other", isCorrect: true },
          { id: "c", label: "They have a beginning and an end", isCorrect: false },
          { id: "d", label: "Density of lines indicates field strength", isCorrect: true }
        ]
      },
      {
        _id: "q10",
        title: "A wave pulse traveling on a string has the equation y = 2/(1 + (x-3t)²). What is the speed of the wave?",
        type: "single-select",
        difficulty: "medium",
        points: 2,
        tags: ["waves", "wave equation"],
        hint: "Compare with standard wave equation y = f(x ± vt) to find wave speed",
        options: [
          { id: "a", label: "3 m/s", isCorrect: true },
          { id: "b", label: "2 m/s", isCorrect: false },
          { id: "c", label: "1 m/s", isCorrect: false },
          { id: "d", label: "6 m/s", isCorrect: false }
        ]
      }
    ]
  }
};

// Mock user progress data
export const mockUserProgress = {
  examId: "68aa3554eb65a371b7a4dafc",
  answers: {
    "q1": "a",
    "q2": ["a", "b"],
    "q4": "a"
  },
  currentQuestionIndex: 3,
  timeRemaining: 2100,
  flaggedQuestions: ["q3", "q7"],
  status: "in_progress",
  lastSaved: new Date().toISOString(),
  examData: mockExamData.data
};

// Mock attempt history
export const mockAttemptHistory = [
  {
    id: "attempt_1",
    examId: "68aa3554eb65a371b7a4dafc",
    examName: "JEE Main Physics Mock Test",
    totalQuestions: 10,
    answeredQuestions: 8,
    correctAnswers: 6,
    score: 18,
    maxScore: 25,
    percentage: 72,
    accuracy: 75,
    timeTaken: 2400, // seconds
    timeLimit: 2700, // seconds
    completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    answers: { "q1": "a", "q2": ["a", "b"], "q4": "a" },
    flaggedQuestions: ["q3"]
  },
  {
    id: "attempt_2",
    examId: "another_exam_id",
    examName: "Chemistry Fundamentals Test",
    totalQuestions: 15,
    answeredQuestions: 15,
    correctAnswers: 12,
    score: 28,
    maxScore: 30,
    percentage: 93,
    accuracy: 80,
    timeTaken: 1800,
    timeLimit: 2700,
    completedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    answers: {},
    flaggedQuestions: []
  }
];

// Mock analytics data
export const mockAnalytics = {
  totalAttempts: 15,
  averageScore: 76,
  bestScore: 93,
  averageAccuracy: 78,
  totalTimeSpent: 32400, // seconds
  examStats: {
    "68aa3554eb65a371b7a4dafc": {
      examName: "JEE Main Physics Mock Test",
      attempts: 3,
      bestScore: 85,
      averageScore: 74,
      totalScore: 222
    },
    "another_exam_id": {
      examName: "Chemistry Fundamentals Test",
      attempts: 2,
      bestScore: 93,
      averageScore: 88,
      totalScore: 176
    }
  },
  subjectWisePerformance: [
    { subject: "Physics", averageScore: 74, attempts: 8 },
    { subject: "Chemistry", averageScore: 82, attempts: 4 },
    { subject: "Mathematics", averageScore: 69, attempts: 3 }
  ],
  weeklyProgress: [
    { week: "Week 1", score: 65 },
    { week: "Week 2", score: 72 },
    { week: "Week 3", score: 78 },
    { week: "Week 4", score: 81 }
  ]
};

// Export all mock data
export const mockData = {
  examData: mockExamData,
  userProgress: mockUserProgress,
  attemptHistory: mockAttemptHistory,
  analytics: mockAnalytics
};