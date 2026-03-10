import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メディア掲載について - カウカウ",
  description: "架空通販サイト「カウカウ」のメディア掲載・取材に関するご案内。",
};

const mediaHistory = [
  {
    date: "2026.02.24",
    title: "Gigazine掲載",
    url: "https://gigazine.net/news/20260224-kawkaw/",
    note: null,
  },
  {
    date: "2026.03.03",
    title: "おたくま経済新聞掲載",
    url: "https://otakuma.net/archives/2026030307.html",
    note: "同記事がYahooニュース、ライブドアニュース、NTTドコモニュース、Niftyニュースなどに配信される",
  },
  {
    date: "2026.03.07",
    title: "FM AICHI ONE MORNING SATURDAYにて紹介",
    url: "https://fma.co.jp/f/prg/onemornings/",
    note: null,
  },
  {
    date: "2026.03.07",
    title: "ZIP-FM 77.8 SCAMPER内にて紹介",
    url: "https://zip-fm.co.jp/programs/d961906c-5370-4676-bfb7-2acdedda8799",
    note: null,
  },
];

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 text-sm text-foreground leading-relaxed">
        <div className="space-y-2">
          <h1 className="font-black text-base">
            ✒️ 記事化、メディア掲載について
          </h1>
          <p>
            記事化、メディア掲載にあたり、制約や規制は特に設けておりません。
          </p>
          <p>サイトのスクリーンショットなどもご自由にお使いください。</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-black text-base">🔺 事前連絡のお願い</h2>
          <p>
            記事やメディアに掲載いただく前に、事前のご連絡をお願いしております。
          </p>
          <p>
            カウカウは個人が運営するサイトです。トラフィックの急増により、サーバーがダウンする恐れがあります。掲載の前日などで結構です、できる限りなんとかしますのでご協力のほどよろしくお願いいたします。
          </p>
          <p>
            <Link
              href="#"
              className="underline text-blue-600 hover:text-blue-800"
            >
              &gt;メディア掲載の連絡をする
            </Link>
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-black text-base">🎤 取材について</h2>
          <p>
            バックエンドの技術的な構成から、発達障害に関する個人的な事象まで対応しています。まずは事前にお問い合わせください。
          </p>
          <p>
            <Link
              href="#"
              className="underline text-blue-600 hover:text-blue-800"
            >
              &gt;取材の相談をする
            </Link>
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <h2 className="font-black text-base">メディア掲載・紹介履歴</h2>
          <div className="space-y-4">
            {mediaHistory.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:gap-6">
                <span className="text-muted-foreground shrink-0 sm:w-24">
                  {item.date}
                </span>
                <div className="space-y-1">
                  <p className="font-black">{item.title}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800 break-all"
                  >
                    {item.url}
                  </a>
                  {item.note && <p className="font-black">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Link href="/" className="underline hover:no-underline">
            カウカウトップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
