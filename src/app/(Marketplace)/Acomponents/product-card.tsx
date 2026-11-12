"use client";

import { Heart, Minus, Plus } from "../../../../public/svg/svg";
import Image from "next/image";
import React, { memo } from "react";
import { formatCurrency } from "../../../../lib/utils";
import { useCartActions, useCartQuantity } from "@/lib/cart";
import { useFavorites } from "@/lib/favoritesContext";
import { useToast } from "@/components/ui/Toast";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

type ProductCardExtras = ProductCardProps & {
  /** Only the first few above-the-fold cards should opt into this. */
  priority?: boolean;
};

function FavoriteButton({ product }: { product: ProductCardProps }) {
  const favorites = useFavorites();
  const { showToast } = useToast();
  const favorited = favorites.isFavorited(product.id);

  return (
    <button
      className={`absolute top-2 right-2 ${favorited ? "bg-green-50 text-green-500" : "bg-grayScale-50/60"} p-1.5 sm:p-2 flex items-center justify-center rounded-full`}
      onClick={() => {
        if (!favorited) showToast("Added to favourites");
        favorites.toggle(product);
      }}
    >
      <Heart
        size={16}
        className="sm:size-5"
        fill={favorited ? "#004A19" : "none"}
        stroke={favorited ? "#004A19" : "black"}
      />
    </button>
  );
}

function CartControls({ product }: { product: ProductCardProps }) {
  const { addItem, setQuantity } = useCartActions();
  const quantity = useCartQuantity(product.id);
  const { showToast } = useToast();

  const addOne = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageURL,
        unit: product.more,
      },
      1,
    );
    if (quantity === 0) showToast("Added to cart");
  };

  if (quantity === 0) {
    return (
      <button
        className="bg-primary text-white p-1.5 sm:p-2 rounded-full shrink-0"
        onClick={addOne}
      >
        <Plus size={16} className="sm:size-5" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-green-500 text-white rounded-full shrink-0">
      <button
        className="text-white p-1.5 sm:p-2 rounded-full"
        onClick={() => setQuantity(product.id, quantity - 1)}
      >
        <Minus size={12} className="sm:size-[15px]" />
      </button>

      <p className="body-small">{quantity}</p>

      <button className="text-white p-1.5 sm:p-2 rounded-full" onClick={addOne}>
        <Plus size={12} className="sm:size-[15px]" />
      </button>
    </div>
  );
}

const ProductCard = memo(function ProductCard(props: ProductCardExtras) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="relative overflow-hidden rounded-2xl aspect-[5/3] bg-[#F3F4F6]">
        <Image
          src={props.imageURL || "/assets/Untitled design.png"}
          className="object-cover h-full w-full"
          alt={props.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading={props.priority ? "eager" : "lazy"}
          priority={props.priority}
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />

        <FavoriteButton product={props} />
      </div>

      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex flex-col min-w-0">
          <h6 className="font-medium truncate w-full">{props.name}</h6>
          <p className="text-grey-300 capitalize text-sm sm:text-base">
            {props.more}
          </p>
          <p className="text-sm sm:text-base">{formatCurrency(props.price)}</p>
        </div>

        <CartControls product={props} />
      </div>
    </div>
  );
});

export default ProductCard;
