// Standardized Psychometric Assessment Constants & Presets

export const FACET_GROUPS = [
  {
    group: "RIASEC Interests",
    color: "#2563eb",
    sectionCode: "interest",
    facets: [
      { code: "R", name: "Realistic", description: "Using tools, building/repairing things, working with hands, outdoor work" },
      { code: "I", name: "Investigative", description: "Solving scientific problems, analyzing data patterns, curiosity" },
      { code: "A", name: "Artistic", description: "Drawing, painting, craft, writing, singing, music, dance" },
      { code: "S", name: "Social", description: "Helping friends, teaching, group projects, volunteering, leading groups" },
      { code: "E", name: "Enterprising", description: "Taking the lead, convincing others, team decisions, starting projects" },
      { code: "C", name: "Conventional", description: "Organizing neatly, maintaining records, numerical tasks, careful attention" },
    ],
  },
  {
    group: "Big Five Personality",
    color: "#7c3aed",
    sectionCode: "personality",
    facets: [
      { code: "O", name: "Openness", description: "Exploring new ideas, trying unfamiliar activities, curiosity vs routine" },
      { code: "Cn", name: "Conscientiousness", description: "Completing tasks on time, staying organized, thorough diligence" },
      { code: "Ex", name: "Extraversion", description: "Being around others, social energy, sharing thoughts vs solitude" },
      { code: "Ag", name: "Agreeableness", description: "Kindness, cooperation, avoiding arguments, empathy for others" },
      { code: "ES", name: "Emotional Stability", description: "Calm under pressure, handling stress, resilience vs worrying" },
    ],
  },
  {
    group: "Work Values (Schwartz)",
    color: "#059669",
    sectionCode: "values",
    facets: [
      { code: "OC", name: "Openness to Change", description: "Trying challenging tasks, creative freedom, novelty, autonomy" },
      { code: "SE", name: "Self-Enhancement", description: "Achievement, recognition, leadership, setting goals, status" },
      { code: "CO", name: "Conservation", description: "Following rules, security, stability, predictability, order" },
      { code: "ST", name: "Self-Transcendence", description: "Helping others, fairness, protecting environment, benevolence" },
    ],
  },
  {
    group: "VARK Learning Style",
    color: "#d97706",
    sectionCode: "learning_style",
    facets: [
      { code: "V", name: "Visual", description: "Diagrams, pictures, flowcharts, maps, color highlighting" },
      { code: "A", name: "Auditory", description: "Verbal explanations, discussions, lectures, recordings, podcasts" },
      { code: "Rd", name: "Reading/Writing", description: "Taking notes, reading textbooks/articles, structured essays" },
      { code: "K", name: "Kinesthetic", description: "Practical activities, physical experiments, movement and trial" },
    ],
  },
  {
    group: "Goal Orientation",
    color: "#0891b2",
    sectionCode: "goal_orientation",
    facets: [
      { code: "L", name: "Long Path (Further Education)", description: "Advanced degrees, long-term educational investment, specialized studies" },
      { code: "S", name: "Short Path (Fast to Work)", description: "Entering workforce quickly, on-the-job training, immediate practical work" },
    ],
  },
  {
    group: "Aptitudes (Cognitive & Reasoning)",
    color: "#dc2626",
    sectionCode: "aptitude",
    facets: [
      { code: "Log", name: "Logical Reasoning", description: "Deductive, Venn diagrams, directions, coding patterns, family relations" },
      { code: "Voc", name: "Vocabulary & Language", description: "Sentence correction, speech form, passage analysis, grammar, synonyms" },
      { code: "Num", name: "Numerical Ability", description: "Profit/loss, speed-distance-time, simple interest, work rates, algebra" },
      { code: "Mech", name: "Mechanical Reasoning", description: "Gears, pulleys, levers, mechanical advantage, energy transformations" },
      { code: "Verb", name: "Verbal Reasoning", description: "Sentence restructuring, syllogisms, analogies, paragraph logic" },
      { code: "Spat", name: "Spatial Reasoning", description: "3D cube views, folding, rotation, painted cubes, geometric patterns" },
    ],
  },
];

export const ALL_FACETS = FACET_GROUPS.flatMap((group) =>
  group.facets.map((facet) => ({
    ...facet,
    groupName: group.group,
    groupColor: group.color,
    sectionCode: group.sectionCode,
  }))
);

export const FACET_MAP = ALL_FACETS.reduce((acc, facet) => {
  acc[facet.code] = facet;
  return acc;
}, {});

