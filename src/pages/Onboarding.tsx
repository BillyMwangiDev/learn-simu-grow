import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import MobileShell from "@/components/MobileShell";
import { useApp, useT } from "@/state/AppContext";
import { ProgressBar } from "@/components/ProgressBar";

export default function Onboarding() {
  const { language, setLanguage, startDownload, downloads } = useApp();
  const navigate = useNavigate();
  const t = useT();
  const starter = downloads["starter"];

  return (
    <MobileShell title={t('onboarding_title')}>
      <Card className="animate-enter">
        <CardHeader>
          <CardTitle className="text-lg">{t('choose_language')} / {t('kiswahili')}</CardTitle>
          <CardDescription>Select app language / Chagua lugha</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant={language==='en'? 'default':'secondary'} onClick={() => setLanguage('en')}>{t('english')}</Button>
            <Button variant={language==='sw'? 'default':'secondary'} onClick={() => setLanguage('sw')}>{t('kiswahili')}</Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label className="font-medium">{t('offline_opt_in')}</Label>
              <p className="text-xs text-muted-foreground">Download core lessons for offline use.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Button onClick={() => startDownload('starter', t('download_starter'))} disabled={starter?.status==='progress' || starter?.status==='done'} className="w-full hover-scale">
              {t('download_starter')}
            </Button>
            {starter && (
              <div className="pl-1">
                <ProgressBar value={starter.progress} />
              </div>
            )}
          </div>
          <Button onClick={() => navigate('/home')} className="w-full">{t('next')}</Button>
        </CardContent>
      </Card>
    </MobileShell>
  );
}
