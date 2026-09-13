"use client";

import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

const StarRating = ({ value, onChange, readOnly, size = 22 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`transition-colors duration-150 ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => onChange?.(star)}
        >
          <Star
            size={size}
            className={star <= value ? "text-amber-400 fill-amber-400" : "text-grey-200 fill-grey-200"}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
