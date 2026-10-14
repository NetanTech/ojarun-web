"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import BreadCrumb from "../Acomponents/bread-crumb";
import Filters from "../Acomponents/filters";
import AllProducts from "./components/all-products";
import { Home } from "../../../../public/svg/svg";
import FreshToday from "./components/fresh-today";
import { fetchProducts, filterProductsByCategory } from "@/lib/products";

const AIAgent = dynamic(() => import("@/components/ui/AIAgent"), {
  ssr: false,
  loading: () => null,
});

const CookingRecommendations = dynamic(
  () => import("./components/cooking-recommendations"),
  { loading: () => null },
);

const MarketplaceContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [catalog, setCatalog] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState("all");

  // One network fetch per search — category filters are free on the client.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProducts({ search: query || undefined })
      .then((list) => {
        if (!cancelled) setCatalog(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load products.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const products = useMemo(
    () => filterProductsByCategory(catalog, selectedCat),
    [catalog, selectedCat],
  );

  const freshToday = useMemo(() => products.slice(0, 6), [products]);

  return (
    <>
      <div className="md:max-w-300  lg:mx-auto w-full px-4 py-3">
        <BreadCrumb
          item={[
            {
              title: "Home",
              href: "/marketplace",
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
        <p className="text-red-600 body-medium px-4 md:max-w-300 md:mx-auto">
          {error}
        </p>
      )}
      {!query && <FreshToday products={freshToday} loading={loading} />}
      {!query && <CookingRecommendations />}
      <AllProducts
        key={`${selectedCat}:${query}`}
        products={products}
        loading={loading}
      />
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
