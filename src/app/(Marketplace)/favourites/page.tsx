"use client";

import React from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import ProductGrid from "../Acomponents/products-grid";
import MealProductCard from "../Acomponents/MealProductCard";
import { usePathname } from "next/navigation";
import { Home } from "../../../../public/svg/svg";
import Empty from "./components/Empty";
import { useFavorites } from "@/lib/favoritesContext";
import { useMealFavorites } from "@/lib/mealFavoritesContext";
import { mockMeals } from "../../../../constants/data";

const Page = () => {
  const pathName = usePathname();
  const { products, loading } = useFavorites();
  const { meals: mealFavorites, loading: mealsLoading } = useMealFavorites();

  const favoritedMeals: Meal[] = mealFavorites.map((fav) => {
    const fullMeal = mockMeals.find((m) => m.id === fav.id);
    if (fullMeal) return fullMeal;
    // Meal no longer in the catalog — fall back to the saved snapshot.
    return {
      id: fav.id,
      name: fav.name,
      imageURL: fav.imageURL,
      description: "",
      servings: fav.servings,
      totalPrice: fav.totalPrice,
      ingredients: [],
    };
  });

  const anyLoading = loading || mealsLoading;
  const hasAnyFavorites = products.length > 0 || favoritedMeals.length > 0;

  return (
    <div className="md:max-w-300 lg:mx-auto mx-5 md:w-full flex flex-col items-start gap-6 my-5">
      <BreadCrumb
        item={[
          {
            icon: <Home size={18} className="text-grey-300"/>,
            title: "Home",
            href: "/marketplace",
          },
          {
            title: "Favourites",
            href: pathName
          },
        ]}
      />
      <h6>Favourites</h6>

      {anyLoading ? (
        <ProductGrid products={[]} loading />
      ) : hasAnyFavorites ? (
        <>
          {favoritedMeals.length > 0 && (
            <div className="flex flex-col gap-4 w-full">
              <h6>Favourite meals</h6>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {favoritedMeals.map((meal) => (
                  <MealProductCard key={meal.id} {...meal} />
                ))}
              </div>
            </div>
          )}
          {products.length > 0 && (
            <div className="flex flex-col gap-4 w-full">
              {favoritedMeals.length > 0 && <h6>Favourite items</h6>}
              <ProductGrid products={products} />
            </div>
          )}
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Page;
