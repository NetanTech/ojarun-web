import React from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import Filters from "../Acomponents/filters";
import AllProducts from "./components/all-products";
import { Home } from "lucide-react";
import FreshToday from "./components/fresh-today";
import CookingRecommendations from "./components/cooking-recommendations";

const Page = () => {
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
      <Filters />
      <FreshToday />
      <CookingRecommendations />
      <AllProducts />
    </>
  );
};

export default Page;
