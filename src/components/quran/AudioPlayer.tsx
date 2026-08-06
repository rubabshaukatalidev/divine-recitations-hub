import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, Repeat } from "lucide-react";
import { audioUrl, type Surah } from "./data";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

type Props = {
  surah: Surah | null;
  reciter: string;
  reciterName: string;
  onNext: () => void;
  onPrev: () => void;
};

export function AudioPlayer({ surah, reciter, reciterName, onNext, onPrev }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loop, setLoop] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !surah) return;
    setLoading(true);
    el.load();
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
      .finally(() => setLoading(false));
  }, [surah?.number, reciter]);

  if (!surah) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-border bg-secondary font-arabic text-lg text-primary">
            {surah.number}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-arabic text-lg leading-tight text-primary">{surah.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {surah.englishName} · {reciterName}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onPrev}
              aria-label="Pichli surah"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </button>
            <button
              onClick={onNext}
              aria-label="Agli surah"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLoop((l) => !l)}
              aria-label="Repeat"
              className={`hidden rounded-full p-2 transition-colors sm:block ${
                loop ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Repeat className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 pl-2 md:flex">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                aria-label="Volume"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  if (audioRef.current) audioRef.current.volume = v;
                }}
                className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">
            {fmt(time)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={time}
            aria-label="Seek"
            onChange={(e) => {
              const v = Number(e.target.value);
              setTime(v);
              if (audioRef.current) audioRef.current.currentTime = v;
            }}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
          />
          <span className="w-10 text-[11px] tabular-nums text-muted-foreground">
            {fmt(duration)}
          </span>
        </div>
      </div>

      <audio
        ref={audioRef}
        loop={loop}
        src={audioUrl(reciter, surah.number)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => (loop ? null : onNext())}
      />
    </div>
  );
}
