"use client";

import React from "react";
import ProductCard from "../../Acomponents/product-card";

const FreshToday = () => {
  return (
    <section className="md:max-w-300 w-full lg:mx-auto px-4 lg:px-0 flex flex-col gap-4 mb-6 my-3">
        <h5>Fresh Today</h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <ProductCard
        category="rice"
        imageURL="/assets/cornflakes.jpg"
        more="more"
        name="Corn flakes"
        price={300}
      />
        <ProductCard
        category="rice"
        imageURL="/assets/Untitled design.png"
        more="more"
        name="Corn flakes"
        price={300}
      />
        <ProductCard
        category="rice"
        imageURL="/assets/cornflakes.jpg"
        more="more"
        name="Corn flakes"
        price={300}
      />
        <ProductCard
        category="rice"
        imageURL="/assets/cornflakes.jpg"
        more="more"
        name="Corn flakes"
        price={300}
      />
        <ProductCard
        category="rice"
        imageURL="/assets/cornflakes.jpg"
        more="more"
        name="Corn flakes"
        price={300}
      />
        <ProductCard
        category="rice"
        imageURL="/assets/cornflakes.jpg"
        more="more"
        name="Corn flakes"
        price={300}
      />
      </div>
    </section>
  );
};

export default FreshToday;
