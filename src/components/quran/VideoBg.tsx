import { useEffect, useRef, useState } from "react";

// Note: pehle ye .asset.json files se Lovable ke internal "/__l5e/" proxy path
// use karti thi — jo sirf Lovable ke apne hosting par kaam karta hai. Vercel (ya
// kisi bhi doosre static host) par woh path 404 deta hai, isliye background
// videos ghayab thay. Ab hum directly hosted, license-free (Mixkit) video CDN
// URLs use kar rahe hain jo kisi bhi host par kaam karte hain.
export const BG_VIDEOS = {
  calligraphy: "/videos/open-quran-calligraphy.mp4",
  particles: "https://assets.mixkit.co/videos/9736/9736-720.mp4",
  silk: "https://assets.mixkit.co/videos/17255/17255-720.mp4",
  recitation: "https://assets.mixkit.co/videos/34188/34188-720.mp4",
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
  // Video jab tak load/play na ho jaye, opacity 0 rakhte hain taake ek
  // smooth fade-in ho, achanak "pop" na ho.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    setReady(false);

    // Mobile Safari/Chrome: muted DOM par set karna zaroori hai,
    // warna autoplay block ho jata hai.
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;

    const tryPlay = () => {
      const p = el.play();
      if (p)
        p.then(() => setReady(true)).catch(() => {
          /* autoplay blocked — next interaction par dobara try hoga */
        });
    };

    if (el.readyState >= 2) tryPlay();
    else el.addEventListener("canplay", tryPlay, { once: true });

    // Agar browser ne autoplay block kiya to pehli user interaction par play
    const onFirstTouch = () => tryPlay();
    document.addEventListener("touchstart", onFirstTouch, { once: true, passive: true });
    document.addEventListener("click", onFirstTouch, { once: true });

    // Performance: viewport se bahar jaye to pause, wapas aaye to resume
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
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
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
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
        className="h-full w-full scale-105 object-cover [animation:slow-zoom_28s_ease-in-out_infinite_alternate] transition-opacity duration-[1400ms] ease-out"
        style={{ opacity: ready ? opacity : 0 }}
      />
      <div
        className={`transition-opacity duration-[1400ms] ${
          overlay === "strong"
            ? "absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"
            : "absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/95"
        }`}
      />
    </div>
  );
}
