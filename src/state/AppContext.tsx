import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export type Language = "en" | "sw";

type DownloadState = {
  status: "not" | "progress" | "done";
  progress: number; // 0-100
};

type QueuedApplication = { id: string; jobId: string; status: "queued" | "sent" };

export type AppState = {
  language: Language;
  offline: boolean;
  points: number;
  badges: string[];
  downloads: Record<string, DownloadState>;
  lastLessonId: string | null;
  queuedApplications: QueuedApplication[];
};

const defaultState: AppState = {
  language: "en",
  offline: false,
  points: 0,
  badges: [],
  downloads: {},
  lastLessonId: "alphabet-song",
  queuedApplications: [],
};

type AppContextType = AppState & {
  setLanguage: (lang: Language) => void;
  toggleOffline: () => void;
  startDownload: (id: string, label?: string) => void;
  addPoints: (n: number) => void;
  addBadge: (b: string) => void;
  markLastLesson: (id: string) => void;
  queueApplication: (jobId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "lsw_app_state_v1";

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

  // When coming back online, send queued applications
  useEffect(() => {
    if (!state.offline && state.queuedApplications.some(q => q.status === "queued")) {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          queuedApplications: prev.queuedApplications.map(q => ({ ...q, status: "sent" }))
        }));
        toast({ title: "Applications sent", description: "Queued job applications were submitted." });
      }, 600);
    }
  }, [state.offline]);

  const setLanguage = useCallback((lang: Language) => setState(s => ({ ...s, language: lang })), []);
  const toggleOffline = useCallback(() => setState(s => ({ ...s, offline: !s.offline })), []);

  const startDownload = useCallback((id: string, label?: string) => {
    setState(s => ({
      ...s,
      downloads: {
        ...s.downloads,
        [id]: { status: "progress", progress: 0 },
      }
    }));
    toast({ title: label ?? "Starting download", description: "Simulating download…" });
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.floor(5 + Math.random() * 15));
      setState(s => ({
        ...s,
        downloads: {
          ...s.downloads,
          [id]: { status: p >= 100 ? "done" : "progress", progress: p },
        }
      }));
      if (p >= 100) {
        clearInterval(iv);
        toast({ title: "Download complete", description: `${label ?? id} available offline.` });
      }
    }, 300);
  }, [toast]);

  const addPoints = useCallback((n: number) => setState(s => ({ ...s, points: s.points + n })), []);
  const addBadge = useCallback((b: string) => setState(s => ({ ...s, badges: Array.from(new Set([...(s.badges||[]), b])) })), []);
  const markLastLesson = useCallback((id: string) => setState(s => ({ ...s, lastLessonId: id })), []);

  const queueApplication = useCallback((jobId: string) => {
    const id = `${jobId}-${Date.now()}`;
    const isOffline = state.offline;
    setState(prev => ({ ...prev, queuedApplications: [...prev.queuedApplications, { id, jobId, status: isOffline ? "queued" : "sent" }] }));
    toast({ title: isOffline ? "Application queued" : "Application sent", description: isOffline ? "Will send when online." : "Submitted successfully." });
  }, [state.offline, toast]);

  const value = useMemo<AppContextType>(() => ({
    ...state,
    setLanguage,
    toggleOffline,
    startDownload,
    addPoints,
    addBadge,
    markLastLesson,
    queueApplication,
  }), [state, setLanguage, toggleOffline, startDownload, addPoints, addBadge, markLastLesson, queueApplication]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

// Minimal i18n for key labels
export const labels: Record<Language, Record<string, string>> = {
  en: {
    onboarding_title: "Welcome",
    choose_language: "Choose language",
    english: "English",
    kiswahili: "Kiswahili",
    offline_opt_in: "Enable offline downloads",
    download_starter: "Download starter pack",
    next: "Next",
    home_greeting: "Hi, Amina",
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
  },
  sw: {
    onboarding_title: "Karibu",
    choose_language: "Chagua lugha",
    english: "Kiingereza",
    kiswahili: "Kiswahili",
    offline_opt_in: "Washa upakuaji nje ya mtandao",
    download_starter: "Pakua kifurushi cha kuanza",
    next: "Ifuatayo",
    home_greeting: "Hujambo, Amina",
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
  }
};

export const useT = () => {
  const { language } = useApp();
  return useCallback((key: string) => labels[language][key] ?? key, [language]);
};
