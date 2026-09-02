"use client";

import React from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import ProductGrid from "../Acomponents/products-grid";
import { usePathname } from "next/navigation";
import { Home } from "../../../../public/svg/svg";
import Empty from "./components/Empty";
import { useFavorites } from "@/lib/favoritesContext";

const Page = () => {
  const pathName = usePathname();
  const { products, loading } = useFavorites();

  return (
    <div className="md:max-w-300 lg:mx-auto mx-5 md:w-full flex flex-col items-start gap-2 my-5">
      <BreadCrumb
        item={[
          {
            icon: <Home size={18} className="text-grey-300"/>,
            title: "Home",
            href: "/",
          },
          {
            title: "Favourites",
            href: pathName
          },
        ]}
      />
      <h6 className="text-green-500">Favourites</h6>
      {loading ? (
        <ProductGrid products={[]} loading />
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Page;
