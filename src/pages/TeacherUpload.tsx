import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/state/AppContext";
import MobileShell from "@/components/MobileShell";

export default function TeacherUpload() {
  const { addBadge } = useApp();
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "approved" | "rejected">("idle");

  const submit = () => {
    setStatus("pending");
    setTimeout(() => {
      if (pin === "12345678") {
        setStatus("approved");
        addBadge("Verified Teacher");
      } else {
        setStatus("rejected");
      }
    }, 1200);
  };

  return (
    <MobileShell title="Teacher Upload">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload content</CardTitle>
          <CardDescription>Mr. Otieno</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>File</Label>
            <Input type="file" />
          </div>
          <div className="space-y-2">
            <Label>TSC PIN</Label>
            <Input placeholder="Enter 12345678" value={pin} onChange={e=>setPin(e.target.value)} />
          </div>
          <Button onClick={submit} className="w-full">Submit</Button>
          {status !== 'idle' && (
            <div className="text-sm text-center">
              {status === 'pending' && 'Pending verification…'}
              {status === 'approved' && 'Verified ✓'}
              {status === 'rejected' && 'Rejected ✗'}
            </div>
          )}
        </CardContent>
      </Card>
    </MobileShell>
  );
}
