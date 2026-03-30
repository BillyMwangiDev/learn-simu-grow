import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { getRandomQuestions, Question } from "@/data/questions";
import confetti from "canvas-confetti";
import {
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  ArrowCounterClockwiseIcon as ArrowCounterClockwise,
  TrophyIcon as Trophy,
  StarIcon as Star,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const QUIZ_ID        = "daily-quiz";
const QUESTION_COUNT = 5;

export default function Assessment() {
  const { saveHighScore, addPoints, highScores, language } = useApp();
  const t = useT();

  const [questions, setQuestions] = useState<Question[]>(() => getRandomQuestions(QUESTION_COUNT));
  const [answers,   setAnswers]   = useState<number[]>(Array(QUESTION_COUNT).fill(-1));
  const [done,      setDone]      = useState(false);

  const prevHighScore = highScores[QUIZ_ID] ?? 0;

  const score = useMemo(
    () => answers.reduce((s, ans, i) => s + (ans === questions[i].answer ? 1 : 0), 0),
    [answers, questions]
  );

  const submit = () => {
    if (answers.some((a) => a === -1)) return;
    setDone(true);
    const pts = score * 20;
    addPoints(pts);
    saveHighScore(QUIZ_ID, score);
    if (score >= QUESTION_COUNT) {
      confetti({ particleCount: 120, spread: 65, origin: { y: 0.6 } });
    } else if (score >= Math.ceil(QUESTION_COUNT / 2)) {
      confetti({ particleCount: 60, spread: 45, origin: { y: 0.6 } });
    }
  };

  const retry = useCallback(() => {
    setQuestions(getRandomQuestions(QUESTION_COUNT));
    setAnswers(Array(QUESTION_COUNT).fill(-1));
    setDone(false);
  }, []);

  const allAnswered   = answers.every((a) => a !== -1);
  const answeredCount = answers.filter((a) => a !== -1).length;

  return (
    <MobileShell title="Assessment">
      <div className="space-y-4">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-[18px]">Quick Quiz 🧠</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {done
                ? `${score * 20} pts earned`
                : `${answeredCount} of ${QUESTION_COUNT} answered`}
            </p>
          </div>
          {prevHighScore > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 rounded-full px-2.5 py-1">
              <Trophy className="h-3.5 w-3.5 text-amber-500" weight="duotone" />
              <span className="text-[11px] font-bold text-amber-700">Best: {prevHighScore}/{QUESTION_COUNT}</span>
            </div>
          )}
        </div>

        {/* ── Progress dots ── */}
        {!done && (
          <div className="flex items-center gap-1.5 px-0.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  answers[i] !== -1 ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}

        {/* ── Questions ── */}
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const opts     = language === "sw" ? q.options.sw : q.options.en;
            const qText    = language === "sw" ? q.question.sw : q.question.en;
            const isCorrect = done && answers[idx] === q.answer;
            const isWrong   = done && answers[idx] !== q.answer && answers[idx] !== -1;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-2xl border p-4 transition-all",
                  done
                    ? isCorrect
                      ? "border-primary/30 bg-primary/5"
                      : "border-destructive/30 bg-destructive/5"
                    : "border-border bg-card"
                )}
              >
                {/* Question */}
                <div className="flex items-start gap-2.5 mb-3">
                  <span className={cn(
                    "shrink-0 h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                    done
                      ? isCorrect
                        ? "bg-primary text-white"
                        : "bg-destructive text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {done
                      ? isCorrect ? <CheckCircle className="h-3.5 w-3.5" weight="fill" /> : <XCircle className="h-3.5 w-3.5" weight="fill" />
                      : `Q${idx + 1}`
                    }
                  </span>
                  <p className="font-semibold text-[13px] leading-snug">{qText}</p>
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-1 gap-1.5">
                  {opts.map((opt, oi) => {
                    const selected = answers[idx] === oi;
                    const correct  = done && oi === q.answer;
                    const wrong    = done && selected && oi !== q.answer;

                    return (
                      <button
                        key={oi}
                        disabled={done}
                        onClick={() =>
                          !done && setAnswers((a) => a.map((v, i) => (i === idx ? oi : v)))
                        }
                        className={cn(
                          "w-full text-left px-3.5 py-2.5 rounded-xl text-[12px] font-medium border transition-all",
                          // default
                          !selected && !correct && !wrong && "bg-muted/50 border-transparent hover:border-primary/25 hover:bg-primary/5",
                          // selected (pre-submit)
                          selected && !done && "bg-primary text-white border-primary shadow-sm shadow-primary/20",
                          // correct answer after submit
                          correct && "bg-primary text-white border-primary",
                          // wrong answer after submit
                          wrong   && "bg-destructive/10 text-destructive border-destructive/30",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span className={cn(
                            "h-4 w-4 rounded-full border flex-none text-[9px] font-bold flex items-center justify-center",
                            selected && !done && "border-white/50 text-white",
                            correct && "border-white/50 bg-white/20 text-white",
                            wrong   && "border-destructive/50 text-destructive",
                            !selected && !correct && !wrong && "border-muted-foreground/30 text-muted-foreground"
                          )}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Submit / Results ── */}
        {!done ? (
          <Button
            onClick={submit}
            className="w-full h-11 rounded-xl shadow-sm shadow-primary/20"
            disabled={!allAnswered}
          >
            {allAnswered
              ? `${t("submit")} →`
              : `Answer all ${QUESTION_COUNT} questions to submit`}
          </Button>
        ) : (
          <div className="rounded-2xl border bg-card p-5 text-center space-y-4 animate-bounce-in">
            {/* Score ring display */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "h-20 w-20 rounded-full flex flex-col items-center justify-center border-4",
                score === QUESTION_COUNT
                  ? "border-primary bg-primary/8"
                  : score >= Math.ceil(QUESTION_COUNT / 2)
                  ? "border-amber-400 bg-amber-50"
                  : "border-muted bg-muted/30"
              )}>
                <span className="text-2xl font-bold tabular leading-tight">{score}</span>
                <span className="text-[10px] text-muted-foreground">of {QUESTION_COUNT}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-base">
                {score === QUESTION_COUNT
                  ? "Perfect score! 🎉"
                  : score >= Math.ceil(QUESTION_COUNT / 2)
                  ? "Well done! 👍"
                  : "Keep practising! 💪"}
              </p>
              <p className="text-[13px] text-muted-foreground">{score * 20} pts earned this round</p>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {score > prevHighScore && (
                <Badge className="bg-amber-500 text-white gap-1 rounded-full">
                  <Trophy className="h-3 w-3" weight="fill" /> {t("new_high_score")}
                </Badge>
              )}
              {score >= QUESTION_COUNT && (
                <Badge className="bg-primary text-white gap-1 rounded-full">
                  <Star className="h-3 w-3" weight="fill" /> Perfect 🎉
                </Badge>
              )}
            </div>

            <Button
              onClick={retry}
              variant="outline"
              className="w-full h-11 rounded-xl gap-2"
            >
              <ArrowCounterClockwise className="h-4 w-4" weight="bold" />
              {t("retry")} with new questions
            </Button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
