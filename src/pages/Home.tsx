import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { points, badges } = useApp();
  const t = useT();
  const navigate = useNavigate();
  return (
    <MobileShell title="Home">
      <section className="space-y-3">
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-lg">{t('home_greeting')}</CardTitle>
            <CardDescription>Primary 3 • {points} pts</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="font-medium">Alphabet Song</div>
              <div className="text-xs text-muted-foreground">1:34 • Video</div>
            </div>
            <div className="flex items-center gap-2">
              {badges?.map((b) => <Badge key={b}>{b}</Badge>)}
              <Button onClick={() => navigate('/player/alphabet-song')}>{t('continue')}</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="text-base">{t('daily_practice')}</CardTitle>
              <CardDescription>3 questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/assessment')} className="w-full">Start</Button>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="text-base">{t('voice_lesson')}</CardTitle>
              <CardDescription>Speak and learn</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/voice')} className="w-full">Open</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="text-base">{t('teacher_upload')}</CardTitle>
              <CardDescription>Mr. Otieno</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/upload')} className="w-full">Open</Button>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="text-base">{t('jobs')}</CardTitle>
              <CardDescription>Career board</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/jobs')} className="w-full">Explore</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </MobileShell>
  );
}
