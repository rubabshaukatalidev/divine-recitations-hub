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
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <video
        key={video}
        src={BG_VIDEOS[video]}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
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
