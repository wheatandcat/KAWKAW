"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, Loader2, Send } from "lucide-react";
import type { Review } from "@kawkaw/database";

interface ReviewSectionProps {
  productId: string;
}

function StarRating({ rating, onRate, interactive = false }: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          onClick={() => onRate?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          data-testid={interactive ? `star-${i}` : undefined}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              i <= (hover || rating)
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-border py-4 last:border-b-0" data-testid={`review-item-${review.id}`}>
      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
        <span className="text-sm font-semibold text-foreground" data-testid={`review-nickname-${review.id}`}>
          {review.nickname}
        </span>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm font-medium text-foreground mb-1" data-testid={`review-title-${review.id}`}>
        {review.title}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`review-comment-${review.id}`}>
        {review.comment}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-2">
        {new Date(review.createdAt).toLocaleDateString("ja-JP")}
      </p>
    </div>
  );
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: [`/api/reviews/${productId}`],
    staleTime: 30000,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, nickname, rating, title, comment }),
      });
      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }
      return res.json();
    },
    onSuccess: (newReview: Review) => {
      queryClient.setQueryData<Review[]>([`/api/reviews/${productId}`], (prev = []) => [newReview, ...prev]);
      setShowForm(false);
      setNickname("");
      setRating(0);
      setTitle("");
      setComment("");
      toast({ title: "レビューを投稿しました", description: "ありがとうございます！" });
    },
    onError: () => {
      toast({ title: "投稿に失敗しました", description: "入力内容を確認してください。", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "評価を選択してください", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mt-8 max-w-5xl mx-auto px-4 pb-8">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-lg font-bold text-foreground" data-testid="text-reviews-title">
          カスタマーレビュー
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              ({reviews.length}件)
            </span>
          </div>
        )}
      </div>

      {!showForm ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 mb-6"
          onClick={() => setShowForm(true)}
          data-testid="button-write-review"
        >
          <MessageSquare className="w-4 h-4" />
          レビューを書く
        </Button>
      ) : (
        <Card className="p-4 mb-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">レビューを書く</h3>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">評価</label>
              <StarRating rating={rating} onRate={setRating} interactive data-testid="input-rating" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">ニックネーム</label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="匿名ユーザー"
                maxLength={30}
                required
                data-testid="input-nickname"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">タイトル</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="レビューのタイトル"
                maxLength={100}
                required
                data-testid="input-review-title"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">コメント</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="商品についての感想を書いてください..."
                maxLength={1000}
                rows={4}
                required
                className="resize-none"
                data-testid="input-review-comment"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm" className="gap-1.5" disabled={mutation.isPending} data-testid="button-submit-review">
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                投稿する
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                data-testid="button-cancel-review"
              >
                キャンセル
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4" data-testid="text-no-reviews">
          まだレビューがありません。最初のレビューを書いてみませんか？
        </p>
      ) : (
        <div data-testid="reviews-list">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
