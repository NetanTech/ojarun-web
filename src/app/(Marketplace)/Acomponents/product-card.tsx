"use client";

import { Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { formatCurrency } from "../../../../lib/utils";

const ProductCard = (props: ProductCardProps) => {
  const [addToWishlist, setAddToWishlist] = useState(false);

  const [quantity, setQuantity] = useState(0);
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="relative overflow-hidden rounded-2xl aspect-[5/3]">
        <Image
          src={props.imageURL || "/assets/Untitled design.png"}
          className="object-cover h-full w-full"
          loading="eager"
          alt={props.name}
          width={500}
          height={300}
        />

        <button
          className={`absolute top-2 right-2 ${addToWishlist || props.wishlisted ? "bg-green-50 text-green-500" : "bg-grayScale-50/60"} p-1.5 sm:p-2 flex items-center justify-center rounded-full`}
          onClick={() => setAddToWishlist(!addToWishlist)}
        >
          <Heart
            size={16}
            className="sm:size-5"
            fill={addToWishlist || props.wishlisted ? "#004A19" : "none"}
            stroke={addToWishlist || props.wishlisted ? "#004A19" : "black"}
          />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex flex-col min-w-0">
          <h6 className="font-medium truncate w-full">{props.name}</h6>
          <p className="text-grey-300 capitalize text-sm sm:text-base">{props.more}</p>
          <p className="text-sm sm:text-base">{formatCurrency(props.price)}</p>
        </div>

        {quantity === 0 ? (
          <button
            className="bg-primary text-white p-1.5 sm:p-2 rounded-full shrink-0"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            <Plus size={16} className="sm:size-5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-green-500 text-white rounded-full shrink-0">
            <button
              className="text-white p-1.5 sm:p-2 rounded-full"
              onClick={() => {
                if (quantity !== 0) {
                  setQuantity((prev) => prev - 1);
                }
              }}
            >
              <Minus size={12} className="sm:size-[15px]" />
            </button>

            <p className="body-small">{quantity}</p>

            <button
              className="text-white p-1.5 sm:p-2 rounded-full"
              onClick={() => {
                if (quantity > 0) {
                  setQuantity((prev) => prev + 1);
                }
              }}
            >
              <Plus size={12} className="sm:size-[15px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
