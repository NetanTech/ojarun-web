"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BreadCrumb from "../Acomponents/bread-crumb";
import Filters from "../Acomponents/filters";
import AllProducts from "./components/all-products";
import { Home } from "../../../../public/svg/svg";
import FreshToday from "./components/fresh-today";
import CookingRecommendations from "./components/cooking-recommendations";
import AIAgent from "@/components/ui/AIAgent";
import { fetchProducts } from "@/lib/products";

const MarketplaceContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState("all");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts({ search: query, category: selectedCat })
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load products."))
      .finally(() => setLoading(false));
  }, [query, selectedCat]);

  return (
    <>
      <div className="md:max-w-300  lg:mx-auto w-full px-4 py-3">
        <BreadCrumb
          item={[
            {
              title: "Home",
              href: "/",
              icon: <Home size={18} className="text-grey-300" />,
             },
            { title: "Marketplace", href: "/marketplace" },
          ]}
        />
      </div>
      <Filters selectedCat={selectedCat} setSelectedCat={setSelectedCat} />
      {query && (
        <p className="px-4 md:max-w-300 md:mx-auto text-grey-300">
          Showing results for &quot;{query}&quot;
        </p>
      )}
      {error && (
        <p className="text-red-600 body-medium px-4 md:max-w-300 md:mx-auto">{error}</p>
      )}
      {!query && <FreshToday products={products.slice(0, 6)} loading={loading} />}
      {!query && <CookingRecommendations />}
      <AllProducts products={products} loading={loading} />
      <AIAgent />
    </>
  );
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <MarketplaceContent />
    </Suspense>
  );
};

export default Page;
