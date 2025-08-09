import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/ProgressBar";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { Captions, Download, Pause, Play, TextQuote, CloudOff } from "lucide-react";

export default function Player() {
  const { id } = useParams();
  const { offline, downloads, startDownload, markLastLesson } = useApp();
  const t = useT();
  const contentId = id === 'alphabet-song' ? 'alphabet' : 'comp-basics';
  const d = downloads[contentId];

  const [playing, setPlaying] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) markLastLesson(id);
  }, [id, markLastLesson]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setProgress((p) => {
          const next = Math.min(100, p + 100 / (10 * (1 / speed)) / 10);
          if (next >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          return next;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const offlineBlocked = offline && d?.status !== 'done';

  return (
    <MobileShell title={`Player: ${id}`}>
      <Card className="space-y-2">
        <CardHeader>
          <CardTitle className="text-lg">{id === 'alphabet-song' ? 'Alphabet Song' : 'Lesson'}</CardTitle>
          <CardDescription>Simulated 10s playback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="aspect-video rounded-md border bg-muted/20 flex items-center justify-center relative">
            {offlineBlocked ? (
              <div className="text-center p-4">
                <CloudOff className="mx-auto mb-2 h-6 w-6" />
                <p className="text-sm mb-2">Offline — stream unavailable</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => startDownload(contentId, t('download'))} disabled={d?.status==='progress' || d?.status==='done'}>{t('download')}</Button>
                  <Button variant="secondary" disabled>{t('play')}</Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">{captions ? '♪ A-B-C…' : 'Captions off'}</div>
                <Button onClick={() => setPlaying(!playing)} className="mx-auto">
                  {playing ? (<><Pause className="h-4 w-4 mr-2" /> {t('pause')}</>) : (<><Play className="h-4 w-4 mr-2" /> {t('play')}</>)}
                </Button>
              </div>
            )}
          </div>

          <ProgressBar value={progress} />

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCaptions(v => !v)}><Captions className="h-4 w-4 mr-2" /> {t('captions')}</Button>
            <Button variant="outline" onClick={() => setShowTranscript(v => !v)}><TextQuote className="h-4 w-4 mr-2" /> {t('transcript')}</Button>
            <Button variant="outline" onClick={() => startDownload(contentId, t('download'))} disabled={d?.status==='progress' || d?.status==='done'}>
              <Download className="h-4 w-4 mr-2" /> {t('download')}
            </Button>
            {d?.status === 'done' && <Badge variant="secondary">{t('available_offline')}</Badge>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('speed')}</span>
            <Select value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showTranscript && (
            <div className="text-sm p-3 rounded-md border animate-fade-in">
              <p>Sing along: A, B, C, D…</p>
            </div>
          )}

          {d && d.status !== 'done' && <ProgressBar value={d.progress} />}
          <Separator />
        </CardContent>
      </Card>
    </MobileShell>
  );
}
