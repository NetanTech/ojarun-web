import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 animate-pulse">
      <div className="relative overflow-hidden rounded-2xl bg-grayScale-50 aspect-[5/3]">
        <div className="absolute top-2 right-2 bg-grayScale-200 size-7 sm:size-9 rounded-full" />
      </div>

      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 w-24 sm:w-32 bg-grayScale-200 rounded" />
          <div className="h-3 w-20 sm:w-24 bg-grayScale-100 rounded" />
          <div className="h-4 w-12 sm:w-16 bg-grayScale-200 rounded" />
        </div>

        <div className="size-8 sm:size-10 bg-grayScale-200 rounded-full shrink-0" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
