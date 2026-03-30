// ─── Lesson ─────────────────────────────────────────────────────────────────
export interface Lesson {
  id: string;
  courseId: string;
  title: { en: string; sw: string };
  description: { en: string; sw: string };
  durationSecs: number; // for simulated playback bar
  type: "video" | "pdf" | "audio";
  transcript: { en: string; sw: string };
  voicePrompt?: { en: string; sw: string }; // word to say in VoiceLesson
}

// ─── Course ──────────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  title: { en: string; sw: string };
  description: { en: string; sw: string };
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessonIds: string[];
}

// ─── Job ─────────────────────────────────────────────────────────────────────
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  county: string;
  type: "Internship" | "Full-time" | "Part-time" | "Volunteer";
  deadline: string;
  description: string;
  requirements: string[];
}

// ─── Lessons Data ────────────────────────────────────────────────────────────
export const LESSONS: Lesson[] = [
  {
    id: "alphabet-song",
    courseId: "alphabet-reading",
    title: { en: "The Alphabet Song", sw: "Wimbo wa Alfabeti" },
    description: { en: "Sing along to learn all 26 letters", sw: "Imba kujifunza herufi 26 zote" },
    durationSecs: 94,
    type: "video",
    transcript: {
      en: "A, B, C, D, E, F, G — H, I, J, K, L, M, N, O, P — Q, R, S — T, U, V — W, X, Y and Z! Now I know my ABCs, next time won't you sing with me!",
      sw: "A, B, C, D, E, F, G — H, I, J, K, L, M, N, O, P — Q, R, S — T, U, V — W, X, Y na Z! Sasa najua ABCs zangu, mara ijayo je, ungeweza kuimba nami!",
    },
    voicePrompt: { en: "Say the letter A", sw: "Sema herufi A" },
  },
  {
    id: "vowels-intro",
    courseId: "alphabet-reading",
    title: { en: "Vowels: A E I O U", sw: "Irabu: A E I O U" },
    description: { en: "Identify and pronounce the five vowels", sw: "Tambua na kutamka irabu tano" },
    durationSecs: 120,
    type: "video",
    transcript: {
      en: "The five vowels are A, E, I, O and U. Every word needs at least one vowel. Say them with me: A… E… I… O… U!",
      sw: "Irabu tano ni A, E, I, O na U. Kila neno linahitaji irabu moja angalau. Sema nawe: A… E… I… O… U!",
    },
    voicePrompt: { en: "Say a vowel", sw: "Sema irabu" },
  },
  {
    id: "simple-words",
    courseId: "alphabet-reading",
    title: { en: "Simple 3-Letter Words", sw: "Maneno Mafupi ya Herufi 3" },
    description: { en: "Read cat, dog, hen and more", sw: "Soma cat, dog, hen na zaidi" },
    durationSecs: 150,
    type: "video",
    transcript: {
      en: "C-A-T spells cat. D-O-G spells dog. H-E-N spells hen. These are three-letter words. Can you read them?",
      sw: "C-A-T inasomeka cat. D-O-G inasomeka dog. H-E-N inasomeka hen. Hizi ni maneno ya herufi tatu. Je, unaweza kuzisoma?",
    },
    voicePrompt: { en: "Say the word CAT", sw: "Sema neno CAT" },
  },
  {
    id: "number-intro",
    courseId: "numbers-maths",
    title: { en: "Numbers 1–10", sw: "Nambari 1–10" },
    description: { en: "Count from one to ten", sw: "Hesabu kutoka moja hadi kumi" },
    durationSecs: 80,
    type: "video",
    transcript: {
      en: "One, two, three, four, five — six, seven, eight, nine, ten! Count loud with me!",
      sw: "Moja, mbili, tatu, nne, tano — sita, saba, nane, tisa, kumi! Hesabu kwa sauti pamoja nami!",
    },
    voicePrompt: { en: "Count to five", sw: "Hesabu hadi tano" },
  },
  {
    id: "addition-basics",
    courseId: "numbers-maths",
    title: { en: "Addition Basics", sw: "Misingi ya Kuongeza" },
    description: { en: "Add small numbers together", sw: "Ongeza nambari ndogo pamoja" },
    durationSecs: 180,
    type: "video",
    transcript: {
      en: "When we put 2 apples and 3 apples together we get 5 apples. 2 + 3 = 5. Addition means putting things together!",
      sw: "Tunapochanganya maapulo 2 na maapulo 3 tunapata maapulo 5. 2 + 3 = 5. Kuongeza kunamaanisha kuchanganya vitu pamoja!",
    },
    voicePrompt: { en: "Say two plus three", sw: "Sema mbili jumlisha tatu" },
  },
  {
    id: "comp-intro",
    courseId: "computer-basics",
    title: { en: "What is a Computer?", sw: "Kompyuta ni Nini?" },
    description: { en: "Parts of a computer and what they do", sw: "Sehemu za kompyuta na kazi zake" },
    durationSecs: 200,
    type: "video",
    transcript: {
      en: "A computer has a screen, a keyboard and a mouse. The screen shows pictures and words. The keyboard is for typing. The mouse controls where you click.",
      sw: "Kompyuta ina skrini, kibodi na panya. Skrini inaonyesha picha na maneno. Kibodi ni ya kuandika. Panya inadhibiti mahali unaobonyeza.",
    },
    voicePrompt: { en: "Say the word keyboard", sw: "Sema neno kibodi" },
  },
  {
    id: "comp-mouse",
    courseId: "computer-basics",
    title: { en: "Using the Mouse", sw: "Kutumia Panya" },
    description: { en: "Click, double-click and drag", sw: "Bonyeza, bonyeza mara mbili na buruta" },
    durationSecs: 160,
    type: "video",
    transcript: {
      en: "Move the mouse to move the cursor. Click once to select. Double-click to open. Hold and drag to move items.",
      sw: "Hamisha panya kuhamisha kishale. Bonyeza mara moja kuchagua. Bonyeza mara mbili kufungua. Shika na buruta kuhamisha vitu.",
    },
    voicePrompt: { en: "Say double click", sw: "Sema bonyeza mara mbili" },
  },
  {
    id: "kiswahili-greetings",
    courseId: "kiswahili",
    title: { en: "Greetings in Kiswahili", sw: "Salamu za Kiswahili" },
    description: { en: "Say hello, goodbye and thank you", sw: "Sema hujambo, kwaheri na asante" },
    durationSecs: 90,
    type: "audio",
    transcript: {
      en: "Hujambo means Hello. Sijambo means I am fine. Asante means Thank you. Karibu means Welcome. Kwaheri means Goodbye.",
      sw: "Hujambo inamaanisha Hello. Sijambo inamaanisha Niko sawa. Asante inamaanisha Thank you. Karibu inamaanisha Welcome. Kwaheri inamaanisha Goodbye.",
    },
    voicePrompt: { en: "Say Hujambo", sw: "Sema Hujambo" },
  },
  {
    id: "kiswahili-numbers",
    courseId: "kiswahili",
    title: { en: "Numbers in Kiswahili", sw: "Nambari kwa Kiswahili" },
    description: { en: "Count 1–5 in Kiswahili", sw: "Hesabu 1–5 kwa Kiswahili" },
    durationSecs: 70,
    type: "audio",
    transcript: {
      en: "One = Moja, Two = Mbili, Three = Tatu, Four = Nne, Five = Tano. Let's count: Moja, Mbili, Tatu, Nne, Tano!",
      sw: "Moja, Mbili, Tatu, Nne, Tano! Hesabu pamoja: Moja, Mbili, Tatu, Nne, Tano!",
    },
    voicePrompt: { en: "Say Moja Mbili Tatu", sw: "Sema Moja Mbili Tatu" },
  },
  {
    id: "science-plants",
    courseId: "science",
    title: { en: "How Plants Grow", sw: "Mimea Inakua Vipi" },
    description: { en: "Seeds, water, light and soil", sw: "Mbegu, maji, mwanga na udongo" },
    durationSecs: 210,
    type: "video",
    transcript: {
      en: "Plants need four things to grow: soil, water, sunlight and air. First we plant a seed in the soil. Then we water it every day. The sun gives it energy to grow tall.",
      sw: "Mimea inahitaji mambo manne kukua: udongo, maji, jua na hewa. Kwanza tunapanda mbegu kwenye udongo. Kisha tumwagilia kila siku. Jua inaitoa nishati kukua juu.",
    },
    voicePrompt: { en: "Say the word sunlight", sw: "Sema neno jua" },
  },
];