// ==========================================
// 21 FACET DEFINITION FOR CAREER CLUSTERS
// ==========================================
export const CAREER_CLUSTER_FACET_GROUPS = [
  {
    group: "Holland Interests (RIASEC)",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    sectionCode: "interest",
    facets: [
      { key: "R", code: "R", name: "Realistic", label: "Realistic (Doer)", description: "Hands-on tools, machinery, physical creation, and outdoor work" },
      { key: "I", code: "I", name: "Investigative", label: "Investigative (Thinker)", description: "Scientific research, data analysis, deep inquiry, and logic" },
      { key: "A", code: "A", name: "Artistic", label: "Artistic (Creator)", description: "Creative expression, design, writing, visual arts, and performance" },
      { key: "S", code: "S", name: "Social", label: "Social (Helper)", description: "Teaching, counseling, community service, caregiving, and mentoring" },
      { key: "E", code: "E", name: "Enterprising", label: "Enterprising (Leader)", description: "Persuasion, entrepreneurship, strategic leadership, and sales" },
      { key: "C", code: "C", name: "Conventional", label: "Conventional (Organizer)", description: "Record keeping, compliance, numerical precision, and orderly systems" },
    ],
  },
  {
    group: "Big Five Personality",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    sectionCode: "personality",
    facets: [
      { key: "O", code: "O", name: "Openness", label: "Openness", description: "Curiosity, openness to new paradigms, creative imagination" },
      { key: "Cn", code: "Cn", name: "Conscientiousness", label: "Conscientiousness", description: "Methodical discipline, reliability, goal persistence, and detail focus" },
      { key: "Ex", code: "Ex", name: "Extraversion", label: "Extraversion", description: "Sociability, assertiveness, outgoing energy, and team enthusiasm" },
      { key: "Ag", code: "Ag", name: "Agreeableness", label: "Agreeableness", description: "Cooperation, empathy, constructive harmony, and team trust" },
      { key: "ES", code: "ES", name: "Emotional Stability", label: "Emotional Stability", description: "Composure under pressure, resilience against stress, and calm focus" },
    ],
  },
  {
    group: "Work Values (Schwartz)",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    sectionCode: "values",
    facets: [
      { key: "OC", code: "OC", name: "Openness to Change", label: "Openness to Change", description: "Autonomy, variety, challenging innovation, and creative freedom" },
      { key: "SE", code: "SE", name: "Self-Enhancement", label: "Self-Enhancement", description: "Achievement, prestige, career progression, and recognition" },
      { key: "CO", code: "CO", name: "Conservation", label: "Conservation", description: "Organizational stability, clear standards, predictability, and security" },
      { key: "ST", code: "ST", name: "Self-Transcendence", label: "Self-Transcendence", description: "Social impact, ethical integrity, community benefit, and altruism" },
    ],
  },
  {
    group: "Aptitudes & Abilities",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    sectionCode: "aptitude",
    facets: [
      { key: "Mech", code: "Mech", name: "Mechanical Reasoning", label: "Mechanical Reasoning", description: "Physical machinery, gear dynamics, levers, and kinematic principles" },
      { key: "Log", code: "Log", name: "Logical Reasoning", label: "Logical Reasoning", description: "Deductive logic, pattern recognition, and systematic problem solving" },
      { key: "Verb", code: "Verb", name: "Verbal Reasoning", label: "Verbal Reasoning", description: "Text analysis, deductive rhetoric, and structured arguments" },
      { key: "Spat", code: "Spat", name: "Spatial Ability", label: "Spatial Ability", description: "3D geometry, visual rotation, mental modeling, and blueprint layout" },
      { key: "Num", code: "Num", name: "Numerical Ability", label: "Numerical Ability", description: "Mathematical formulation, quantitative metrics, and data analysis" },
      { key: "Voc", code: "Voc", name: "Vocabulary & Language", label: "Vocabulary & Language", description: "Language clarity, terminology precision, grammar, and syntax" },
    ],
  },
];

export const CAREER_CLUSTER_FACETS_LIST = CAREER_CLUSTER_FACET_GROUPS.flatMap((g) =>
  g.facets.map((f) => ({
    ...f,
    groupName: g.group,
    groupColor: g.color,
    groupBg: g.bg,
    groupBorder: g.border,
  }))
);

export const CAREER_CLUSTER_FACET_MAP = CAREER_CLUSTER_FACETS_LIST.reduce((acc, f) => {
  acc[f.code] = f;
  return acc;
}, {});

// Specific Facets by Section Code
export const SECTION_FACETS_MAP = {
  interest: FACET_GROUPS.find((g) => g.sectionCode === "interest")?.facets || [],
  personality: FACET_GROUPS.find((g) => g.sectionCode === "personality")?.facets || [],
  learning_style: FACET_GROUPS.find((g) => g.sectionCode === "learning_style")?.facets || [],
  values: FACET_GROUPS.find((g) => g.sectionCode === "values")?.facets || [],
  goal_orientation: FACET_GROUPS.find((g) => g.sectionCode === "goal_orientation")?.facets || [],
  aptitude: FACET_GROUPS.find((g) => g.sectionCode === "aptitude")?.facets || [],
};

