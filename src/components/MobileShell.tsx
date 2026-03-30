import { ReactNode, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useApp, useT } from "@/state/AppContext";
import {
  WifiSlashIcon as WifiSlash,
  WifiHighIcon as Wifi,
  HouseIcon as House,
  BookOpenIcon as BookOpen,
  MicrophoneIcon as Microphone,
  BriefcaseIcon as Briefcase,
  LeafIcon as Leaf,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  match: string;
}

export default function MobileShell({ title, children }: { title: string; children: ReactNode }) {
  const { offline, toggleOffline, language, setLanguage, points, badges, userName } = useApp();
  const loc = useLocation();

  useEffect(() => {
    document.title = `${title} • Learn Simu Grow`;
  }, [title]);

  const navItems: NavItem[] = [
    { to: "/home",     label: "Home",  icon: <House      className="h-[18px] w-[18px]" weight="bold" />, match: "/home"     },
    { to: "/category", label: "Learn", icon: <BookOpen  className="h-[18px] w-[18px]" weight="bold" />, match: "/category" },
    { to: "/voice",    label: "Voice", icon: <Microphone className="h-[18px] w-[18px]" weight="bold" />, match: "/voice"    },
    { to: "/jobs",     label: "Jobs",  icon: <Briefcase className="h-[18px] w-[18px]" weight="bold" />, match: "/jobs"     },
  ];

  const firstName = userName ? userName.split(" ")[0] : null;

  return (
    <div className="w-full min-h-screen flex justify-center bg-gradient-to-br from-emerald-50/60 via-background to-amber-50/40">
      <article className="w-[375px] min-h-[800px] relative bg-background shadow-2xl shadow-black/10 overflow-hidden flex flex-col animate-fade-in border border-border/40">

        {/* ── Header ── */}
        <header className="relative shrink-0 px-4 pt-4 pb-3 overflow-hidden">
          {/* Ambient mesh glow */}
          <div className="absolute inset-0 mesh-green opacity-60 pointer-events-none" />
          {/* Frosted glass surface */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white/98 pointer-events-none" />

          <div className="relative flex items-center justify-between gap-2">
            {/* Brand mark */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[hsl(142_65%_28%)] flex items-center justify-center shadow-md shadow-primary/30">
                  <Leaf className="h-4.5 w-4.5 text-white" weight="bold" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold tracking-tight leading-tight text-foreground">
                  Learn · Simu · Grow
                </p>
                {firstName && (
                  <p className="text-[10px] text-muted-foreground leading-tight truncate">
                    Habari, {firstName} 👋
                  </p>
                )}
              </div>
            </div>

            {/* Controls cluster */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Points badge */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 rounded-full px-2 py-0.5">
                <span className="text-[11px]">⭐</span>
                <span className="text-[11px] font-bold tabular text-amber-700">{points}</span>
              </div>

              {/* Language toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden bg-muted/50 text-xs">
                {(["en", "sw"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-2 py-1 font-semibold transition-colors uppercase text-[10px]",
                      language === lang
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Offline toggle */}
              <button
                onClick={toggleOffline}
                aria-label="Toggle offline mode"
                title={offline ? "Offline — click to go online" : "Online — click to simulate offline"}
                className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center transition-all",
                  offline
                    ? "bg-destructive/10 text-destructive border border-destructive/25"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
                )}
              >
                {offline
                  ? <WifiSlash className="h-3.5 w-3.5" weight="bold" />
                  : <Wifi      className="h-3.5 w-3.5" weight="bold" />
                }
              </button>
            </div>
          </div>

          {/* Badges strip — scrollable */}
          {badges.length > 0 && (
            <div className="relative mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {badges.slice(-6).map((b) => (
                <span
                  key={b}
                  className="shrink-0 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 leading-none"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Offline banner */}
          {offline && (
            <div className="relative mt-2 flex items-center gap-1.5 text-[11px] font-medium text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-3 py-1.5">
              <WifiSlash className="h-3 w-3 shrink-0" weight="bold" />
              Offline mode — some features limited
            </div>
          )}
        </header>

        {/* Hairline divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent shrink-0" />

        {/* ── Main content ── */}
        <main className="p-4 space-y-3 flex-1 overflow-y-auto pb-28">
          {children}
        </main>

        {/* ── Floating glass bottom nav ── */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-4 pt-3 pointer-events-none">
          <nav className="pointer-events-auto glass rounded-2xl shadow-lg shadow-black/8 grid grid-cols-4 p-1 gap-0.5">
            {navItems.map((item) => {
              const active =
                loc.pathname.startsWith(item.match) ||
                (item.match === "/category" &&
                  (loc.pathname.startsWith("/course") || loc.pathname.startsWith("/player")));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-xl transition-all duration-200",
                    active
                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                  )}
                >
                  {item.icon}
                  <span className="text-[9px] font-bold tracking-wider uppercase">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

      </article>
    </div>
  );
}
