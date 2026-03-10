import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 - カウカウ",
  description: "架空通販サイト「カウカウ」の二次創作利用ガイドライン。",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 text-sm text-foreground leading-relaxed">
        <div className="space-y-2">
          <h1 className="font-black text-base">🐄「カウカウ」二次創作利用ガイドライン</h1>
          <p>架空通販サイト「カウカウ」へアクセスいただき、ありがとうございます。</p>
          <p>
            本サイトの架空商品を用いた表現活動について、皆さまの創造性を尊重するためのガイドラインを策定いたしました。
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-black text-base">💠 二次創作について</h2>
          <p>「カウカウ」の製品から着想を得た、あらゆる次元の創作物を歓迎いたします。</p>
          <p>
            漫画、小説、映像、音楽、演劇、コント、その他未知の表現媒体。有償・無償を問わず、自由なアウトプットが可能です。創作の補足として、商品説明文のスクリーンショットやテキストを引用いただいても構いません。
          </p>
          <p>
            クレジットは必須ではありませんが、元ネタとして「カウカウ」の名称とurlを添えていただけますと幸いです。また、創作物ができましたら管理者までお知らせいただけますと、ニューロンが大変きらめき喜びます<span className="font-black">。</span>
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-black text-base">📡 映像アーカイブでの配信について</h2>
          <p>
            YouTube等のプラットフォームにおける動画配信なども歓迎しています。 全宇宙に開かれた「全体公開」の形式であれば問題ありません。スパチャなどの収益化もOKです。ただし、 メンバーシップ限定など、アクセスを制限した閉鎖領域での公開はご遠慮くださ<span className="font-black">い。</span>
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-black text-base">⚠️ 禁止事項</h2>
          <p>当サイトの存続を脅かす以下の行為は、固くお断りいたします。</p>
          <p>・商品説明文やレビューをそのままコピーし、別のサイトを構築する行為。</p>
          <p>・「カウカウ」のコンテンツそのものが主成分となる著作物の作成と販売。</p>
          <p>
            ご自身の「創作」が主であるか判断に迷う場合は、その出力（制作）を一度停止することをお勧めします。
          </p>
        </div>

        <p>その他、不明な点がありましたらこちらからお問い合わせください。</p>

        <p>カウカウの架空商品とあなたの創造性が合わさり、宇宙が美しく拡張されることを願っております。</p>

        <div className="pt-4">
          <Link href="/" className="underline hover:no-underline">
            カウカウトップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