export const getFacetsForSection = (sectionCode = "") => {
  const norm = (sectionCode || "").toLowerCase();
  if (norm.includes("interest") || norm.includes("riasec")) {
    return SECTION_FACETS_MAP.interest;
  }
  if (norm.includes("personality") || norm.includes("ocean")) {
    return SECTION_FACETS_MAP.personality;
  }
  if (norm.includes("learn") || norm.includes("vark")) {
    return SECTION_FACETS_MAP.learning_style;
  }
  if (norm.includes("value") || norm.includes("schwartz")) {
    return SECTION_FACETS_MAP.values;
  }
  if (norm.includes("goal")) {
    return SECTION_FACETS_MAP.goal_orientation;
  }
  if (norm.includes("aptitude")) {
    return SECTION_FACETS_MAP.aptitude;
  }
  return ALL_FACETS;
};

export const SECTION_CODE_PRESETS = [
  {
    code: "interest",
    title: "Your Interests",
    description: "RIASEC Career Interest Inventory evaluating 6 vocational domains.",
    badgeColor: "blue",
    defaultType: "likert5",
    itemPrefix: "INT",
  },
  {
    code: "personality",
    title: "Your Personality",
    description: "Big Five Personality Dimensions (OCEAN).",
    badgeColor: "purple",
    defaultType: "likert5",
    itemPrefix: "PER",
  },
  {
    code: "learning_style",
    title: "How You Learn Best",
    description: "VARK learning style preferences (Visual, Auditory, Reading/Writing, Kinesthetic).",
    badgeColor: "orange",
    defaultType: "likert5",
    itemPrefix: "LRN",
  },
  {
    code: "values",
    title: "What You Value",
    description: "Work values and motivational drivers (Schwartz Model).",
    badgeColor: "green",
    defaultType: "likert5",
    itemPrefix: "VAL",
  },
  {
    code: "goal_orientation",
    title: "Your Goal Orientation",
    description: "Long term educational path vs short term fast to work orientation.",
    badgeColor: "cyan",
    defaultType: "likert5",
    itemPrefix: "GOL",
  },
  {
    code: "aptitude",
    title: "Aptitude Challenge",
    description: "Timed multiple choice questions across Logical, Numerical, Mechanical, Verbal, and Spatial reasoning.",
    badgeColor: "red",
    defaultType: "mcq",
    itemPrefix: "APT",
  },
];

export const LIKERT5_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral / Unsure" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export const slugify = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const generateItemId = (sectionCode = "interest", facetCode = "R", existingCount = 1) => {
  const normSec = (sectionCode || "").toLowerCase();
  let prefix = "INT";
  if (normSec.includes("personality")) prefix = "PER";
  else if (normSec.includes("learn") || normSec.includes("vark")) prefix = "LRN";
  else if (normSec.includes("value")) prefix = "VAL";
  else if (normSec.includes("goal")) prefix = "GOL";
  else if (normSec.includes("aptitude")) prefix = "APT";
  else prefix = (facetCode || "ITM").toUpperCase().slice(0, 3);

  const num = String(existingCount).padStart(2, "0");
  return `${prefix}${num}`;
};

export const getStatusBadgeConfig = (status) => {
  switch (status?.toLowerCase()) {
    case "published":
      return { color: "success", text: "Published", bg: "#ecfdf5", border: "#a7f3d0", textCol: "#065f46" };
    case "draft":
      return { color: "warning", text: "Draft", bg: "#fffbeb", border: "#fde68a", textCol: "#92400e" };
    case "archived":
      return { color: "default", text: "Archived", bg: "#f3f4f6", border: "#e5e7eb", textCol: "#4b5563" };
    default:
      return { color: "default", text: status || "Draft", bg: "#f3f4f6", border: "#e5e7eb", textCol: "#4b5563" };
  }
};

export const getSectionBadgeConfig = (code) => {
  const normalized = (code || "").toLowerCase();
  if (normalized.includes("interest") || normalized.includes("riasec")) {
    return { bg: "#eff6ff", border: "#bfdbfe", textCol: "#1d4ed8", label: "Interest (RIASEC)" };
  }
  if (normalized.includes("personality") || normalized.includes("ocean")) {
    return { bg: "#f5f3ff", border: "#ddd6fe", textCol: "#6d28d9", label: "Personality (OCEAN)" };
  }
  if (normalized.includes("value") || normalized.includes("schwartz")) {
    return { bg: "#ecfdf5", border: "#a7f3d0", textCol: "#047857", label: "Work Values" };
  }
  if (normalized.includes("learn") || normalized.includes("vark")) {
    return { bg: "#fffbeb", border: "#fde68a", textCol: "#b45309", label: "Learning Style (VARK)" };
  }
  if (normalized.includes("aptitude")) {
    return { bg: "#fef2f2", border: "#fecaca", textCol: "#b91c1c", label: "Aptitude (MCQ)" };
  }
  if (normalized.includes("goal")) {
    return { bg: "#ecfeff", border: "#a5f3fc", textCol: "#0e7490", label: "Goal Orientation" };
  }
  return { bg: "#f8fafc", border: "#e2e8f0", textCol: "#475569", label: code || "Custom Section" };
};

// ==========================================
// 🔄 UNIVERSAL RESPONSE NORMALIZERS
// ==========================================

export const normalizeSectionsResponse = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.sections)) return res.data.sections;
  if (Array.isArray(res?.sections)) return res.sections;
  if (Array.isArray(res?.data?.rows)) return res.data.rows;
  return [];
};

