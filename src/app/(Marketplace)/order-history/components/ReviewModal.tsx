"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { submitReview, Review } from "@/lib/reviews";

interface ReviewModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (review: Review) => void;
}

const ReviewModal = ({ orderId, isOpen, onClose, onSubmitted }: ReviewModalProps) => {
  const [overallRating, setOverallRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = overallRating > 0 && qualityRating > 0 && deliveryRating > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const review = await submitReview(orderId, {
        overallRating,
        qualityRating,
        deliveryRating,
        comment: comment.trim() || undefined,
      });
      onSubmitted(review);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate your order" className="w-[35%]">
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="body-medium">Overall experience</p>
          <StarRating value={overallRating} onChange={setOverallRating} />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="body-medium">Product quality</p>
          <StarRating value={qualityRating} onChange={setQualityRating} />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="body-medium">Delivery speed</p>
          <StarRating value={deliveryRating} onChange={setDeliveryRating} />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2 w-full border border-[#E7E7E7] rounded-xl p-3">
            <textarea
              rows={3}
              maxLength={280}
              className="focus-within:outline-0 flex-1"
              placeholder="Tell us more (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <p className="text-grey-300 body-small self-end">{comment.length}/280</p>
        </div>

        {error && <p className="text-red-600 body-small text-center">{error}</p>}

        <Button
          as="button"
          size="lg"
          variant="primary"
          className="w-full"
          isDisabled={!canSubmit || loading}
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit review"}
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewModal;
