import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { subscribeTilawatState } from "./AudioPlayer";

export const NasheedPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.16; // Halka background volume

    const handleFirstUserInteraction = () => {
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay handle
        });
      }
      document.removeEventListener("click", handleFirstUserInteraction);
      document.removeEventListener("touchstart", handleFirstUserInteraction);
    };

    document.addEventListener("click", handleFirstUserInteraction);
    document.addEventListener("touchstart", handleFirstUserInteraction);

    // Subscribe to Tilawat audio events (Duck/Pause Nasheed when Tilawat plays)
    const unsubscribe = subscribeTilawatState((tilawatPlaying) => {
      if (!audioRef.current) return;
      if (tilawatPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!isMuted) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    });

    return () => {
      unsubscribe();
      document.removeEventListener("click", handleFirstUserInteraction);
      document.removeEventListener("touchstart", handleFirstUserInteraction);
    };
  }, [isMuted]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuteState = !isMuted;
    audioRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
    if (newMuteState) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio
        ref={audioRef}
        src="/audio/nasheed-background.mp3"
        loop
        preload="auto"
      />
      <button
        onClick={toggleMute}
        title={isMuted ? "Unmute Background Nasheed" : "Mute Background Nasheed"}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-md border border-white/20 shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        {isMuted || !isPlaying ? (
          <VolumeX size={18} className="text-muted-foreground" />
        ) : (
          <Volume2 size={18} className="text-emerald-400 animate-pulse" />
        )}
      </button>
    </div>
  );
};
