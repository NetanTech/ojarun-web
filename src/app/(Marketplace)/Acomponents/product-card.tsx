"use client";

import { Heart, Minus, Plus } from "../../../../public/svg/svg";
import Image from "next/image";
import React, { memo, useCallback, useEffect, useState } from "react";
import { formatCurrency } from "../../../../lib/utils";
import { useCartActions, useCartQuantity } from "@/lib/cart";
import { useFavorites } from "@/lib/favoritesContext";
import { useToast } from "@/components/ui/Toast";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import Modal from "@/components/ui/Modal";
import { fetchProductDetail } from "@/lib/products";
import Link from "next/link";
import { productPath } from "@/lib/productSlug";

type ProductCardExtras = ProductCardProps & {
  /** Only the first few above-the-fold cards should opt into this. */
  priority?: boolean;
};

export function FavoriteButton({ product }: { product: ProductCardProps }) {
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

export function CartControls({ product }: { product: ProductCardProps }) {
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

function ProductDetails({
  product,
  onClose,
}: {
  product: ProductCardProps;
  onClose: () => void;
}) {
  const [description, setDescription] = useState<string | null | undefined>(
    product.description,
  );
  const [loading, setLoading] = useState(product.description === undefined);

  useEffect(() => {
    if (product.description !== undefined) return;
    let cancelled = false;
    fetchProductDetail(product.id)
      .then((d) => {
        if (!cancelled) setDescription(d.description ?? null);
      })
      .catch(() => {
        if (!cancelled) setDescription(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [product.id, product.description]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={product.name}
      className="w-full max-w-lg mx-4"
    >
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-[#F3F4F6]">
          <Image
            src={product.imageURL || "/assets/Untitled design.png"}
            className="object-cover"
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 512px"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
          <FavoriteButton product={product} />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <p className="text-lg font-semibold">
              {formatCurrency(product.price)}
            </p>
            <p className="text-grey-300 text-sm capitalize">
              Per {product.more.replace(/^per\s+/i, "")}
              {product.category && product.category !== "Uncategorized"
                ? ` · ${product.category}`
                : ""}
            </p>
          </div>
          <CartControls product={product} />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">About this item</p>
          {loading ? (
            <div className="flex flex-col gap-2" aria-label="Loading description">
              <span className="h-3 w-full rounded bg-grey-50 animate-pulse" />
              <span className="h-3 w-2/3 rounded bg-grey-50 animate-pulse" />
            </div>
          ) : (
            <p className="text-sm text-grey-400 leading-relaxed">
              {description?.trim() ||
                "No description yet. Our market agent will pick the freshest available and contact you if anything differs."}
            </p>
          )}
        </div>

        <Link
          href={productPath(product)}
          className="text-sm font-medium text-primary underline self-start"
        >
          View full page &amp; share
        </Link>
      </div>
    </Modal>
  );
}

const ProductCard = memo(function ProductCard(props: ProductCardExtras) {
  const [showDetails, setShowDetails] = useState(false);
  const { priority, ...product } = props;
  const closeDetails = useCallback(() => setShowDetails(false), []);

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="relative overflow-hidden rounded-2xl aspect-[5/3] bg-[#F3F4F6]">
        <button
          type="button"
          className="absolute inset-0 cursor-pointer"
          onClick={() => setShowDetails(true)}
          aria-label={`View details for ${product.name}`}
        >
          <Image
            src={product.imageURL || "/assets/Untitled design.png"}
            className="object-cover h-full w-full"
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </button>

        <FavoriteButton product={product} />
      </div>

      <div className="flex items-start justify-between gap-3 w-full">
        <button
          type="button"
          className="flex flex-col min-w-0 text-left cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <h6 className="font-medium truncate w-full">{product.name}</h6>
          <p className="text-grey-300 capitalize text-sm sm:text-base">
            {product.more}
          </p>
          <p className="text-sm sm:text-base">{formatCurrency(product.price)}</p>
        </button>

        <CartControls product={product} />
      </div>

      {showDetails && (
        <ProductDetails
          product={product}
          onClose={closeDetails}
        />
      )}
    </div>
  );
});

export default ProductCard;
