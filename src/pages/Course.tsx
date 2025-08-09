import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { useApp, useT } from "@/state/AppContext";
import MobileShell from "@/components/MobileShell";

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { downloads, startDownload } = useApp();
  const t = useT();
  const contentId = id === 'alphabet-song' ? 'alphabet' : 'comp-basics';
  const d = downloads[contentId];

  return (
    <MobileShell title={`Course: ${id}`}> 
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{id === 'alphabet-song' ? 'Alphabet Song' : 'Primary Computer Basics'}</CardTitle>
          <CardDescription>{id === 'alphabet-song' ? '1:34 • Video' : 'PDF + 2 short videos'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {d?.status === 'done' && <Badge variant="secondary">{t('available_offline')}</Badge>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => navigate(`/player/${id}`)}>{t('continue')}</Button>
            <Button variant="secondary" onClick={() => startDownload(contentId, t('download'))} disabled={d?.status==='progress' || d?.status==='done'}>
              {t('download')}
            </Button>
          </div>
          {d && <ProgressBar value={d.progress} />}
        </CardContent>
      </Card>
    </MobileShell>
  );
}
