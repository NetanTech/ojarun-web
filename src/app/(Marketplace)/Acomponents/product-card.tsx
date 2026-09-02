"use client";

import { Heart, Minus, Plus } from "../../../../public/svg/svg";
import Image from "next/image";
import React from "react";
import { formatCurrency } from "../../../../lib/utils";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favoritesContext";

const ProductCard = (props: ProductCardProps) => {
  const cart = useCart();
  const favorites = useFavorites();
  const quantity = cart.getQuantity(props.id);
  const favorited = favorites.isFavorited(props.id);

  const addOne = () =>
    cart.addItem(
      {
        id: props.id,
        name: props.name,
        price: props.price,
        image: props.imageURL,
        unit: props.more,
      },
      1,
    );

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
          className={`absolute top-2 right-2 ${favorited ? "bg-green-50 text-green-500" : "bg-grayScale-50/60"} p-1.5 sm:p-2 flex items-center justify-center rounded-full`}
          onClick={() => favorites.toggle(props)}
        >
          <Heart
            size={16}
            className="sm:size-5"
            fill={favorited ? "#004A19" : "none"}
            stroke={favorited ? "#004A19" : "black"}
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
            onClick={addOne}
          >
            <Plus size={16} className="sm:size-5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-green-500 text-white rounded-full shrink-0">
            <button
              className="text-white p-1.5 sm:p-2 rounded-full"
              onClick={() => cart.setQuantity(props.id, quantity - 1)}
            >
              <Minus size={12} className="sm:size-[15px]" />
            </button>

            <p className="body-small">{quantity}</p>

            <button
              className="text-white p-1.5 sm:p-2 rounded-full"
              onClick={addOne}
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
