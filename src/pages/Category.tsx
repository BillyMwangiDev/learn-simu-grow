import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileShell from "@/components/MobileShell";
import { useNavigate } from "react-router-dom";

export default function Category() {
  const navigate = useNavigate();
  return (
    <MobileShell title="Categories">
      <div className="space-y-3">
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-base">Alphabet & Reading</CardTitle>
            <CardDescription>Early learner videos</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={() => navigate('/course/alphabet-song')}>Open</Button>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="text-base">Computer Basics</CardTitle>
            <CardDescription>PDF + short videos</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={() => navigate('/course/computer-basics')}>Open</Button>
          </CardContent>
        </Card>
      </div>
    </MobileShell>
  );
}
