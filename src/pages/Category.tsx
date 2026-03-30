import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import MobileShell from "@/components/MobileShell";
import { useNavigate } from "react-router-dom";
import { COURSES, getLessonsForCourse } from "@/data/content";
import { useApp } from "@/state/AppContext";
import {
  CheckCircleIcon as CheckCircle,
  CaretRightIcon as CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// One accent color per course (cycles through palette)
const COURSE_ACCENTS = [
  { bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200/60", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  { bg: "bg-sky-500",     light: "bg-sky-50",     border: "border-sky-200/60",     text: "text-sky-700",     badge: "bg-sky-100 text-sky-700"     },
  { bg: "bg-violet-500",  light: "bg-violet-50",  border: "border-violet-200/60",  text: "text-violet-700",  badge: "bg-violet-100 text-violet-700"  },
  { bg: "bg-amber-500",   light: "bg-amber-50",   border: "border-amber-200/60",   text: "text-amber-700",   badge: "bg-amber-100 text-amber-700"   },
  { bg: "bg-rose-500",    light: "bg-rose-50",    border: "border-rose-200/60",    text: "text-rose-700",    badge: "bg-rose-100 text-rose-700"    },
  { bg: "bg-teal-500",    light: "bg-teal-50",    border: "border-teal-200/60",    text: "text-teal-700",    badge: "bg-teal-100 text-teal-700"    },
];

export default function Category() {
  const navigate = useNavigate();
  const { completedLessons, language } = useApp();

  return (
    <MobileShell title="Categories">
      <div className="space-y-3">

        {/* Header row */}
        <div className="flex items-center justify-between px-0.5 mb-1">
          <h2 className="text-lg font-bold">All Courses</h2>
          <span className="text-[11px] text-muted-foreground font-medium">{COURSES.length} available</span>
        </div>

        {COURSES.map((course, idx) => {
          const accent   = COURSE_ACCENTS[idx % COURSE_ACCENTS.length];
          const lessons  = getLessonsForCourse(course.id);
          const doneCount = lessons.filter((l) => completedLessons.includes(l.id)).length;
          const pct      = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;
          const allDone  = doneCount === lessons.length && lessons.length > 0;
          const firstLesson = lessons[0];
          const started  = doneCount > 0;

          return (
            <div
              key={course.id}
              onClick={() => navigate(firstLesson ? `/course/${firstLesson.id}` : `/course/${course.id}`)}
              className={cn(
                "rounded-2xl border bg-card overflow-hidden hover-lift cursor-pointer",
                accent.border
              )}
            >
              {/* Top accent strip with course number */}
              <div className={cn("relative h-1.5", accent.bg)}>
                {pct > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 bg-black/15 rounded-r-full"
                    style={{ width: `${100 - pct}%`, right: 0, left: `${pct}%` }}
                  />
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Course number badge */}
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm",
                    allDone ? "bg-primary text-white" : cn(accent.light, accent.text)
                  )}>
                    {allDone
                      ? <CheckCircle className="h-5 w-5" weight="fill" />
                      : String(idx + 1).padStart(2, "0")
                    }
                  </div>

                  {/* Course info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-[14px] leading-tight truncate">
                          {language === "sw" ? course.title.sw : course.title.en}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {language === "sw" ? course.description.sw : course.description.en}
                        </p>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", accent.badge)}>
                        {course.level}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {doneCount}/{lessons.length} lessons
                      </span>
                      {allDone && (
                        <span className="text-[10px] font-semibold text-primary">Complete ✓</span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <CaretRight className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-1" weight="bold" />
                </div>

                {/* Progress bar */}
                {pct > 0 && (
                  <div className="mt-3">
                    <ProgressBar value={pct} showLabel={false} />
                  </div>
                )}

                {/* CTA */}
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    variant={started ? "default" : "outline"}
                    className={cn(
                      "h-7 px-3 text-xs rounded-xl gap-1",
                      !started && cn("border", accent.border, accent.text, accent.light)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(firstLesson ? `/course/${firstLesson.id}` : `/course/${course.id}`);
                    }}
                  >
                    {allDone ? "Review" : started ? "Continue" : "Start"}
                    {!allDone && <CaretRight className="h-3 w-3" weight="bold" />}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
