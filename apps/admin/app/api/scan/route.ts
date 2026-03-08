import { NextResponse } from "next/server";
import { storage } from "@kawkaw/database";
import { scanReview } from "@/server/spam-detector";

export const maxDuration = 60;

export async function POST() {
  const [progress, ngWordRows] = await Promise.all([
    storage.getScanProgress(),
    storage.getNgWords(),
  ]);

  const afterId = progress?.lastScannedId ?? 0;
  const ngWords = ngWordRows.map((w) => w.word);

  const targetReviews = await storage.getReviewsForScan(afterId);

  if (targetReviews.length === 0) {
    return NextResponse.json({ scanned: 0, candidates: 0, message: "新しいレビューはありません" });
  }

  // 並列でスキャン実行
  const results = await Promise.all(
    targetReviews.map(async (review) => {
      const result = await scanReview(review.comment, ngWords);
      return { review, result };
    })
  );

  // 削除候補をDBに保存
  let candidateCount = 0;
  for (const { review, result } of results) {
    if (result.isCandidate) {
      await storage.addScanCandidate(review.id, result.spamScore, result.reasons, result.aiChecked);
      candidateCount++;
    }
  }

  // スキャン済み最大IDを更新
  const maxScannedId = Math.max(...targetReviews.map((r) => r.id));
  await storage.updateScanProgress(maxScannedId);

  return NextResponse.json({
    scanned: targetReviews.length,
    candidates: candidateCount,
    message: `${targetReviews.length}件をスキャンし、${candidateCount}件の削除候補を検出しました`,
  });
}
