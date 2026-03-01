"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/reviews");
    } else {
      setError("パスワードが正しくありません");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-lg border border-border bg-card">
        <div>
          <h2 className="text-lg font-semibold text-foreground">ログイン</h2>
          <p className="text-sm text-muted-foreground mt-1">
            管理画面にアクセスするにはパスワードが必要です
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !password}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            ログイン
          </Button>
        </form>
      </div>
    </div>
  );
}
