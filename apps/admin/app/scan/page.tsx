"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ScanSearch,
  Trash2,
  Loader2,
  Bot,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Review, ScanCandidate } from "@kawkaw/database";

type CandidateWithReview = ScanCandidate & { review: Review };

type ScanResult = {
  scanned: number;
  candidates: number;
  message: string;
};

export default function ScanPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: candidates = [], isLoading } = useQuery<CandidateWithReview[]>({
    queryKey: ["/api/scan/candidates"],
    queryFn: async () => {
      const res = await fetch("/api/scan/candidates", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    },
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/scan", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("スキャンに失敗しました");
      return res.json() as Promise<ScanResult>;
    },
    onSuccess: (result) => {
      setScanResult(result);
      queryClient.invalidateQueries({ queryKey: ["/api/scan/candidates"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewIds: number[]) => {
      const res = await fetch("/api/scan/candidates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reviewIds }),
      });
      if (!res.ok) throw new Error("削除に失敗しました");
    },
    onSuccess: () => {
      setSelected(new Set());
      setConfirmDelete(false);
      queryClient.invalidateQueries({ queryKey: ["/api/scan/candidates"] });
    },
  });

  const toggleSelect = (reviewId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  };

  const allSelected =
    candidates.length > 0 && selected.size === candidates.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(candidates.map((c) => c.reviewId)));
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(Array.from(selected));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <ScanSearch className="w-5 h-5" />
            スパムスキャン
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            前回スキャン以降の新しいレビューを自動判定して削除候補を表示します
          </p>
        </div>
        <Button
          onClick={() => scanMutation.mutate()}
          disabled={scanMutation.isPending}
          className="shrink-0"
        >
          {scanMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ScanSearch className="w-4 h-4 mr-2" />
          )}
          スキャン開始
        </Button>
      </div>

      {/* スキャン結果メッセージ */}
      {scanResult && (
        <div className="rounded-md bg-muted px-4 py-3 text-sm text-foreground">
          {scanResult.message}
        </div>
      )}
      {scanMutation.isError && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {scanMutation.error.message}
        </div>
      )}

      {/* 削除候補一覧 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            削除候補 {candidates.length} 件
          </h3>
          {selected.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              選択した {selected.size} 件を削除
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            削除候補はありません
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">商品</th>
                  <th className="px-4 py-3 text-left font-medium">
                    ニックネーム
                  </th>
                  <th className="px-4 py-3 text-left font-medium">コメント</th>
                  <th className="px-4 py-3 text-left font-medium">スコア</th>
                  <th className="px-4 py-3 text-left font-medium">判定理由</th>
                  <th className="px-4 py-3 text-left font-medium">AI判定</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    className={`bg-background hover:bg-muted/30 transition-colors cursor-pointer ${
                      selected.has(c.reviewId) ? "bg-destructive/5" : ""
                    }`}
                    onClick={() => toggleSelect(c.reviewId)}
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(c.reviewId)}
                        onChange={() => toggleSelect(c.reviewId)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.reviewId}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://kawkaw.app/product/${c.review.productId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge
                          variant="outline"
                          className="font-mono text-xs hover:bg-muted cursor-pointer"
                        >
                          {c.review.productId}
                          <ExternalLink className="ml-1 w-3 h-3" />
                        </Badge>
                      </a>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {c.review.nickname}
                    </td>
                    <td className="px-4 py-3 max-w-[280px] text-muted-foreground">
                      <p className="line-clamp-2" title={c.review.comment}>
                        {c.review.comment}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={c.spamScore >= 4 ? "destructive" : "secondary"}
                        className="font-mono"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {c.spamScore}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <ul className="space-y-0.5">
                        {c.reasons.map((r, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            · {r}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      {c.aiChecked && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Bot className="w-3 h-3" />
                          AI
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              選択したレビューを削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selected.size}{" "}
              件のレビューを完全に削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              )}
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
