"use client";

import React, { useState } from "react";
import ProductCard from "../../Acomponents/product-card";
import ProductCardSkeleton from "../../Acomponents/product-card-skeleton";
import Button from "@/components/ui/Button";

const PAGE_SIZE = 24;

interface AllProductsProps {
  products: ProductCardProps[];
  loading?: boolean;
}

const AllProducts = ({ products, loading }: AllProductsProps) => {
  // Parent remounts this via `key` when search/category changes, resetting the page.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <section className="md:max-w-300 w-full lg:mx-auto px-4 lg:px-0 flex flex-col gap-4 mb-6 my-3">
      <h5>All items</h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : products.length > 0 ? (
          visible.map((product, index) => (
            <ProductCard
              key={product.id}
              {...product}
              priority={index < 4}
            />
          ))
        ) : (
          <p className="text-grey-300 col-span-full">No items found.</p>
        )}
      </div>
      {!loading && hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            as="button"
            size="sm"
            variant="secondary"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          >
            Show more ({products.length - visibleCount} left)
          </Button>
        </div>
      )}
    </section>
  );
};

export default AllProducts;
