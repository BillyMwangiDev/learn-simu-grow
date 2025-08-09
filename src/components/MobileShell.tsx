import { ReactNode, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp, useT } from "@/state/AppContext";
import { WifiOff, Wifi, Globe } from "lucide-react";

export default function MobileShell({ title, children }: { title: string; children: ReactNode }) {
  const { offline, toggleOffline, language, setLanguage, points, badges } = useApp();
  const t = useT();
  const loc = useLocation();

  useEffect(() => {
    document.title = `${title} • Learn Simu Grow`;
  }, [title]);

  return (
    <div className="w-full min-h-screen flex justify-center bg-background">
      <article className="w-[360px] min-h-[800px] shadow-lg border rounded-lg overflow-hidden bg-card animate-fade-in">
        <header className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h1 className="text-base font-semibold">Learn · Simu · Grow</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border overflow-hidden">
              <Button variant={language === 'en' ? 'default' : 'secondary'} size="sm" onClick={() => setLanguage('en')}>EN</Button>
              <Button variant={language === 'sw' ? 'default' : 'secondary'} size="sm" onClick={() => setLanguage('sw')}>SW</Button>
            </div>
            <Button variant={offline ? 'destructive' : 'outline'} size="sm" onClick={toggleOffline} aria-label="Toggle offline">
              {offline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            </Button>
          </div>
        </header>
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{t('filters')}</div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{points} pts</Badge>
            {badges?.slice(-2).map((b) => (
              <Badge key={b} className="hover-scale">{b}</Badge>
            ))}
          </div>
        </div>
        <Separator />
        <main className="p-4 space-y-3">{children}</main>
        <nav className="sticky bottom-0 bg-card border-t grid grid-cols-4">
          <Link to="/home" className={`text-center py-2 ${loc.pathname.startsWith('/home') ? 'text-primary' : ''}`}>Home</Link>
          <Link to="/category" className={`text-center py-2 ${loc.pathname.startsWith('/category') ? 'text-primary' : ''}`}>Learn</Link>
          <Link to="/voice" className={`text-center py-2 ${loc.pathname.startsWith('/voice') ? 'text-primary' : ''}`}>Voice</Link>
          <Link to="/jobs" className={`text-center py-2 ${loc.pathname.startsWith('/jobs') ? 'text-primary' : ''}`}>Jobs</Link>
        </nav>
      </article>
    </div>
  );
}
