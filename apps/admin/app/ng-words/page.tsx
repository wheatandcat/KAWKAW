"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NgWord } from "@kawkaw/database";

export default function NgWordsPage() {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const { data: words = [], isLoading } = useQuery<NgWord[]>({
    queryKey: ["/api/ng-words"],
    queryFn: async () => {
      const res = await fetch("/api/ng-words", { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (word: string) => {
      const res = await fetch("/api/ng-words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ word }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "追加に失敗しました");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ng-words"] });
      setInput("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/ng-words/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("削除に失敗しました");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ng-words"] });
    },
  });

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMutation.mutate(trimmed);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          NGワード管理
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          スキャン時にスパムスコアを上げるNGワードを管理します
        </p>
      </div>

      {/* 追加フォーム */}
      <div className="flex gap-2">
        <Input
          placeholder="NGワードを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="max-w-xs"
        />
        <Button onClick={handleAdd} disabled={!input.trim() || addMutation.isPending}>
          {addMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          追加
        </Button>
      </div>

      {addMutation.isError && (
        <p className="text-sm text-destructive">{addMutation.error.message}</p>
      )}

      {/* 一覧 */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : words.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">NGワードはまだ登録されていません</p>
      ) : (
        <div className="rounded-md border border-border divide-y divide-border">
          {words.map((w) => (
            <div key={w.id} className="flex items-center justify-between px-4 py-3">
              <span className="font-medium">{w.word}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteMutation.mutate(w.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
