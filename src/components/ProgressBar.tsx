import { Progress } from "@/components/ui/progress";

export const ProgressBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-2 w-full">
    <Progress value={value} className="w-full" />
    <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">{Math.round(value)}%</span>
  </div>
);
