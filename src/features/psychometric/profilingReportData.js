export const SAMPLE_PROFILING_REPORT = {
  heading: "YOUR PROFILING",
  introParagraph:
    "The Current Career stage analysis is the foundation of effective career planning. It provides a clear understanding of where you currently stand in your career decision-making journey and helps identify the direction you need to take. Through this, we assess your present level of career preparedness, identify the challenges or risks that may influence your career decisions, and determine the appropriate steps for your growth and development.\n\nThe objective is to establish a clear career goal and create a structured roadmap that gradually moves you from your current stage of career planning towards an optimized, informed, and future-ready stage.",
  stageTrack: {
    title: "Current Stage of Planning",
    currentStageName: "Discovering",
    currentStageCode: "DISCOVERING",
    currentStageNo: 3,
    stages: [
      { stageNo: 1, stageCode: "LOW_AWARENESS", stageName: "Low awareness", isCurrent: false },
      { stageNo: 2, stageCode: "UNCERTAIN", stageName: "Uncertain", isCurrent: false },
      { stageNo: 3, stageCode: "DISCOVERING", stageName: "Discovering", isCurrent: true },
      { stageNo: 4, stageCode: "DECISIVE", stageName: "Decisive", isCurrent: false },
      { stageNo: 5, stageCode: "CAREER_READINESS", stageName: "Career Readiness", isCurrent: false },
    ],
  },
  riskBadge: {
    text: "Risk level: Low to Medium",
    label: "Low to Medium",
    level: 2,
    colour: "Light green",
    hexColor: "#4CAF50",
    baseRiskLevel: 2,
    isEscalated: false,
  },
  whatItMeans:
    "You know what you want to do. Now you need a clear path: which subjects, which exams, and which skills.",

  your5Areas: [
    {
      domainCode: "SA",
      domainStudentFacingName: "About Me",
      score: 83,
      stage: "Career Readiness",
      stageNo: 5,
      label: "About Me â€“ Career Readiness",
      meaning: "You know yourself very well and can use this to choose your career.",
    },
    {
      domainCode: "CE",
      domainStudentFacingName: "Knowing About Careers",
      score: 58,
      stage: "Discovering",
      stageNo: 3,
      label: "Knowing About Careers â€“ Discovering",
      meaning: "You are finding out about different careers.",
    },
    {
      domainCode: "DC",
      domainStudentFacingName: "Making a Choice",
      score: 83,
      stage: "Career Readiness",
      stageNo: 5,
      label: "Making a Choice â€“ Career Readiness",
      meaning: "You are sure about your choice and it stays steady.",
    },
    {
      domainCode: "PP",
      domainStudentFacingName: "Knowing the Path",
      score: 50,
      stage: "Discovering",
      stageNo: 3,
      label: "Knowing the Path â€“ Discovering",
      meaning: "You know some of the steps for the field you like.",
    },
    {
      domainCode: "CO",
      domainStudentFacingName: "Feeling Sure",
      score: 75,
      stage: "Decisive",
      stageNo: 4,
      label: "Feeling Sure â€“ Decisive",
      meaning: "You feel confident about choosing your career.",
    },
  ],
  careerReadinessScore: {
    cri: 70,
    maxScore: 100,
    displayText: "Career Readiness Score: 70/100",
    criStageName: "Clarity",
  },
  notesForYou: {
    hasNotes: true,
    notes: [
      {
        flagId: "F1",
        flagName: "Decided too early",
        text: "You seem sure about your career, but you may not know enough about yourself or other options yet. Make sure this choice really matches what you like and what you are good at.",
      },
    ],
  },
};