export const normalizeAssessmentsResponse = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.assessments)) return res.data.assessments;
  if (Array.isArray(res?.assessments)) return res.assessments;
  if (Array.isArray(res?.data?.rows)) return res.data.rows;
  return [];
};

export const normalizeQuestionsResponse = (res, sectionsList = []) => {
  let list = [];
  if (Array.isArray(res)) list = res;
  else if (Array.isArray(res?.data)) list = res.data;
  else if (Array.isArray(res?.data?.questions)) list = res.data.questions;
  else if (Array.isArray(res?.questions)) list = res.questions;
  else if (Array.isArray(res?.data?.rows)) list = res.data.rows;
  else if (Array.isArray(res?.rows)) list = res.rows;
  else if (Array.isArray(res?.data?.items)) list = res.data.items;
  else if (Array.isArray(res?.items)) list = res.items;
  else if (Array.isArray(res?.data?.data)) list = res.data.data;

  // If questions are not returned directly as a flat list, extract embedded questions from sections
  if (list.length === 0 && Array.isArray(sectionsList) && sectionsList.length > 0) {
    sectionsList.forEach((sec) => {
      if (Array.isArray(sec.questions)) {
        sec.questions.forEach((q) => {
          list.push({
            ...q,
            sectionId: q.sectionId || q.section_id || sec.id,
            sectionCode: sec.code,
            sectionTitle: sec.title,
            assessmentId: sec.assessmentId || sec.assessment?.id,
            assessmentTitle: sec.assessment?.title,
          });
        });
      }
    });
  }

  // Normalize each item to ensure consistent property names across backend versions
  return list.map((q, idx) => {
    const secId = q.sectionId ?? q.section_id ?? q.section?.id;
    const sec = Array.isArray(sectionsList)
      ? sectionsList.find((s) => String(s.id) === String(secId))
      : null;

    return {
      ...q,
      id: q.id ?? q._id ?? `q-${idx + 1}`,
      sectionId: secId ?? sec?.id,
      sectionCode: q.sectionCode || q.section?.code || sec?.code,
      sectionTitle: q.sectionTitle || q.section?.title || sec?.title,
      assessmentId:
        q.assessmentId ??
        q.assessment_id ??
        q.section?.assessmentId ??
        q.section?.assessment?.id ??
        sec?.assessmentId,
      assessmentTitle:
        q.assessmentTitle || q.section?.assessment?.title || sec?.assessmentTitle,
      itemId: q.itemId || q.item_id || q.itemCode || q.code || `ITM_${q.id ?? idx + 1}`,
      text: q.text || q.question || q.prompt || q.questionText || q.question_text || "",
      type: q.type || (sec?.code === "aptitude" ? "mcq" : "likert5"),
      facet: q.facet || "R",
      reverse: Boolean(q.reverse ?? q.isReverse ?? q.is_reverse ?? false),
      order: Number(q.order ?? q.sortOrder ?? q.sort_order ?? idx + 1),
      image: q.image || q.imageUrl || q.image_url || null,
      note: q.note || q.explanation || q.rubric || null,
      options: Array.isArray(q.options)
        ? q.options.map((opt, optIdx) => ({
            id: opt.id ?? opt._id ?? optIdx,
            optionText: opt.optionText || opt.option_text || opt.text || "",
            optionIndex: opt.optionIndex ?? opt.option_index ?? optIdx,
            isCorrect: Boolean(opt.isCorrect ?? opt.is_correct),
            image: opt.image || opt.imageUrl || opt.image_url || null,
          }))
        : [],
    };
  });
};

// Seed Assessment
export const INITIAL_ASSESSMENTS = [
  {
    id: 1,
    title: "Career Compass Test",
    slug: "career-compass-test",
    description: "Complete holistic psychometric profile combining RIASEC Interest, Big Five Personality, Work Values, VARK learning preferences, Goal orientation, and Cognitive Aptitudes.",
    version: "2.0",
    status: "published",
    sectionCount: 6,
    questionCount: 163,
    attemptCount: 142,
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-09-12T14:30:00.000Z",
  },
];

// Seed Sections matching live backend structure
export const INITIAL_SECTIONS = [
  {
    id: 1,
    assessmentId: 1,
    code: "interest",
    title: "Your Interests",
    description: "RIASEC interests",
    order: 1,
    _count: { questions: 30 },
    questionCount: 30,
  },
  {
    id: 2,
    assessmentId: 1,
    code: "personality",
    title: "Your Personality",
    description: "OCEAN personality",
    order: 2,
    _count: { questions: 30 },
    questionCount: 30,
  },
  {
    id: 3,
    assessmentId: 1,
    code: "learning_style",
    title: "How You Learn Best",
    description: "VARK learning style",
    order: 3,
    _count: { questions: 20 },
    questionCount: 20,
  },
  {
    id: 4,
    assessmentId: 1,
    code: "values",
    title: "What You Value",
    description: "Work values",
    order: 4,
    _count: { questions: 37 },
    questionCount: 37,
  },
  {
    id: 5,
    assessmentId: 1,
    code: "goal_orientation",
    title: "Your Goal Orientation",
    description: "Long term vs short term",
    order: 5,
    _count: { questions: 7 },
    questionCount: 7,
  },
  {
    id: 6,
    assessmentId: 1,
    code: "aptitude",
    title: "Aptitude Challenge",
    description: "Reasoning assessment",
    order: 6,
    _count: { questions: 39 },
    questionCount: 39,
  },
];

