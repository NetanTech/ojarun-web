"use client";

import { Heart, Minus, Plus } from "../../../../public/svg/svg";
import Image from "next/image";
import React, { useState } from "react";
import { formatCurrency } from "../../../../lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/cart";
import { useMealFavorites } from "@/lib/mealFavoritesContext";
import { useToast } from "@/components/ui/Toast";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";

function MealImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      placeholder="blur"
      blurDataURL={IMAGE_BLUR_DATA_URL}
      onLoadingComplete={() => setLoaded(true)}
      className={`object-cover transition-opacity duration-200 ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}

interface MealProductCardProps extends Meal {
  onClick?: () => void;
}

const MealProductCard = ({
  id,
  name,
  imageURL,
  servings,
  totalPrice,
  ingredients,
  onClick,
}: MealProductCardProps) => {
  const [showMealDetail, setShowMealDetail] = useState(false);
  const cart = useCart();
  const mealFavorites = useMealFavorites();
  const { showToast } = useToast();
  const quantity = cart.getQuantity(id);
  const favorited = mealFavorites.isFavorited(id);

  const addMealToCart = () => {
    cart.addItem(
      { id, name, price: totalPrice, image: imageURL, unit: servings },
      1,
    );
    showToast("Added to cart");
    setShowMealDetail(false);
  };

  return (
    <div
      className="flex flex-col gap-2 sm:gap-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[5/3] bg-[#F3F4F6]">
        <MealImage
          src={imageURL || "/assets/Untitled design.png"}
          alt={name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <button
          className={`absolute top-2 right-2 ${
            favorited ? "bg-green-50 text-[#004A19]" : "bg-white/70"
          } p-1.5 sm:p-2 rounded-full`}
          onClick={(e) => {
            e.stopPropagation();
            const wasFavorited = favorited;
            mealFavorites.toggle({
              id,
              name,
              imageURL,
              servings,
              totalPrice,
              ingredientCount: ingredients.length,
            });
            if (!wasFavorited) showToast("Added to favourites");
          }}
        >
          <Heart
            size={16}
            className="sm:size-5"
            fill={favorited ? "#004A19" : "none"}
            stroke={favorited ? "#004A19" : "black"}
          />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <h6 className="font-medium truncate">{name}</h6>

          <p className="text-grey-300 text-xs sm:text-sm">
            {ingredients.length} ingredients • {servings}
          </p>

          <p className="text-sm sm:text-base font-medium mt-1">
            {formatCurrency(totalPrice)}
          </p>
        </div>

        {quantity === 0 ? (
          <button
            className="bg-primary text-white p-1.5 sm:p-2 rounded-full shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowMealDetail(true);
            }}
          >
            <Plus size={16} className="sm:size-5" />
          </button>
        ) : (
          <div
            className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-primary text-white rounded-full shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => cart.setQuantity(id, quantity - 1)}>
              <Minus size={12} className="sm:size-3.75" />
            </button>

            <span className="body-small">{quantity}</span>

            <button onClick={addMealToCart}>
              <Plus size={12} className="sm:size-3.75" />
            </button>
          </div>
        )}
      </div>

      {showMealDetail && (
        <Modal
          isOpen={showMealDetail}
          onClose={() => setShowMealDetail(false)}
          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto mx-4"
          title="Meal based order"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-2 sm:p-4 w-full justify-between">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="relative h-48 md:h-72 overflow-hidden rounded-lg bg-[#F3F4F6]">
                <MealImage
                  src={imageURL || "/assets/Untitled design.png"}
                  alt={name}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="body-large font-medium truncate min-w-0">{name}</p>
                <p className="body-large font-medium shrink-0">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
              <p className="text-grey-300 body-small">
                {ingredients.length} ingredients • {servings}
              </p>
            </div>
            <div className="flex flex-col flex-1 gap-7 min-w-0">
              <div
                className="flex flex-col gap-2 overflow-y-auto max-h-64 md:max-h-72"
                style={{ scrollbarWidth: "none" }}
              >
                {ingredients.map((ingredient, i) => (
                  <div
                    className="w-full flex items-center justify-between gap-2 border border-[#e7e7e7] rounded-lg p-2 px-2.5"
                    key={i}
                  >
                    <div className="flex flex-col gap-2 min-w-0">
                      <h6 className="truncate">{ingredient.product.name}</h6>
                      <p className="body-small text-grey-300">
                        {ingredient.product.unit}
                      </p>
                      <p>{formatCurrency(ingredient.product.price)}</p>
                    </div>

                    <div className="flex items-center justify-center px-3 py-1.5 bg-primary text-white rounded-full shrink-0">
                      <span className="body-small">x{ingredient.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                as="button"
                size="sm"
                variant="primary"
                onClick={addMealToCart}
              >
                Add to cart {formatCurrency(totalPrice)}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MealProductCard;
