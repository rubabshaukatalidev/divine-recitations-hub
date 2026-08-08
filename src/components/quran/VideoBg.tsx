import { useEffect, useRef } from "react";
import calligraphy from "@/assets/quran-calligraphy.mp4.asset.json";
import particles from "@/assets/navy-particles.mp4.asset.json";
import silk from "@/assets/navy-silk.mp4.asset.json";

export const BG_VIDEOS = {
  calligraphy: calligraphy.url,
  particles: particles.url,
  silk: silk.url,
} as const;

type Props = {
  /** 0 - 1, kitna dikhai de */
  opacity?: number;
  className?: string;
  /** overlay gradient ki shiddat */
  overlay?: "soft" | "strong";
  /** kaunsi video background me chale */
  video?: keyof typeof BG_VIDEOS;
};

export function VideoBg({
  opacity = 0.25,
  className = "",
  overlay = "soft",
  video = "calligraphy",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Mobile Safari/Chrome: muted DOM par set karna zaroori hai,
    // warna autoplay block ho jata hai.
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;

    const tryPlay = () => {
      const p = el.play();
      if (p) p.catch(() => {/* autoplay blocked — next interaction par dobara try hoga */});
    };

    if (el.readyState >= 2) tryPlay();
    else el.addEventListener("canplay", tryPlay, { once: true });

    // Agar browser ne autoplay block kiya to pehli user interaction par play
    const onFirstTouch = () => tryPlay();
    document.addEventListener("touchstart", onFirstTouch, { once: true, passive: true });
    document.addEventListener("click", onFirstTouch, { once: true });

    // Performance: viewport se bahar jaye to pause, wapas aaye to resume
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    return () => {
      el.removeEventListener("canplay", tryPlay);
      document.removeEventListener("touchstart", onFirstTouch);
      document.removeEventListener("click", onFirstTouch);
      io.disconnect();
    };
  }, [video]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <video
        key={video}
        ref={videoRef}
        src={BG_VIDEOS[video]}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        tabIndex={-1}
        className="h-full w-full scale-105 object-cover transition-opacity duration-1000"
        style={{ opacity }}
      />
      <div
        className={
          overlay === "strong"
            ? "absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"
            : "absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/95"
        }
      />
    </div>
  );
}
