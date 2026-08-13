import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { VideoBg } from "./VideoBg";
import { RECITERS, audioUrl, fetchSurahText, type Surah } from "./data";

type Props = {
  surah: Surah;
  reciter: string;
  onReciterChange: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export function NowPlaying({ surah, reciter, onReciterChange, onBack, onNext, onPrev }: Props) {
  const reciterName = RECITERS.find((r) => r.id === reciter)?.name ?? "";
  const { data: ayat = [], isLoading } = useQuery({
    queryKey: ["surah-text", surah.number],
    queryFn: () => fetchSurahText(surah.number),
    staleTime: Infinity,
  });

  return (
    <div className="relative min-h-screen overflow-hidden pb-44">
      <VideoBg opacity={0.28} overlay="strong" video="particles" className="fixed" />

      <div className="relative mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full gold-border px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" /> Tamam surahein
        </button>

        <div className="animate-rise-in mt-8 text-center">
          <span className="animate-soft-pulse mx-auto flex h-20 w-20 items-center justify-center rounded-3xl gold-border bg-secondary/60 font-arabic text-3xl text-primary">
            {surah.number}
          </span>
          <h1 className="mt-6 font-arabic text-5xl leading-[1.6] text-quran-gradient sm:text-7xl">
            {surah.name.replace("سُورَةُ ", "")}
          </h1>
          <p className="mt-3 text-2xl font-semibold sm:text-3xl">{surah.englishName}</p>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            {surah.englishNameTranslation} · {surah.numberOfAyahs} ayaat · {surah.revelationType}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {reciterName}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {RECITERS.map((r) => (
            <button
              key={r.id}
              onClick={() => onReciterChange(r.id)}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                r.id === reciter
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "gold-border text-muted-foreground hover:text-primary"
              }`}
            >
              {r.name.split(" ").slice(-2).join(" ")}
            </button>
          ))}
        </div>

        <div className="mt-12">
          <p className="mb-6 flex items-center justify-center gap-2 text-sm tracking-widest text-primary uppercase">
            <BookOpen className="h-4 w-4" /> Tilawat ka matn
          </p>

          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-3xl bg-card/70" />
              ))}
            </div>
          )}

          <div className="space-y-4">
            {ayat.map((a) => (
              <article key={a.number} className="glass-card animate-rise-in rounded-3xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full gold-border text-xs text-primary">
                    {a.number}
                  </span>
                  <p className="flex-1 text-right font-arabic text-3xl leading-[2.2] text-foreground sm:text-4xl">
                    {a.arabic}
                  </p>
                </div>
                {a.urdu && (
                  <p
                    dir="rtl"
                    className="mt-5 border-t border-border pt-4 font-urdu text-base leading-[2.8] text-muted-foreground"
                  >
                    {a.urdu}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>

      <AudioPlayer
        key={`${reciter}-${surah.number}`}
        src={audioUrl(reciter, surah.number)}
        title={surah.englishName}
        reciterName={reciterName}
        onEnded={onNext}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  );
}
