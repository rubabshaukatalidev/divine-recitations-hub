import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

// Global simple pub-sub audio bus so NasheedPlayer knows when Tilawat plays/pauses
type AudioListener = (isPlaying: boolean) => void;
const listeners = new Set<AudioListener>();

export const notifyTilawatState = (isPlaying: boolean) => {
  listeners.forEach((fn) => fn(isPlaying));
};

export const subscribeTilawatState = (fn: AudioListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

interface AudioPlayerProps {
  src: string;
  title?: string;
  reciterName?: string;
  onEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  reciterName,
  onEnded,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      notifyTilawatState(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      notifyTilawatState(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      notifyTilawatState(false);
      if (onEnded) onEnded();
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [onEnded]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-background/60 p-4 backdrop-blur-md border border-white/10">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <button
        onClick={togglePlay}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
      </button>

      <div className="flex-1">
        {title && <h4 className="font-semibold text-foreground">{title}</h4>}
        {reciterName && <p className="text-sm text-muted-foreground">{reciterName}</p>}
        
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={toggleMute}
        className="text-muted-foreground hover:text-foreground transition-colors p-2"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};
