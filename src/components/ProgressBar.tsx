interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export const ProgressBar = ({ value, showLabel = true, size = "sm" }: ProgressBarProps) => {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const h = size === "md" ? "h-2.5" : "h-1.5";

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`relative flex-1 ${h} rounded-full bg-muted overflow-hidden`}>
        {/* Track fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? "linear-gradient(90deg, hsl(142 52% 34%), hsl(142 68% 42%))"
              : "linear-gradient(90deg, hsl(142 52% 34%), hsl(142 68% 42%), hsl(36 92% 50%))",
          }}
        />
        {/* Shimmer overlay — only animates while not 100% */}
        {pct > 0 && pct < 100 && (
          <div
            className="absolute inset-y-0 rounded-full pointer-events-none overflow-hidden"
            style={{ width: `${pct}%` }}
          >
            <div
              className="absolute inset-y-0 w-1/3 animate-shimmer"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
              }}
            />
          </div>
        )}
      </div>
      {showLabel && (
        <span className="tabular text-[10px] text-muted-foreground w-8 text-right shrink-0">
          {pct}%
        </span>
      )}
    </div>
  );
};
