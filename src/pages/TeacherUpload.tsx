import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useApp, useT } from "@/state/AppContext";
import MobileShell from "@/components/MobileShell";
import { findTeacherByPin } from "@/data/teachers";
import {
  LockIcon as Lock,
  UploadSimpleIcon as Upload,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  FileTextIcon as FileText,
  ImageIcon,
  ShieldCheckIcon as ShieldCheck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type VerifyStatus = "idle" | "pending" | "approved" | "rejected";

function FileIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-primary" weight="duotone" />;
  return <FileText className="h-5 w-5 text-muted-foreground" weight="duotone" />;
}

function formatBytes(b: number) {
  return b < 1024 ? `${b} B`
    : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB`
    : `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function TeacherUpload() {
  const { addBadge, addUploadedFile, userRole, uploadedContent } = useApp();
  const t = useT();

  const [pin,             setPin]             = useState("");
  const [status,          setStatus]          = useState<VerifyStatus>("idle");
  const [verifiedTeacher, setVerifiedTeacher] = useState<ReturnType<typeof findTeacherByPin>>(undefined);
  const [selectedFile,    setSelectedFile]    = useState<File | null>(null);
  const [uploadDone,      setUploadDone]      = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVerify = () => {
    setStatus("pending");
    setTimeout(() => {
      const teacher = findTeacherByPin(pin);
      if (teacher) {
        setStatus("approved");
        setVerifiedTeacher(teacher);
        addBadge("Verified Teacher");
      } else {
        setStatus("rejected");
      }
    }, 1200);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    addUploadedFile({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      uploadedAt: new Date().toISOString(),
    });
    setUploadDone(true);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Learner role guard ── */
  if (userRole === "learner") {
    return (
      <MobileShell title="Teacher Upload">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground/50" weight="duotone" />
          </div>
          <div>
            <p className="font-bold text-base">Teacher Access Only</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-[260px] mx-auto">
              This section is for TSC-registered teachers. Go to Onboarding to change your role.
            </p>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Teacher Upload">
      <div className="space-y-4">

        {/* ── Header ── */}
        <div>
          <h2 className="font-bold text-[18px]">Teacher Upload 📚</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Verify your TSC credentials and share content</p>
        </div>

        {/* ── TSC Verification card ── */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary to-[hsl(142_68%_42%)]" />
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" weight="duotone" />
              <p className="font-bold text-[14px]">TSC Verification</p>
            </div>
            <p className="text-[12px] text-muted-foreground">Enter your TSC PIN to verify your identity</p>

            {status !== "approved" && (
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">TSC PIN</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. TSC001234"
                    value={pin}
                    onChange={(e) => { setPin(e.target.value); setStatus("idle"); }}
                    disabled={status === "pending"}
                    className="font-mono h-10 rounded-xl"
                  />
                  <Button
                    onClick={handleVerify}
                    disabled={!pin.trim() || status === "pending"}
                    className="h-10 px-4 rounded-xl shrink-0"
                  >
                    {status === "pending" ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : "Verify"}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Try: <span className="font-mono text-primary">TSC001234</span> or <span className="font-mono text-primary">TSC005678</span>
                </p>
              </div>
            )}

            {/* Approved state */}
            {status === "approved" && verifiedTeacher && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-primary/25 bg-primary/5 animate-fade-in">
                <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" weight="fill" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-primary">{t("verified")} ✓</p>
                  <p className="text-[13px] font-semibold">{verifiedTeacher.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {verifiedTeacher.school} · {verifiedTeacher.county} County
                  </p>
                  <p className="text-[11px] text-muted-foreground">Subject: {verifiedTeacher.subject}</p>
                  <Badge className="text-[10px] bg-primary/10 text-primary border-0 rounded-full mt-1">TSC Verified</Badge>
                </div>
              </div>
            )}

            {/* Rejected state */}
            {status === "rejected" && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-destructive/25 bg-destructive/6 text-destructive animate-fade-in">
                <XCircle className="h-4.5 w-4.5 shrink-0" weight="fill" />
                <span className="text-[13px] font-medium">{t("rejected")} — PIN not found in registry.</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Upload card (only when verified) ── */}
        {status === "approved" && (
          <div className="rounded-2xl border bg-card p-4 space-y-4 animate-fade-in">
            <div>
              <p className="font-bold text-[14px]">Upload Learning Content</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Lessons, worksheets, videos or audio</p>
            </div>

            {/* Drop zone */}
            <label
              className={cn(
                "block rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
                selectedFile
                  ? "border-primary/40 bg-primary/4"
                  : "border-muted hover:border-primary/30 hover:bg-primary/3"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                {selectedFile ? (
                  <>
                    <FileIcon type={selectedFile.type} />
                    <p className="font-semibold text-[13px] truncate max-w-[220px]">{selectedFile.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatBytes(selectedFile.size)} · {selectedFile.type || "unknown type"}
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-7 w-7 text-muted-foreground/50" weight="duotone" />
                    <p className="font-medium text-[13px] text-muted-foreground">Tap to select a file</p>
                    <p className="text-[10px] text-muted-foreground/60">Video, audio, PDF, images, documents</p>
                  </>
                )}
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
                onChange={(e) => { setSelectedFile(e.target.files?.[0] ?? null); setUploadDone(false); }}
              />
            </label>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="w-full h-11 rounded-xl gap-2 shadow-sm shadow-primary/20"
            >
              <Upload className="h-4 w-4" weight="bold" />
              Upload Content
            </Button>

            {uploadDone && (
              <div className="flex items-center gap-2 text-sm text-primary animate-fade-in">
                <CheckCircle className="h-4 w-4 shrink-0" weight="fill" />
                {t("file_uploaded")}
              </div>
            )}
          </div>
        )}

        {/* ── Previously uploaded files ── */}
        {uploadedContent.length > 0 && (
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <p className="font-bold text-[13px]">Uploaded Content</p>
              <Badge variant="secondary" className="text-[10px] rounded-full">{uploadedContent.length}</Badge>
            </div>
            <div className="divide-y divide-border/50">
              {uploadedContent.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <FileIcon type={f.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[12px]">{f.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatBytes(f.size)} · {new Date(f.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0 rounded-full bg-primary/10 text-primary border-0">
                    Saved
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
