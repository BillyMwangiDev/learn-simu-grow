import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { JOBS, Job } from "@/data/content";
import {
  MapPinIcon as MapPin,
  CalendarIcon as Calendar,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
  MagnifyingGlassIcon as Search,
  BriefcaseIcon as Briefcase,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const JOB_TYPES = ["All types", "Internship", "Full-time", "Part-time", "Volunteer"] as const;

function getApplicationStatus(jobId: string, applications: { jobId: string; status: string }[]) {
  const app = applications.find((a) => a.jobId === jobId);
  return app?.status ?? null;
}

const TYPE_STYLES: Record<Job["type"], { bg: string; text: string }> = {
  "Internship": { bg: "bg-sky-100",    text: "text-sky-700"    },
  "Full-time":  { bg: "bg-emerald-100",text: "text-emerald-700"},
  "Part-time":  { bg: "bg-amber-100",  text: "text-amber-700"  },
  "Volunteer":  { bg: "bg-violet-100", text: "text-violet-700" },
};

// Company initials avatar
function CompanyAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  // Hash name to pick a color
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold text-white"
      style={{ background: `hsl(${hue} 55% 45%)` }}
    >
      {initials}
    </div>
  );
}

export default function Jobs() {
  const { offline, queueApplication, queuedApplications } = useApp();
  const t = useT();

  const [keyword,    setKeyword]    = useState("");
  const [location,   setLocation]   = useState("");
  const [type,       setType]       = useState("All types");
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return JOBS.filter((j) => {
      const kw  = keyword.toLowerCase();
      const loc = location.toLowerCase();
      const matchKw  = !kw  || j.title.toLowerCase().includes(kw)  || j.company.toLowerCase().includes(kw)  || j.description.toLowerCase().includes(kw);
      const matchLoc = !loc || j.location.toLowerCase().includes(loc) || j.county.toLowerCase().includes(loc);
      const matchType = type === "All types" || j.type === type;
      return matchKw && matchLoc && matchType;
    });
  }, [keyword, location, type]);

  const handleApply = (jobId: string) => {
    setApplyingId(jobId);
    setTimeout(() => { queueApplication(jobId); setApplyingId(null); }, 800);
  };

  return (
    <MobileShell title="Jobs">
      <div className="space-y-3">

        {/* ── Header ── */}
        <div>
          <h2 className="font-bold text-[18px]">Job Board 💼</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {visible.length} of {JOBS.length} opportunities
          </p>
        </div>

        {/* ── Search & Filters ── */}
        <div className="rounded-2xl border bg-card p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" weight="bold" />
            <Input
              placeholder={t("search") + " jobs, companies…"}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9 h-9 text-sm rounded-xl border-border/60"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Location</Label>
              <Input
                placeholder="Nairobi, Kisumu…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-8 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-8 text-xs rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((jt) => (
                    <SelectItem key={jt} value={jt}>{jt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground/30" weight="duotone" />
            <p className="text-sm text-muted-foreground">No jobs match your filters.</p>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setKeyword(""); setLocation(""); setType("All types"); }}>
              Clear filters
            </Button>
          </div>
        )}

        {/* ── Job cards ── */}
        {visible.map((job) => {
          const appStatus   = getApplicationStatus(job.id, queuedApplications);
          const isApplying  = applyingId === job.id;
          const typeStyle   = TYPE_STYLES[job.type];
          const deadline    = new Date(job.deadline).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

          return (
            <div key={job.id} className="rounded-2xl border bg-card p-4 hover-lift space-y-3">
              {/* Company row */}
              <div className="flex items-start gap-3">
                <CompanyAvatar name={job.company} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[13px] leading-tight truncate">{job.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{job.company}</p>
                </div>
                <span className={cn("shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full", typeStyle.bg, typeStyle.text)}>
                  {job.type}
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" weight="bold" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" weight="bold" /> {deadline}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
                {/* Status badge */}
                {appStatus === "sent" && (
                  <Badge variant="secondary" className="text-[10px] gap-1 rounded-full bg-primary/10 text-primary border-0">
                    <CheckCircle className="h-3 w-3" weight="fill" /> Applied
                  </Badge>
                )}
                {appStatus === "queued" && (
                  <Badge variant="outline" className="text-[10px] gap-1 rounded-full">
                    <Clock className="h-3 w-3" weight="bold" /> {t("queued")}
                  </Badge>
                )}
                {!appStatus && <div />}

                <div className="flex gap-1.5 ml-auto">
                  {/* Details dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] rounded-xl">
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[340px] rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-[15px]">{job.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CompanyAvatar name={job.company} />
                          <div>
                            <p className="font-semibold text-[13px]">{job.company}</p>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", typeStyle.bg, typeStyle.text)}>
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 text-[12px] text-muted-foreground">
                          <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" weight="bold" /> {job.location}, {job.county} County</div>
                          <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" weight="bold" /> Deadline: {deadline}</div>
                        </div>
                        <p className="text-[13px] leading-relaxed">{job.description}</p>
                        <div>
                          <p className="font-bold text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">Requirements</p>
                          <ul className="space-y-1">
                            {job.requirements.map((r, i) => (
                              <li key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                                <span className="text-primary mt-0.5 shrink-0">•</span> {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button
                          onClick={() => handleApply(job.id)}
                          disabled={!!appStatus || isApplying}
                          className="w-full h-11 rounded-xl"
                        >
                          {isApplying ? t("applying") : appStatus === "sent" ? t("applied") : appStatus === "queued" ? t("queued") : offline ? "Queue Application" : t("apply")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Quick apply */}
                  <Button
                    size="sm"
                    className="h-8 px-3 text-[11px] rounded-xl"
                    onClick={() => handleApply(job.id)}
                    disabled={!!appStatus || isApplying}
                  >
                    {isApplying ? "…" : appStatus ? "✓" : offline ? "Queue" : t("apply")}
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
