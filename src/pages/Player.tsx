import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "@/components/ProgressBar";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { getLessonById } from "@/data/content";
import {
  ClosedCaptioningIcon as Captions,
  DownloadSimpleIcon as Download,
  PauseIcon as Pause,
  PlayIcon as Play,
  QuotesIcon as TextQuote,
  CloudSlashIcon as CloudOff,
  CheckCircleIcon as CheckCircle,
  GaugeIcon as Gauge,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function Player() {
  const { id } = useParams();
  const {
    offline, downloads, startDownload, markLastLesson,
    saveLessonProgress, markLessonComplete, completedLessons, lessonProgress, language,
  } = useApp();
  const t = useT();

  const lesson      = getLessonById(id ?? "");
  const contentId   = id ?? "";
  const d           = downloads[contentId];

  const savedProgress = lessonProgress[contentId] ?? 0;
  const alreadyDone   = completedLessons.includes(contentId);

  const [playing, setPlaying]             = useState(false);
  const [captions, setCaptions]           = useState(true);
  const [progress, setProgress]           = useState(alreadyDone ? 100 : savedProgress);
  const [speed, setSpeed]                 = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const intervalRef    = useRef<number | null>(null);
  const completedRef   = useRef(alreadyDone);

  const durationSecs = lesson?.durationSecs ?? 60;

  useEffect(() => { if (id) markLastLesson(id); }, [id, markLastLesson]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setProgress((p) => {
          const increment = (100 / (durationSecs / speed)) / 10;
          const next = Math.min(100, p + increment);
          saveLessonProgress(contentId, next);
          if (next >= 100 && !completedRef.current) {
            completedRef.current = true;
            clearInterval(intervalRef.current!);
            setPlaying(false);
            setJustCompleted(true);
            markLessonComplete(contentId);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
          return next;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, durationSecs, contentId, saveLessonProgress, markLessonComplete]);

  const offlineBlocked = offline && d?.status !== "done";

  const title       = lesson ? (language === "sw" ? lesson.title.sw       : lesson.title.en)       : id ?? "Lesson";
  const description = lesson ? (language === "sw" ? lesson.description.sw  : lesson.description.en)  : "Simulated playback";
  const transcriptText = lesson ? (language === "sw" ? lesson.transcript.sw : lesson.transcript.en) : "Transcript unavailable.";

  const remaining = progress > 0 && progress < 100
    ? Math.ceil(((100 - progress) / 100) * (durationSecs / speed))
    : null;

  return (
    <MobileShell title="Player">
      <div className="space-y-3">

        {/* ── Lesson info header ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-bold text-[16px] leading-tight">{title}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
          </div>
          {(alreadyDone || justCompleted) && (
            <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" weight="fill" />
            </div>
          )}
        </div>

        {/* ── Video / player canvas ── */}
        <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
          {/* Simulated video area */}
          <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">

            {/* Ambient glow */}
            <div className="absolute inset-0 mesh-green opacity-20 pointer-events-none" />

            {justCompleted ? (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="h-16 w-16 rounded-full bg-white/15 flex items-center justify-center mx-auto animate-bounce-in">
                    <CheckCircle className="h-9 w-9 text-white" weight="fill" />
                  </div>
                  <p className="font-bold text-white text-base">{t("lesson_complete")}</p>
                  <p className="text-white/70 text-sm">+20 pts earned 🎉</p>
                </div>
              </div>
            ) : offlineBlocked ? (
              <div className="text-center p-6 space-y-3">
                <CloudOff className="h-8 w-8 text-white/50 mx-auto" weight="duotone" />
                <p className="text-sm text-white/70">Offline — stream unavailable</p>
                <Button
                  onClick={() => startDownload(contentId, t("download"))}
                  disabled={d?.status === "progress" || d?.status === "done"}
                  size="sm"
                  className="rounded-xl"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" weight="bold" />
                  {t("download")}
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3 p-4">
                {captions && (
                  <p className="text-sm text-white/60 italic px-4 leading-relaxed line-clamp-2">
                    {playing
                      ? `♪ ${transcriptText.slice(0, 72)}…`
                      : `"${title}"`}
                  </p>
                )}
                <button
                  onClick={() => setPlaying(!playing)}
                  disabled={progress >= 100}
                  className={cn(
                    "h-14 w-14 rounded-full flex items-center justify-center transition-all mx-auto shadow-lg",
                    playing
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-white text-primary hover:scale-110",
                    progress >= 100 && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {playing
                    ? <Pause className="h-6 w-6" weight="fill" />
                    : <Play  className="h-6 w-6 ml-0.5" weight="fill" />
                  }
                </button>
                {!playing && progress > 0 && progress < 100 && (
                  <p className="text-[11px] text-white/50">Resume from {Math.round(progress)}%</p>
                )}
              </div>
            )}
          </div>

          {/* Progress + controls strip */}
          <div className="p-4 space-y-3">
            <ProgressBar value={progress} size="md" />
            {remaining && (
              <p className="text-[11px] text-muted-foreground text-right -mt-1">
                ~{remaining}s remaining
              </p>
            )}

            {/* Control buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 rounded-xl text-xs gap-1.5", captions && "border-primary/30 text-primary bg-primary/5")}
                onClick={() => setCaptions((v) => !v)}
              >
                <Captions className="h-3.5 w-3.5" weight="bold" />
                CC {captions ? "On" : "Off"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 rounded-xl text-xs gap-1.5", showTranscript && "border-primary/30 text-primary bg-primary/5")}
                onClick={() => setShowTranscript((v) => !v)}
              >
                <TextQuote className="h-3.5 w-3.5" weight="bold" />
                {t("transcript")}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl text-xs gap-1.5"
                onClick={() => startDownload(contentId, t("download"))}
                disabled={d?.status === "progress" || d?.status === "done"}
              >
                <Download className="h-3.5 w-3.5" weight="bold" />
                {d?.status === "done" ? "Saved" : t("download")}
              </Button>

              {d?.status === "done" && (
                <Badge variant="secondary" className="text-[10px] rounded-full">✓ Offline</Badge>
              )}
            </div>

            {/* Speed control */}
            <div className="flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground shrink-0" weight="bold" />
              <span className="text-[11px] text-muted-foreground">{t("speed")}</span>
              <Select value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
                <SelectTrigger className="w-[80px] h-7 text-xs rounded-lg ml-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["0.5", "1", "1.5", "2"].map((s) => (
                    <SelectItem key={s} value={s}>{s}×</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Download progress */}
            {d?.status === "progress" && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Downloading…</p>
                <ProgressBar value={d.progress} showLabel={false} />
              </div>
            )}
          </div>
        </div>

        {/* Transcript panel */}
        {showTranscript && (
          <div className="rounded-2xl border bg-card p-4 animate-fade-in">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Transcript
            </p>
            <p className="text-[13px] leading-relaxed text-foreground/80">{transcriptText}</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
