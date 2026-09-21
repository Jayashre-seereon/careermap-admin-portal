// Comprehensive Career Compass Data Constants & Scoring Helpers

export function pct(val) {
  if (val == null) return 0;
  if (typeof val === "object") {
    if (val.percentage != null) return Math.round(val.percentage);
    if (val.percent != null) return Math.round(val.percent);
    if (val.score != null) {
      const s = Number(val.score);
      return s <= 5 ? Math.round((s / 5) * 100) : Math.round(s);
    }
  }
  const num = Number(val);
  if (isNaN(num)) return 0;
  if (num <= 5 && num > 0) return Math.round((num / 5) * 100);
  return Math.round(num);
}

export function band(scoreOrPct) {
  const p = pct(scoreOrPct);
  if (p >= 70) return "HIGH";
  if (p >= 40) return "MODERATE";
  return "LOW";
}

export const INTERP = {
  riasec: {
    R: { name: "Realistic", tag: "The Doer", desc: "Action-oriented, practical, hands-on, prefers working with tools, machinery, and tangible objects." },
    I: { name: "Investigative", tag: "The Thinker", desc: "Curious, analytical, intellectual, loves solving complex puzzles, research, and scientific inquiry." },
    A: { name: "Artistic", tag: "The Creator", desc: "Creative, expressive, original, values imagination, design, aesthetics, and unstructured self-expression." },
    S: { name: "Social", tag: "The Helper", desc: "Empathetic, cooperative, friendly, dedicated to teaching, counseling, caregiving, and empowering others." },
    E: { name: "Enterprising", tag: "The Persuader", desc: "Confident, energetic, ambitious, thrives in leadership, public speaking, entrepreneurship, and persuasion." },
    C: { name: "Conventional", tag: "The Organizer", desc: "Organized, systematic, reliable, detail-oriented, excels in data management, records, and procedural accuracy." },
  },
  ocean: {
    O: { name: "Openness", desc: "Curiosity, appreciation for art, emotion, adventure, unusual ideas, imagination, and variety of experience." },
    Cn: { name: "Conscientiousness", desc: "Tendency to display self-discipline, act dutifully, and strive for achievement against measures or outside expectations." },
    Ex: { name: "Extraversion", desc: "Energy, positive emotions, urgency, assertiveness, sociability and the tendency to seek stimulation in the company of others." },
    Ag: { name: "Agreeableness", desc: "Tendency to be compassionate and cooperative rather than suspicious and antagonistic towards others." },
    ES: { name: "Emotional Stability", desc: "Ability to remain calm, balanced, and resilient under stressful and pressurized conditions." },
  },
  vark: {
    V: { name: "Visual", desc: "Preference for graphical, symbolic representations, diagrams, charts, color codes, and mind maps." },
    A: { name: "Auditory", desc: "Preference for spoken word, lectures, discussions, storytelling, podcasts, and debating concepts aloud." },
    Rd: { name: "Reading/Writing", desc: "Preference for text-based input and output, reading books, note taking, essay writing, and lists." },
    K: { name: "Kinesthetic", desc: "Preference for hands-on experience, physical simulation, experiments, field trips, and tactile practice." },
  },
  values: {
    OC: { name: "Openness to Change", desc: "Driven by autonomy, creative innovation, intellectual exploration, and novelty." },
    SE: { name: "Self-Enhancement", desc: "Driven by ambition, social status, tangible achievement, career growth ladders, and influence." },
    ST: { name: "Self-Transcendence", desc: "Driven by societal benevolence, fairness, ecological protection, and positive human impact." },
    CO: { name: "Conservation", desc: "Driven by structure, stability, traditions, security, and proven standard operating procedures." },
  },
  aptitudes: {
    Num: { name: "Numerical", desc: "Comfort with mathematical formulation, arithmetic logic, statistical calculation, and quantitative reasoning." },
    Log: { name: "Logical", desc: "Deductive logic, syllogistic reasoning, pattern discovery, and systemic problem decomposition." },
    Verb: { name: "Verbal", desc: "Text comprehension, nuanced linguistic rhetoric, grammatical structuring, and argument articulation." },
    Voc: { name: "Vocabulary", desc: "Breadth of word mastery, lexical precision, semantic differentiation, and language fluency." },
    Mech: { name: "Mechanical", desc: "Physical systems, kinematic advantage, gear ratios, pulleys, levers, and machine diagnostics." },
    Spat: { name: "Spatial", desc: "3D mental rotation, architectural blueprint visualization, geometric patterns, and spatial manipulation." },
  },
};

