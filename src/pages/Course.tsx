import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/ProgressBar";
import { useApp, useT } from "@/state/AppContext";
import MobileShell from "@/components/MobileShell";
import { getLessonById, getLessonsForCourse, getCourseById, COURSES } from "@/data/content";
import {
  CheckCircleIcon as CheckCircle,
  PlayIcon as Play,
  DownloadSimpleIcon as Download,
  ClockIcon as Clock,
  LockIcon as Lock,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { downloads, startDownload, completedLessons, lessonProgress, language } = useApp();
  const t = useT();

  const lesson = getLessonById(id ?? "");
  const course =
    lesson
      ? getCourseById(lesson.courseId)
      : COURSES.find((c) => c.id === id) ?? getCourseById(id ?? "");

  const lessons = course ? getLessonsForCourse(course.id) : lesson ? [lesson] : [];

  if (!course && !lesson) {
    return (
      <MobileShell title="Course">
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <Lock className="h-10 w-10 text-muted-foreground/40" weight="duotone" />
          <p className="text-muted-foreground text-sm">Course not found.</p>
        </div>
      </MobileShell>
    );
  }

  const courseTitle = course
    ? language === "sw" ? course.title.sw : course.title.en
    : lesson?.title.en ?? "Lesson";

  const courseDesc = course
    ? language === "sw" ? course.description.sw : course.description.en
    : null;

  const doneCount = lessons.filter((l) => completedLessons.includes(l.id)).length;
  const pct = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;

  return (
    <MobileShell title={courseTitle}>
      <div className="space-y-4">

        {/* ── Course header card ── */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary to-[hsl(142_68%_42%)]" />
          <div className="p-4 space-y-3">
            <div>
              <h2 className="font-bold text-[16px] leading-tight">{courseTitle}</h2>
              {courseDesc && (
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{courseDesc}</p>
              )}
            </div>

            {lessons.length > 1 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-muted-foreground">{doneCount} of {lessons.length} complete</span>
                  <span className="font-bold text-primary">{pct}%</span>
                </div>
                <ProgressBar value={pct} showLabel={false} size="md" />
              </div>
            )}

            <div className="flex items-center gap-2">
              {course?.level && (
                <Badge variant="secondary" className="text-[10px] font-semibold rounded-full">
                  {course.level}
                </Badge>
              )}
              <span className="text-[11px] text-muted-foreground">{lessons.length} lessons</span>
            </div>
          </div>
        </div>

        {/* ── Lesson list ── */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-0.5">
            Lessons
          </p>

          {lessons.map((l, idx) => {
            const done      = completedLessons.includes(l.id);
            const prog      = lessonProgress[l.id] ?? 0;
            const dl        = downloads[l.id];
            const mins      = Math.floor(l.durationSecs / 60);
            const secs      = String(l.durationSecs % 60).padStart(2, "0");
            const lessonTitle = language === "sw" ? l.title.sw : l.title.en;

            return (
              <div
                key={l.id}
                className={cn(
                  "rounded-2xl border p-3.5 transition-all hover-lift",
                  done
                    ? "border-primary/25 bg-primary/4"
                    : "border-border bg-card hover:border-primary/20"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Number / check */}
                  <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold",
                    done
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {done
                      ? <CheckCircle className="h-4.5 w-4.5" weight="fill" />
                      : String(idx + 1).padStart(2, "0")
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-[13px] font-semibold leading-tight truncate", done && "text-primary")}>
                      {lessonTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" weight="bold" />
                        {mins}:{secs}
                      </span>
                      <span className="text-[10px] text-muted-foreground capitalize">{l.type}</span>
                      {dl?.status === "done" && (
                        <span className="text-[10px] text-primary font-medium">· offline</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!done && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-xl"
                        onClick={() => startDownload(l.id, t("download"))}
                        disabled={dl?.status === "progress" || dl?.status === "done"}
                      >
                        <Download className="h-3.5 w-3.5" weight="bold" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 rounded-xl",
                        done && "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                      variant={done ? "ghost" : "default"}
                      onClick={() => navigate(`/player/${l.id}`)}
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* In-progress bar */}
                {prog > 0 && prog < 100 && (
                  <div className="mt-2.5">
                    <ProgressBar value={prog} showLabel={false} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Download all ── */}
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl gap-2 border-dashed"
          onClick={() => lessons.forEach((l) => startDownload(l.id, l.title.en))}
        >
          <Download className="h-4 w-4" weight="bold" />
          Download all lessons offline
        </Button>
      </div>
    </MobileShell>
  );
}
