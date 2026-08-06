import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Play, BookOpen, Moon, Headphones, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-islamic.jpg";
import { AudioPlayer } from "@/components/quran/AudioPlayer";
import { DAILY_DUAS, RECITERS, VIRTUES, fetchSurahs, type Surah } from "@/components/quran/data";
import { VideoBg } from "@/components/quran/VideoBg";
import { AyahSearch } from "@/components/quran/AyahSearch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nur al-Quran — Tilawat-e-Quran Har Surah Ki Awaz Mein" },
      {
        name: "description",
        content:
          "Mashhoor Arab qurra ki khoobsurat awaz mein poori 114 surahon ki tilawat suniye — modern, responsive aur sukoon bhari Islamic website.",
      },
      { property: "og:title", content: "Nur al-Quran — Tilawat-e-Quran Online" },
      {
        property: "og:description",
        content: "114 surahon ki tilawat, mashhoor Arab qurra ki awaz mein, ek khoobsurat Islamic website par.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const [reciter, setReciter] = useState<string>(RECITERS[0].id);
  const [current, setCurrent] = useState<Surah | null>(null);

  const { data: surahs = [], isLoading, isError } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
    staleTime: Infinity,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(query.trim()) ||
        String(s.number) === q,
    );
  }, [surahs, query]);

  const step = (dir: 1 | -1) => {
    if (!current || surahs.length === 0) return;
    const next = surahs.find((s) => s.number === current.number + dir);
    if (next) setCurrent(next);
  };

  const reciterName = RECITERS.find((r) => r.id === reciter)?.name ?? "";

  return (
    <div className="min-h-screen arabesque pb-40">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <span className="font-arabic text-2xl text-gold-gradient sm:text-3xl">نور القرآن</span>
          </a>
          <div className="hidden items-center gap-8 text-base text-muted-foreground sm:flex">
            <a href="#surahs" className="transition-colors hover:text-primary">
              Surahs
            </a>
            <a href="#ayat" className="transition-colors hover:text-primary">
              Ayat
            </a>
            <a href="#fazail" className="transition-colors hover:text-primary">
              Fazail
            </a>
            <a href="#duain" className="transition-colors hover:text-primary">
              Duain
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Islamic geometric arch pattern in emerald and gold"
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <VideoBg opacity={0.5} overlay="soft" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <p className="animate-float font-arabic text-4xl text-primary sm:text-6xl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
            Quran ki <span className="text-gold-gradient">Tilawat</span>, dil ko sukoon
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Poori 114 surahein — mashhoor Arab qurra ki dilnasheen awaz mein. Music ki jagah sirf
            kalam-e-ilahi, kisi bhi device par, bilkul free.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#surahs"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            >
              <Play className="h-4 w-4" /> Tilawat shuru karein
            </a>
            <a
              href="#fazail"
              className="inline-flex items-center gap-2 rounded-full gold-border px-8 py-4 text-base text-foreground transition-colors hover:bg-secondary"
            >
              <BookOpen className="h-4 w-4" /> Fazail-e-Quran
            </a>
          </div>

          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { k: "114", v: "Surahein" },
              { k: "6,236", v: "Ayaat" },
              { k: `${RECITERS.length}`, v: "Qurra" },
            ].map((s) => (
              <div key={s.v} className="surface-card rounded-2xl px-3 py-5">
                <dt className="font-arabic text-3xl text-primary sm:text-4xl">{s.k}</dt>
                <dd className="mt-1 text-sm text-muted-foreground sm:text-base">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Reciters */}
      <section className="relative overflow-hidden">
        <VideoBg opacity={0.18} overlay="strong" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionTitle icon={<Headphones className="h-4 w-4" />} kicker="Qurra" title="Apni pasand ka qari chunein" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECITERS.map((r) => {
            const active = r.id === reciter;
            return (
              <button
                key={r.id}
                onClick={() => setReciter(r.id)}
                className={`surface-card rounded-2xl px-5 py-5 text-left transition-all hover:-translate-y-1 ${
                  active ? "ring-2 ring-primary" : ""
                }`}
              >
                <p className="text-lg font-semibold">{r.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.country}</p>
                {active && (
                  <p className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                    <Sparkles className="h-3 w-3" /> Selected
                  </p>
                )}
              </button>
            );
          })}
        </div>
        </div>
      </section>

      {/* Ayat search */}
      <section id="ayat" className="relative overflow-hidden">
        <VideoBg opacity={0.22} overlay="strong" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionTitle
            icon={<Search className="h-4 w-4" />}
            kicker="Ayat"
            title="Ayat talash karein aur seekhein"
          />
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-muted-foreground sm:text-lg">
            Koi bhi lafz likhein — Arabic ayat Urdu tarjume ke sath saamne aa jayegi.
          </p>
          <AyahSearch />
        </div>
      </section>

      {/* Surah list */}
      <section id="surahs" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle icon={<BookOpen className="h-4 w-4" />} kicker="Tilawat" title="Tamam Surahein" />
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Surah ka naam ya number likhein…"
            aria-label="Surah search"
            className="w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-4 text-base outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>

        {isError && (
          <p className="mt-8 text-center text-base text-destructive">
            Surah list load nahi ho saki. Please page refresh karein.
          </p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-card" />
            ))}

          {filtered.map((s) => {
            const active = current?.number === s.number;
            return (
              <button
                key={s.number}
                onClick={() => setCurrent(s)}
                className={`surface-card group flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all hover:-translate-y-1 ${
                  active ? "ring-2 ring-primary" : ""
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 rotate-45 items-center justify-center rounded-lg gold-border bg-secondary">
                  <span className="-rotate-45 text-sm text-primary">{s.number}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-semibold">{s.englishName}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {s.englishNameTranslation} · {s.numberOfAyahs} ayaat · {s.revelationType}
                  </span>
                </span>
                <span className="font-arabic text-2xl text-primary">{s.name.replace("سُورَةُ ", "")}</span>
              </button>
            );
          })}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="mt-10 text-center text-base text-muted-foreground">Koi surah nahi mili.</p>
        )}
      </section>

      {/* Fazail */}
      <section id="fazail" className="relative overflow-hidden">
        <VideoBg opacity={0.18} overlay="strong" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionTitle icon={<Sparkles className="h-4 w-4" />} kicker="Fazail" title="Tilawat ki barkatein" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {VIRTUES.map((v) => (
            <article key={v.title} className="surface-card rounded-3xl p-7">
              <h3 className="font-urdu text-xl leading-loose text-primary">{v.title}</h3>
              <p className="mt-4 font-urdu text-base leading-[2.6] text-muted-foreground">{v.text}</p>
              <p className="mt-5 text-sm tracking-wide text-primary/80">{v.ref}</p>
            </article>
          ))}
        </div>
        </div>
      </section>

      {/* Duain */}
      <section id="duain" className="relative overflow-hidden">
        <VideoBg opacity={0.22} overlay="strong" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionTitle icon={<Moon className="h-4 w-4" />} kicker="Duain" title="Rozana ki masnoon duain" />
        <div className="mt-8 space-y-4">
          {DAILY_DUAS.map((d) => (
            <article key={d.ref} className="surface-card rounded-3xl p-7 text-center">
              <p className="font-arabic text-3xl leading-[2] text-primary sm:text-4xl">{d.arabic}</p>
              <p className="mx-auto mt-5 max-w-2xl font-urdu text-base leading-[2.8] text-muted-foreground sm:text-lg">
                {d.urdu}
              </p>
              <p className="mt-4 text-sm tracking-wide text-primary/80">{d.ref}</p>
            </article>
          ))}
        </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t border-border px-4 py-12 text-center sm:px-6">
        <p className="font-arabic text-3xl text-gold-gradient sm:text-4xl">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p>
        <p className="mt-3 text-base text-muted-foreground">
          Nur al-Quran — tilawat ke liye banayi gayi ek sadqa-e-jariya website.
        </p>
      </footer>

      <AudioPlayer
        surah={current}
        reciter={reciter}
        reciterName={reciterName}
        onNext={() => step(1)}
        onPrev={() => step(-1)}
      />
    </div>
  );
}

function SectionTitle({
  icon,
  kicker,
  title,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
}) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full gold-border px-5 py-2 text-sm tracking-widest text-primary uppercase">
        {icon}
        {kicker}
      </span>
      <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
    </div>
  );
}
