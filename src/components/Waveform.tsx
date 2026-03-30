import { useEffect, useRef } from "react";

interface WaveformProps {
  analyser?: AnalyserNode | null;
}

export function Waveform({ analyser }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (analyser) {
      // Real AudioContext waveform
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        rafRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const hue = 220 + (i / bufferLength) * 60;
          ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - barHeight, barWidth - 1, barHeight, 2);
          ctx.fill();
          x += barWidth;
        }
      };

      draw();
    } else {
      // Fallback: animated CSS-style bars drawn on canvas
      const bars = 24;
      let frame = 0;

      const draw = () => {
        rafRef.current = requestAnimationFrame(draw);
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / bars - 2;
        for (let i = 0; i < bars; i++) {
          const t = (frame * 0.05 + i * 0.4) % (Math.PI * 2);
          const barHeight = 8 + Math.sin(t) * (canvas.height / 2 - 8);
          const x = i * (barWidth + 2);
          const hue = 220 + (i / bars) * 60;
          ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
          ctx.beginPath();
          ctx.roundRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight, 2);
          ctx.fill();
        }
      };

      draw();
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={40}
      className="rounded"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
