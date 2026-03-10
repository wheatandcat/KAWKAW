import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ベスト架空ストアアワード2026大賞受賞！ - カウカウ",
  description:
    "架空通販サイト「カウカウ」がベスト架空ストアアワード2026大賞を受賞しました。",
};

export default function CampaignPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div
        className="relative w-full py-24 flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0ea5a0 0%, #06b6d4 30%, #0891b2 60%, #0e7490 100%)",
        }}
      >
        {/* confetti dots decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: "8%", top: "20%", color: "#f9a8d4", size: 18 },
            { left: "15%", top: "60%", color: "#fde68a", size: 14 },
            { left: "25%", top: "35%", color: "#86efac", size: 10 },
            { left: "35%", top: "75%", color: "#c4b5fd", size: 16 },
            { left: "50%", top: "15%", color: "#fca5a5", size: 12 },
            { left: "62%", top: "65%", color: "#fdba74", size: 20 },
            { left: "72%", top: "25%", color: "#6ee7b7", size: 14 },
            { left: "80%", top: "55%", color: "#f9a8d4", size: 10 },
            { left: "90%", top: "40%", color: "#fde68a", size: 16 },
            { left: "5%", top: "80%", color: "#a5b4fc", size: 12 },
            { left: "45%", top: "85%", color: "#86efac", size: 18 },
            { left: "88%", top: "75%", color: "#fca5a5", size: 10 },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-80"
              style={{
                left: dot.left,
                top: dot.top,
                width: dot.size,
                height: dot.size,
                backgroundColor: dot.color,
              }}
            />
          ))}
        </div>
        <h1
          className="relative text-white text-center font-black leading-tight px-4"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            letterSpacing: "-0.04em",
          }}
        >
          <span className="block">架空ショッピング</span>
          <span className="block">ベスト架空ストアアワード</span>
          <span className="block">2026大賞受賞！</span>
        </h1>
      </div>

      {/* Thank you message */}
      <div className="py-12 px-4 text-center">
        <p
          className="font-black leading-relaxed mx-auto"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            maxWidth: 640,
            letterSpacing: "-0.04em",
          }}
        >
          <span className="block">皆様のおかげでカウカウは2026年度、</span>
          <span className="block">
            ベスト架空ストアアワード大賞を受賞しました。
          </span>
          <span className="block">たくさんの推薦コメントをお寄せいただき</span>
          <span className="block">まことにありがとうございました。</span>
          <span className="block">
            下記一部のコメントを抜粋して紹介させていただきます。
          </span>
        </p>
      </div>

      {/* Quotes */}
      <div
        className="py-10 px-4 text-center space-y-2"
        style={{ color: "#d5c3a7" }}
      >
        {/* Large center quote with ruby */}
        <div className="mb-8">
          <p
            className="font-black leading-tight mx-auto"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
              letterSpacing: "-0.04em",
              maxWidth: 800,
            }}
          >
            <ruby>
              実物<rp>(</rp>
              <rt className="text-sm">リアル</rt>
              <rp>)</rp>
            </ruby>
            より満たされる
            <ruby>
              虚像<rp>(</rp>
              <rt className="text-sm">フェイク</rt>
              <rp>)</rp>
            </ruby>
            が、ここにある
          </p>
          <p
            className="font-black mt-2"
            style={{
              fontSize: "clamp(0.8rem, 1.5vw, 1.25rem)",
              letterSpacing: "-0.04em",
            }}
          >
            ─Xユーザー
          </p>
        </div>

        {/* 2-column quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-4">
          {/* 1: スマホ左寄せ */}
          <div className="text-left">
            <p
              className="font-black leading-snug whitespace-pre-line"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {"絵に描いた餅が\n買えるのは、ここだけ"}
            </p>
            <p
              className="font-black mt-1"
              style={{
                fontSize: "clamp(0.75rem, 1.2vw, 1.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              ─Xユーザー
            </p>
          </div>
          {/* 2: スマホ右寄せ */}
          <div className="text-right md:text-left">
            <p
              className="font-black leading-snug whitespace-pre-line"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {"素敵なイマジネーションと\nリアルなハッピー体験を"}
            </p>
            <p
              className="font-black mt-1"
              style={{
                fontSize: "clamp(0.75rem, 1.2vw, 1.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              ─Xユーザー
            </p>
          </div>
          {/* 3: スマホ左寄せ */}
          <div className="text-left">
            <p
              className="font-black leading-snug"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              机上の買い物を、あなたに
            </p>
            <p
              className="font-black mt-1"
              style={{
                fontSize: "clamp(0.75rem, 1.2vw, 1.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              ─Xユーザー
            </p>
          </div>
          {/* 4: スマホ右寄せ */}
          <div className="text-right md:text-left">
            <p
              className="font-black leading-snug whitespace-pre-line"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 2.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {"買いたいの　欲望満たす\nカウカウで"}
            </p>
            <p
              className="font-black mt-1"
              style={{
                fontSize: "clamp(0.75rem, 1.2vw, 1.25rem)",
                letterSpacing: "-0.04em",
              }}
            >
              ─架空川柳・中学生の部入賞作品
            </p>
          </div>
        </div>
      </div>

      {/* New content announcement */}
      <div className="py-12 px-4 text-center">
        <p
          className="font-black mx-auto"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.5rem)",

            letterSpacing: "-0.04em",
          }}
        >
          受賞を記念いたしまして、カウカウに以下のコンテンツを追加しました。
        </p>
        <div
          className="mt-6 space-y-2 font-black"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            letterSpacing: "-0.04em",
          }}
        >
          <p>
            <Link
              href="/about"
              className="hover:underline text-blue-600 hover:text-blue-800"
            >
              カウカウについて
            </Link>
          </p>
          <p>
            <Link
              href="/terms"
              className="hover:underline text-blue-600 hover:text-blue-800"
            >
              二次創作利用規約
            </Link>
          </p>
          <p>
            <Link
              href="/media"
              className="hover:underline text-blue-600 hover:text-blue-800"
            >
              メディア掲載について
            </Link>
          </p>
        </div>
        <p
          className="font-black mt-8"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            letterSpacing: "-0.04em",
          }}
        >
          今後ともカウカウをよろしくお願いいたします。
        </p>
        <div className="mt-12">
          <Link
            href="/"
            className="font-black hover:underline"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            カウカウトップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
