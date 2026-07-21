"use client";

import { FormEvent, useState } from "react";

interface OrderReviewFormProps {
  bookingId: string;
  existingReview?: { rating: number; comment: string | null } | null;
  onSubmitted?: () => void;
}

export function OrderReviewForm({ bookingId, existingReview, onSubmitted }: OrderReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(!!existingReview);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/bookings/${bookingId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Failed to submit review.");
      return;
    }

    setSubmitted(true);
    onSubmitted?.();
  }

  if (submitted && existingReview) {
    return (
      <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3">
        <p className="text-sm font-semibold text-green-800">Your review</p>
        <div className="mt-1 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= (existingReview?.rating ?? rating) ? "text-accent-500" : "text-navy-200"}>
              ★
            </span>
          ))}
        </div>
        {(existingReview?.comment || comment) && (
          <p className="mt-2 text-sm text-navy-700">{existingReview?.comment || comment}</p>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
        Thank you for your review! ⭐
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-xl border border-navy-100 bg-surface p-4">
      <p className="text-sm font-semibold text-navy-800">Rate this order</p>
      <p className="mt-0.5 text-xs text-navy-500">How was your experience with this shipment?</p>

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl transition ${
              star <= (hover || rating) ? "text-accent-500 scale-110" : "text-navy-200"
            }`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your feedback (optional)..."
        rows={2}
        className="mt-3 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/25"
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-3 text-sm py-2">
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