// Fallback initial questions
export const INITIAL_QUESTIONS = [
  {
    id: 1,
    sectionId: 1,
    itemId: "INT01",
    text: "Using tools to build or fix things.",
    type: "likert5",
    facet: "R",
    reverse: false,
    image: null,
    note: null,
    order: 1,
    options: [],
  },
  {
    id: 2,
    sectionId: 1,
    itemId: "INT02",
    text: "Doing activities that involve working with my hands.",
    type: "likert5",
    facet: "R",
    reverse: false,
    image: null,
    note: null,
    order: 2,
    options: [],
  },
  {
    id: 31,
    sectionId: 2,
    itemId: "PER01",
    text: "I enjoy exploring new ideas and learning about different subjects.",
    type: "likert5",
    facet: "O",
    reverse: false,
    image: null,
    note: null,
    order: 1,
    options: [],
  },
  {
    id: 33,
    sectionId: 2,
    itemId: "PER03",
    text: "I avoid doing things that are unfamiliar or new to me.",
    type: "likert5",
    facet: "O",
    reverse: true,
    image: null,
    note: "Reverse scored Openness item",
    order: 3,
    options: [],
  },
  {
    id: 125,
    sectionId: 6,
    itemId: "APT01",
    text: "In a class of 30 students, 20 have taken Mathematics, 15 have taken Physics, and 10 have taken both. How many students have taken neither Mathematics nor Physics?",
    type: "mcq",
    facet: "Log",
    reverse: false,
    image: null,
    note: "Venn diagram intersection logic",
    order: 1,
    options: [
      { id: 1, optionText: "5", optionIndex: 0, isCorrect: true },
      { id: 2, optionText: "10", optionIndex: 1, isCorrect: false },
      { id: 3, optionText: "20", optionIndex: 2, isCorrect: false },
      { id: 4, optionText: "None of the above", optionIndex: 3, isCorrect: false },
    ],
  },
  {
    id: 127,
    sectionId: 6,
    itemId: "APT03",
    text: "If TRAIN is coded as WUDLQ, how will PLANE be coded?",
    type: "mcq",
    facet: "Log",
    reverse: false,
    image: null,
    note: "Shift cipher logic (+3 letters: P->S, L->O, A->D, N->Q, E->H = SODQH)",
    order: 2,
    options: [
      { id: 5, optionText: "SMDQH", optionIndex: 0, isCorrect: false },
      { id: 6, optionText: "SMDOF", optionIndex: 1, isCorrect: false },
      { id: 7, optionText: "SODQH", optionIndex: 2, isCorrect: true },
      { id: 8, optionText: "SODMH", optionIndex: 3, isCorrect: false },
    ],
  },
];

