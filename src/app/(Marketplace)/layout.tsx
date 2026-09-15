"use client";

import React from "react";
import Header from "./Acomponents/header";


import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favoritesContext";
import { MealFavoritesProvider } from "@/lib/mealFavoritesContext";

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <CartProvider>
      <FavoritesProvider>
        <MealFavoritesProvider>
          <div className="">
            <Header />
            {children}
            <Footer />
          </div>
        </MealFavoritesProvider>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default Layout;
