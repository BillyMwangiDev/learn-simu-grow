export interface Question {
  id: string;
  topic: "alphabet" | "numbers" | "science" | "kiswahili" | "ict";
  question: { en: string; sw: string };
  options: { en: string[]; sw: string[] };
  answer: number; // index into options
}

export const QUESTIONS: Question[] = [
  // ── Alphabet ──────────────────────────────────────────────────────────────
  {
    id: "q-alph-01",
    topic: "alphabet",
    question: { en: "Which letter comes after A?", sw: "Herufi gani inakuja baada ya A?" },
    options: { en: ["B", "D", "Z"], sw: ["B", "D", "Z"] },
    answer: 0,
  },
  {
    id: "q-alph-02",
    topic: "alphabet",
    question: { en: "Which letter comes before C?", sw: "Herufi gani inakuja kabla ya C?" },
    options: { en: ["A", "F", "B"], sw: ["A", "F", "B"] },
    answer: 2,
  },
  {
    id: "q-alph-03",
    topic: "alphabet",
    question: { en: "Pick a vowel:", sw: "Chagua irabu:" },
    options: { en: ["K", "E", "T"], sw: ["K", "E", "T"] },
    answer: 1,
  },
  {
    id: "q-alph-04",
    topic: "alphabet",
    question: { en: "How many letters are in the English alphabet?", sw: "Alfabeti ya Kiingereza ina herufi ngapi?" },
    options: { en: ["24", "26", "28"], sw: ["24", "26", "28"] },
    answer: 1,
  },
  {
    id: "q-alph-05",
    topic: "alphabet",
    question: { en: "Which of these is NOT a vowel?", sw: "Ipi kati ya hizi si irabu?" },
    options: { en: ["A", "O", "B"], sw: ["A", "O", "B"] },
    answer: 2,
  },
  {
    id: "q-alph-06",
    topic: "alphabet",
    question: { en: "C-A-T spells which word?", sw: "C-A-T inasomeka neno gani?" },
    options: { en: ["dog", "cat", "bat"], sw: ["dog", "cat", "bat"] },
    answer: 1,
  },
  {
    id: "q-alph-07",
    topic: "alphabet",
    question: { en: "Which letter comes last in the alphabet?", sw: "Herufi gani inakuja mwisho katika alfabeti?" },
    options: { en: ["X", "Y", "Z"], sw: ["X", "Y", "Z"] },
    answer: 2,
  },

  // ── Numbers ───────────────────────────────────────────────────────────────
  {
    id: "q-num-01",
    topic: "numbers",
    question: { en: "What is 2 + 3?", sw: "2 + 3 ni nini?" },
    options: { en: ["4", "5", "6"], sw: ["4", "5", "6"] },
    answer: 1,
  },
  {
    id: "q-num-02",
    topic: "numbers",
    question: { en: "What number comes after 9?", sw: "Nambari gani inakuja baada ya 9?" },
    options: { en: ["8", "10", "11"], sw: ["8", "10", "11"] },
    answer: 1,
  },
  {
    id: "q-num-03",
    topic: "numbers",
    question: { en: "Which is the biggest number?", sw: "Nambari ipi ni kubwa zaidi?" },
    options: { en: ["3", "7", "5"], sw: ["3", "7", "5"] },
    answer: 1,
  },
  {
    id: "q-num-04",
    topic: "numbers",
    question: { en: "How many sides does a triangle have?", sw: "Pembetatu ina pande ngapi?" },
    options: { en: ["2", "3", "4"], sw: ["2", "3", "4"] },
    answer: 1,
  },
  {
    id: "q-num-05",
    topic: "numbers",
    question: { en: "What is 10 minus 4?", sw: "10 ondoa 4 ni nini?" },
    options: { en: ["5", "6", "7"], sw: ["5", "6", "7"] },
    answer: 1,
  },

  // ── Science ───────────────────────────────────────────────────────────────
  {
    id: "q-sci-01",
    topic: "science",
    question: { en: "What do plants need to grow?", sw: "Mimea inahitaji nini kukua?" },
    options: { en: ["Stone", "Water", "Plastic"], sw: ["Jiwe", "Maji", "Plastiki"] },
    answer: 1,
  },
  {
    id: "q-sci-02",
    topic: "science",
    question: { en: "Which animal lays eggs?", sw: "Mnyama gani anataga mayai?" },
    options: { en: ["Cat", "Dog", "Hen"], sw: ["Paka", "Mbwa", "Kuku"] },
    answer: 2,
  },
  {
    id: "q-sci-03",
    topic: "science",
    question: { en: "What gives plants energy to grow?", sw: "Nini kinapeakea mimea nishati ya kukua?" },
    options: { en: ["Moon", "Sunlight", "Wind"], sw: ["Mwezi", "Jua", "Upepo"] },
    answer: 1,
  },

  // ── Kiswahili ─────────────────────────────────────────────────────────────
  {
    id: "q-sw-01",
    topic: "kiswahili",
    question: { en: "What does 'Asante' mean?", sw: "'Asante' inamaanisha nini?" },
    options: { en: ["Goodbye", "Thank you", "Hello"], sw: ["Kwaheri", "Thank you", "Hello"] },
    answer: 1,
  },
  {
    id: "q-sw-02",
    topic: "kiswahili",
    question: { en: "How do you say 'three' in Kiswahili?", sw: "Unasemaje 'three' kwa Kiswahili?" },
    options: { en: ["Mbili", "Tatu", "Nne"], sw: ["Mbili", "Tatu", "Nne"] },
    answer: 1,
  },
  {
    id: "q-sw-03",
    topic: "kiswahili",
    question: { en: "What does 'Kwaheri' mean?", sw: "'Kwaheri' inamaanisha nini?" },
    options: { en: ["Hello", "Thank you", "Goodbye"], sw: ["Hujambo", "Asante", "Goodbye"] },
    answer: 2,
  },

  // ── ICT ───────────────────────────────────────────────────────────────────
  {
    id: "q-ict-01",
    topic: "ict",
    question: { en: "What is used to type on a computer?", sw: "Nini kinatumika kuandika kwenye kompyuta?" },
    options: { en: ["Mouse", "Keyboard", "Screen"], sw: ["Panya", "Kibodi", "Skrini"] },
    answer: 1,
  },
  {
    id: "q-ict-02",
    topic: "ict",
    question: { en: "What does the mouse control on a screen?", sw: "Panya inadhibiti nini kwenye skrini?" },
    options: { en: ["Volume", "Cursor", "Brightness"], sw: ["Sauti", "Kishale", "Mwangaza"] },
    answer: 1,
  },
  {
    id: "q-ict-03",
    topic: "ict",
    question: { en: "Double-clicking opens a file. True or False?", sw: "Kubonyeza mara mbili kunafungua faili. Kweli au Uongo?" },
    options: { en: ["False", "It depends", "True"], sw: ["Uongo", "Inategemea", "Kweli"] },
    answer: 2,
  },
];

/**
 * Returns `count` random questions, optionally filtered by topic.
 * Shuffles the pool before slicing.
 */
export const getRandomQuestions = (count = 5, topic?: Question["topic"]): Question[] => {
  const pool = topic ? QUESTIONS.filter((q) => q.topic === topic) : QUESTIONS;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
};
