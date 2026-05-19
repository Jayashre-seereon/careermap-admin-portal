const PERSONALITY_TEST_STORAGE_KEY = "careermap-admin-personality-test-questions";

const defaultQuestions = [
  {
    id: "personality-question-1",
    question: "When working on a team project, what role do you naturally take?",
    options: [
      "I organize tasks and keep everyone on track",
      "I come up with creative ideas and new directions",
      "I support others and help where needed",
      "I focus on finishing my assigned work quietly",
    ],
    correctOption: 0,
  },
  {
    id: "personality-question-2",
    question: "Which environment helps you do your best work?",
    options: [
      "A structured plan with clear deadlines",
      "A flexible setup with room to experiment",
      "A collaborative group with regular discussion",
      "A calm space where I can work independently",
    ],
    correctOption: 1,
  },
];

function cloneQuestions(questions) {
  return questions.map((question) => ({
    ...question,
    options: [...(question.options || [])],
  }));
}

export function getPersonalityTestQuestions() {
  if (typeof window === "undefined") {
    return cloneQuestions(defaultQuestions);
  }

  const stored = window.localStorage.getItem(PERSONALITY_TEST_STORAGE_KEY);

  if (!stored) {
    const initial = cloneQuestions(defaultQuestions);
    window.localStorage.setItem(PERSONALITY_TEST_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid personality test store");
    }

    return cloneQuestions(parsed);
  } catch {
    const fallback = cloneQuestions(defaultQuestions);
    window.localStorage.setItem(PERSONALITY_TEST_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function savePersonalityTestQuestions(questions) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PERSONALITY_TEST_STORAGE_KEY,
    JSON.stringify(questions)
  );
}

export function createPersonalityQuestionId() {
  return `personality-question-${Date.now()}`;
}
