import videoAsset from "@/assets/quran-calligraphy.mp4.asset.json";

type Props = {
  /** 0 - 1, kitna dikhai de */
  opacity?: number;
  className?: string;
  /** overlay gradient ki shiddat */
  overlay?: "soft" | "strong";
};

export function VideoBg({ opacity = 0.25, className = "", overlay = "soft" }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <video
        src={videoAsset.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        style={{ opacity }}
      />
      <div
        className={
          overlay === "strong"
            ? "absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"
            : "absolute inset-0 bg-gradient-to-b from-background/85 via-background/80 to-background/95"
        }
      />
    </div>
  );
}
