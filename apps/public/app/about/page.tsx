import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カウカウについて - カウカウ",
  description:
    "カウカウは、個人が運営する架空の買い物シミュレーション・ジョークサイトです。",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-1.5 text-sm text-foreground leading-relaxed">
        <p>
          <Link
            href="/terms"
            className="underline text-blue-600 hover:text-blue-800"
          >
            創作活動への利用、配信などの利用規約はこちら
          </Link>
        </p>
        <p>
          <Link
            href="/media"
            className="underline text-blue-600 hover:text-blue-800"
          >
            メディア掲載、取材の問合せはこちら
          </Link>
        </p>

        <div className="pt-4 space-y-3">
          <h2 className="font-black text-base">🛒 カウカウへようこそ！</h2>
          <p>
            「カウカウ」は、個人が運営する架空の買い物シミュレーション・ジョークサイトです。ここではどれだけ買い物をしても、お金はかかりませんし、商品は届きません。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              すべて無料、酔狂と道楽とミツビシのおこづかいで運営されています。
            </li>
            <li>個人情報は不要、データの収集は一切行っていません。</li>
            <li>安心・安全！ 間違えて注文しても、誰にも迷惑はかかりません。</li>
          </ul>
        </div>

        <div className="pt-4 space-y-2">
          <h2 className="font-black text-base">誰が作っているのか</h2>
          <div>
            <p>
              ミツビシ（X:{" "}
              <Link
                href="https://x.com/mitsubisi"
                className="underline text-blue-600 hover:text-blue-800"
              >
                @mitsubisi
              </Link>
              ）
            </p>
            <p className="text-muted-foreground">
              デザイナー。アイデア出しや架空商品開発など
            </p>
          </div>
          <div>
            <p>
              ユニコーン（
              <Link
                href="https://github.com/wheatandcat"
                className="underline text-blue-600 hover:text-blue-800"
              >
                GitHub: @wheatandcat
              </Link>{" "}
              /{" "}
              <Link
                href="https://www.wheatandcat.me"
                className="underline text-blue-600 hover:text-blue-800"
              >
                blog
              </Link>
              ）
            </p>
            <p className="text-muted-foreground">
              エンジニア。システムの設計開発など。
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <h2 className="font-black text-base">
            💡 なぜこのサイトを作ったのか
          </h2>
          <p>
            運営者のミツビシにはADHD（注意欠陥多動症）の特性があり、かつては衝動買いが止まらず、週に何度も荷物が届く生活を送っていました。
          </p>
          <p>「この衝動を、現実ではない場所で発散できれば……」</p>
          <p>そんなアイデアから生まれたのが、このカウカウです。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>衝動性に： 架空の買い物。</li>
            <li>多動性に： 大量の読み物とレビュー書き込み。</li>
            <li>注意欠陥に： 失敗しても実害のないシステム。</li>
          </ul>
          <p>
            同じような悩みを持つ方や、ちょっとしたストレス発散をしたい方に、自由に楽しんでいただければ幸いです。
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <h2 className="font-black text-base">
            ⚠️ サイトのこだわり（現実と区別するために）
          </h2>
          <p>
            間違えて本物の通販サイトで買い物をしてしまわないよう「非現実」にこだわっています。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>実在しない商品のみを掲載</li>
            <li>商品画像は使わない</li>
            <li>代引きやクレジット決済など、現実を連想させる言葉を排除</li>
          </ul>
        </div>

        <div className="pt-4 space-y-3">
          <h2 className="font-black text-base">
            ✍️ みんなで創る「架空レビュー」
          </h2>
          <p>
            サイト内のレビューはすべて、ユーザーの皆様によるユーモア溢れる投稿です。
            皆様の豊かな知識と想像力、ひとつまみの悪ノリがこのサイトを支えています。いつもありがとうございます！
          </p>
          <p className="text-muted-foreground">
            ※不適切なレビューは「時空警察」が即座にヴォイド（虚無）へ送りますのでご安心ください。
          </p>
        </div>

        <div className="pt-8">
          <Link href="/" className="underline hover:no-underline">
            カウカウトップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
