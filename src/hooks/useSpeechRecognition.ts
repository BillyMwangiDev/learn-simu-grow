import { useCallback, useEffect, useRef, useState } from "react";

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number; // 0–1
}

export interface UseSpeechRecognitionReturn {
  supported: boolean;
  listening: boolean;
  transcript: string;
  confidence: number;
  analyserNode: AnalyserNode | null;
  start: (lang?: string) => void;
  stop: () => void;
  reset: () => void;
}

// Augment Window for webkit prefix
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const supported = !!SpeechRecognitionAPI;

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const stopAudioContext = useCallback(() => {
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    sourceRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current = null;
    streamRef.current = null;
    setAnalyserNode(null);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    stopAudioContext();
    setListening(false);
  }, [stopAudioContext]);

  const reset = useCallback(() => {
    stop();
    setTranscript("");
    setConfidence(0);
  }, [stop]);

  const start = useCallback(
    async (lang = "en-US") => {
      if (!supported || !SpeechRecognitionAPI) return;

      reset();

      // Set up live audio analyser for waveform visualisation
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        const source = ctx.createMediaStreamSource(stream);
        sourceRef.current = source;
        source.connect(analyser);
        setAnalyserNode(analyser);
      } catch {
        // mic permission denied — still run recognition without waveform
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = lang === "sw" ? "sw-KE" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0];
        setTranscript(result.transcript.trim().toLowerCase());
        setConfidence(Math.round(result.confidence * 100));
      };

      recognition.onerror = () => {
        setListening(false);
        stopAudioContext();
      };

      recognition.onend = () => {
        setListening(false);
        stopAudioContext();
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [supported, SpeechRecognitionAPI, reset, stopAudioContext]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      stopAudioContext();
    };
  }, [stopAudioContext]);

  return { supported, listening, transcript, confidence, analyserNode, start, stop, reset };
}

/** Fuzzy match: returns true if `heard` contains `expected` or vice versa */
export function matchesPrompt(heard: string, expected: string): boolean {
  const h = heard.toLowerCase().trim();
  const e = expected.toLowerCase().trim();
  return h.includes(e) || e.includes(h) || levenshtein(h, e) <= 2;
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
}
