import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { ProgressBar } from "@/components/ProgressBar";
import { UserRole } from "@/state/AppContext";
import {
  GraduationCapIcon as GraduationCap,
  BookOpenIcon as BookOpen,
  CaretRightIcon as ChevronRight,
  CaretLeftIcon as ChevronLeft,
  LeafIcon as Leaf,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export default function Onboarding() {
  const { language, setLanguage, startDownload, downloads, setUserName, setUserRole } = useApp();
  const navigate = useNavigate();
  const t = useT();
  const starter = downloads["starter"];

  const [step, setStep] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState<UserRole>("learner");

  const handleFinish = () => {
    if (nameInput.trim()) setUserName(nameInput.trim());
    setUserRole(roleInput);
    navigate("/home");
  };

  const stepTitles = ["Choose Language", "Your Profile", "Go Offline"];

  return (
    <MobileShell title={t("onboarding_title")}>
      {/* ── Step indicator ── */}
      <div className="flex flex-col items-center gap-3 mb-4">
        {/* Brand mark */}
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-[hsl(142_65%_28%)] flex items-center justify-center shadow-lg shadow-primary/25">
          <Leaf className="h-7 w-7 text-white" weight="bold" />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold">Learn · Simu · Grow</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Step {step} of 3 — {stepTitles[step - 1]}
          </p>
        </div>

        {/* Pill step track */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-400",
                s === step   ? "w-8 bg-primary"       :
                s < step     ? "w-4 bg-primary/40"    :
                               "w-4 bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Step 1: Language ── */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg font-bold">{t("choose_language")}</h2>
            <p className="text-sm text-muted-foreground">Select your preferred app language / Chagua lugha</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { code: "en" as const, flag: "🇬🇧", name: "English", sub: "Continue in English" },
              { code: "sw" as const, flag: "🇰🇪", name: "Kiswahili", sub: "Endelea kwa Kiswahili" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  "flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 transition-all hover-lift",
                  language === lang.code
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/15"
                    : "border-muted bg-card hover:border-primary/30"
                )}
              >
                <span className="text-4xl leading-none">{lang.flag}</span>
                <div className="text-center">
                  <p className={cn("font-bold text-sm", language === lang.code ? "text-primary" : "text-foreground")}>
                    {lang.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{lang.sub}</p>
                </div>
                {language === lang.code && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          <Button onClick={() => setStep(2)} className="w-full h-11 rounded-xl gap-2 shadow-sm shadow-primary/20">
            {t("next")} <ChevronRight className="h-4 w-4" weight="bold" />
          </Button>
        </div>
      )}

      {/* ── Step 2: Profile ── */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg font-bold">{t("your_name")}</h2>
            <p className="text-sm text-muted-foreground">{t("i_am_a")}…</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("your_name")}
            </Label>
            <Input
              id="user-name"
              placeholder={language === "sw" ? "Jina lako… e.g. Amina" : "Your name… e.g. Amina"}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="h-11 rounded-xl border-border bg-card"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">I am a…</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: "learner" as UserRole, icon: <BookOpen className="h-6 w-6" weight="duotone" />, label: t("learner"), sub: "Student, self-learner" },
                { role: "teacher" as UserRole, icon: <GraduationCap className="h-6 w-6" weight="duotone" />, label: t("teacher"), sub: "TSC educator" },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => setRoleInput(r.role)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover-lift",
                    roleInput === r.role
                      ? "border-primary bg-primary/5 shadow-sm shadow-primary/15"
                      : "border-muted bg-card hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    roleInput === r.role ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {r.icon}
                  </div>
                  <div className="text-center">
                    <p className={cn("font-bold text-sm", roleInput === r.role ? "text-primary" : "text-foreground")}>
                      {r.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{r.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-none h-11 w-11 p-0 rounded-xl">
              <ChevronLeft className="h-4 w-4" weight="bold" />
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="flex-1 h-11 rounded-xl gap-2 shadow-sm shadow-primary/20"
              disabled={!nameInput.trim()}
            >
              {t("next")} <ChevronRight className="h-4 w-4" weight="bold" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Offline download ── */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg font-bold">{t("offline_opt_in")}</h2>
            <p className="text-sm text-muted-foreground">
              {language === "sw"
                ? "Pakua masomo ya msingi kwa matumizi nje ya mtandao."
                : "Download core lessons for offline use — no data needed after."}
            </p>
          </div>

          {/* Offline toggle card */}
          <div className="rounded-2xl border bg-card p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-xl">📥</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{t("offline_opt_in")}</p>
                <p className="text-[11px] text-muted-foreground">~12 MB · Core lessons</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <Button
            onClick={() => startDownload("starter", t("download_starter"))}
            disabled={starter?.status === "progress" || starter?.status === "done"}
            className="w-full h-11 rounded-xl gap-2"
            variant="outline"
          >
            {starter?.status === "done" ? "✓ Downloaded" : t("download_starter")}
          </Button>

          {starter?.status === "progress" && (
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground text-center">Downloading…</p>
              <ProgressBar value={starter.progress} size="md" />
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-none h-11 w-11 p-0 rounded-xl">
              <ChevronLeft className="h-4 w-4" weight="bold" />
            </Button>
            <Button
              onClick={handleFinish}
              className="flex-1 h-11 rounded-xl gap-2 shadow-sm shadow-primary/20"
            >
              {t("next")} 🚀
            </Button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
