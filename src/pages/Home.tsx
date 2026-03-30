import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { useNavigate } from "react-router-dom";
import { COURSES, LESSONS } from "@/data/content";
import {
  FireIcon as Fire,
  BookOpenIcon as BookOpen,
  TrophyIcon as Trophy,
  CaretRightIcon as CaretRight,
  PlayIcon as Play,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { points, badges, userName, completedLessons, lastLessonId, streakDays, lessonProgress } = useApp();
  const t = useT();
  const navigate = useNavigate();

  const totalLessons   = LESSONS.length;
  const completedCount = completedLessons.length;
  const overallProgress = Math.round((completedCount / totalLessons) * 100);

  const lastLesson      = LESSONS.find((l) => l.id === lastLessonId) ?? LESSONS[0];
  const lastLessonCourse = COURSES.find((c) => c.lessonIds.includes(lastLesson.id));
  const lastProgress    = lessonProgress[lastLesson.id] ?? 0;

  const displayName = userName?.split(" ")[0] || "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 5  ? "Good night"
    : hour < 12 ? "Good morning"
    : hour < 17 ? "Good afternoon"
    : "Good evening";

  const stats = [
    {
      icon: <BookOpen className="h-4 w-4" weight="bold" />,
      value: `${completedCount}/${totalLessons}`,
      label: t("lessons_done"),
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      icon: <Fire className="h-4 w-4" weight="duotone" />,
      value: String(streakDays),
      label: t("day_streak"),
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: <Trophy className="h-4 w-4" weight="duotone" />,
      value: String(points),
      label: "Points",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  const quickActions = [
    {
      emoji: "🧠",
      label: t("daily_practice"),
      desc: "5 questions",
      bg: "bg-violet-50",
      border: "border-violet-200/80",
      textColor: "text-violet-800",
      descColor: "text-violet-500",
      action: () => navigate("/assessment"),
    },
    {
      emoji: "🎙️",
      label: t("voice_lesson"),
      desc: "Speak & learn",
      bg: "bg-sky-50",
      border: "border-sky-200/80",
      textColor: "text-sky-800",
      descColor: "text-sky-500",
      action: () => navigate("/voice"),
    },
    {
      emoji: "📚",
      label: t("teacher_upload"),
      desc: "TSC verified",
      bg: "bg-emerald-50",
      border: "border-emerald-200/80",
      textColor: "text-emerald-800",
      descColor: "text-emerald-500",
      action: () => navigate("/upload"),
    },
    {
      emoji: "💼",
      label: t("jobs"),
      desc: "Career board",
      bg: "bg-amber-50",
      border: "border-amber-200/80",
      textColor: "text-amber-800",
      descColor: "text-amber-500",
      action: () => navigate("/jobs"),
    },
  ];

  return (
    <MobileShell title="Home">
      <section className="space-y-4">

        {/* ── Hero greeting card ── */}
        <div className="relative rounded-2xl overflow-hidden bg-primary p-5 shadow-md shadow-primary/20">
          {/* Decorative orbs */}
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/8" />
          <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
          <div className="absolute top-1/2 right-6 -translate-y-1/2 h-14 w-14 rounded-full bg-white/6" />

          <div className="relative space-y-0.5">
            <p className="text-[12px] font-medium text-white/65 uppercase tracking-wide">{greeting}</p>
            <h2 className="text-[22px] font-bold text-white leading-tight">{displayName}! 👋</h2>
            <p className="text-[12px] text-white/60 mt-1">
              {overallProgress > 0
                ? `${overallProgress}% through your journey`
                : "Ready to start learning?"}
            </p>
          </div>

          {/* Mini progress */}
          <div className="relative mt-4">
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/80 transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-white/50">{completedCount} of {totalLessons} lessons</span>
              <span className="text-[10px] font-bold text-white/70">{overallProgress}%</span>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card p-3 flex flex-col items-center gap-1.5 hover-lift"
            >
              <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", s.iconBg, s.iconColor)}>
                {s.icon}
              </div>
              <span className="text-[18px] font-bold tabular leading-none">{s.value}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground text-center leading-tight">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Continue learning card ── */}
        <div className="rounded-2xl border bg-card p-4 hover-lift">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-1 w-4 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Continue Learning
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight truncate">{lastLesson.title.en}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {lastLessonCourse?.title.en}
                {" · "}
                {Math.floor(lastLesson.durationSecs / 60)}:{String(lastLesson.durationSecs % 60).padStart(2, "0")}
                {" · "}
                {lastLesson.type}
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0 gap-1.5 rounded-xl h-8 px-3 shadow-sm shadow-primary/20"
              onClick={() => navigate(`/player/${lastLesson.id}`)}
            >
              <Play className="h-3.5 w-3.5" weight="fill" />
              {t("continue")}
            </Button>
          </div>
          {lastProgress > 0 && (
            <div className="mt-3">
              <ProgressBar value={lastProgress} />
            </div>
          )}
        </div>

        {/* ── Quick actions grid ── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Quick Actions
            </span>
            <button
              className="flex items-center gap-0.5 text-[10px] font-semibold text-primary"
              onClick={() => navigate("/category")}
            >
              All courses <CaretRight className="h-3 w-3" weight="bold" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={a.action}
                className={cn(
                  "rounded-2xl border p-4 text-left hover-lift transition-all",
                  a.bg, a.border
                )}
              >
                <span className="text-[26px] leading-none block mb-2">{a.emoji}</span>
                <span className={cn("font-bold text-[13px] block leading-tight", a.textColor)}>
                  {a.label}
                </span>
                <span className={cn("text-[11px] mt-0.5 block", a.descColor)}>{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

      </section>
    </MobileShell>
  );
}
