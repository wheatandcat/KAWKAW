import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function moderateText(text: string): Promise<{ flagged: boolean }> {
  try {
    const response = await client.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });
    return { flagged: response.results[0].flagged };
  } catch (error) {
    // API障害時はフェイルオープン（投稿を通す）
    console.error("Moderation API error:", error);
    return { flagged: false };
  }
}
