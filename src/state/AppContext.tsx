import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type Language = "en" | "sw";
export type UserRole = "learner" | "teacher";

type DownloadState = {
  status: "not" | "progress" | "done";
  progress: number;
};

type QueuedApplication = { id: string; jobId: string; status: "queued" | "sent"; appliedAt: string };

export type UploadedFile = {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export type AppState = {
  language: Language;
  offline: boolean;
  points: number;
  badges: string[];
  downloads: Record<string, DownloadState>;
  lastLessonId: string | null;
  queuedApplications: QueuedApplication[];
  // ── New fields ─────────────────────────────────────────────
  userName: string;
  userRole: UserRole;
  completedLessons: string[];
  lessonProgress: Record<string, number>; // lessonId → 0-100
  highScores: Record<string, number>;     // quizId → score
  uploadedContent: UploadedFile[];
  lastActiveDate: string | null;          // ISO date string for streak
  streakDays: number;
};

const defaultState: AppState = {
  language: "en",
  offline: false,
  points: 0,
  badges: [],
  downloads: {},
  lastLessonId: "alphabet-song",
  queuedApplications: [],
  userName: "",
  userRole: "learner",
  completedLessons: [],
  lessonProgress: {},
  highScores: {},
  uploadedContent: [],
  lastActiveDate: null,
  streakDays: 0,
};

type AppContextType = AppState & {
  setLanguage: (lang: Language) => void;
  toggleOffline: () => void;
  startDownload: (id: string, label?: string) => void;
  addPoints: (n: number) => void;
  addBadge: (b: string) => void;
  markLastLesson: (id: string) => void;
  queueApplication: (jobId: string) => void;
  // ── New actions ─────────────────────────────────────────────
  setUserName: (name: string) => void;
  setUserRole: (role: UserRole) => void;
  saveLessonProgress: (lessonId: string, progress: number) => void;
  markLessonComplete: (lessonId: string) => void;
  saveHighScore: (quizId: string, score: number) => void;
  addUploadedFile: (file: UploadedFile) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "lsw_app_state_v2";

// ── Badge rules ─────────────────────────────────────────────────────────────
function computeNewBadges(state: AppState, updatedCompleted: string[]): string[] {
  const earned: string[] = [];
  if (updatedCompleted.length >= 1 && !state.badges.includes("First Lesson"))
    earned.push("First Lesson");
  if (updatedCompleted.length >= 5 && !state.badges.includes("5 Lessons Done"))
    earned.push("5 Lessons Done");
  if (updatedCompleted.length >= 10 && !state.badges.includes("10 Lessons Done"))
    earned.push("10 Lessons Done");
  if (state.points + 20 >= 100 && !state.badges.includes("Century Club"))
    earned.push("Century Club");
  return earned;
}

// ── Streak logic ─────────────────────────────────────────────────────────────
function updateStreak(state: AppState): Pick<AppState, "streakDays" | "lastActiveDate"> {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastActiveDate === today) return { streakDays: state.streakDays, lastActiveDate: today };
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = state.lastActiveDate === yesterday ? state.streakDays + 1 : 1;
  return { streakDays: newStreak, lastActiveDate: today };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ── Real online/offline events ──────────────────────────────────────────
  useEffect(() => {
    const goOnline = () => {
      setState((s) => ({ ...s, offline: false }));
      toast({ title: "Back online", description: "You are connected." });
    };
    const goOffline = () => {
      setState((s) => ({ ...s, offline: true }));
      toast({ title: "You are offline", description: "Some features may be limited." });
    };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [toast]);

  // ── Flush queued applications when coming back online ───────────────────
  useEffect(() => {
    if (!state.offline && state.queuedApplications.some((q) => q.status === "queued")) {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          queuedApplications: prev.queuedApplications.map((q) => ({ ...q, status: "sent" })),
        }));
        toast({ title: "Applications sent", description: "Queued job applications were submitted." });
      }, 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.offline]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const setLanguage = useCallback((lang: Language) => setState((s) => ({ ...s, language: lang })), []);
  const toggleOffline = useCallback(() => setState((s) => ({ ...s, offline: !s.offline })), []);
  const setUserName = useCallback((name: string) => setState((s) => ({ ...s, userName: name })), []);
  const setUserRole = useCallback((role: UserRole) => setState((s) => ({ ...s, userRole: role })), []);

  const startDownload = useCallback(
    (id: string, label?: string) => {
      setState((s) => ({
        ...s,
        downloads: { ...s.downloads, [id]: { status: "progress", progress: 0 } },
      }));
      toast({ title: label ?? "Starting download", description: "Simulating download…" });
      let p = 0;
      const iv = setInterval(() => {
        p = Math.min(100, p + Math.floor(5 + Math.random() * 15));
        setState((s) => ({
          ...s,
          downloads: {
            ...s.downloads,
            [id]: { status: p >= 100 ? "done" : "progress", progress: p },
          },
        }));
        if (p >= 100) {
          clearInterval(iv);
          toast({ title: "Download complete", description: `${label ?? id} available offline.` });
        }
      }, 300);
    },
    [toast]
  );

  const addPoints = useCallback((n: number) => setState((s) => ({ ...s, points: s.points + n })), []);

  const addBadge = useCallback(
    (b: string) =>
      setState((s) => ({
        ...s,
        badges: Array.from(new Set([...(s.badges || []), b])),
      })),
    []
  );

  const markLastLesson = useCallback(
    (id: string) => setState((s) => ({ ...s, lastLessonId: id })),
    []
  );

  const saveLessonProgress = useCallback((lessonId: string, progress: number) => {
    setState((s) => ({
      ...s,
      lessonProgress: { ...s.lessonProgress, [lessonId]: Math.max(s.lessonProgress[lessonId] ?? 0, progress) },
      ...updateStreak(s),
    }));
  }, []);

  const markLessonComplete = useCallback(
    (lessonId: string) => {
      setState((s) => {
        if (s.completedLessons.includes(lessonId)) return s;
        const updatedCompleted = [...s.completedLessons, lessonId];
        const newBadges = computeNewBadges(s, updatedCompleted);
        newBadges.forEach((b) =>
          toast({ title: `🏅 Badge earned: ${b}`, description: "Keep it up!" })
        );
        return {
          ...s,
          completedLessons: updatedCompleted,
          points: s.points + 20,
          badges: Array.from(new Set([...s.badges, ...newBadges])),
          lessonProgress: { ...s.lessonProgress, [lessonId]: 100 },
          ...updateStreak(s),
        };
      });
    },
    [toast]
  );

  const saveHighScore = useCallback(
    (quizId: string, score: number) => {
      setState((s) => {
        const prev = s.highScores[quizId] ?? 0;
        if (score <= prev) return s;
        const newBadge = score === 5 && !s.badges.includes("Top Scorer") ? ["Top Scorer"] : [];
        if (newBadge.length)
          toast({ title: "🏅 Badge earned: Top Scorer", description: "Perfect score!" });
        return {
          ...s,
          highScores: { ...s.highScores, [quizId]: score },
          points: s.points + (score - prev) * 10,
          badges: Array.from(new Set([...s.badges, ...newBadge])),
        };
      });
    },
    [toast]
  );

  const addUploadedFile = useCallback((file: UploadedFile) => {
    setState((s) => {
      const alreadyExists = s.uploadedContent.some((f) => f.name === file.name);
      if (alreadyExists) return s;
      const newBadges = s.userRole === "teacher" && !s.badges.includes("Verified Teacher")
        ? ["Verified Teacher"]
        : [];
      return {
        ...s,
        uploadedContent: [...s.uploadedContent, file],
        badges: Array.from(new Set([...s.badges, ...newBadges])),
      };
    });
  }, []);

  const queueApplication = useCallback(
    (jobId: string) => {
      const id = `${jobId}-${Date.now()}`;
      const isOffline = state.offline;
      setState((prev) => ({
        ...prev,
        queuedApplications: [
          ...prev.queuedApplications,
          { id, jobId, status: isOffline ? "queued" : "sent", appliedAt: new Date().toISOString() },
        ],
      }));
      toast({
        title: isOffline ? "Application queued" : "Application sent",
        description: isOffline ? "Will send when online." : "Submitted successfully.",
      });
    },
    [state.offline, toast]
  );

  const value = useMemo<AppContextType>(
    () => ({
      ...state,
      setLanguage,
      toggleOffline,
      startDownload,
      addPoints,
      addBadge,
      markLastLesson,
      queueApplication,
      setUserName,
      setUserRole,
      saveLessonProgress,
      markLessonComplete,
      saveHighScore,
      addUploadedFile,
    }),
    [
      state,
      setLanguage,
      toggleOffline,
      startDownload,
      addPoints,
      addBadge,
      markLastLesson,
      queueApplication,
      setUserName,
      setUserRole,
      saveLessonProgress,
      markLessonComplete,
      saveHighScore,
      addUploadedFile,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

// ── i18n ─────────────────────────────────────────────────────────────────────
export const labels: Record<Language, Record<string, string>> = {
  en: {
    onboarding_title: "Welcome",
    choose_language: "Choose language",
    english: "English",
    kiswahili: "Kiswahili",
    offline_opt_in: "Enable offline downloads",
    download_starter: "Download starter pack",
    next: "Next",
    home_greeting: "Hi",
    continue: "Continue",
    daily_practice: "Daily practice",
    voice_lesson: "Voice mini-lesson",
    teacher_upload: "Teacher upload",
    jobs: "Jobs",
    available_offline: "Available offline",
    download: "Download",
    play: "Play",
    pause: "Pause",
    captions: "Captions",
    transcript: "Transcript",
    speed: "Speed",
    correct: "Correct!",
    try_again: "Try again",
    submit: "Submit",
    apply: "Apply",
    filters: "Filters",
    your_name: "Your name",
    i_am_a: "I am a",
    learner: "Learner",
    teacher: "Teacher",
    step: "Step",
    of: "of",
    lessons_done: "lessons done",
    day_streak: "day streak",
    high_score: "High score",
    new_high_score: "New high score!",
    retry: "Retry",
    lesson_complete: "Lesson complete!",
    mic_not_supported: "Microphone not supported in this browser. Use Chrome or Edge.",
    listening: "Listening…",
    heard: "Heard",
    score: "Score",
    applying: "Applying…",
    applied: "Applied",
    queued: "Queued",
    not_applied: "Apply",
    showing: "Showing",
    of_jobs: "jobs",
    keyword: "Keyword",
    search: "Search jobs…",
    all_types: "All types",
    file_uploaded: "File uploaded",
    verified: "Verified ✓",
    rejected: "Rejected ✗",
    pending: "Verifying…",
  },
  sw: {
    onboarding_title: "Karibu",
    choose_language: "Chagua lugha",
    english: "Kiingereza",
    kiswahili: "Kiswahili",
    offline_opt_in: "Washa upakuaji nje ya mtandao",
    download_starter: "Pakua kifurushi cha kuanza",
    next: "Ifuatayo",
    home_greeting: "Hujambo",
    continue: "Endelea",
    daily_practice: "Mazoezi ya kila siku",
    voice_lesson: "Somo la sauti",
    teacher_upload: "Upakiaji wa mwalimu",
    jobs: "Kazi",
    available_offline: "Inapatikana nje ya mtandao",
    download: "Pakua",
    play: "Cheza",
    pause: "Sitisha",
    captions: "Maelezo mafupi",
    transcript: "Nakala",
    speed: "Kasi",
    correct: "Sahihi!",
    try_again: "Jaribu tena",
    submit: "Wasilisha",
    apply: "Omba",
    filters: "Vichujio",
    your_name: "Jina lako",
    i_am_a: "Mimi ni",
    learner: "Mwanafunzi",
    teacher: "Mwalimu",
    step: "Hatua",
    of: "ya",
    lessons_done: "masomo yamekamilika",
    day_streak: "siku mfululizo",
    high_score: "Alama ya juu",
    new_high_score: "Alama mpya ya juu!",
    retry: "Jaribu tena",
    lesson_complete: "Somo limekamilika!",
    mic_not_supported: "Maikrofoni haifanyi kazi kwenye kivinjari hiki. Tumia Chrome au Edge.",
    listening: "Sikiliza…",
    heard: "Imesikika",
    score: "Alama",
    applying: "Inaomba…",
    applied: "Imeombiwa",
    queued: "Imewekwa foleni",
    not_applied: "Omba",
    showing: "Inaonyesha",
    of_jobs: "kazi",
    keyword: "Neno",
    search: "Tafuta kazi…",
    all_types: "Aina zote",
    file_uploaded: "Faili imepakiwa",
    verified: "Imethibitishwa ✓",
    rejected: "Imekataliwa ✗",
    pending: "Inathbitisha…",
  },
};

export const useT = () => {
  const { language } = useApp();
  return useCallback((key: string) => labels[language][key] ?? key, [language]);
};