// ─── Courses Data ─────────────────────────────────────────────────────────────
export const COURSES: Course[] = [
  {
    id: "alphabet-reading",
    title: { en: "Alphabet & Reading", sw: "Alfabeti na Kusoma" },
    description: { en: "Early literacy: letters, vowels and simple words", sw: "Elimu ya awali: herufi, irabu na maneno rahisi" },
    category: "English",
    level: "Beginner",
    lessonIds: ["alphabet-song", "vowels-intro", "simple-words"],
  },
  {
    id: "numbers-maths",
    title: { en: "Numbers & Maths", sw: "Nambari na Hisabati" },
    description: { en: "Count, add and understand numbers 1–10", sw: "Hesabu, ongeza na elewa nambari 1–10" },
    category: "Maths",
    level: "Beginner",
    lessonIds: ["number-intro", "addition-basics"],
  },
  {
    id: "computer-basics",
    title: { en: "Computer Basics", sw: "Misingi ya Kompyuta" },
    description: { en: "Intro to hardware: screen, mouse and keyboard", sw: "Utangulizi wa vifaa: skrini, panya na kibodi" },
    category: "ICT",
    level: "Beginner",
    lessonIds: ["comp-intro", "comp-mouse"],
  },
  {
    id: "kiswahili",
    title: { en: "Kiswahili Basics", sw: "Misingi ya Kiswahili" },
    description: { en: "Greetings, numbers and everyday words in Kiswahili", sw: "Salamu, nambari na maneno ya kila siku kwa Kiswahili" },
    category: "Kiswahili",
    level: "Beginner",
    lessonIds: ["kiswahili-greetings", "kiswahili-numbers"],
  },
  {
    id: "science",
    title: { en: "Science & Nature", sw: "Sayansi na Asili" },
    description: { en: "Explore plants, animals and the world around us", sw: "Chunguza mimea, wanyama na ulimwengu unaotuzunguka" },
    category: "Science",
    level: "Beginner",
    lessonIds: ["science-plants"],
  },
];

