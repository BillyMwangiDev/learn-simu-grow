import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp, useT } from "@/state/AppContext";
import { Waveform } from "@/components/Waveform";
import MobileShell from "@/components/MobileShell";
import {
  MicrophoneIcon as Mic,
  MicrophoneSlashIcon as MicOff,
  WarningCircleIcon as AlertCircle,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  CaretRightIcon as ChevronRight,
} from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition, matchesPrompt } from "@/hooks/useSpeechRecognition";
import { LESSONS } from "@/data/content";
import { cn } from "@/lib/utils";

const VOICE_PROMPTS = LESSONS
  .filter((l) => l.voicePrompt)
  .map((l) => ({ lessonId: l.id, prompt: l.voicePrompt! }));

export default function VoiceLesson() {
  const { addPoints, language } = useApp();
  const t = useT();
  const { toast } = useToast();

  const {
    supported, listening, transcript, confidence,
    analyserNode, start, stop, reset,
  } = useSpeechRecognition();

  const [promptIdx, setPromptIdx]   = useState(0);
  const [result, setResult]         = useState<"correct" | "wrong" | null>(null);
  const [score, setScore]           = useState(0);
  const [attempts, setAttempts]     = useState(0);

  const currentPrompt = VOICE_PROMPTS[promptIdx % VOICE_PROMPTS.length];
  const promptText    = language === "sw" ? currentPrompt.prompt.sw : currentPrompt.prompt.en;
  const expectedWord  = promptText
    .replace(/^(say the (letter |word |phrase )?|sema (herufi |neno |maneno )?)/i, "")
    .trim();

  useEffect(() => {
    if (!listening && transcript) {
      const ok = matchesPrompt(transcript, expectedWord);
      setResult(ok ? "correct" : "wrong");
      setAttempts((a) => a + 1);
      if (ok) {
        addPoints(10);
        setScore((s) => s + 10);
        toast({ title: t("correct"), description: `You said: "${transcript}" · +10 pts` });
      } else {
        toast({
          title: t("try_again"),
          description: `I heard: "${transcript}" — expected "${expectedWord}"`,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript]);

  const handleStart = () => { reset(); setResult(null); start(language === "sw" ? "sw" : "en"); };
  const handleNext  = () => { reset(); setResult(null); setPromptIdx((i) => i + 1); };

  const promptNum   = (promptIdx % VOICE_PROMPTS.length) + 1;
  const promptTotal = VOICE_PROMPTS.length;

  return (
    <MobileShell title="Voice Lesson">
      <div className="space-y-4">

        {/* ── Header ── */}
        <div>
          <h2 className="font-bold text-[18px]">
            {language === "sw" ? "Somo la Sauti 🎙️" : "Voice Lesson 🎙️"}
          </h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {language === "sw" ? "Sema wazi kwenye maikrofoni" : "Speak clearly and earn points"}
          </p>
        </div>

        {/* ── Not supported warning ── */}
        {!supported && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-destructive/25 bg-destructive/6 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" weight="duotone" />
            <span>{t("mic_not_supported")}</span>
          </div>
        )}

        {/* ── Prompt card ── */}
        <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/8 to-primary/3 p-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="h-px flex-1 bg-primary/15" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
              Prompt {promptNum} / {promptTotal}
            </span>
            <div className="h-px flex-1 bg-primary/15" />
          </div>
          <p className="text-[20px] font-bold text-primary leading-tight">{promptText}</p>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1">
            <span className="text-[11px] text-primary/70">Say:</span>
            <span className="text-[12px] font-bold text-primary font-mono">"{expectedWord}"</span>
          </div>
        </div>

        {/* ── Mic / waveform area ── */}
        <div className="rounded-2xl border bg-card p-6 flex flex-col items-center gap-4">
          {/* Mic button with pulse ring */}
          <div className="relative">
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full bg-destructive/30 animate-pulse-ring" />
                <span className="absolute inset-0 rounded-full bg-destructive/15 animate-pulse-ring" style={{ animationDelay: "0.4s" }} />
              </>
            )}
            <button
              onClick={listening ? stop : handleStart}
              disabled={!supported}
              className={cn(
                "relative h-20 w-20 rounded-full flex items-center justify-center transition-all shadow-lg",
                listening
                  ? "bg-destructive text-white shadow-destructive/30 scale-105"
                  : "bg-primary text-white shadow-primary/30 hover:scale-105 active:scale-95",
                !supported && "opacity-40 cursor-not-allowed"
              )}
            >
              {listening
                ? <MicOff className="h-8 w-8" weight="bold" />
                : <Mic    className="h-8 w-8" weight="bold" />
              }
            </button>
          </div>

          {/* Waveform / idle state */}
          <div className="h-10 flex items-center justify-center">
            {listening ? (
              <Waveform analyser={analyserNode} />
            ) : (
              <p className="text-[12px] text-muted-foreground text-center">
                {transcript
                  ? `${t("heard")}: "${transcript}"`
                  : supported ? "Tap the mic to speak" : "Mic unavailable"}
              </p>
            )}
          </div>

          <p className="text-[11px] font-semibold text-muted-foreground">
            {listening ? "🔴 Listening…" : "Tap to start"}
          </p>
        </div>

        {/* ── Feedback banner ── */}
        {result && (
          <div
            className={cn(
              "flex items-start gap-3 p-4 rounded-2xl border animate-fade-in",
              result === "correct"
                ? "bg-primary/8 border-primary/25 text-primary"
                : "bg-destructive/8 border-destructive/25 text-destructive"
            )}
          >
            {result === "correct"
              ? <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" weight="fill" />
              : <XCircle     className="h-5 w-5 shrink-0 mt-0.5" weight="fill" />
            }
            <div>
              <p className="font-bold text-sm">
                {result === "correct" ? `${t("correct")} 🎉` : t("try_again")}
              </p>
              {transcript && (
                <p className="text-[11px] opacity-75 mt-0.5">
                  I heard: "{transcript}"
                  {result === "correct" && confidence > 0 && ` (${confidence}% confidence)`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex gap-2">
          <Button
            onClick={listening ? stop : handleStart}
            disabled={!supported}
            variant={listening ? "destructive" : "default"}
            className="flex-1 h-11 rounded-xl gap-2"
          >
            {listening
              ? <><MicOff className="h-4 w-4" weight="bold" /> Stop</>
              : <><Mic    className="h-4 w-4" weight="bold" /> Start</>
            }
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={listening}
            className="flex-1 h-11 rounded-xl gap-1.5"
          >
            Next <ChevronRight className="h-4 w-4" weight="bold" />
          </Button>
        </div>

        {/* ── Session score strip ── */}
        <div className="rounded-2xl border bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Session</p>
            <p className="text-sm font-semibold mt-0.5">{attempts} attempts</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("score")}</p>
            <p className="text-xl font-bold text-primary tabular">{score} pts</p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
