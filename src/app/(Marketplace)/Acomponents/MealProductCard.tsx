"use client";

import { Heart, Minus, Plus } from "../../../../public/svg/svg";
import Image from "next/image";
import React, { useState } from "react";
import { formatCurrency } from "../../../../lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/cart";

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
  wishlisted,
  onClick,
}: MealProductCardProps) => {
  const [addToWishlist, setAddToWishlist] = useState(false);
  const [showMealDetail, setShowMealDetail] = useState(false);
  const cart = useCart();
  const quantity = cart.getQuantity(id);

  const addMealToCart = () => {
    cart.addItem(
      { id, name, price: totalPrice, image: imageURL, unit: servings },
      1,
    );
    setShowMealDetail(false);
  };

  return (
    <div
      className="flex flex-col gap-2 sm:gap-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl aspect-5/3">
        <Image
          src={imageURL || "/assets/Untitled design.png"}
          alt={name}
          width={500}
          height={300}
          className="object-cover w-full h-full"
        />

        <button
          className={`absolute top-2 right-2 ${
            addToWishlist || wishlisted
              ? "bg-green-50 text-[#004A19]"
              : "bg-white/70"
          } p-1.5 sm:p-2 rounded-full`}
          onClick={(e) => {
            e.stopPropagation();
            setAddToWishlist((prev) => !prev);
          }}
        >
          <Heart
            size={16}
            className="sm:size-5"
            fill={addToWishlist || wishlisted ? "#004A19" : "none"}
            stroke={addToWishlist || wishlisted ? "#004A19" : "black"}
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
          className="w-225 h-150"
          title="Meal based order"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 w-full h-full justify-between">
            <div className="flex flex-col h-full gap-2 flex-1">
              <div className="h-48 md:h-[80%] overflow-hidden rounded-lg">
                <Image
                  src={imageURL || "/assets/Untitled design.png"}
                  alt={name}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="body-large font-medium">{name}</p>
                <p className="body-large font-medium">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
              <p className="text-grey-300 body-small">
                {ingredients.length} ingredients • {servings}
              </p>
            </div>
            <div className="flex flex-col flex-1 h-full gap-7">
              <div
                className="flex flex-col gap-2 overflow-y-auto  md:max-h-none md:h-[80%]"
                style={{ scrollbarWidth: "none" }}
              >
                {ingredients.map((ingredient, i) => (
                  <div
                    className="w-full flex items-center justify-between border border-[#e7e7e7] rounded-lg p-2 px-2.5"
                    key={i}
                  >
                    <div className="flex flex-col gap-2">
                      <h6>{ingredient.product.name}</h6>
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
