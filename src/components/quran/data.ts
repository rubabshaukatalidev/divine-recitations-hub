export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", country: "Kuwait" },
  { id: "ar.abdurrahmaansudais", name: "Abdul Rahman As-Sudais", country: "Saudi Arabia" },
  { id: "ar.saoodshuraym", name: "Saud Al-Shuraim", country: "Saudi Arabia" },
  { id: "ar.mahermuaiqly", name: "Maher Al Muaiqly", country: "Saudi Arabia" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", country: "Egypt" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi", country: "Egypt" },
] as const;

export type ReciterId = (typeof RECITERS)[number]["id"];

export const audioUrl = (reciter: string, surah: number) =>
  `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surah}.mp3`;

export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  if (!res.ok) throw new Error("Surah list load nahi ho saki");
  const json = (await res.json()) as { data: Surah[] };
  return json.data;
}

export const DAILY_DUAS = [
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    urdu: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی، اور ہمیں آگ کے عذاب سے بچا۔",
    ref: "Al-Baqarah 2:201",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    urdu: "اے میرے رب! میرے علم میں اضافہ فرما۔",
    ref: "Ta-Ha 20:114",
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    urdu: "ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔",
    ref: "Aal-i-Imran 3:173",
  },
];

export const VIRTUES = [
  {
    title: "ہر حرف پر دس نیکیاں",
    text: "نبی ﷺ نے فرمایا: جس نے قرآن کا ایک حرف پڑھا اُس کے لیے ایک نیکی ہے اور نیکی دس گنا بڑھا دی جاتی ہے۔",
    ref: "Tirmidhi 2910",
  },
  {
    title: "قرآن قیامت کو سفارش کرے گا",
    text: "قرآن پڑھا کرو، بےشک یہ قیامت کے دن اپنے پڑھنے والوں کے لیے سفارشی بن کر آئے گا۔",
    ref: "Sahih Muslim 804",
  },
  {
    title: "دلوں کا سکون",
    text: "خبردار! اللہ کے ذکر ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔",
    ref: "Ar-Ra'd 13:28",
  },
];

export type AyahResult = {
  surahNumber: number;
  ayahNumber: number;
  surahEnglish: string;
  arabic: string;
  urdu: string;
};

type SearchMatch = {
  numberInSurah: number;
  text: string;
  surah: { number: number; englishName: string };
};

/** Urdu tarjuma me lafz talash karein, phir har match ki Arabic ayat laayein. */
export async function searchAyat(keyword: string): Promise<AyahResult[]> {
  const q = keyword.trim();
  if (q.length < 2) return [];
  const res = await fetch(
    `https://api.alquran.cloud/v1/search/${encodeURIComponent(q)}/all/ur.jalandhry`,
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: { matches?: SearchMatch[] } };
  const matches = (json.data?.matches ?? []).slice(0, 15);

  const withArabic = await Promise.all(
    matches.map(async (m) => {
      let arabic = "";
      try {
        const r = await fetch(
          `https://api.alquran.cloud/v1/ayah/${m.surah.number}:${m.numberInSurah}/quran-uthmani`,
        );
        if (r.ok) {
          const j = (await r.json()) as { data?: { text?: string } };
          arabic = j.data?.text ?? "";
        }
      } catch {
        arabic = "";
      }
      return {
        surahNumber: m.surah.number,
        ayahNumber: m.numberInSurah,
        surahEnglish: m.surah.englishName,
        arabic,
        urdu: m.text,
      };
    }),
  );
  return withArabic;
}

export type AyahLine = { number: number; arabic: string; urdu: string };

/** Ek surah ki poori ayaat (Arabic + Urdu tarjuma) laayein. */
export async function fetchSurahText(surah: number): Promise<AyahLine[]> {
  const res = await fetch(
    `https://api.alquran.cloud/v1/surah/${surah}/editions/quran-uthmani,ur.jalandhry`,
  );
  if (!res.ok) throw new Error("Surah text load nahi ho saka");
  const json = (await res.json()) as {
    data: { ayahs: { numberInSurah: number; text: string }[] }[];
  };
  const ar = json.data[0]?.ayahs ?? [];
  const ur = json.data[1]?.ayahs ?? [];
  return ar.map((a, i) => ({
    number: a.numberInSurah,
    arabic: a.text,
    urdu: ur[i]?.text ?? "",
  }));
}
