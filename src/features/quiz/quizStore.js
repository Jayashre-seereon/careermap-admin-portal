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
    participants: [
      {
        id: "user-1",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        score: "18/20",
        attendedOn: "2026-04-27",
      },
      {
        id: "user-2",
        name: "Ananya Roy",
        email: "ananya.roy@example.com",
          score: "16/20",
        attendedOn: "2026-04-28",
      },
      {
        id: "user-4",
        name: "Kiran Patel",
        email: "kiran.patel@example.com",
  score: "19/20",
        attendedOn: "2026-04-29",
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
    participants: [
      {
        id: "user-3",
        name: "Priya Das",
        email: "priya.das@example.com",
         score: "14/20",
        attendedOn: "2026-05-02",
      },
      {
        id: "user-5",
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        score: "17/20",
        attendedOn: "2026-05-02",
      },
    ],
  },
];

const defaultParticipantsByQuizId = Object.fromEntries(
  defaultQuizzes.map((quiz) => [quiz.id, quiz.participants || []])
);

function hydrateParticipants(quizzes) {
  return quizzes.map((quiz) => {
    const fallbackParticipants = defaultParticipantsByQuizId[quiz.id] || [];
    const participants =
      Array.isArray(quiz.participants) && quiz.participants.length > 0
        ? quiz.participants
        : fallbackParticipants;

    return {
      ...quiz,
      participants,
    };
  });
}

function cloneQuizzes(quizzes) {
  return quizzes.map((quiz) => ({
    ...quiz,
    questions: (quiz.questions || []).map((question) => ({
      ...question,
      options: [...question.options],
    })),
    participants: (quiz.participants || []).map((participant) => ({
      ...participant,
    })),
  }));
}

export function getQuizzes() {
  if (typeof window === "undefined") {
    return cloneQuizzes(defaultQuizzes);
  }

  const stored = window.localStorage.getItem(QUIZ_STORAGE_KEY);

  if (!stored) {
    const initial = cloneQuizzes(hydrateParticipants(defaultQuizzes));
    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid quiz store");
    }

    return cloneQuizzes(hydrateParticipants(parsed));
  } catch {
    const fallback = cloneQuizzes(hydrateParticipants(defaultQuizzes));
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