// Fallback seed career clusters with 21 domain weights (0 to 3 scale)
export const INITIAL_CAREER_CLUSTERS = [
  {
    id: "cluster-1",
    name: "Agriculture, Food & Natural Resources",
    code: "AGR",
    hollandCode: "RIA",
    description: "Agricultural science, animal husbandry, environmental stewardship, forestry, and sustainable agribusiness management.",
    weights: [
      { facet: "R", weight: 3 }, { facet: "I", weight: 2 }, { facet: "A", weight: 1 }, { facet: "S", weight: 1 }, { facet: "E", weight: 2 }, { facet: "C", weight: 2 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 1 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 2 }, { facet: "SE", weight: 1 }, { facet: "CO", weight: 3 }, { facet: "ST", weight: 3 },
      { facet: "Mech", weight: 3 }, { facet: "Log", weight: 2 }, { facet: "Verb", weight: 1 }, { facet: "Spat", weight: 2 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 1 },
    ],
  },
  {
    id: "cluster-2",
    name: "Architecture & Construction",
    code: "ARC_CON",
    hollandCode: "RIC",
    description: "Designing, planning, managing, building, and maintaining structural frameworks, civil works, and architectural spaces.",
    weights: [
      { facet: "R", weight: 3 }, { facet: "I", weight: 2 }, { facet: "A", weight: 2 }, { facet: "S", weight: 1 }, { facet: "E", weight: 1 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 1 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 2 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 1 },
      { facet: "Mech", weight: 3 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 1 }, { facet: "Spat", weight: 3 }, { facet: "Num", weight: 3 }, { facet: "Voc", weight: 1 },
    ],
  },
  {
    id: "cluster-3",
    name: "Arts, Audio/Video & Communications",
    code: "ARTS_COMM",
    hollandCode: "AES",
    description: "Visual design, multimedia production, performing arts, audio/video engineering, animation, and creative storytelling.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 2 }, { facet: "A", weight: 3 }, { facet: "S", weight: 2 }, { facet: "E", weight: 2 }, { facet: "C", weight: 1 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 2 }, { facet: "Ex", weight: 2 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 3 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 1 }, { facet: "ST", weight: 2 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 2 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 3 }, { facet: "Num", weight: 1 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-4",
    name: "Business Management & Administration",
    code: "BUS_MGMT",
    hollandCode: "ECS",
    description: "Corporate leadership, strategic operations, personnel management, project leadership, and organizational administration.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 2 }, { facet: "A", weight: 1 }, { facet: "S", weight: 2 }, { facet: "E", weight: 3 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 3 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 2 }, { facet: "SE", weight: 3 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 1 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 1 }, { facet: "Num", weight: 3 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-5",
    name: "Education & Training",
    code: "EDU_TRN",
    hollandCode: "SAE",
    description: "Instruction, academic curriculum design, educational leadership, instructional technology, and vocational training.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 2 }, { facet: "A", weight: 2 }, { facet: "S", weight: 3 }, { facet: "E", weight: 2 }, { facet: "C", weight: 2 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 3 }, { facet: "Ag", weight: 3 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 2 }, { facet: "SE", weight: 1 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 3 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 2 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 1 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-6",
    name: "Finance, Investment & Banking",
    code: "FIN_BNK",
    hollandCode: "CEI",
    description: "Financial modeling, commercial banking, investment securities, wealth advisory, auditing, and corporate accounting.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 3 }, { facet: "A", weight: 1 }, { facet: "S", weight: 1 }, { facet: "E", weight: 2 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 2 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 2 }, { facet: "SE", weight: 3 }, { facet: "CO", weight: 3 }, { facet: "ST", weight: 1 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 2 }, { facet: "Spat", weight: 1 }, { facet: "Num", weight: 3 }, { facet: "Voc", weight: 2 },
    ],
  },
  {
    id: "cluster-7",
    name: "Government & Public Administration",
    code: "GOV_PUB",
    hollandCode: "CES",
    description: "Public policy analysis, civil governance, urban planning, diplomatic affairs, revenue management, and public administration.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 2 }, { facet: "A", weight: 1 }, { facet: "S", weight: 2 }, { facet: "E", weight: 2 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 2 }, { facet: "Ag", weight: 3 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 1 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 3 }, { facet: "ST", weight: 3 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 1 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-8",
    name: "Health Science & Clinical Care",
    code: "HLT_SCI",
    hollandCode: "ISR",
    description: "Medical practice, clinical diagnostics, therapeutics, nursing, pharmacology, surgical assistance, and biotechnology.",
    weights: [
      { facet: "R", weight: 2 }, { facet: "I", weight: 3 }, { facet: "A", weight: 1 }, { facet: "S", weight: 3 }, { facet: "E", weight: 1 }, { facet: "C", weight: 2 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 2 }, { facet: "Ag", weight: 3 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 2 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 3 },
      { facet: "Mech", weight: 2 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 2 }, { facet: "Spat", weight: 2 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-9",
    name: "Hospitality & Tourism",
    code: "HSP_TRM",
    hollandCode: "ESR",
    description: "Hotel and resort operations, culinary arts, travel experience design, guest relations, and international tourism.",
    weights: [
      { facet: "R", weight: 2 }, { facet: "I", weight: 1 }, { facet: "A", weight: 2 }, { facet: "S", weight: 3 }, { facet: "E", weight: 3 }, { facet: "C", weight: 2 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 2 }, { facet: "Ex", weight: 3 }, { facet: "Ag", weight: 3 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 3 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 1 }, { facet: "ST", weight: 2 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 1 }, { facet: "Verb", weight: 2 }, { facet: "Spat", weight: 1 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 2 },
    ],
  },
  {
    id: "cluster-10",
    name: "Human Services & Counseling",
    code: "HUM_SRV",
    hollandCode: "SEC",
    description: "Clinical psychotherapy, family social work, rehabilitation, child development, and community welfare counseling.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 2 }, { facet: "A", weight: 2 }, { facet: "S", weight: 3 }, { facet: "E", weight: 2 }, { facet: "C", weight: 2 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 2 }, { facet: "Ag", weight: 3 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 2 }, { facet: "SE", weight: 1 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 3 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 2 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 1 }, { facet: "Num", weight: 1 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-11",
    name: "Information Technology & Computing",
    code: "IT_COMP",
    hollandCode: "ICR",
    description: "Software engineering, cloud infrastructure, AI/ML models, cybersecurity systems, and distributed database networks.",
    weights: [
      { facet: "R", weight: 2 }, { facet: "I", weight: 3 }, { facet: "A", weight: 1 }, { facet: "S", weight: 1 }, { facet: "E", weight: 2 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 1 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 3 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 1 },
      { facet: "Mech", weight: 2 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 2 }, { facet: "Spat", weight: 2 }, { facet: "Num", weight: 3 }, { facet: "Voc", weight: 2 },
    ],
  },
  {
    id: "cluster-12",
    name: "Law, Public Safety & Security",
    code: "LAW_SEC",
    hollandCode: "ESC",
    description: "Judicial litigation, law enforcement, corporate compliance, forensic investigation, and emergency emergency services.",
    weights: [
      { facet: "R", weight: 2 }, { facet: "I", weight: 2 }, { facet: "A", weight: 1 }, { facet: "S", weight: 2 }, { facet: "E", weight: 3 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 2 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 2 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 1 }, { facet: "SE", weight: 3 }, { facet: "CO", weight: 3 }, { facet: "ST", weight: 2 },
      { facet: "Mech", weight: 2 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 1 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-13",
    name: "Manufacturing & Industrial Production",
    code: "MFG_PRD",
    hollandCode: "RCI",
    description: "Precision manufacturing, automated assembly, industrial quality assurance, robotics maintenance, and CNC tooling.",
    weights: [
      { facet: "R", weight: 3 }, { facet: "I", weight: 2 }, { facet: "A", weight: 1 }, { facet: "S", weight: 1 }, { facet: "E", weight: 1 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 1 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 1 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 1 }, { facet: "SE", weight: 1 }, { facet: "CO", weight: 3 }, { facet: "ST", weight: 1 },
      { facet: "Mech", weight: 3 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 1 }, { facet: "Spat", weight: 3 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 1 },
    ],
  },
  {
    id: "cluster-14",
    name: "Marketing, Sales & Brand Strategy",
    code: "MKT_SLS",
    hollandCode: "EAS",
    description: "Consumer behavior analytics, performance marketing, direct B2B sales, brand strategy, and media advertising.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 2 }, { facet: "A", weight: 3 }, { facet: "S", weight: 2 }, { facet: "E", weight: 3 }, { facet: "C", weight: 2 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 2 }, { facet: "Ex", weight: 3 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 3 }, { facet: "SE", weight: 3 }, { facet: "CO", weight: 1 }, { facet: "ST", weight: 1 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 2 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 2 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 3 },
    ],
  },
  {
    id: "cluster-15",
    name: "Science, Technology, Engineering & Math",
    code: "STEM_ENG",
    hollandCode: "IRC",
    description: "Scientific hypothesis testing, mechanical & electrical engineering, advanced algorithmic research, and applied physics.",
    weights: [
      { facet: "R", weight: 3 }, { facet: "I", weight: 3 }, { facet: "A", weight: 1 }, { facet: "S", weight: 1 }, { facet: "E", weight: 2 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 1 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 3 },
      { facet: "OC", weight: 3 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 2 },
      { facet: "Mech", weight: 3 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 2 }, { facet: "Spat", weight: 3 }, { facet: "Num", weight: 3 }, { facet: "Voc", weight: 2 },
    ],
  },
  {
    id: "cluster-16",
    name: "Transportation, Distribution & Logistics",
    code: "TRN_LOG",
    hollandCode: "RCE",
    description: "Global supply chain optimization, freight navigation, commercial transport dispatch, warehousing, and inventory fulfillment.",
    weights: [
      { facet: "R", weight: 3 }, { facet: "I", weight: 2 }, { facet: "A", weight: 1 }, { facet: "S", weight: 1 }, { facet: "E", weight: 2 }, { facet: "C", weight: 3 },
      { facet: "O", weight: 1 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 2 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 1 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 3 }, { facet: "ST", weight: 1 },
      { facet: "Mech", weight: 3 }, { facet: "Log", weight: 2 }, { facet: "Verb", weight: 1 }, { facet: "Spat", weight: 3 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 1 },
    ],
  },
  {
    id: "cluster-17",
    name: "Environmental Sciences & Renewable Energy",
    code: "ENV_ENG",
    hollandCode: "IRS",
    description: "Solar/wind power systems, environmental ecology, climate impact mitigation, ecological conservation, and clean tech innovation.",
    weights: [
      { facet: "R", weight: 3 }, { facet: "I", weight: 3 }, { facet: "A", weight: 1 }, { facet: "S", weight: 2 }, { facet: "E", weight: 1 }, { facet: "C", weight: 2 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 3 }, { facet: "Ex", weight: 1 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 3 }, { facet: "SE", weight: 1 }, { facet: "CO", weight: 2 }, { facet: "ST", weight: 3 },
      { facet: "Mech", weight: 3 }, { facet: "Log", weight: 3 }, { facet: "Verb", weight: 2 }, { facet: "Spat", weight: 2 }, { facet: "Num", weight: 2 }, { facet: "Voc", weight: 2 },
    ],
  },
  {
    id: "cluster-18",
    name: "Media, Journalism & Digital Content",
    code: "MED_JRN",
    hollandCode: "ASE",
    description: "Investigative reporting, digital news publishing, podcast production, broadcast communications, and media ethics.",
    weights: [
      { facet: "R", weight: 1 }, { facet: "I", weight: 3 }, { facet: "A", weight: 3 }, { facet: "S", weight: 2 }, { facet: "E", weight: 2 }, { facet: "C", weight: 1 },
      { facet: "O", weight: 3 }, { facet: "Cn", weight: 2 }, { facet: "Ex", weight: 3 }, { facet: "Ag", weight: 2 }, { facet: "ES", weight: 2 },
      { facet: "OC", weight: 3 }, { facet: "SE", weight: 2 }, { facet: "CO", weight: 1 }, { facet: "ST", weight: 3 },
      { facet: "Mech", weight: 1 }, { facet: "Log", weight: 2 }, { facet: "Verb", weight: 3 }, { facet: "Spat", weight: 2 }, { facet: "Num", weight: 1 }, { facet: "Voc", weight: 3 },
    ],
  },
];

// Fallback seed candidate test attempts
export const INITIAL_STUDENT_ATTEMPTS = [
  {
    id: "att-101",
    studentId: "stu-1",
    studentName: "Aarav Sharma",
    studentEmail: "aarav.sharma@example.com",
    assessmentId: 1,
    assessmentTitle: "Career Compass Test",
    hollandCode: "RIC",
    topClusterName: "Engineering, Robotics & Advanced Tech",
    fitScore: 94.2,
    status: "completed",
    startedAt: "2026-09-14T09:15:00.000Z",
    completedAt: "2026-09-14T10:02:00.000Z",
    domainScores: {
      riasec: { R: 4.8, I: 4.6, A: 2.1, S: 2.4, E: 3.2, C: 4.1 },
      ocean: { O: 4.2, Cn: 4.7, Ex: 2.8, Ag: 3.6, ES: 4.5 },
      aptitude: { total: 10, correct: 9, accuracyPercent: 90 },
      vark: { V: 4.5, A: 2.6, Rd: 4.2, K: 4.0 },
      values: { OC: 4.1, SE: 3.2, CO: 4.3, ST: 2.9 },
    },
    clusterRecommendations: [
      { clusterName: "Engineering, Robotics & Advanced Tech", code: "ENG_TECH", matchPercent: 94.2 },
      { clusterName: "Data Science & Computational Intelligence", code: "DATA_AI", matchPercent: 91.5 },
      { clusterName: "Healthcare & Biomedical Technology", code: "HEALTH_SCI", matchPercent: 82.0 },
    ],
    responses: [
      { itemId: "INT01", prompt: "Using tools to build or fix things.", type: "likert5", selected: 5, score: 5, isReverse: false },
      { itemId: "INT02", prompt: "Doing activities that involve working with my hands.", type: "likert5", selected: 5, score: 5, isReverse: false },
      { itemId: "PER01", prompt: "I enjoy exploring new ideas and learning about different subjects.", type: "likert5", selected: 5, score: 5, isReverse: false },
      { itemId: "APT01", prompt: "In a class of 30 students, 20 have taken Mathematics, 15 have taken Physics...", type: "mcq", selected: "5", correct: "5", isCorrect: true, score: 1 },
      { itemId: "APT03", prompt: "If TRAIN is coded as WUDLQ, how will PLANE be coded?", type: "mcq", selected: "SODQH", correct: "SODQH", isCorrect: true, score: 1 },
    ],
  },
  {
    id: "att-102",
    studentId: "stu-2",
    studentName: "Ananya Iyer",
    studentEmail: "ananya.iyer@example.com",
    assessmentId: 1,
    assessmentTitle: "Career Compass Test",
    hollandCode: "AES",
    topClusterName: "Digital Arts, UI/UX & Creative Media",
    fitScore: 91.8,
    status: "completed",
    startedAt: "2026-09-15T11:00:00.000Z",
    completedAt: "2026-09-15T11:45:00.000Z",
    domainScores: {
      riasec: { R: 1.8, I: 3.4, A: 4.9, S: 4.3, E: 4.1, C: 2.2 },
      ocean: { O: 4.9, Cn: 3.8, Ex: 4.3, Ag: 4.5, ES: 3.9 },
      aptitude: { total: 10, correct: 8, accuracyPercent: 80 },
      vark: { V: 4.9, A: 3.2, Rd: 3.5, K: 3.8 },
      values: { OC: 4.8, SE: 4.1, CO: 2.3, ST: 4.2 },
    },
    clusterRecommendations: [
      { clusterName: "Digital Arts, UI/UX & Creative Media", code: "ARTS_COMM", matchPercent: 91.8 },
      { clusterName: "Product Management & Human-Centered Design", code: "PROD_MGMT", matchPercent: 86.4 },
      { clusterName: "Marketing, Brand Strategy & PR", code: "BUS_FIN", matchPercent: 81.0 },
    ],
    responses: [
      { itemId: "INT01", prompt: "Using tools to build or fix things.", type: "likert5", selected: 2, score: 2, isReverse: false },
      { itemId: "PER01", prompt: "I enjoy exploring new ideas and learning about different subjects.", type: "likert5", selected: 5, score: 5, isReverse: false },
      { itemId: "APT01", prompt: "In a class of 30 students...", type: "mcq", selected: "5", correct: "5", isCorrect: true, score: 1 },
    ],
  },
];
