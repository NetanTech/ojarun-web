"use client";

import React from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import ProductGrid from "../Acomponents/products-grid";
import { DEMO_PRODUCTS } from "../../../../constants/data";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import Empty from "./components/Empty";



const Page = () => {
    const pathName = usePathname();
    const whishListProducts = DEMO_PRODUCTS.filter(f => f.wishlisted)
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
      {
        whishListProducts.length > 0 ? <ProductGrid  products={whishListProducts} /> : <Empty />
      }
    </div>
  );
};

export default Page;
