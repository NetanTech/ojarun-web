"use client";

import React from "react";
import ProductCard from "./product-card";
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductGridProps {
  products: ProductCardProps[];
  loading?: boolean;
  emptyMessage?: string;
  showWishlistButton?: boolean;
  showAddToCart?: boolean;
  onProductClick?: (product: ProductCardProps) => void;
}

const ProductGrid = ({
  products,
  loading = false,
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        return <ProductCard key={product.id} {...product} />;
      })}
    </div>
  );
};

export default ProductGrid;
