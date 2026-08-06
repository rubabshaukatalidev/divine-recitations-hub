import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { searchAyat, type AyahResult } from "./data";

export function AyahSearch() {
  const [term, setTerm] = useState("");
  const [q, setQ] = useState("");

  const { data, isFetching, isError } = useQuery({
    queryKey: ["ayah-search", q],
    queryFn: () => searchAyat(q),
    enabled: q.trim().length > 1,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="mt-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQ(term);
        }}
        className="relative mx-auto max-w-2xl"
      >
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ayat search karein — misaal: rahmat, sabr, jannat…"
          aria-label="Ayat search"
          className="w-full rounded-full border border-border bg-card/80 py-4 pl-13 pr-32 text-base outline-none backdrop-blur transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring sm:text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          Talash
        </button>
      </form>

      {isFetching && (
        <p className="mt-8 flex items-center justify-center gap-2 text-base text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Ayaat talash ho rahi hain…
        </p>
      )}

      {isError && (
        <p className="mt-8 text-center text-base text-destructive">
          Talash mukammal nahi ho saki, dobara koshish karein.
        </p>
      )}

      {!isFetching && data && data.length === 0 && (
        <p className="mt-8 text-center text-base text-muted-foreground">
          Is lafz par koi ayat nahi mili.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {data?.map((a: AyahResult) => (
          <article key={`${a.surahNumber}:${a.ayahNumber}`} className="surface-card rounded-3xl p-6 sm:p-8">
            <p dir="rtl" className="font-arabic text-2xl leading-[2.2] text-primary sm:text-3xl">
              {a.arabic}
            </p>
            <p dir="rtl" className="mt-5 font-urdu text-base leading-[2.6] text-muted-foreground sm:text-lg">
              {a.urdu}
            </p>
            <p className="mt-5 text-sm tracking-wide text-primary/80">
              {a.surahEnglish} · {a.surahNumber}:{a.ayahNumber}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
