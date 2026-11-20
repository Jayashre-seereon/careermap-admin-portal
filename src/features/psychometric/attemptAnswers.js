// Builds read-only "what did the candidate answer" rows for the admin attempt drawer.
//
// GET /admin/attempts/:id returns the raw Prisma attempt:
//   - attempt.assessment.sections[].questions[]  -> every question (with options)
//   - attempt.answers[]                          -> what the candidate picked
//        { questionId, likertValue | selectedOptionId, selectedOption, question }
// Nothing here mutates data or talks to the API.

const AGREE_SCALE = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral / Undecided",
  4: "Agree",
  5: "Strongly Agree",
};

// Section 1 (profiling) uses a different wording for the same 1-5 scale.
const PROFILING_SCALE = {
  1: "Not true at all",
  2: "Mostly not true",
  3: "Not sure",
  4: "Mostly true",
  5: "Very true",
};

const PROFILING_CODES = new Set([
  "profiling",
  "personal_profiling",
  "career_planning",
  "profile",
  "cri",
  "career_readiness",
]);

const isProfilingSection = (code) => PROFILING_CODES.has(String(code || "").toLowerCase().trim());

const hasValue = (v) => v !== null && v !== undefined;

const buildRow = ({ question, section, answer, index }) => {
  const options = Array.isArray(question.options) ? question.options : [];

  const base = {
    key: question.id ?? `${section?.code}-${question.itemId}-${index}`,
    itemId: question.itemId,
    prompt: question.text,
    sectionTitle: section?.title || section?.code || "General",
    answered: false,
    selected: null,
  };

  if (!answer) return base;

  // Likert (1-5 rating)
  if (hasValue(answer.likertValue)) {
    const value = Number(answer.likertValue);
    const labels = isProfilingSection(section?.code) ? PROFILING_SCALE : AGREE_SCALE;
    return { ...base, answered: true, selected: `${value} - ${labels[value] || "Rating"}` };
  }

  // Multiple choice / single choice
  const chosen =
    answer.selectedOption ||
    options.find((o) => Number(o.id) === Number(answer.selectedOptionId)) ||
    null;
  if (chosen || hasValue(answer.selectedOptionId)) {
    return {
      ...base,
      answered: true,
      selected: chosen?.optionText ?? `Option #${answer.selectedOptionId}`,
    };
  }

  return base;
};

/**
 * @param {object} attempt  attempt payload from GET /admin/attempts/:id
 * @returns {{ rows: object[], summary: { total: number, answered: number } }}
 */
export const buildAttemptAnswerRows = (attempt) => {
  const answers = Array.isArray(attempt?.answers) ? attempt.answers : [];
  const answerByQuestionId = new Map(answers.map((a) => [Number(a.questionId), a]));
  const sections = Array.isArray(attempt?.assessment?.sections) ? attempt.assessment.sections : [];

  const rows = [];

  if (sections.length > 0) {
    // Full question list (in test order) so unanswered questions show as "Not answered".
    sections.forEach((section) => {
      (section.questions || []).forEach((question) => {
        rows.push(
          buildRow({
            question,
            section,
            answer: answerByQuestionId.get(Number(question.id)),
            index: rows.length,
          })
        );
      });
    });
  } else {
    // Fallback: only the answers we have (each carries its own question + section).
    answers.forEach((answer) => {
      if (!answer.question) return;
      rows.push(
        buildRow({
          question: answer.question,
          section: answer.question.section,
          answer,
          index: rows.length,
        })
      );
    });
  }

  // Stable question number (survives section filtering in the UI)
  rows.forEach((row, i) => {
    row.no = i + 1;
  });

  return {
    rows,
    summary: { total: rows.length, answered: rows.filter((r) => r.answered).length },
  };
};
