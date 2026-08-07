import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Pause, Play, RefreshCw, RotateCcw } from "lucide-react";

type Mood = {
  id: string;
  label: string;
  urdu: string;
  refs: string[];
};

export const MOODS: Mood[] = [
  {
    id: "sukoon",
    label: "Sukoon chahiye",
    urdu: "دل بے چین ہے",
    refs: ["13:28", "94:5", "2:286", "65:3", "9:40"],
  },
  {
    id: "sabr",
    label: "Sabr ki taqat",
    urdu: "آزمائش میں ہوں",
    refs: ["2:153", "3:200", "39:10", "2:155", "103:3"],
  },
  {
    id: "shukr",
    label: "Shukr ka jazba",
    urdu: "شکر ادا کرنا ہے",
    refs: ["14:7", "55:13", "2:152", "16:18", "27:19"],
  },
  {
    id: "maafi",
    label: "Maafi ki umeed",
    urdu: "گناہوں پر ندامت",
    refs: ["39:53", "11:90", "4:110", "66:8", "25:70"],
  },
  {
    id: "hidayat",
    label: "Hidayat ki talab",
    urdu: "راستہ دکھائی نہیں دیتا",
    refs: ["1:6", "18:10", "2:2", "6:125", "20:114"],
  },
  {
    id: "rizq",
    label: "Rizq aur bharosa",
    urdu: "فکرِ روزی",
    refs: ["65:2", "11:6", "51:22", "29:60", "3:160"],
  },
];

type AyahData = {
  arabic: string;
  urdu: string;
  surahName: string;
  surahEnglish: string;
  ref: string;
  globalNumber: number;
};

async function fetchAyah(ref: string): Promise<AyahData> {
  const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,ur.jalandhry`);
  if (!res.ok) throw new Error("Ayat load nahi ho saki");
  const json = (await res.json()) as {
    data: {
      number: number;
      text: string;
      surah: { name: string; englishName: string };
    }[];
  };
  const ar = json.data[0];
  const ur = json.data[1];
  return {
    arabic: ar?.text ?? "",
    urdu: ur?.text ?? "",
    surahName: ar?.surah?.name ?? "",
    surahEnglish: ar?.surah?.englishName ?? "",
    ref,
    globalNumber: ar?.number ?? 0,
  };
}

const pick = (arr: string[], not?: string) => {
  const pool = arr.filter((r) => r !== not);
  return pool[Math.floor(Math.random() * pool.length)] ?? arr[0] ?? "1:1";
};

/** Dil ke haal ke mutabiq ayat — "Ayat-e-Noor" */
export function MoodAyat() {
  const [mood, setMood] = useState<Mood>(MOODS[0]!);
  const [ref, setRef] = useState<string>(MOODS[0]!.refs[0]!);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mood-ayah", ref],
    queryFn: () => fetchAyah(ref),
    staleTime: Infinity,
  });

  useEffect(() => {
    setPlaying(false);
    audioRef.current?.pause();
  }, [ref]);

  const choose = (m: Mood) => {
    setMood(m);
    setRef(pick(m.refs));
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap justify-center gap-2">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => choose(m)}
            className={`rounded-full px-5 py-2.5 text-sm transition-all duration-300 hover:-translate-y-0.5 ${
              m.id === mood.id
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "gold-border text-muted-foreground hover:text-primary"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p dir="rtl" className="mt-6 text-center font-urdu text-base leading-[2.6] text-muted-foreground">
        {mood.urdu}
      </p>

      <div className="glass-card animate-rise-in mt-6 rounded-3xl p-7 sm:p-10" key={ref}>
        {isLoading && (
          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded-xl bg-secondary/60" />
            <div className="h-6 w-2/3 animate-pulse rounded-xl bg-secondary/50" />
          </div>
        )}

        {isError && (
          <p className="text-center text-base text-destructive">
            Ayat load nahi ho saki, dobara koshish karein.
          </p>
        )}

        {data && (
          <>
            <p className="text-center font-arabic text-3xl leading-[2.2] text-foreground sm:text-4xl">
              {data.arabic}
            </p>
            <p
              dir="rtl"
              className="mx-auto mt-6 max-w-2xl border-t border-border pt-6 text-center font-urdu text-base leading-[2.8] text-muted-foreground sm:text-lg"
            >
              {data.urdu}
            </p>
            <p className="mt-5 text-center text-sm tracking-wide text-primary/90">
              {data.surahEnglish} · {data.ref}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={toggle}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Rukein" : "Ayat suniye"}
              </button>
              <button
                onClick={() => setRef(pick(mood.refs, ref))}
                className="inline-flex items-center gap-2 rounded-full gold-border px-6 py-3 text-sm text-foreground transition-colors hover:bg-secondary"
              >
                <RefreshCw className="h-4 w-4" /> Nayi ayat
              </button>
            </div>

            <audio
              ref={audioRef}
              src={`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${data.globalNumber}.mp3`}
              onEnded={() => setPlaying(false)}
            />
          </>
        )}
      </div>

      <Tasbeeh />
    </div>
  );
}

const DHIKR = [
  { ar: "سُبْحَانَ اللَّهِ", ur: "سبحان اللہ" },
  { ar: "الْحَمْدُ لِلَّهِ", ur: "الحمد للہ" },
  { ar: "اللَّهُ أَكْبَرُ", ur: "اللہ اکبر" },
  { ar: "أَسْتَغْفِرُ اللَّهَ", ur: "استغفر اللہ" },
];

function Tasbeeh() {
  const [i, setI] = useState(0);
  const [count, setCount] = useState(0);
  const target = 33;
  const pct = Math.min(count / target, 1);

  return (
    <div className="glass-card mt-6 rounded-3xl p-7 text-center sm:p-10">
      <p className="text-sm tracking-widest text-primary uppercase">Digital Tasbeeh</p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {DHIKR.map((d, idx) => (
          <button
            key={d.ar}
            onClick={() => {
              setI(idx);
              setCount(0);
            }}
            className={`rounded-full px-4 py-2 font-urdu text-sm leading-loose transition-colors ${
              idx === i ? "bg-primary text-primary-foreground" : "gold-border text-muted-foreground"
            }`}
          >
            {d.ur}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCount((c) => c + 1)}
        aria-label="Tasbeeh count"
        className="group relative mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full gold-border bg-secondary/50 transition-transform active:scale-95"
      >
        <span
          className="absolute inset-0 rounded-full opacity-70 transition-all duration-300"
          style={{
            background: `conic-gradient(var(--primary) ${pct * 360}deg, transparent 0deg)`,
            mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))",
          }}
        />
        <span className="relative flex flex-col items-center">
          <span className="font-arabic text-3xl text-primary">{DHIKR[i]!.ar}</span>
          <span className="mt-2 text-4xl font-bold tabular-nums">{count}</span>
        </span>
      </button>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 text-primary" /> Target {target}
        </span>
        <button
          onClick={() => setCount(0)}
          className="inline-flex items-center gap-1 transition-colors hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}
