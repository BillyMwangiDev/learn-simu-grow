import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp, useT } from "@/state/AppContext";
import { Waveform } from "@/components/Waveform";
import MobileShell from "@/components/MobileShell";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VoiceLesson() {
  const { addPoints } = useApp();
  const t = useT();
  const { toast } = useToast();
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<"good" | "bad" | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (listening) {
      const timer = setTimeout(() => {
        const ok = Math.random() > 0.4;
        setResult(ok ? 'good' : 'bad');
        if (ok) {
          addPoints(10);
          setScore(s => s + 10);
          toast({ title: t('correct'), description: "+10" });
        } else {
          toast({ title: t('try_again') });
        }
        setListening(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [listening]);

  return (
    <MobileShell title="Voice Lesson">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Say the letter A</CardTitle>
          <CardDescription>Speak clearly into the microphone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex justify-center">
            {listening ? <Waveform /> : <div className="h-6" />}
          </div>
          {result && (
            <div className={`text-sm ${result==='good' ? 'text-primary' : 'text-destructive'}`}>{result==='good' ? t('correct') : t('try_again')}</div>
          )}
          <Button onClick={() => { setResult(null); setListening(true); }} className="mx-auto">
            <Mic className="h-4 w-4 mr-2" /> Start
          </Button>
          <div className="text-xs text-muted-foreground">Score: {score}</div>
        </CardContent>
      </Card>
    </MobileShell>
  );
}
