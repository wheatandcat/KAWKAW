import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#131921] text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-bold text-white">カウカウ</span>
            <span className="text-gray-500">.fake</span>
          </div>
          <nav className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/about" className="hover:text-white transition-colors">
              カウカウについて
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              利用規約
            </Link>
            <Link href="/media" className="hover:text-white transition-colors">
              メディア掲載
            </Link>
            <Link
              href="/campaign"
              className="hover:text-white transition-colors"
            >
              キャンペーン
            </Link>
          </nav>
          <p className="text-gray-400 text-[11px]">
            架空のECサイト。実際の決済は発生しません。
          </p>
        </div>
      </div>
    </footer>
  );
}
