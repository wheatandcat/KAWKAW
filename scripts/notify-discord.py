#!/usr/bin/env python3
"""
Discord Webhook で商品候補を投稿するスクリプト
Usage: python3 scripts/notify-discord.py plans/YYYY-MM-DD/products.md
"""
import sys
import os
import json
import urllib.request
import urllib.error
import re
import time

WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL")


def send_message(content: str):
    if not WEBHOOK_URL:
        print("Error: DISCORD_WEBHOOK_URL not set", file=sys.stderr)
        sys.exit(1)

    payload = json.dumps({"content": content}).encode("utf-8")
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "DiscordBot (kawkaw, 1.0)",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status not in (200, 204):
                print(f"Discord API error: {resp.status}", file=sys.stderr)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} {e.reason}", file=sys.stderr)
    time.sleep(1)  # Discord rate limit


def split_products(content: str) -> list[str]:
    """products.md から各商品セクションを抽出"""
    sections = re.split(r"(?=^## 商品\d+)", content, flags=re.MULTILINE)
    result = []
    for s in sections:
        s = s.strip()
        if not s.startswith("## 商品"):
            continue
        # TypeScriptコードブロックを除去してDiscord向けに整形
        simplified = re.sub(r"```typescript[\s\S]*?```", "", s)
        simplified = re.sub(r"\n{3,}", "\n\n", simplified).strip()
        result.append(simplified)
    return result


def main():
    if len(sys.argv) < 2:
        print("Usage: notify-discord.py <products.md>", file=sys.stderr)
        sys.exit(1)

    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}", file=sys.stderr)
        sys.exit(1)

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    date_match = re.search(r"\d{4}-\d{2}-\d{2}", filepath)
    date_str = date_match.group() if date_match else "本日"

    send_message(
        f"🛍️ **カウカウ 商品追加候補 {date_str}** (20件)\n"
        f"各商品を確認し、承認する商品IDをお知らせください。"
    )

    products = split_products(content)
    batch = ""
    for product in products:
        if len(batch) + len(product) + 10 > 1900:
            send_message(batch.rstrip())
            batch = ""
        batch += product + "\n\n---\n\n"

    if batch.strip():
        send_message(batch.rstrip())

    send_message(
        f"📁 プランファイル: `{filepath}`\n"
        "承認した商品を選んで「商品XXXをコードに追加して」と指示してください。"
    )


if __name__ == "__main__":
    main()