// ─── Jobs Data ────────────────────────────────────────────────────────────────
export const JOBS: Job[] = [
  {
    id: "job-001",
    title: "Junior Web Developer",
    company: "Safaricom PLC",
    location: "Nairobi",
    county: "Nairobi",
    type: "Internship",
    deadline: "2025-12-31",
    description: "Build and maintain internal web tools for Kenya's largest telco.",
    requirements: ["Basic HTML/CSS", "JavaScript knowledge", "Team player"],
  },
  {
    id: "job-002",
    title: "Data Entry Clerk",
    company: "Kenya Revenue Authority",
    location: "Mombasa",
    county: "Mombasa",
    type: "Full-time",
    deadline: "2025-11-15",
    description: "Capture and verify tax data for the coastal region office.",
    requirements: ["Computer literacy", "Attention to detail", "KCSE certificate"],
  },
  {
    id: "job-003",
    title: "Community Health Volunteer",
    company: "Amref Health Africa",
    location: "Kisumu",
    county: "Kisumu",
    type: "Volunteer",
    deadline: "2025-10-01",
    description: "Conduct door-to-door health education in Nyanza region.",
    requirements: ["Good communication", "Kiswahili fluency", "Compassion"],
  },
  {
    id: "job-004",
    title: "ICT Intern",
    company: "Equity Bank Kenya",
    location: "Nairobi",
    county: "Nairobi",
    type: "Internship",
    deadline: "2026-01-31",
    description: "Support the IT helpdesk and assist with network maintenance at HQ.",
    requirements: ["CompTIA A+ or equivalent", "Customer service mindset"],
  },
  {
    id: "job-005",
    title: "Primary School Teacher",
    company: "Starehe Boys Centre",
    location: "Nairobi",
    county: "Nairobi",
    type: "Full-time",
    deadline: "2025-09-30",
    description: "Teach Lower Primary classes (Grades 1–3) in the CBC curriculum.",
    requirements: ["P1 Certificate", "TSC Registration", "2 years experience"],
  },
  {
    id: "job-006",
    title: "Graphic Design Trainee",
    company: "Nation Media Group",
    location: "Nairobi",
    county: "Nairobi",
    type: "Internship",
    deadline: "2025-12-01",
    description: "Assist the design team in creating layouts for print and digital publications.",
    requirements: ["Adobe Suite basics", "Creative portfolio", "Diploma in Design"],
  },
  {
    id: "job-007",
    title: "Agricultural Extension Officer",
    company: "County Government of Nakuru",
    location: "Nakuru",
    county: "Nakuru",
    type: "Full-time",
    deadline: "2025-10-15",
    description: "Train smallholder farmers on modern farming techniques in the Rift Valley.",
    requirements: ["Diploma in Agriculture", "Driving licence", "Kiswahili & English"],
  },
  {
    id: "job-008",
    title: "Customer Care Agent",
    company: "Jumia Kenya",
    location: "Nairobi",
    county: "Nairobi",
    type: "Part-time",
    deadline: "2025-11-30",
    description: "Handle customer queries via phone and chat for East Africa's largest e-commerce platform.",
    requirements: ["Excellent communication", "Computer literate", "KCSE C+"],
  },
  {
    id: "job-009",
    title: "Coding Instructor",
    company: "iHub Nairobi",
    location: "Nairobi",
    county: "Nairobi",
    type: "Part-time",
    deadline: "2026-02-28",
    description: "Teach Python and web development to youth aged 14–18 at weekend coding bootcamps.",
    requirements: ["Proficiency in Python or JavaScript", "Teaching experience"],
  },
  {
    id: "job-010",
    title: "Solar Technician Apprentice",
    company: "M-KOPA Solar",
    location: "Eldoret",
    county: "Uasin Gishu",
    type: "Internship",
    deadline: "2026-03-31",
    description: "Install and service off-grid solar systems for rural households in Western Kenya.",
    requirements: ["Basic electronics", "Physical fitness", "KCSE certificate"],
  },
  {
    id: "job-011",
    title: "Library Assistant",
    company: "Kenya National Library Service",
    location: "Mombasa",
    county: "Mombasa",
    type: "Full-time",
    deadline: "2025-10-31",
    description: "Manage book cataloguing, lending and reading programmes at the Mombasa branch.",
    requirements: ["Diploma in Library Science", "Kiswahili & English"],
  },
  {
    id: "job-012",
    title: "Youth Mentor",
    company: "Enablis Kenya",
    location: "Kisumu",
    county: "Kisumu",
    type: "Volunteer",
    deadline: "2025-12-15",
    description: "Mentor young entrepreneurs in developing business plans and accessing finance.",
    requirements: ["Business background", "Passion for youth development"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getLessonById = (id: string): Lesson | undefined =>
  LESSONS.find((l) => l.id === id);

export const getCourseById = (id: string): Course | undefined =>
  COURSES.find((c) => c.id === id);

export const getLessonsForCourse = (courseId: string): Lesson[] =>
  LESSONS.filter((l) => l.courseId === courseId);
