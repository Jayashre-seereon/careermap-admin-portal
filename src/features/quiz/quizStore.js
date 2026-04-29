const QUIZ_STORAGE_KEY = "careermap-admin-quizzes";

const defaultQuizzes = [
  {
    key: "quiz-1",
    id: "quiz-1",
    title: "Medical Entrance Basics",
    type: "Mock",
    from: "2026-04-25",
    to: "2026-04-30",
    duration: "30 Minutes",
    questions: [
      {
        id: "question-1",
        question: "Which entrance exam is required for MBBS admission in India?",
        options: ["JEE Main", "NEET UG", "CAT", "CLAT"],
        correctOption: 1,
      },
    ],
  },
  {
    key: "quiz-2",
    id: "quiz-2",
    title: "Career Aptitude Live Quiz",
    type: "Live",
    from: "2026-05-01",
    to: "2026-05-03",
    duration: "20 Minutes",
    questions: [],
  },
];

function cloneQuizzes(quizzes) {
  return quizzes.map((quiz) => ({
    ...quiz,
    questions: (quiz.questions || []).map((question) => ({
      ...question,
      options: [...question.options],
    })),
  }));
}

export function getQuizzes() {
  if (typeof window === "undefined") {
    return cloneQuizzes(defaultQuizzes);
  }

  const stored = window.localStorage.getItem(QUIZ_STORAGE_KEY);

  if (!stored) {
    const initial = cloneQuizzes(defaultQuizzes);
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid quiz store");
    }

    return parsed;
  } catch {
    const fallback = cloneQuizzes(defaultQuizzes);
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function saveQuizzes(quizzes) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
}

export function createQuizId() {
  return `quiz-${Date.now()}`;
}

export function createQuestionId() {
  return `question-${Date.now()}`;
}
