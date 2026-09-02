"use client";

import React from "react";
import ProductCard from "../../Acomponents/product-card";
import ProductCardSkeleton from "../../Acomponents/product-card-skeleton";

interface AllProductsProps {
  products: ProductCardProps[];
  loading?: boolean;
}

const AllProducts = ({ products, loading }: AllProductsProps) => {
  return (
    <section className="md:max-w-300 w-full lg:mx-auto px-4 lg:px-0 flex flex-col gap-4 mb-6 my-3">
      <h5>All items</h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} {...product} />)
        ) : (
          <p className="text-grey-300 col-span-full">No items found.</p>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
