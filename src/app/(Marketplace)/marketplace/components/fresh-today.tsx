"use client";

import React from "react";
import ProductCard from "../../Acomponents/product-card";
import ProductCardSkeleton from "../../Acomponents/product-card-skeleton";

interface FreshTodayProps {
  products: ProductCardProps[];
  loading?: boolean;
}

const FreshToday = ({ products, loading }: FreshTodayProps) => {
  if (!loading && products.length === 0) return null;

  return (
    <section className="md:max-w-300 w-full lg:mx-auto px-4 lg:px-0 flex flex-col gap-4 mb-6 my-3">
      <h5>Fresh Today</h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product.id} {...product} />)}
      </div>
    </section>
  );
};

export default FreshToday;
