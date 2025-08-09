import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobileShell from "@/components/MobileShell";
import { useApp } from "@/state/AppContext";

const JOB = { id: 'job-1', title: 'Junior Web Developer', location: 'Nairobi', type: 'Internship', deadline: '2025-12-31' };

export default function Jobs() {
  const { offline, queueApplication } = useApp();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const visible = useMemo(() => (
    (!location || JOB.location.toLowerCase().includes(location.toLowerCase())) &&
    (!type || JOB.type.toLowerCase().includes(type.toLowerCase()))
  ), [location, type]);

  return (
    <MobileShell title="Jobs">
      <Card className="mb-3">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Find your next role</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <div>
            <Label>Location</Label>
            <Input placeholder="Nairobi" value={location} onChange={e=>setLocation(e.target.value)} />
          </div>
          <div>
            <Label>Type</Label>
            <Input placeholder="Internship" value={type} onChange={e=>setType(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {visible && (
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-base">{JOB.title}</CardTitle>
            <CardDescription>{JOB.location} • {JOB.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Details</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{JOB.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                  <div>Location: {JOB.location}</div>
                  <div>Type: {JOB.type}</div>
                  <div>Deadline: {JOB.deadline}</div>
                </div>
                <Button onClick={() => queueApplication(JOB.id)} className="w-full mt-4">
                  {offline ? 'Queue Application' : 'Apply'}
                </Button>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </MobileShell>
  );
}
