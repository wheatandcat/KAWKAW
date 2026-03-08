import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type SpamResult = {
  spamScore: number;
  reasons: string[];
  aiChecked: boolean;
  isCandidate: boolean;
};

/**
 * スパムスコアを計算する
 * +1: NGワードを含む
 * +1: 短すぎる (10文字未満)
 * +1: 同一文字連続 (3文字以上)
 * +1: 1文字種類偏り
 * +1: 単語/文節が少ない
 * +1: 数値のみ
 */
export function calcSpamScore(
  comment: string,
  ngWords: string[],
): { score: number; reasons: string[] } {
  if (!comment || comment.trim() === "") {
    return { score: 5, reasons: ["空のコメント"] };
  }

  const text = comment.trim();
  let score = 0;
  const reasons: string[] = [];

  // NGワードチェック
  for (const word of ngWords) {
    if (text.includes(word)) {
      score += 1;
      reasons.push(`NGワード: "${word}"`);
      break;
    }
  }

  // 短すぎる (10文字未満)
  if (text.length < 10) {
    score += 1;
    reasons.push(`短すぎる (${text.length}文字)`);
  }

  // 同一文字の連続 (3文字以上)
  if (/(.)\1{2,}/.test(text)) {
    score += 1;
    reasons.push("同一文字連続");
  }

  // 1文字種類偏り
  const hiragana = (text.match(/[\u3041-\u3096]/g) ?? []).length;
  const katakana = (text.match(/[\u30A0-\u30FF]/g) ?? []).length;
  const kanji = (text.match(/[\u4E00-\u9FFF\u3400-\u4DBF]/g) ?? []).length;
  const ascii = (text.match(/[a-zA-Z]/g) ?? []).length;
  const digits = (text.match(/[0-9０-９]/g) ?? []).length;
  const meaningful = hiragana + katakana + kanji + ascii + digits;
  if (meaningful > 0) {
    const maxType = Math.max(hiragana, katakana, ascii);
    if (maxType / meaningful > 0.8 && kanji === 0 && text.length > 5) {
      score += 1;
      reasons.push("1文字種類偏り");
    }
  }

  // 単語/文節が少ない
  const segments = text
    .split(/[。、！？\n\s　,.!?]+/)
    .filter((s) => s.trim().length > 0);
  if (segments.length <= 2 && text.length < 20) {
    score += 1;
    reasons.push(`単語/文節が少ない (${segments.length}セグメント)`);
  }

  // 数値のみ (全角数字含む)
  if (/^[0-9０-９\s　]+$/.test(text)) {
    score += 4;
    reasons.push("数値のみ");
  }

  return { score, reasons };
}

/**
 * GPT-4.1 nano でスパム判定する
 */
async function checkSpamWithAI(
  comment: string,
): Promise<{ isSpam: boolean; reason: string }> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content:
            'あなたはECサイトのレビュースパム判定AIです。レビューコメントがスパム・荒らし・無意味な投稿かどうか判定してください。JSONのみ返してください: {"isSpam": boolean, "reason": string}',
        },
        {
          role: "user",
          content: `以下のレビューコメントを判定してください:\n\n${comment}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
    });

    const text = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text) as { isSpam?: boolean; reason?: string };
    return { isSpam: parsed.isSpam ?? false, reason: parsed.reason ?? "" };
  } catch {
    // AI判定失敗時はスパムでないとみなす
    return { isSpam: false, reason: "AI判定エラー" };
  }
}

/**
 * レビューのコメントをスキャンしてスパム判定する
 * - スコア4以上: 削除候補確定
 * - スコア2〜3: AI判定
 * - スコア0〜1: 正常
 */
export async function scanReview(
  comment: string,
  ngWords: string[],
): Promise<SpamResult> {
  const { score, reasons } = calcSpamScore(comment, ngWords);

  if (score >= 4) {
    return { spamScore: score, reasons, aiChecked: false, isCandidate: true };
  }

  if (score >= 2) {
    const { isSpam, reason } = await checkSpamWithAI(comment);
    const aiReasons = [
      ...reasons,
      `AI判定: ${isSpam ? `スパム (${reason})` : "正常"}`,
    ];
    return {
      spamScore: score,
      reasons: aiReasons,
      aiChecked: true,
      isCandidate: isSpam,
    };
  }

  return { spamScore: score, reasons, aiChecked: false, isCandidate: false };
}
