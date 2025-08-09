import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import confetti from "canvas-confetti";

const QUESTIONS = [
  { q: "Which letter comes after A?", options: ["B", "D", "Z"], a: 0 },
  { q: "Which letter comes before C?", options: ["A", "F", "B"], a: 2 },
  { q: "Pick a vowel:", options: ["K", "E", "T"], a: 1 },
];

export default function Assessment() {
  const { addPoints, addBadge } = useApp();
  const t = useT();
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [done, setDone] = useState(false);

  const score = useMemo(() => answers.reduce((s, ans, i) => s + (ans === QUESTIONS[i].a ? 1 : 0), 0), [answers]);

  const submit = () => {
    setDone(true);
    const pts = score * 20;
    addPoints(pts);
    if (score >= 3) {
      addBadge("Alphabet Ace");
    }
    confetti({ particleCount: 80, spread: 55, origin: { y: 0.6 } });
  };

  return (
    <MobileShell title="Assessment">
      <Card className="space-y-2">
        <CardHeader>
          <CardTitle className="text-lg">Quick Quiz</CardTitle>
          <CardDescription>3 questions • instant feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {QUESTIONS.map((q, idx) => (
            <div key={idx} className="p-3 border rounded-md animate-fade-in">
              <div className="font-medium mb-2">{q.q}</div>
              <div className="grid grid-cols-3 gap-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[idx] === oi;
                  const correct = done && oi === q.a;
                  const wrong = done && selected && oi !== q.a;
                  return (
                    <Button key={oi} variant={selected ? 'default' : 'secondary'} className={`${correct ? 'ring-2 ring-primary' : ''} ${wrong ? 'ring-2 ring-destructive' : ''}`} onClick={() => !done && setAnswers(a => a.map((v, i) => i===idx? oi: v))}>{opt}</Button>
                  );
                })}
              </div>
              {done && (
                <div className={`text-xs mt-2 ${answers[idx] === q.a ? 'text-primary' : 'text-destructive'}`}>
                  {answers[idx] === q.a ? t('correct') : t('try_again')}
                </div>
              )}
            </div>
          ))}
          {!done ? (
            <Button onClick={submit} className="w-full">Submit</Button>
          ) : (
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold">Score: {score}/3</div>
              {score >= 3 && <Badge>Alphabet Ace</Badge>}
            </div>
          )}
        </CardContent>
      </Card>
    </MobileShell>
  );
}
