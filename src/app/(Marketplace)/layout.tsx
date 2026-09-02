"use client";

import React from "react";
import Header from "./Acomponents/header";


import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favoritesContext";

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="">
          <Header />
          {children}
          <Footer />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default Layout;