export const CLUSTERS = [
  {
    cluster_id: "BIZ",
    code: "BIZ",
    name: "Business & Entrepreneurship",
    matchPercentage: 67,
    description: "Careers that build and run organisations — marketing, sales, operations, HR, startups and entrepreneurship.",
    why_fit: "You like leading, persuading and organising people and resources, and you're energised by goals, competition and building something of your own.",
    streams_and_pathways_india: "Commerce or any stream. Pathways: BBA (IPMAT/CUET), B.Com, entrepreneurship cells & competitions in school/college, MBA later.",
    careers: [
      "Marketing Manager",
      "Operations Manager",
      "Sales Manager",
      "Supply Chain Manager",
      "E-commerce Manager",
      "Retail Manager",
      "Office Administrator/HR Admin",
      "Business Analyst",
      "Import-Export Manager",
      "Human Resource (HR) Manager",
    ],
  },
  {
    cluster_id: "HSP",
    code: "HSP",
    name: "Hospitality & Tourism",
    matchPercentage: 65,
    description: "Careers that create great experiences for guests — hotels, food, travel, aviation service and events. You're energetic with people, gracious under pressure, and you enjoy organising experiences others will remember.",
    why_fit: "You're energetic with people, gracious under pressure, and you enjoy organising experiences others will remember.",
    streams_and_pathways_india: "Any stream. Pathways: NCHM JEE for hotel management, culinary institutes, aviation/cabin crew training after Class 12, event management degrees.",
    careers: [
      "Hotel/Resort Manager",
      "Tour/Travel Consultant",
      "Baker",
      "Human Resource (HR) Manager",
      "Bartender",
      "Butler",
      "Cabin Crew (Air Hostess/Flight Steward)",
      "Tour Guide",
      "Cruise Manager",
      "Front Office/Guest Relations/Housekeeping Manager",
      "Restaurant/Cloud Kitchen /Catering Manager",
    ],
  },
  {
    cluster_id: "SPT",
    code: "SPT",
    name: "Sports & Athletics",
    matchPercentage: 65,
    description: "Careers in and around the game — playing, coaching, sports science, analysis and sports media. You're physically driven and competitive, you train with discipline, and you perform best when the pressure is highest.",
    why_fit: "You're physically driven and competitive, you train with discipline, and you perform best when the pressure is highest.",
    streams_and_pathways_india: "Any stream. Pathways: sports quotas and academies, B.P.Ed / physical education, sports science degrees, SAI schemes; for sports media/analytics combine with mass comm or data skills.",
    careers: [
      "Professional Athlete & Coach",
      "Professional Player",
      "Sports Nutritionist",
      "Physical Education Teacher",
      "Sports Physiotherapist",
      "Armed Forces Sports Instructor",
      "Sports Psychologist",
      "Umpire",
      "Referee",
      "Sports Coach/Trainer",
    ],
  },
  {
    cluster_id: "GOV",
    code: "GOV",
    name: "Government, Law & Public Policy",
    matchPercentage: 63,
    description: "Careers that run the country and uphold the law — civil services, law, judiciary, policy and regulation. You're disciplined and dutiful, strong in language and reasoning, and you respect systems — with the ambition to serve and lead within them.",
    why_fit: "You're disciplined and dutiful, strong in language and reasoning, and you respect systems — with the ambition to serve and lead within them.",
    streams_and_pathways_india: "Any stream. Pathways: CLAT / AILET for 5-year integrated law (BA LLB / BBA LLB), UPSC Civil Services Examination after graduation in any discipline.",
    careers: [
      "Rural Development Officer",
      "Banker",
      "BMC Officer",
      "Passport Officer",
      "BDO",
      "Tahasildar",
      "Food Safety Officer",
      "DEO",
      "Cyber Crime Officer",
      "Civil Servant (IAS, IPS, IFS) / Bureaucrat",
    ],
  },
  {
    cluster_id: "PSF",
    code: "PSF",
    name: "Personal Services & Freelance",
    matchPercentage: 62,
    description: "Careers built on personal skill and client relationships — fitness, styling, coaching, wellness, freelancing. You connect easily one-on-one, you have a sense of style or wellbeing you love sharing, and independence matters to you.",
    why_fit: "You connect easily one-on-one, you have a sense of style or wellbeing you love sharing, and independence matters to you.",
    streams_and_pathways_india: "Any stream. Pathways: certified courses (fitness, cosmetology, yoga — e.g., YCB), apprenticeships with professionals, building a client portfolio early.",
    careers: [
      "Fashion Stylist",
      "Image Consultant",
      "Life Coach",
      "Fitness/Personal Trainer",
      "Yoga/Zumba/Aerobics Instructor",
      "Nutrition Coach",
      "Career Coach",
      "Personal Assistant/Executive",
      "Spa/Massage Therapist",
      "Cosmetologist (Hair stylist/Makeup Artist/Nail Artist)",
    ],
  },
  {
    cluster_id: "IT_COMP",
    code: "IT_COMP",
    name: "Information Technology & Software",
    matchPercentage: 60,
    description: "Software engineering, cloud computing, AI, cybersecurity, and modern systems architecture.",
    why_fit: "You enjoy logical puzzle-solving, building technology tools, and mastering high-growth digital infrastructure.",
    streams_and_pathways_india: "Science with PCM. Pathways: JEE Main/Advanced, B.Tech in CSE/IT, BCA -> MCA, CUET for B.Sc Computer Science.",
    careers: [
      "Full Stack Software Engineer",
      "AI & Machine Learning Engineer",
      "Cybersecurity Specialist",
      "Cloud Architect",
      "Data Scientist",
      "Mobile App Developer",
      "DevOps Engineer",
      "Database Administrator",
      "Blockchain Developer",
      "Product Manager",
    ],
  },
  {
    cluster_id: "HLT_SCI",
    code: "HLT_SCI",
    name: "Healthcare & Medical Sciences",
    matchPercentage: 58,
    description: "Clinical medicine, nursing, diagnostics, pharmacology, therapy, and biomedical healthcare technologies.",
    why_fit: "You are driven by helping individuals recover their health, with deep curiosity for biological systems and scientific care.",
    streams_and_pathways_india: "Science with PCB. Pathways: NEET-UG for MBBS / BDS / BAMS / BHMS, B.Pharm, B.Sc Nursing, Allied Health Sciences.",
    careers: [
      "Physician / Surgeon (MBBS)",
      "Dentist (BDS)",
      "Pharmacist",
      "Clinical Psychologist",
      "Biomedical Scientist",
      "Radiologist",
      "Physiotherapist",
      "Medical Laboratory Technologist",
      "Public Health Specialist",
      "Dietitian & Nutritionist",
    ],
  },
  {
    cluster_id: "ARTS_COMM",
    code: "ARTS_COMM",
    name: "Arts, Media & Design",
    matchPercentage: 56,
    description: "Visual communication, filmmaking, journalism, UI/UX design, animation, and creative writing.",
    why_fit: "You thrive when expressing visual concepts, creating compelling narratives, and engaging audiences creatively.",
    streams_and_pathways_india: "Any stream. Pathways: NID DAT, UCEED, NIFT, BA Journalism & Mass Communication, B.Des.",
    careers: [
      "UI/UX Designer",
      "Graphic Designer",
      "Animator & 3D Artist",
      "Journalist / News Anchor",
      "Content Creator & Copywriter",
      "Film Director & Video Editor",
      "Fashion Designer",
      "Game Designer",
      "Photographer",
      "Public Relations (PR) Specialist",
    ],
  },
];
